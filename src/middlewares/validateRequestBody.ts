import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { writeErrorStatus } from "../helpers/writeErrorStatus";

/**
 * Middleware. Used for validation of request body in accordance to model requirements
 * @param validationSchema
 */
export function validateRequestBody(validationSchema: Joi.ObjectSchema) {
  return function validator(req: Request, res: Response, next: NextFunction) {
    const { error } = validationSchema.validate(req.body);

    if (error) {
      return writeErrorStatus(res, 400, error.message);
    }

    next();
  }
}
