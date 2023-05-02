import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user";
import { authenticationService } from "../services/authentication";
import { writeErrorStatus } from "../helpers/writeErrorStatus";

const ignorePaths = ["/api/signup", "/api/signin"];

/**
 * Used to inform user that he has to be authenticated
 * @param res
 */
export function writeUnauthorized(res: Response) {
  return writeErrorStatus(res, 401, "You must be logged in");
}


/**
 * Used to report user that his token is broken
 * @param res
 */
function writeWrongTokenError(res: Response) {
  res.clearCookie("auth_token");
  return writeErrorStatus(res, 400, "Wrong authentication token, try login again")
}

/**
 * Middleware. Used for JWT validation
 * @param req
 * @param res
 * @param next
 */
export async function validateJWTToken(req: Request, res: Response, next: NextFunction) {
  if (ignorePaths.includes(req.path)) {
    return next();
  }

  const { auth_token } = req.cookies;

  if (!auth_token) {
    return writeUnauthorized(res);
  }

  try {
    const { id } = await authenticationService.validateJWT(auth_token);
    const user = await UserService.findUserById(id);

    if (!user) {
      return writeWrongTokenError(res);
    }
    res.locals.user = user;
    return next();
  } catch {
    return writeWrongTokenError(res);
  }
}
