import { readFile, writeFile } from 'fs';

/**
 * Promise based wrapper over fs.writeFile to write source file, can be used in an async function
 * @param filePath A path like string
 * @param source Source string to be written
 */
export function writeSource(filePath: string, source: string): Promise<void> {
    return new Promise<void>((res, rej) => {
        writeFile(filePath, source, err => {
            if (err) {
                rej(err);
            }
            else {
                res();
            }
        });
    })
}

/**
 * Promise based wrapper over fs.writeFile to read source file, can be used in an async function
 * @param filePath A path like string
 */
export function readSource(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}