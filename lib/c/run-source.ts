import { Result, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../helper";
import { compileCSource } from "./compile-source";
import { runExecutable } from "../executable/execute-executable";

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param options
 * @param callback
 */
export function runCSource(sourceCode: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param callback
 */
export function runCSource(sourceCode: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param options
 */
export function runCSource(sourceCode: string, options?: Options): Promise<Result>;

export async function runCSource(sourceCode: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(sourceCode, runCSourceAndReturnPromise, ...args);
}

export async function runCSourceAndReturnPromise(sourceCode: string, options?: Options): Promise<Result> {
    try {
        let executablePath = await compileCSource(sourceCode, options);
        return runExecutable(executablePath, options);
    }
    catch (err) {
        return err;
    }
}