import { Options } from "../types";
import path from 'path';
import { writeSource } from '../source-writer/read-write-util';
import { setupJavaDir } from "./setup";
import { compileJava } from "./compile";
/**
 * Compiles a java source string
 * @param source Java source to be compiled
 * @param options 
 */
export async function compileJavaSource(source: string, options?: Options): Promise<string> {
    //get target dir
    let dirPath = setupJavaDir();
    let publicClass;
    try {
        publicClass = getPublicClassName(source);
    }
    catch (err) {
        return err;
    }
    let fileName = `${publicClass}.java`;
    let filePath = path.join(dirPath, fileName);
    await writeSource(filePath, source);
    //compile
    return compileJava(filePath, options);
}

/**
 * Get the public class's name
 * @param source 
 */
function getPublicClassName(source: string): string {
    const re = /public\sclass\s([A-Za-z0-9]+)\s*{/gm;
    let res = re.exec(source);
    if (res) {
        return res[1];
    }
    else {
        throw {
            stdout: '',
            stderr: 'Invalid public class',
            exitCode: 3,
            errorType: 'pre-compile-time'
        };
    }
}
