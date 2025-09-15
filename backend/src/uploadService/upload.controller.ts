import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/bad-request-error';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { InternalServerError } from '../errors/server-error';

export const uploadMiddleware = multer({
    dest: path.join(__dirname, '../../uploads/product-images'),
    limits: {
        fileSize: 1064960,
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
            cb(null, path.join(__dirname, '../../uploads/product-images'));
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

export function uploadProductImage(req: Request, res: Response, next: NextFunction) {
    //Нужно поставить таймер с помощью cron на удаление файла изображения спустя некоторое время
    const file = req.file;
    if (!file) {
        next(new InternalServerError('не удалось обработать файл'));
        return;
    }
    const originalName = file.originalname;
    const fileName = file.filename;
    res.status(201).json({
        originalName,
        fileName,
    });
}
