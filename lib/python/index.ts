import { runPythonFile } from './run-file';
import { runPythonSourceCode } from './run-source';

const python = {
    runFile: runPythonFile,
    runSource: runPythonSourceCode
};

export default python;
