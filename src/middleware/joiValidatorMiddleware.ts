import * as asyncHandler from "express-async-handler";
import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError, RequiredFieldError, InvalidFieldValueError } from "../errors";


export function joiValidator(schema: ObjectSchema, target = "body") {
  return asyncHandler(async function(req: Request, _res: Response, next: NextFunction) {
    const { error } = schema.validate(req[target]);
    if (!error) {
      next();
    } else {
      if (error instanceof ApiError) {
        return next(error);
      }
      let newError: ApiError;
      const data = {};
      if (error.details[0].type === "any.required") {
        newError = new RequiredFieldError(error.details[0].message);
      } else {
        newError = new InvalidFieldValueError(error.details[0].message);
      }
      data["field"] = error.details[0].path[0];
      newError.data = data;
      next(newError);
    }
  });
}