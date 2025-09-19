import path from 'path';
import { FILES_TIMEOUTS, MAX_FILE_TIME_IN_MS } from './constants';
import walk from './walkFiles';
import deleteFile from './delete';
import { manualErrorLogger } from '../middlewares/logger';

const uploadPath = path.join(__dirname, '../../uploads');

export default async function uploadCleaner() {
  try {
    const checkedFiles = await walk(uploadPath);
    const now = Date.now();
    checkedFiles.forEach(async (file) => {
      const timestamp = FILES_TIMEOUTS.get(file);
      if ((timestamp && Math.abs(now - timestamp) > MAX_FILE_TIME_IN_MS) || !timestamp) {
        FILES_TIMEOUTS.delete(file);
        try {
          await deleteFile(file);
        } catch (err) {
          manualErrorLogger.error(`ошибка удаления файла ${file}: ${err}`);
        }
      }
    });
  } catch (err) {
    manualErrorLogger.error(`ошибка удаления файлов: ${err}`);
  }
}
