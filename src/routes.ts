import * as cors from "cors";
import { NextFunction, Request, Response, Router, static as serveStatic, urlencoded } from "express";
import * as asyncHandler from "express-async-handler";
import { ApiError, InternalError, NotFoundError } from "./errors";
import logging from "./config/logging";
import { ApiErrorResponse } from "./response/ApiResponseError";
import { UserController } from "./controller/UserController";
import { auth } from "./middleware/authMiddleware";
import { signInUpValidator } from "./middleware/validators/userValidator";
import * as path from "path";
import { FileController } from "./controller/FileController";
import { imageStore } from "./middleware/fileStoreMiddleware";

const NAMESPACE = "ROUTES"

const apiRouter = Router();
apiRouter.use(cors());

// User routes
apiRouter.post('/signin', signInUpValidator, asyncHandler(UserController.signIn));
apiRouter.post('/signup', signInUpValidator, asyncHandler(UserController.signUp));
apiRouter.post('/signin/new_token', asyncHandler(UserController.newToken));
apiRouter.get('/info', auth(), asyncHandler(UserController.info));
apiRouter.get('/logout', auth(), asyncHandler(UserController.logout));

// File routes
apiRouter.post('/file/upload', auth(), imageStore.single("file"), FileController.uploadFile);
apiRouter.get('/file/list', auth(), FileController.listFiles);
apiRouter.delete('/file/delete/:id', auth(), FileController.deleteFile);
apiRouter.get('/file/:id', auth(), FileController.getFile);
apiRouter.get('/file/download/:id', auth(), FileController.downloadFile);
apiRouter.put('/file/update/:id', auth(), imageStore.single('file'), FileController.updateFile);

export const router = Router();
router.use("", apiRouter);

router.use(function (_req, _res, next) {
    next(new NotFoundError());
});
router.use("/", serveStatic(path.join(__dirname, "../public")));
router.use(urlencoded({ extended: true }));

router.use(function (err: Error|any, _req: Request, res: Response, _next: NextFunction) {
    logging.warn(NAMESPACE, JSON.stringify(err))
    if (process.env.ENV === "prod" && !(err instanceof ApiError)) {
        err = new InternalError();
    }

    res.json(new ApiErrorResponse(err.message, err["code"], err["data"]));
});
