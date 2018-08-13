import { errorResultCallback, Result, Options } from "../types";
import { spawn } from 'child_process';
import path from 'path';
import { streamDataToString } from "../stream-to-string";
import { writeToStdin } from "../sdtin-write";

/**
 * executes the python source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param callback 
 */
export async function runNodeFile(filePath: string, options?: Options, callback?: errorResultCallback): Promise<Result> {
    let execPromise = runNodeFileAndReturnPromise(filePath, options);
    if (typeof callback === 'function') {
        execPromise.then(result => {
            callback(undefined, result);
        }, (err: Error) => {
            callback(err);
        });
    }
    return await execPromise;
}

/**
 * Core function to handle program execution
 * @param filePath A path like string
 * @param options 
 */
function runNodeFileAndReturnPromise(filePath: string, options?: Options): Promise<Result> {
    return new Promise<Result>((res, rej) => {
        const timeout = options && options.timeout || 2000;
        const stdin = options && options.stdin || '';
        //Make the path absolute
        filePath = path.resolve(filePath);
        const p = spawn('node', [filePath]);

        //write to stdin
        writeToStdin(p, stdin);
        
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
