import multer from 'multer';
import path from 'path';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/server-error';

interface IUploadParams {
  uploadDirectory: string;
  fileSize: number;
  fileTypes: string[];
  fileTimeouts: Map<string, number>;
}

export default class UploadController {
  private fileTimeouts: Map<string, number>;

  private uploadMiddlewareFn: multer.Multer;

  private uploadDirectory: string;

  constructor(uploadParams: IUploadParams) {
    const { uploadDirectory, fileSize, fileTypes, fileTimeouts } = uploadParams;

    this.fileTimeouts = fileTimeouts;

    this.uploadDirectory = uploadDirectory;

    const fileTypesSet = new Set(fileTypes);
    const absoluteUploadDirectory = path.join(__dirname, '../../uploads', uploadDirectory);

    this.uploadMiddlewareFn = multer({
      dest: absoluteUploadDirectory,
      limits: {
        fileSize,
      },
      fileFilter: (_, file, cb) => {
        if (fileTypesSet.has(file.mimetype)) {
          return cb(null, true);
        }
        return cb(new BadRequestError('неверный формат файла'));
      },
      storage: multer.diskStorage({
        destination: (_, __, cb) => cb(null, absoluteUploadDirectory),
        filename: (_, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          return cb(null, fileName);
        },
      }),
    });
  }

  public getUploadMiddleware(isFiles?: boolean): RequestHandler {
    return this.uploadMiddlewareFn.single(isFiles ? 'files' : 'file').bind(this);
  }

  public getUploadController(): RequestHandler {
    return this.upload.bind(this);
  }

  private upload(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      return next(new InternalServerError('не удалось обработать файл'));
    }
    const { file } = req;
    const originalName = file.originalname;
    const fileName = path.join(this.uploadDirectory, file.filename);
    this.fileTimeouts.set(fileName, Date.now());
    return res.status(201).json({
      originalName,
      fileName,
    });
  }
}
