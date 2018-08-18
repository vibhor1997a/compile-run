import { Result, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../helper";
import { compileCpp } from "./compile-file";
import { runExecutable } from "../executable/execute-executable";

/**
 * Runs a Cpp file on a given path and 
 * @param filePath A path like string
 * @param options
 * @param callback
 */
export function runCppFile(filePath: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Cpp file on a given path and 
 * @param filePath A path like string
 * @param callback
 */
export function runCppFile(filePath: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Cpp file on a given path and 
 * @param filePath A path like string
 * @param options
 */
export function runCppFile(filePath: string, options?: Options): Promise<Result>;

export async function runCppFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runCppFileAndReturnPromise, ...args);
}

export async function runCppFileAndReturnPromise(filePath: string, options?: Options): Promise<Result> {
    try {
        let executablePath = await compileCpp(filePath, options);
        return runExecutable(executablePath, options);
    }
    catch (err) {
        return err;
    }
}