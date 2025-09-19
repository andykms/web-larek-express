import { promises as fs } from 'fs';
import path from 'path';

export default async function deleteFile(filePath: string) {
  const absolutePath = filePath.startsWith('/') ? path.join(__dirname, filePath) : filePath;
  const ending = absolutePath.split('.').pop();
  if (!ending) {
    return Promise.reject();
  }
  try {
    return await fs.unlink(absolutePath);
  } catch (err) {
    return Promise.reject(err);
  }
}
