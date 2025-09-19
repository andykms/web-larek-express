/* eslint-disable no-await-in-loop */
import { promises as fs } from 'fs';
import path from 'path';

export default async function walk(dir: string): Promise<string[]> {
  let startFiles: Array<string> = [];
  try {
    startFiles = await fs.readdir(dir);
  } catch (err) {
    return Promise.reject(err);
  }
  const stack = [...startFiles];
  const files = [];
  while (stack.length > 0) {
    const file = stack.pop();
    if (typeof file === 'string') {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = await fs.stat(fullPath);
      } catch (err) {
        return Promise.reject(err);
      }
      if (stat.isDirectory()) {
        try {
          stack.push(...(await fs.readdir(fullPath)).map((f) => path.join(file, f)));
        } catch (err) {
          return Promise.reject(err);
        }
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  }
  return Promise.resolve(files);
}
