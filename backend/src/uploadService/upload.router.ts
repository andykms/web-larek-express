import { Router } from 'express';
import {
  FILES_TIMEOUTS,
  MAX_IMAGE_SIZE_IN_BYTES,
  IMAGES_TYPES,
  IMAGE_PATH,
} from '../utils/constants';
import UploadController from './upload.controller';
import auth from '../middlewares/auth';

const rootPath = '/upload';
const uploadRouter = Router();

const uploadImageController = new UploadController({
  fileTypes: IMAGES_TYPES,
  fileSize: MAX_IMAGE_SIZE_IN_BYTES,
  fileTimeouts: FILES_TIMEOUTS,
  uploadDirectory: IMAGE_PATH!,
});

uploadRouter.post(
  rootPath,
  auth,
  uploadImageController.getUploadMiddleware(),
  uploadImageController.getUploadController(),
);

export default uploadRouter;
