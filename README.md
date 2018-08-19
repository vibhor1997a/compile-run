compile-run
===================

- This library works as a wrapper over the compilers installed in your system.
- It provides APIs to execute programs by spawning child processes.
- It has built in supports for types.
- It can work with `async/await` and `promises`.

## Supported Languages 

- C
- Cpp
- Java
- JavaScript(Node.js env)
- Python


## Prerequisites

The following should be installed on your machine and be added to the path. 

| Language | Software |
|---------|:-------:|
|C | gcc |
|C++ | gcc |
|Java | jdk or jre |
|Python | python |
|JavaScript(in node.js environment) | node.js |

## Installation

You can install it by using `npm` like below.

```shell
npm install compile-run --save
```

## Usage

It have 5 modules each for a language containing namely.

```javascript
const {c, cpp, node, python, java} = require('compile-run');
```
Each module have 2 functions :-

## 1. `runFile` 

This enables you to run a file and takes filepath as an argument with options and callback as optional arguments.

## 2. `runSource`
This enables 
you to directly execute a source code in a stored in a string. It takes source code as an argument with options and callback as optional arguments.

## Examples:-

### - Running a cpp source code file.

```javascript
let resultPromise = cpp.runFile('E:\\abcd.cpp', { stdin:'3\n2 '});
resultPromise
    .then(result => {
        console.log(result);//result object
    })
    .catch(err => {
        console.log(err);
    });
```

### - Running a python source code string.
```javascript
const sourcecode = `print("Hell0 W0rld!")`;
let resultPromise = python.runSource(sourcecode);
resultPromise
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
```

### - Working with callback.

You can also use callback by passing it like -

- with options
```javascript
cpp.runFile('E:\\abcd.cpp', { stdin:'3\n2 '}, (err, result) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(result);
    }
});
```
- without options
```javascript
cpp.runFile('E:\\abcd.cpp', (err, result) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(result);
    }
});
```
## Result

Result is an object with the following keys:-

1. `stdout` \<string> - stdout of the program execution. For empty stdout an empty string is returned.
2. `stderr` \<string> - stderr of the program execution, compilation or if public class name is not found in provided source string(In java). For empty stderr empty string is returned.
3. `exitCode` \<number> - exit code of the program.
4. `errorType` \<string|undefined> - It is set to the below values if there is some stderr or in case of a non-zero exitCode.
    1. `'pre-compile-time'` - Only in case of `java`. Can be arised due to invalid public class name if using `runSource` for `java`.
    2. `'compile-time'` - If some error has occured at the compile time.
    3. `'run-time'` - If the error has occured at the run time.

## Options

API's offer an optional options object which has following keys:-

1. `stdin` \<string> - Input/stdin you want to pass to the program.
2. `timeout` \<number> - timeout for program execution in milliseconds. Default is 3000 milliseconds. 
3. `compileTimeout` - timeout during compilation for c, cpp, java in milliseconds. Default is 3000 milliseconds. Would be ignored if passed for node or python