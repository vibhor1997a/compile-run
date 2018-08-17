import { runNodeFile } from './run-file';
import { runNodeSourceCode } from './run-source';

const node = {
    runFile: runNodeFile,
    runSource: runNodeSourceCode
};

export default node;
