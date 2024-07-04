import * as Joi from "joi";
import { joiValidator } from "../joiValidatorMiddleware";


export const signInUpValidator = joiValidator(Joi.object({
    id: Joi.string().required(),
    password: Joi.string().required()
  }));