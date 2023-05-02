import { Document, model, Schema } from 'mongoose';

export interface IFile extends Document {
  _id: string;
  name: string;
  mimetype: string;
  url: string;
}

const fileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  mimetype: { type: String, required: true },
  url: { type: String, required: true },
});

export const FileModel = model<IFile>("File", fileSchema);