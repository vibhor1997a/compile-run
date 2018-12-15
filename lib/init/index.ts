import fs from 'fs';
import os from 'os';
import path from 'path';
const home = os.homedir();

const libDir = '.compile-run2';
const tmpDir = 'tmp';

export const libPath = path.join(home, libDir);
//Make Lib dir in the os home directory
checkExistsAndMakeDir(libPath);
export const tmpPath = path.join(home, libDir, tmpDir);
//Make the tmp dir to store source files
checkExistsAndMakeDir(tmpPath);

/**
 * Handles an exception occured during making a dir
 * @param err Error object
 */
function handleError(err: Error) {
    console.log(`Maybe you don't have permission to write in this directory`);
    throw err;
}

/**
 * Checks if the dir exists at the provided path. If it doesn't exist simply makes a new Directory
 *  
 * **Its a synchronous function
 * @param path A path like string
 */
export function checkExistsAndMakeDir(path: string) {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
    catch (err) {
        handleError(err);
    }
}
