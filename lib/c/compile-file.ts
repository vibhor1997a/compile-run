import { Options } from "../types";
import { getFileName } from "../source-writer";
import { getExecutableExt } from "../executable/executable-ext";
import { tmpPath, checkExistsAndMakeDir } from "../init";
import path from 'path';
import { execute } from "../execute-command";

/**
 * Compiles a C source file and returns a promise that resolves with the path of the executable
 * @param filePath A path like string
 * @param options Optional options
 */
export async function compileC(filePath: string, options?: Options): Promise<string> {
    let compileTimeout = options && options.compileTimeout || 3000;
    let executableExt = getExecutableExt();
    const compilationPath: string = options && options.compilationPath || 'gcc';
    const compilerArgs: string = options && options.compilerArgs || '-lm';
    let cPath = path.join(tmpPath, 'c');
    checkExistsAndMakeDir(cPath);
    let executableName = getFileName(executableExt);
    let executablePath = path.join(cPath, executableName);
    let res = await execute(compilationPath, [filePath, '-o', executablePath, compilerArgs], { timeout: compileTimeout });
    if (res.exitCode !== 0) {
        res.errorType = 'compile-time';
        throw res;
    }
    return executablePath;
}