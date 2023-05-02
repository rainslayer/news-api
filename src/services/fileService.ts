import { UploadedFile } from "express-fileupload";
import { FileModel, IFile } from "../models/file";
import path from "path";
import fs from "fs";

/**
 * Service. Used for managing user uploaded files
 */
export class FileService {
  static attachmentsPath = path.normalize(`${__dirname}/../../public/attachments`);

  /**
   * Used to store file in static folder and to store it's metadata in DB
   * @param file
   */
  static async uploadFile(file: UploadedFile) {
    const attachment = await FileModel.create({...file, url: file.name});
    attachment.url = `${attachment._id.toString()}${path.extname(file.name)}`;

    await Promise.all([
      file.mv(`${this.attachmentsPath}/${attachment.url}`),
      attachment.save()]);

    return attachment;
  }

  /**
   * Used to delete file from static folder and remove record from DB
   * @param file
   */
  static async deleteFile(file: IFile) {
    return Promise.all([FileModel.findOneAndDelete({ _id: file._id }),
           fs.unlink(`${this.attachmentsPath}/${file.url}`, () => {})]);
  }
}
