import { uploadMiddleware, uploadProductImage } from './upload.controller';
import { Router } from 'express';

const rootPath = '/upload';
const uploadRouter = Router();

uploadRouter.post(rootPath, uploadMiddleware.single('file'), uploadProductImage);

export default uploadRouter;
