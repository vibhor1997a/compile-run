import { Options, errorResultCallback, Result } from "../types";
import { writeSourceFile } from "../source-writer";
import { runPythonFile } from "./run-file";
import { multipleArgsCallbackifier } from "../helper";

/**
 * execute the python source code provided as a string
 * @param soureCode Source code as a string
 * @param options Optional Options object
 * @param callback Optional callback
 */
export async function runPythonSourceCode(soureCode: string, options: Options, callback: errorResultCallback): Promise<Result>

/**
 * execute the python source code provided as a string
 * @param soureCode Source code as a string
 * @param options Optional Options object
 */
export async function runPythonSourceCode(soureCode: string, options?: Options): Promise<Result>

/**
 * execute the python source code provided as a string
 * @param soureCode Source code as a string
 * @param callback Optional callback
 */
export async function runPythonSourceCode(soureCode: string, callback: errorResultCallback): Promise<Result>

export async function runPythonSourceCode(soureCode: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(soureCode, runPythonSourceCodeAndReturnPromise, ...args);
}

async function runPythonSourceCodeAndReturnPromise(soureCode: string, options?: Options): Promise<Result> {
    let filePath = await writeSourceFile('python', soureCode);
    let res = await runPythonFile(filePath, options);
    return res;
}
