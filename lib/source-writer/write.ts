import fs from 'fs';
import path from 'path';
import { tmpPath, checkExistsAndMakeDir } from '../init';
import { LanguageNames, LanguageExtMap } from '../types';
import { getFileName } from './file-name';

/**
 * Writes the source code into the file system and returns a promise that resolves to path of the source file
 * @param lang Language of the source code
 * @param source string containing source code to be written
 */
export async function writeSourceFile(lang: LanguageNames, source: string): Promise<string> {
    let ext = await getExtension(lang);
    const langDir = path.join(tmpPath, lang);
    checkExistsAndMakeDir(langDir);
    const fileName = getFileName(ext);
    const filePath = path.join(tmpPath, lang, fileName);
    return new Promise<string>((resolve, reject) => {
        fs.writeFile(filePath, source, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve(filePath);
            }
        });
    });
}

export function getExtension(lang: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let extensionsMapPath = path.join(__dirname,'../../../','extensions-map.json');
        fs.readFile(extensionsMapPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                let langMap: LanguageExtMap = JSON.parse(data);
                //@ts-ignore
                resolve(langMap[lang]);
            }
        });
    });
}
