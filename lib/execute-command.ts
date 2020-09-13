import { Options, Result } from "./types";
import { ChildProcess, spawn } from "child_process";
import path from 'path';

interface ResponseMessage {
    status: 'success' | 'error';
    executionResult: Result;
    error: any;
}

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
    let stdoutLimit = 1000;
    let stderrLimit = 1000;
    return new Promise((res, rej) => {
        let p: ChildProcess;
        let arr: string[] | undefined = undefined;
        if (args[0] && args[0] instanceof Array) {
            arr = args[0];
            if (args[1] && typeof args[1] === 'object') {

                timeout = args[1] && args[1].timeout || timeout;
                stdin = args[1] && args[1].stdin || stdin;
                stderrLimit = args[1] && args[1].stderrLimit || stderrLimit;
                stdoutLimit = args[1] && args[1].stdoutLimit || stdoutLimit;
            }
        }
        else if (args[0] && typeof args[0] === 'object') {
            timeout = args[0] && args[0].timeout || timeout;
            stdin = args[0] && args[0].stdin || stdin;
            stderrLimit = args[0] && args[0].stderrLimit || stderrLimit;
            stdoutLimit = args[0] && args[0].stdoutLimit || stdoutLimit;
        }
        p = spawn('node', [path.join(__dirname, 'box')], {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc']
        });
        p.send({
            cmd,
            timeout,
            stdin,
            stderrLimit,
            stdoutLimit,
            arguments: arr
        });
        p.on('message', (msg: ResponseMessage) => {
            if (msg.status == 'success') {
                res(msg.executionResult);
            }
            else {
                rej(msg.error);
            }
            p.kill();
        });
    });
}
