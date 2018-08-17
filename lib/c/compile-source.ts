import { writeSourceFile } from "../source-writer";
import { compileC } from "./compile-file";
import { Options } from "../types";

/**
 * Compiles a C source String And resolves with the path of the executable
 * @param sourceCode 
 * @param options 
 */
export async function compileCSource(sourceCode: string, options?: Options): Promise<string> {
    let filePath = await writeSourceFile('c', sourceCode);
    let executablePath = await compileC(filePath, options);
    return executablePath;
}
