import { errorResultCallback, Result, Options } from "../types";
import path from 'path';
import { multipleArgsCallbackifier } from "../helper";
import { execute } from "../execute-command";

/**
 * executes the javascript source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param options Options object
 * @param callback Optional callback
 */
export function runNodeFile(filePath: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * executes the javascript source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param callback Optional callback
 */
export function runNodeFile(filePath: string, callback: errorResultCallback): Promise<Result>;

/**
 * executes the javascript source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param options Options object
 */
export function runNodeFile(filePath: string, options?: Options): Promise<Result>;

export async function runNodeFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runNodeFileAndReturnPromise, ...args);
}

/**
 * Core function to handle program execution
 * @param filePath A path like string
 * @param options 
 */
async function runNodeFileAndReturnPromise(filePath: string, options?: Options): Promise<Result> {
    //Make the path absolute
    filePath = path.resolve(filePath);
    const executionPath = options && options.executionPath || 'node';
    let res = await execute(executionPath, [filePath], options);
    if (res.exitCode != 0) {
        res.errorType = 'run-time';
    }
    return res;
}