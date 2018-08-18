import { Options, Result } from "../types";
import { execute } from "../execute-command";

/**
 * Executes an executable
 * @param filePath A path like string
 * @param options 
 */
export async function runExecutable(filePath: string, options?: Options): Promise<Result> {
  let res = await execute(filePath, options);
  if (res.exitCode != 0) {
    res.errorType = 'run-time';
  }
  return res;
}