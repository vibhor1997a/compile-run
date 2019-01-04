export interface Result {
    stdout: string;
    stderr: string;
    exitCode: number;
    /**
     * Memory used by program in Bytes
     */
    memoryUsage: number;
    /**
     * CPU time by program in microseconds
     */
    cpuUsage: number;
    errorType?: 'compile-time' | 'run-time' | 'pre-compile-time';
}
