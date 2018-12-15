import { Result, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../helper";
import { compileJavaSource } from "./compile-source";
import { execute } from "../execute-command";
import path from 'path';

/**
 * Runs a Java source string 
 * @param source source string
 * @param options
 * @param callback
 */
export function runJavaSource(source: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Java source string 
 * @param source source string
 * @param callback
 */
export function runJavaSource(source: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Java source string 
 * @param source source string
 * @param options
 */
export function runJavaSource(source: string, options?: Options): Promise<Result>;

export async function runJavaSource(source: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(source, runJavaSourceAndReturnPromise, ...args);
}

export async function runJavaSourceAndReturnPromise(filePath: string, options?: Options): Promise<Result> {
    try {
        let classFilePath = await compileJavaSource(filePath, options);
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