import fs from 'fs';

export async function move(oldPath: string, newPath: string) {
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return;
        }
        console.log('File moved successfully');
    });
}
