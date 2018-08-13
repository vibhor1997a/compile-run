import { ChildProcess } from "child_process";

/**
 * Write the stdin into the child process
 * @param proc Child process refrence
 * @param stdin stdin string
 */
export function writeToStdin(proc: ChildProcess, stdin: string) {
    proc.stdin.write(stdin + '\n');
    proc.stdin.end();
}
