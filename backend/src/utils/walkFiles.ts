import { promises as fs } from 'fs';
import path from 'path';

export async function walk(dir: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        let startFiles: Array<string> = [];
        try {
            startFiles = await fs.readdir(dir);
        } catch (err) {
            reject(err);
        }
        const stack = [...startFiles];
        const files = [];
        while (stack.length > 0) {
            const file = stack.pop();
            if (typeof file === 'string') {
                const fullPath = path.join(dir, file);
                const stat = await fs.stat(fullPath);
                if (stat.isDirectory()) {
                    try {
                        stack.push(...(await fs.readdir(fullPath)).map((f) => path.join(file, f)));
                    } catch (err) {
                        reject(err);
                    }
                } else if (stat.isFile()) {
                    files.push(fullPath);
                }
            }
        }
        resolve(files);
    });
}
