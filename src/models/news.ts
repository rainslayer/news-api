import { Document, model, Schema } from 'mongoose';
import { IUser} from "./user";
import { IFile } from "./file";
import Joi from 'joi';

export interface INews extends Document {
  content: string;
  author: IUser;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Array<IFile>;
}

export const newsSchema = new Schema<INews>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  attachments: [{ type: Schema.Types.ObjectId, ref: "File"}],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const NewsModel = model<INews>("News", newsSchema);

export const newsCreateValidationSchema = Joi.object({
  content: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()).optional(),
  createdAt: Joi.string().optional(),
})

export const newsEditValidationSchema = Joi.object({
  _id: Joi.string().required(),
  content: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()).optional(),
  createdAt: Joi.string().optional(),
})

export const newsDeleteValidationSchema = Joi.object({
  _id: Joi.string().required(),
})