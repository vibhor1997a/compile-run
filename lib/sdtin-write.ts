import { ChildProcess } from "child_process";

/**
 * Write the stdin into the child process
 * @param proc Child process refrence
 * @param stdin stdin string
 */
export function writeToStdin(proc: ChildProcess, stdin: string): void {
    if (stdin) {
        proc.stdin.on("error", err => {
            // Ignore input if stream is already closed
            return;
        });
        proc.stdin.write(stdin + '\r\n', err => {
            if (!err) {
                proc.stdin.end();
            }
        });
    }
}