import { Request, Response, Router } from "express";
import { authenticationService } from "../services/authentication";
import { UserDto } from "../dto/UserDto";
import { UserService } from "../services/user";
import { userValidationSchema } from "../models/user";
import { CryptoService } from "../services/crypto";
import { writeErrorStatus } from "../helpers/writeErrorStatus";
import { validateRequestBody } from "../middlewares/validateRequestBody";

/**
 * User controller class. Provides API to work with users
 */
export class UserController {
  constructor(router: Router) {
    router.get("/api/user", this.getUserData.bind(this));
    router.post("/api/signin", validateRequestBody(userValidationSchema), this.signIn.bind(this));
    router.post("/api/signup", validateRequestBody(userValidationSchema), this.signUp.bind(this));
  }

  /**
   * GET request handler. Used to fetch user data
   * @param _
   * @param res
   */
  async getUserData(_, res: Response) {
    const user = await UserService.findUserById(res.locals.user._id.toString());

    return res.send(user);
  }

  /**
   * POST request handler. Used to sign in existing user
   * @param req
   * @param res
   */
  async signIn(req: Request, res: Response) {
    const { login, password }: UserDto = req.body;
    const user = await UserService.findUserFull(login);
    const valid = await CryptoService.validatePassword(password, user?.password ?? "");

    if (valid && user) {
      const payload = this.getPayload(user);
      const token = authenticationService.signJWT(payload);
      this.setTokenCookie(res, token);

      return res.send(payload);
    } else {
      return writeErrorStatus(res, 404, "Wrong login or password")
    }
  }

  /**
   * POST request handler. Used to create new user
   * @param req
   * @param res
   */
  async signUp(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);

      const payload = this.getPayload(user);

      const token = authenticationService.signJWT(payload);
      this.setTokenCookie(res, token);

      return res.send(payload);
    } catch (e) {
      return writeErrorStatus(res, 404, e.message);
    }
  }

  /**
   * Returns payload object to be signed by JWT
   * @param user
   * @private
   */
  private getPayload(user) {
    return {
      id: user._id.toString(),
      login: user.login
    };
  }

  /**
   * Used to set cookie with JWT
   * @param res
   * @param token
   * @private
   */
  private setTokenCookie(res: Response, token: string) {
    return res.cookie("auth_token", token, {
      expires: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)), // 7 days
      httpOnly: true,
    });
  }
}
