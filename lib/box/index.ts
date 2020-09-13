import { spawn, ChildProcess } from 'child_process';
import { writeToStdin } from '../sdtin-write';
import { streamDataToString } from '../stream-to-string';
import { Result } from '../types';

interface ReceivedMessage {
    cmd: string;
    timeout: number;
    stdin: string;
    stderrLimit: number;
    stdoutLimit: number;
    arguments?: string[];
}

// When it receives a message about what command to execute it executes it and returns the result
process.on('message', (msg: ReceivedMessage) => {
    let initialCPUUsage = process.cpuUsage();
    let initialMemUsage = process.memoryUsage();
    let cp: ChildProcess = spawn(msg.cmd, msg.arguments,);

    //write to stdin
    writeToStdin(cp, msg.stdin);
    let killTimerId = setTimeout(() => {
        cp.kill();
    }, msg.timeout);
    let resultPromise: Promise<string>[] = [];
    resultPromise.push((streamDataToString(cp.stderr)));
    resultPromise.push(streamDataToString(cp.stdout));
    let pr = Promise.all(resultPromise);
    let stdoutSize = 0, stdoutErrSize = 0;
    cp.stdout.on('data', (data : string) => {
        stdoutSize += data.length;
        if(stdoutSize > msg.stdoutLimit)
            cp.kill();
    });
    cp.stderr.on('data', (data : string) => {
        stdoutErrSize += data.length;
        if(stdoutErrSize > msg.stderrLimit)
            cp.kill();
    });
    cp.on('close', (exitCode,signal) => {
        let memUsage = process.memoryUsage();
        pr
            .then((result: string[]) => {
                clearTimeout(killTimerId);
                return result;
            })
            .then((result: string[]) => {
                let res = {
                    stderr: result[0].slice(0,msg.stderrLimit),
                    stdout: result[1].slice(0,msg.stdoutLimit),
                    exitCode: exitCode,
                    signal: signal,
                    memoryUsage: memUsage.rss - initialMemUsage.rss,
                    cpuUsage: process.cpuUsage(initialCPUUsage).user
                }
                return res;
            })
            .then((result: Result) => {
                process.send && process.send({
                    status: 'success',
                    executionResult: result
                });
            })
            .catch(err => {
                process.send && process.send({
                    status: 'error',
                    error: err
                });
                clearTimeout(killTimerId);
            });
    });
});
