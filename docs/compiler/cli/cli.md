# CLI (Command-Line Interface)

This program is a simple cli tool which allows us to compile bytescript into wasm (and wat). The compiler is created using visual studio 2022 and is a basic C++ project solution. The project structure follows standard guidelines. 

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
./$> bsc myFunction.bs -native
```

Will test the bytescript `myFunction.bs` the same as if it compiles. It skips the step of generating output code. This function returns console output for debugging purposes during testing your program.

```bash
.$/ bsc myFunction.bs -test
```
 
## Compiling the CLI

The following commands are useful when compiling the project using cmake inside or outside of visual studio. It is assumed you have `cmake` available in your environment and the correct MSVCC resdistribuables. These are required or we will not be able to have an executable build for our correct architecture, such as `x64` or `x32` or `ARM`

This command will build the compiler's executable with default build settings, `Debug` target. Used for developing and testing locally. Note that visual studio will also create your pdb files for attached debugging support.

```bash
./$> cmake --build .
```

This command will build the **Debug** version compiler executable `CMake` directly in the console. 

```bash
./$> cmake --build . --config Debug
```

This command will build the **Release** version of the compiler executable using `CMake` directly in the console.

```bash
./$> cmake --build . --config Release
```

 Alternatively you can use the build solutions inside of Visual Studio to create the executables. This process uses the `CMakeLists.txt` file as the build toolchain configuration.
 
 ### Cleaning Builds
 
 Sometimes we want to remove build data and start fresh. The following command will help with that
 
 ```bash
 ./$> cmake --build C:/foo/build/ --target clean
 ```

# References

The following are useful information on setting up a new visual studio C++/CLR program. 

## WebAssembly

- https://developer.mozilla.org/en-US/docs/WebAssembly/Text_format_to_wasm
- https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format
- https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-tutorial.md
- https://developer.mozilla.org/en-US/docs/WebAssembly
- https://github.com/WebAssembly/wabt
- https://www.freecodecamp.org/news/get-started-with-webassembly-using-only-14-lines-of-javascript-b37b6aaca1e4/

### Building

- https://learn.microsoft.com/en-us/cpp/dotnet/walkthrough-compiling-a-cpp-program-that-targets-the-clr-in-visual-studio?view=msvc-170
- https://learn.microsoft.com/en-us/cpp/ide/walkthrough-working-with-projects-and-solutions-cpp?view=msvc-170/
- https://cmake.org/cmake/help/latest/index.html
- https://learn.microsoft.com/en-us/cpp/build/cmake-projects-in-visual-studio?view=msvc-170
- https://cmake.org/cmake/help/latest/guide/tutorial/A%20Basic%20Starting%20Point.html
- https://stackoverflow.com/questions/42376322/adding-a-cmake-project-to-a-visual-studio-solution
- https://learn.microsoft.com/en-us/cpp/build/working-with-project-properties?view=msvc-170

### CMake

- https://cmake.org/cmake/help/latest/index.html#
- https://cmake.org/cmake/help/latest/variable/CMAKE_RUNTIME_OUTPUT_DIRECTORY.html
- https://stackoverflow.com/questions/19024259/how-to-change-the-build-type-to-release-mode-in-cmake
- https://stackoverflow.com/questions/6594796/how-do-i-make-cmake-output-into-a-bin-dir