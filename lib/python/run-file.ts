import { writeSourceFile } from "../source-writer";
import { errorResultCallback, Result, Options } from "../types";
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { streamDataToString } from "../stream-to-string";

/**
 * executes the python source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param callback 
 */
export function runPythonFile(filePath: string, options?: Options, callback?: errorResultCallback): Promise<Result> | void {
    function execute(res: any, rej: any) {
        runPythonFileAndReturnPromise(filePath, options).then(res).catch(rej);
    }

    return typeof callback === 'function'
        ? execute(callback.bind(null, undefined), callback)
        : new Promise(execute);
}

function runPythonFileAndReturnPromise(filePath: string, options?: Options): Promise<Result> {
    return new Promise<Result>((res, rej) => {
        const timeout = options && options.timeout || 2000;
        //Make the path absolute
        filePath = path.resolve(filePath);
        const p = spawn('python', [filePath]);
        let killTimerId = setTimeout(() => {
            p.kill();
        }, timeout);
        let resultPromise: Promise<string>[] = [];
        resultPromise.push((streamDataToString(p.stderr)));
        resultPromise.push(streamDataToString(p.stdout));
        let pr = Promise.all(resultPromise);
        pr
            .then((result: string[]) => {
                clearTimeout(killTimerId);
                return result;
            })
            .then((result: string[]) => (
                {
                    stderr: result[0],
                    stdout: result[1]
                }
            ))
            .then((result: Result) => res(result))
            .catch(err => {
                clearTimeout(killTimerId);
                rej(err);
            });
    });
}
