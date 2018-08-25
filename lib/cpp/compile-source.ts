import { writeSourceFile } from "../source-writer";
import { compileCpp } from "./compile-file";
import { Options } from "../types";

/**
 * Compiles a Cpp source String And resolves with the path of the executable
 * @param sourceCode 
 * @param options 
 */
export async function compileCppSource(sourceCode: string, options?: Options): Promise<string> {
    let filePath = await writeSourceFile('cpp', sourceCode);
    let executablePath = await compileCpp(filePath, options);
    return executablePath;
}
