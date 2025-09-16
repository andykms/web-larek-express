import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/bad-request-error';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { InternalServerError } from '../errors/server-error';
import { FILES_TIMEOUTS } from '../app';
import { MAX_IMAGE_SIZE_IN_BYTES } from '../utils/constants';

const uploadDirectory = path.join(__dirname, '../../uploads/product-images');

export const uploadMiddleware = multer({
    dest: uploadDirectory,
    limits: {
        fileSize: MAX_IMAGE_SIZE_IN_BYTES,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new BadRequestError('неверный формат файла'));
        }
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDirectory);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

export function uploadProductImage(req: Request, res: Response, next: NextFunction) {
    const file = req.file;
    if (!file) {
        next(new InternalServerError('не удалось обработать файл'));
        return;
    }
    const originalName = file.originalname;
    const fileName = file.filename;
    FILES_TIMEOUTS.set(file.path, Date.now());
    res.status(201).json({
        originalName,
        fileName,
    });
}
