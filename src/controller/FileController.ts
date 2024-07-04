import { NextFunction, Request, Response } from "express";
import { File } from "../entity/File";
import * as path from "path";
import * as fs from "fs";
import { FileRepository } from "../repository/FileRepository";
import { ApiResponse } from "../response/ApiResponse";
import { classToPlain } from "class-transformer";
import { CustomError } from "../errors";
import { deleteFileIfExists } from "../helper.ts/utils";

export class FileController {
    static async uploadFile(req: Request, res: Response, next: NextFunction) {
        const user: any = req["user"];
        const fileObject = req.file;

        if (!fileObject) {
            return next(new CustomError("send file"));
        }

        const file = new File();

        file.name = fileObject.filename
        file.size = fileObject.size
        file.extension = path.extname(fileObject.originalname)
        file.mimeType = fileObject.mimetype
        file.uploadDate = new Date()
        file.user = user

        await FileRepository.save(file)

        res.json(new ApiResponse("File saved"));
    }

    static async listFiles(req: Request, res: Response, _next: NextFunction) {
        const page = req.query.page ? Number(req.query.page) : 1;
        const listSize = req.query.list_size ? Number(req.query.list_size) : 10;

        const files = await FileRepository.getFiles((page - 1) * listSize, listSize)

        res.json(new ApiResponse(classToPlain(files, { groups: ["file"] })));
    }


    static async deleteFile(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!id) {
            return next(new CustomError("file id is required"));
        }

        const file = await FileRepository.findOneBy({ id: Number(id) });

        if (!file) {
            return next(new CustomError("file not found"));
        }
        await Promise.all([deleteFileIfExists(`./public/uploads/${file.name}`), FileRepository.remove(file)])
        res.json(new ApiResponse("File removed"));
    }

    static async getFile(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!id) {
            return next(new CustomError("file id is required"));
        }

        const file = await FileRepository.findOneBy({ id: Number(id) });

        if (!file) {
            return next(new CustomError("file not found"));
        }

        res.json(new ApiResponse(file));
    }

    static async downloadFile(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!id) {
            return next(new CustomError("file id is required"));
        }

        const file = await FileRepository.findOneBy({ id: Number(id) });

        if (!file || !fs.existsSync(`./public/uploads/${file.name}`)) {
            return next(new CustomError("file not found"));
        }

        res.download(`./public/uploads/${file.name}`)
    }

    static async updateFile(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const fileObject = req.file;
        if (!id) {
            return next(new CustomError("file id is required"));
        }

        if (!fileObject) {
            return next(new CustomError("send file"));
        }

        const file = await FileRepository.findOneBy({ id: Number(id) });

        if (!file) {
            return next(new CustomError("file not found"));
        }

        await deleteFileIfExists(`./public/uploads/${file.name}`);

        file.name = fileObject.filename;
        file.size = fileObject.size;
        file.extension = path.extname(fileObject.originalname);
        file.mimeType = fileObject.mimetype;
        file.uploadDate = new Date();

        await FileRepository.save(file);

        res.json(new ApiResponse("file updated successfully"));
    }
}