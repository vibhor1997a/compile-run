import { Result, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../helper";
import { compileJavaFile } from "./compile-file";
import { execute } from "../execute-command";
import path from 'path';

/**
 * Runs a Java file on a given path and 
 * @param filePath A path like string
 * @param options
 * @param callback
 */
export function runJavaFile(filePath: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Java file on a given path and 
 * @param filePath A path like string
 * @param callback
 */
export function runJavaFile(filePath: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Java file on a given path and 
 * @param filePath A path like string
 * @param options
 */
export function runJavaFile(filePath: string, options?: Options): Promise<Result>;

export async function runJavaFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runJavaFileAndReturnPromise, ...args);
}

export async function runJavaFileAndReturnPromise(filePath: string, options?: Options): Promise<Result> {
    try {
        let classFilePath = await compileJavaFile(filePath, options);
        let classPath = path.dirname(classFilePath);
        let [className] = path.basename(classFilePath).split('.');
        const executionPath = options && options.executionPath || 'java';
        let res = await execute(executionPath, ['-classpath', classPath, className], options);
        if (res.stderr) {
            res.errorType = 'run-time';
        }
        return res;
    }
    catch (err) {
        return err;
    }
}