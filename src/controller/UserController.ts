import { Session } from "../entity/Session";
import { CustomError, DuplicateError, InvalidCredentialsError, UserUnauthorizedError } from "../errors";
import { SessionRepository } from "../repository/SessionRepository";
import { UserRepository } from "../repository/UserRepository";
import { ApiResponse } from "../response/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { userManager } from "../service/userManger";
import { AppDataSource } from "../dataSource";
import { EntityManager } from "typeorm";
import * as jwt from "jsonwebtoken";
import { isValidEmail, isValidNumber } from "../helper.ts/utils";
import { User } from "../entity/User";
import {config} from "../config/config";
import { generateAccessToken, generateRefreshToken } from "../helper.ts/generateTokens";

export class UserController {
    static async signIn(req: Request, res: Response, next: NextFunction) {
        const { id, password } = req.body;
        const user = await UserRepository.findOneBy({ username: id });
        if (!user) {
            return next(new InvalidCredentialsError());
        }

        if (!await userManager.verify(password, user)) {
            return next(new InvalidCredentialsError());
        }

        const session = await userManager.loginUser(user);
        await AppDataSource.manager.transaction(async function (transactionalEntityManager: EntityManager) {
            await transactionalEntityManager.save(session);
            await transactionalEntityManager.save(user);
        });

        const payload = { sid: session.id };

        const token = generateAccessToken(payload, session.secret)
        const refreshToken = generateRefreshToken(payload, session.secret + config.secret);

        res.json(new ApiResponse({ token, refreshToken, id: user.username }));
    }

    static async signUp(req: Request, res: Response, next: NextFunction) {
        const { id, password } = req.body;

        if (!isValidEmail(id) && !isValidNumber(id)) {
            return next(new CustomError("id must be either a phone number or email address"));
        }

        let user = await UserRepository.findOneBy({ username: id });

        if (user) {
            return next(new DuplicateError("This account already exists"));
        }

        user = new User();
        user.username = id;
        user.password = password;
        await UserRepository.save(user);

        const session = await userManager.loginUser(user);
        await AppDataSource.manager.transaction(async function (transactionalEntityManager: EntityManager) {
            await transactionalEntityManager.save(session);
            await transactionalEntityManager.save(user);
        });

        const payload = { sid: session.id };

        const token = generateAccessToken(payload, session.secret)
        const refreshToken = generateRefreshToken(payload, session.secret + config.secret);

        res.json(new ApiResponse({ token, refreshToken }));
    }

    static async newToken(req: Request, res: Response, next: NextFunction) {
        const token = req.body.token;
        let session: Session | null;
        let accessToken: string | undefined = undefined;
        let canUpdate = true;
        if (!token) {
            canUpdate = false;
        } else {
            const payload: any = jwt.decode(token)
            if (!payload || !payload["sid"]) {
                canUpdate = false;
            } else {
                session = await SessionRepository.findByIdWithUser(payload["sid"]);
                if (!session) {
                    canUpdate = false;
                } else {
                    if (!jwt.verify(token, session.secret + config.secret)) {
                        canUpdate = false;
                    } else {
                        const payload = { sid: session.id };
                        accessToken = generateAccessToken(payload, session.secret)
                    }
                }
            }
        }

        if (!canUpdate) {
            return next(new UserUnauthorizedError());
        }

        res.json(new ApiResponse({ token: accessToken }));
    }

    static async info(req: Request, res: Response, _next: NextFunction) {
        const user = req["user"] as User;

        res.json(new ApiResponse({ id: user.username }));
    }

    static async logout(req: Request, res: Response, _next: NextFunction) {
        const session = req["session"];
        await SessionRepository.remove(session as Session);
        res.json(new ApiResponse());
    }
}