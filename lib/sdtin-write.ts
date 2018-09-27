import { ChildProcess } from "child_process";

/**
 * Write the stdin into the child process
 * @param proc Child process refrence
 * @param stdin stdin string
 */
export function writeToStdin(proc: ChildProcess, stdin: string): void {
    if (stdin) {
        try {
            proc.stdin.write(stdin + '\r\n');
            proc.stdin.end();
        }
        catch (err) {
            // Maybe the stream was already closed for us to write.
            // To fix issue #2
            return;
        }
    }
}