import { Options, errorResultCallback, Result } from "../types";
import { writeSourceFile } from "../source-writer";
import { runNodeFile } from "./run-file";

export async function runNodeSourceCode(soureCode: string, options?: Options, callback?: errorResultCallback): Promise<Result> {
    let scPromise = runNodeSourceCodeAndReturnPromise(soureCode, options);
    if (typeof callback === 'function') {
        scPromise.then(d => {
            callback(undefined, d);
        }, e => {
            callback(e);
        });
    }
    return await scPromise;
}

async function runNodeSourceCodeAndReturnPromise(soureCode: string, options?: Options): Promise<Result> {
    let filePath = await writeSourceFile('python', soureCode);
    return await runNodeFile(filePath, options);
}
