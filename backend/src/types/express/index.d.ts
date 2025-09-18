import { JwtPayload } from 'jsonwebtoken';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
      file: Multer.File;
    }
  }
}
