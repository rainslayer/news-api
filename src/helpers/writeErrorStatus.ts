import { Response } from "express";

/**
 * Used to respond with error code and message
 * @param res
 * @param code
 * @param message
 */
export function writeErrorStatus(res: Response, code: number, message: string) {
  res.status(code);

  return res.send({
    status: code,
    message
  });
}
