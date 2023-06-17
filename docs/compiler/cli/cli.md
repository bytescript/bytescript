# CLI (Command-Line Interface)

This program is a simple cli tool which allows us to compile bytescript into wasm (and wat). The compiler is created using visual studio 2022 and is a basic C++ project solution. The project structure follows standard guidelines. The following are useful information on setting up a new visual studio C++/CLR program. 

 - https://learn.microsoft.com/en-us/cpp/ide/walkthrough-working-with-projects-and-solutions-cpp?view=msvc-170/
 - https://learn.microsoft.com/en-us/cpp/dotnet/walkthrough-compiling-a-cpp-program-that-targets-the-clr-in-visual-studio?view=msvc-170

## Current State

The CLI is actively being worked on by our development team and is expected many changes and refactors to how it inputs and outputs data, as well as various flags and switch statements common in other cli tools you might use.

### Core Functionality and Features

The initial pass of the cli is mainly to test development output of our compilers lexing analysis. Here are some example use cases for the compiler.

Will compile a simple single function ByteScript `myFunction.bs` in the current directory, into a WebAssembly file `myFunction.wasm` in the same directory

```bash
.$/ bsc myFunction.bs myFunction.wasm
```

Will compile a simple single function Bytescript `myFunction.bs` in the current directory, into a WebAssembly Textual Code `myFunction.wat`

```bash
.$/ bsc myFunction.bs myFunction.wat
```

Will compile the bytescript `myFunction.bs` into WebAssembly and embed it into a generate html wrapper page for the browser.

```bash
.$/ bsc myFunction.bs -html
```
Will compile the bytescript `myFunction.bs` into WebAssembly and embed it into a generate code block of javascript which can be used.

```bash
.$/ bsc myFunction.bs -js
```

Will compile the bytescript `myFunction.bs` into WebAssembly and embed it into a native application which can be run locally on your machine outside of the browser.

```bash
.$/ bsc myFunction.bs -native
```

Will test the bytescript `myFunction.bs` the same as if it compiles. It skips the step of generating output code. This function returns console output for debugging purposes during testing your program.

```bash
.$/ bsc myFunction.bs -test
```