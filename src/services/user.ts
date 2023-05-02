import { UserDto } from "../dto/UserDto";
import { CryptoService } from "./crypto";
import { UserModel } from "../models/user";

/**
 * Service. Used for user management
 */
export class UserService {
  /**
   * Used to get user by id without sensitive fields
   * @param id
   */
  static async findUserById(id: string) {
    return UserModel.findOne({ _id: id }).select(["-password"]).lean();
  }

  /**
   * Used to get user by login without sensitive fields
   * @param login
   */
  static async findUserByLogin(login: string) {
    return UserModel.findOne({ login }).select(["-password"]).lean();
  }

  /**
   * Used to get user by login with sensitive fields
   * @param login
   */
  static async findUserFull(login: string) {
    return UserModel.findOne({ login }).lean();
  }

  /**
   * Used to create new user
   * @param payload
   */
  static async createUser(payload: UserDto) {
    const { login, password: plainTextPwd }: UserDto = payload;
    const existingUser = await this.findUserByLogin(login);

    if (existingUser) {
      throw new Error("Login is already taken");
    }

    const encryptedPassword = await CryptoService.encryptPassword(plainTextPwd);

    const user = await UserModel.create({
      login,
      password: encryptedPassword
    });

    await user.save();
    return user;
  }
}
