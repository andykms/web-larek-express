import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/bad-request-error';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { InternalServerError } from '../errors/server-error';
import { RequestHandler } from 'express';

interface IUploadParams {
    uploadDirectory: string;
    fileSize: number;
    fileTypes: string[];
    fileTimeouts: Map<string, number>;
}

export class UploadController {
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
                fileSize: fileSize,
            },
            fileFilter: (req, file, cb) => {
                if (fileTypesSet.has(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestError('неверный формат файла'));
                }
            },
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, absoluteUploadDirectory);
                },
                filename: (req, file, cb) => {
                    const fileName = `${Date.now()}-${file.originalname}`;
                    cb(null, fileName);
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
        const file = req.file;
        if (!file) {
            next(new InternalServerError('не удалось обработать файл'));
            return;
        }
        const originalName = file.originalname;
        const fileName = path.join(this.uploadDirectory, file.filename);
        this.fileTimeouts.set(fileName, Date.now());
        res.status(201).json({
            originalName,
            fileName,
        });
    }
}
