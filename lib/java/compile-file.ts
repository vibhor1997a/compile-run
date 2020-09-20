import { Options } from "../types";
import path from 'path';
import { writeSource, readSource } from '../source-writer/read-write-util';
import { setupJavaDir } from "./setup";
import { compileJava } from './compile';

/**
 * Compile a java file 
 * @param filePath A path like string
 * @param options 
 */
export async function compileJavaFile(filePath: string, options?: Options): Promise<string> {
    //get target dir
    let dirPath = setupJavaDir();

    let fileName = path.basename(filePath);
    let newFilePath = path.join(dirPath, fileName);
    let source = await readSource(filePath);
    await writeSource(newFilePath, source);
    //compile
    return compileJava(newFilePath, options);
}
