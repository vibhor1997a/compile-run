import { Options, Result } from "./types";
import { spawn, ChildProcess } from "child_process";
import { writeToStdin } from "./sdtin-write";
import { streamDataToString } from "./stream-to-string";

/**
 * Execute a command taking spawn like arguments and returns a result promise
 * @param cmd 
 * @param args 
 * @param options
 */
export function execute(cmd: string, args: string[], options?: Options): Promise<Result>;

/**
 * Execute a command taking spawn like arguments and returns a result promise
 * @param cmd 
 * @param options
 */
export function execute(cmd: string, options?: Options): Promise<Result>;

/**
 * Execute a command taking spawn like arguments and returns a result promise
 * @param cmd 
 * @param args 
 */
export function execute(cmd: string, args?: string[]): Promise<Result>;

export function execute(cmd: string, ...args: any[]): Promise<Result> {
    let timeout = 3000;
    let stdin = '';
    return new Promise((res, rej) => {
        let p: ChildProcess;
        if (args[0] && args[0] instanceof Array) {
            p = spawn(cmd, args[0]);
            if (args[1] && typeof args[1] === 'object') {
                timeout = args[1] && args[1].timeout || timeout;
                stdin = args[1] && args[1].stdin || stdin;
            }
        }
        else if (args[0] && typeof args[0] === 'object') {
            p = spawn(cmd);
            timeout = args[0] && args[0].timeout || timeout;
            stdin = args[0] && args[0].stdin || stdin;
        }
        else {
            p = spawn(cmd);
        }
        //write to stdin
        writeToStdin(p, stdin);
        let killTimerId = setTimeout(() => {
            p.kill();
        }, timeout);
        let resultPromise: Promise<string>[] = [];
        resultPromise.push((streamDataToString(p.stderr)));
        resultPromise.push(streamDataToString(p.stdout));
        let pr = Promise.all(resultPromise);
        p.on('close', exitCode => {
            pr
                .then((result: string[]) => {
                    clearTimeout(killTimerId);
                    return result;
                })
                .then((result: string[]) => (
                    {
                        stderr: result[0],
                        stdout: result[1],
                        exitCode: exitCode
                    }
                ))
                .then((result: Result) => res(result))
                .catch(err => {
                    clearTimeout(killTimerId);
                    rej(err);
                });
        });
    });
}