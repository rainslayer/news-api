import { Request, Response, Router } from "express";
import { FileService } from "../services/fileService";
import { UploadedFile } from "express-fileupload";
import { writeErrorStatus } from "../helpers/writeErrorStatus";

/**
* File controller class. Provides API to work with files
*/
export class FileController {
  constructor(router: Router) {
    router.post("/api/file", this.uploadFile.bind(this));
  }

  /**
   * POST request handler for file upload
   * @param req
   * @param res
   */
  async uploadFile(req: Request, res: Response) {
    if (!req.files?.attachment) {
      return writeErrorStatus(res, 400, "No file to upload");
    }

    const file = await FileService.uploadFile(req.files.attachment as UploadedFile);
    return res.send(file);
  }
}
