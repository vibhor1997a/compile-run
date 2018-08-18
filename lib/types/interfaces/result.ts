export interface Result {
    stdout: string;
    stderr: string;
    exitCode: number;
    errorType?: 'compile-time' | 'run-time' | 'pre-compile-time';
}