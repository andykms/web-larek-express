import { promises as fs } from 'fs';

export default async function move(oldPath: string, newPath: string) {
  try {
    return await fs.rename(oldPath, newPath);
  } catch (err) {
    return Promise.reject(err);
  }
}
