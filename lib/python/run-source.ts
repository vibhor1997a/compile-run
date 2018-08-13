import { Options, errorResultCallback, Result } from "../types";
import { writeSourceFile } from "../source-writer";
import { runPythonFile } from "./run-file";

export async function runPythonSourceCode(soureCode: string, options?: Options, callback?: errorResultCallback): Promise<Result> {
    let scPromise = runPythonSourceCodeAndReturnPromise(soureCode, options);
    if (typeof callback === 'function') {
        scPromise.then(d => {
            callback(undefined, d);
        }, e => {
            callback(e);
        });
    }
    return await scPromise;
}

async function runPythonSourceCodeAndReturnPromise(soureCode: string, options?: Options): Promise<Result> {
    let filePath = await writeSourceFile('python', soureCode);
    return await runPythonFile(filePath, options);
}
