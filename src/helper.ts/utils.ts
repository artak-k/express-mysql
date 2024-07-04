import { access, unlink, constants } from "fs";

export const fileExists = (path: string) => new Promise(r => access(path, constants.F_OK, e => r(!e)));

export const deleteFile = (path: string) => new Promise<void>((res, rej) => unlink(path, e => e ? rej(e) : res()));

export const deleteFileIfExists = (path: string) => fileExists(path).then(ex => ex && deleteFile(path));

export const isValidNumber = (value: string): boolean => /^\+?[0-9]{6,15}$/.test(value);

export const isValidEmail = (value: string): boolean => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);