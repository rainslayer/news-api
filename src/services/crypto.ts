import bcrypt from "bcrypt";

/**
 * Service. Responsible for cryptography
 */
export class CryptoService {
    private static saltRounds = 10;

  /**
   * Used to encrypt plain text password
   * @param password
   */
  static encryptPassword(password: string) {
      return bcrypt.hash(password, this.saltRounds);
    }

  /**
   * Used to compare plain text password with encrypted version
   * @param passwordPlainText
   * @param encryptedPassword
   */
    static async validatePassword(passwordPlainText: string, encryptedPassword: string) {
      return bcrypt.compare(passwordPlainText, encryptedPassword);
    }
}
