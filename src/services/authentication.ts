import jwt from "jsonwebtoken";
import { envVars } from "../config/envvars";

/**
 * Service. Responsible for handling JWT
 */
export class authenticationService {
  /**
   * Used to sign new JWT
   * @param payload
   */
  static signJWT(payload: Object) {
    return jwt.sign(payload, envVars.jwtSecret, {
      expiresIn: "7d",
    });
  }

  /**
   * Used to validate existing token
   * @param token
   */
  static validateJWT(token: string) {
    return jwt.verify(token, envVars.jwtSecret);
  }
}
