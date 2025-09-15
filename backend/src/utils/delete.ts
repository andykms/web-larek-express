import { promises as fs } from 'fs';
import path from 'path';
import { ALLOWED_DELETE_FILES } from './constants';

export async function deleteFile(filePath: string) {
    const absolutePath = filePath.startsWith('/') ? path.join(__dirname, filePath) : filePath;
    const ending = absolutePath.split('.').pop();
    if (!ending) {
        return;
    }
    if (!ALLOWED_DELETE_FILES.has(ending)) {
        return;
    }
    try {
        await fs.unlink(absolutePath);
    } catch (err) {
        return Promise.reject(err);
    }
}
