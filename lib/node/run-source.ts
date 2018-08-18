import { Options, errorResultCallback, Result } from "../types";
import { writeSourceFile } from "../source-writer";
import { runNodeFile } from "./run-file";
import { multipleArgsCallbackifier } from "../helper";

/**
 * execute the JavaScript source code provided as a string in a node environment
 * @param soureCode Source code as a string
 * @param options Optional Options object
 * @param callback Optional callback
 */
export function runNodeSourceCode(soureCode: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * execute the JavaScript source code provided as a string in a node environment
 * @param soureCode Source code as a string
 * @param callback Optional callback
 */
export function runNodeSourceCode(soureCode: string, callback: errorResultCallback): Promise<Result>;

/**
 * execute the JavaScript source code provided as a string in a node environment
 * @param soureCode Source code as a string
 * @param options Optional Options object
 */
export function runNodeSourceCode(soureCode: string, options?: Options): Promise<Result>;

export async function runNodeSourceCode(soureCode: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(soureCode, runNodeSourceCodeAndReturnPromise, ...args);
}

async function runNodeSourceCodeAndReturnPromise(soureCode: string, options?: Options): Promise<Result> {
    let filePath = await writeSourceFile('node', soureCode);
    return runNodeFile(filePath, options);
}
