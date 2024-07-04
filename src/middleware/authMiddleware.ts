import * as jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import { UserUnauthorizedError } from '../errors';
import logging from '../config/logging';
import { SessionRepository } from '../repository/SessionRepository';
const NAMESPACE = "AUTH"

export function auth(required = true) {
    return async function (req: Request, _res: Response, next: NextFunction) {
        try {
            let userFound = true;

            const token = req.header("X-API-TOKEN");
            if (!token) {
                userFound = false;
            } else {
                const payload: any = jwt.decode(token.split(' ')[1]);
                if (!payload || !payload["sid"]) {
                    userFound = false;
                } else {
                    const session = await SessionRepository.findByIdWithUser(payload["sid"]);
                    if (!session) {
                        userFound = false;
                    } else {
                        if (!jwt.verify(token.split(' ')[1], session.secret)) {
                            userFound = false;
                        }
                        if (userFound) {
                            session.lastActiveDate = new Date();
                            await SessionRepository.save(session);

                            req["session"] = session;
                            req["user"] = session.user;
                        }
                    }
                }
            }

            if (required && !userFound) {
                return next(new UserUnauthorizedError());
            }

            next();
        } catch (error: any) {
            logging.warn(NAMESPACE, error.message);
            return next(new UserUnauthorizedError());
        }
    }
}