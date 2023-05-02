import Joi from "joi";
import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  login: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

export const UserModel = model<IUser>("User", userSchema);

export const userValidationSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
})