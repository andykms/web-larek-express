import { Router } from 'express';
import { FILES_TIMEOUTS, MAX_IMAGE_SIZE_IN_BYTES } from '../utils/constants';
import UploadController from './upload.controller';
import auth from '../middlewares/auth';

const rootPath = '/upload';
const uploadRouter = Router();

const uploadImageController = new UploadController({
  fileTypes: ['image/jpeg', 'image/png'],
  fileSize: MAX_IMAGE_SIZE_IN_BYTES,
  fileTimeouts: FILES_TIMEOUTS,
  uploadDirectory: '/images',
});

uploadRouter.post(
  rootPath,
  auth,
  uploadImageController.getUploadMiddleware(),
  uploadImageController.getUploadController(),
);

export default uploadRouter;
