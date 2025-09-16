import { promises as fs } from 'fs';

export async function move(oldPath: string, newPath: string) {
    try {
        await fs.rename(oldPath, newPath);
    } catch (err) {
        return Promise.reject(err);
    }
}
