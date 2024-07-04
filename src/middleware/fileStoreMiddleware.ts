import * as multer from "multer";
import * as crypto from "crypto";
import { InvalidFileTypeError } from "../errors";
import { Request } from "express";

const mimeToExtensionMap: any = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "application/pdf": "pdf"
};

const hashedFilename = function(_req: Request, file: any, cb: any) {
  crypto.pseudoRandomBytes(16, function(err: Error, raw: Buffer) {
    cb(err, err ? undefined : `${raw.toString("hex")}.${mimeToExtensionMap[file.mimetype]}`);
  });
};


export const imageStore = multer({
  storage: multer.diskStorage({
    destination(_req: Request, _file: any, cb: any) {
      cb(null, "./public/uploads")
    },
    filename: hashedFilename,
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  preservePath: false,
  fileFilter(_req: Request, file: any, next: multer.FileFilterCallback) {
    const mimeWhitelist = ["image/jpg", "image/jpeg", "image/png"];
    if (!mimeWhitelist.includes(file.mimetype)) {
      return next(new InvalidFileTypeError());
    }
    next(null, true);
  },
});