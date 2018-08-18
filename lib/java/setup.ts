import { checkExistsAndMakeDir, tmpPath } from "../init";
import path from 'path';
import { getFileName } from "../source-writer";

/**
 * Sets up the java dir and makes a source dir
 * @returns A path like string of source directory
 */
export function setupJavaDir(): string {
    let javaPath = path.join(tmpPath, 'java');
    checkExistsAndMakeDir(javaPath);
    //get a random name for making dir to store class and
    let dirname = getFileName();
    let dirPath = path.join(javaPath, dirname);
    checkExistsAndMakeDir(dirPath);
    return dirPath;
}