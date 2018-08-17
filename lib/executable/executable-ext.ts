import os from 'os';

/**
 * Get the extension to be used for executable acc to the OS
 */
export function getExecutableExt(): string {
    if (os.type() === 'Windows_NT') {
        return 'exe';
    }
    else {
        return 'out';
    }
}