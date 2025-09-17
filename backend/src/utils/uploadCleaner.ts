import { FILES_TIMEOUTS, MAX_FILE_TIME_IN_MS } from './constants';
import { walk } from './walkFiles';
import { deleteFile } from './delete';
import path from 'path';

const uploadPath = path.join(__dirname, '../../uploads');

export async function uploadCleaner() {
    try {
        const checkedFiles = await walk(uploadPath);
        const now = Date.now();
        checkedFiles.forEach((file) => {
            const timestamp = FILES_TIMEOUTS.get(file);
            if ((timestamp && Math.abs(now - timestamp) > MAX_FILE_TIME_IN_MS) || !timestamp) {
                FILES_TIMEOUTS.delete(file);
                deleteFile(path.join(__dirname, '../uploads', file));
            }
            deleteFile(file);
        });
    } catch (err) {
        throw new Error(`ошибка удаления файлов в папке uploads: ${err}`);
    }
}
