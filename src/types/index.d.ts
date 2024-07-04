import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>,
      session?: Record<string,any>
      [key: string]: any
    }
  }
}