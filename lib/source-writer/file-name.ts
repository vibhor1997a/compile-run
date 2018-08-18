import crypto from 'crypto';
/**
 * Return a random name of file with extension
 * 
 * eg - .js --> source-<somerandomstring>-<timestamp>.js
 * @param ext Extension of the file
 */
export function getFileName(ext?: string): string {
    const rand = crypto.pseudoRandomBytes(16).toString('hex');
    const ts = new Date().getTime();
    if (ext) {
        return `source-${rand}-${ts}.${ext}`;
    }
    else {
        return `source-${rand}-${ts}`;
    }
}