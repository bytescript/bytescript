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

Before using any of the command build commands we need to make sure the project is ready to be built by **CMake**. To do this, we can use the `build.bat` file that configures and builds the project with a given configuration (Debug or Release). The file also checks for valid arguments and prints helpful messages.

### Using Build Scripts

To run the `build.bat` file, we can use the following command in the console:

```bash
./$> ./build.bat
```

Or you can also specific a build configuration such as **Debug** or **Release**. If nothing is specified then debug will be used.

```bash
./$> ./build.bat [config]
```

where `[config]` is either Debug or Release. If no argument is given, Debug is used by default.

This command will build the compiler's executable with the specified configuration and place it in the `./bin/[config]/bsc.exe` folder. It will also create pdb files for attached debugging support if Debug configuration is used.

### Using CMake directly

Alternatively, you can use the following commands to configure and build the project using **CMake** directly in the console:

```bash
./$> cmake -S . -B .
./$> cmake --build . --config [config]
```

where `[config]` is either Debug or Release. If no argument is given, Debug is used by default.

These commands will do the same thing as the `build.bat` file, but without checking for valid arguments or printing helpful messages.

You can also use the build solutions inside of Visual Studio to create the executables. This process uses the `CMakeLists.txt` file as the build toolchain configuration.

### Successful Compilation output

The following is a successful build output for a machine running Windows 11 with `x64` architecture.
 
 ```bash
 Rebuild started...
1>------ Rebuild All started: Project: ZERO_CHECK, Configuration: Debug x64 ------
1>Checking Build System
1>CMake is re-running because generate.stamp.list is missing.
1>-- Building for: Visual Studio 17 2022
1>-- Selecting Windows SDK version 10.0.22000.0 to target Windows 10.0.22621.
1>-- The C compiler identification is MSVC 19.36.32534.0
1>-- The CXX compiler identification is MSVC 19.36.32534.0
1>-- Detecting C compiler ABI info
1>-- Detecting C compiler ABI info - done
1>-- Check for working C compiler: C:/Program Files/Microsoft Visual Studio/2022/Community/VC/Tools/MSVC/14.36.32532/bin/Hostx64/x64/cl.exe - skipped
1>-- Detecting C compile features
1>-- Detecting C compile features - done
1>-- Detecting CXX compiler ABI info
1>-- Detecting CXX compiler ABI info - done
1>-- Check for working CXX compiler: C:/Program Files/Microsoft Visual Studio/2022/Community/VC/Tools/MSVC/14.36.32532/bin/Hostx64/x64/cl.exe - skipped
1>-- Detecting CXX compile features
1>-- Detecting CXX compile features - done
1>-- Configuring done (3.1s)
1>-- Generating done (0.0s)
1>-- Build files have been written to: C:/Users/xxx/Code/bytescript/compiler
2>------ Rebuild All started: Project: compiler, Configuration: Debug x64 ------
2>Building Custom Rule C:/Users/xxx/Code/bytescript/compiler/CMakeLists.txt
2>main.cpp
2>compiler.vcxproj -> C:\Users\xxx\Code\bytescript\compiler\bin\Debug\compiler.exe
3>------ Skipped Rebuild All: Project: ALL_BUILD, Configuration: Debug x64 ------
3>Project not selected to build for this solution configuration 
========== Rebuild All: 2 succeeded, 0 failed, 1 skipped ==========
========== Rebuild started at 3:59 AM and took 05.157 seconds ==========
```

You can alternatively run **CMake** directly in your terminal or bash, its output should look something like this on Windows 11 terminal

``` bash
PS C:\Users\xxx\Code\bytescript\compiler> cmake --build .
MSBuild version 17.6.3+07e294721 for .NET Framework

  compiler.vcxproj -> C:\Users\xxx\Code\bytescript\compiler\bin\Debug\bsc.exe
PS C:\Users\xxx\Code\bytescript\compiler>
```

### Troubleshooting

The following sections might help explain any development setup issues you may have.

#### Unable to run executable from Start button
 
First make sure you have the correct target set. Next make sure your startup target is set to `compiler` in your solution view. To do this right click on `compiler` in the solution view, and then select `Set as Startup Project` from the context menu.

### Cleaning Builds

Sometimes we want to remove build data and start fresh. The following command will help with that. The clean script will remove _all_ of the build directories and `cmake` dependendcies. If you wish to just clean the build use the following `cmake` command.

```bash
./$> cmake --build . --target clean
```

## Running the CLI

After compiling the project, you can run the `bsc.exe` executable to test the compiler. The executable takes a source file as an argument and compiles it into a bytecode file. The bytecode file can then be executed by the virtual machine.

To run the `bsc.exe` executable, you can use the following command in the console:

```bash
./$> ./bin/[config]/bsc.exe [source]
```

where `[config]` is either Debug or Release, and `[source]` is the path to the source file.

This command will compile the source file into a bytecode file and place it in the same folder as the source file. The bytecode file is a binary representation of the source code that can be executed by the virtual machine.

To run the bytecode file, you can use the following command in the console:

```bash
./$> ./bin/[config]/bsvm.exe [bytecode]
```

where `[config]` is either Debug or Release, and `[bytecode]` is the path to the bytecode file.

This command will execute the bytecode file using the virtual machine. The virtual machine is a program that simulates a computer that can run the bytecode instructions.

The compiler and the virtual machine are separate programs that work together to run the ByteScript code. The compiler translates the human-readable source code into machine-readable bytecode, and the virtual machine executes the bytecode instructions.

For example, if you have a source file called `hello.bs` that contains the following code:

```bytescript
print("Hello ByteScript!")
```

You can compile and run it using the following commands:

```bash
./$> ./bin/Debug/bsc.exe hello.bs
./$> ./bin/Debug/bsvm.exe hello.bsc
```

This will output `Hello ByteScript!` to the console and exit.

## Disclaimer

Please note that the bsvm executable is not coded yet to test natively in a virtual machine. It is currently a placeholder that prints the bytecode file to the console. The actual virtual machine implementation is still under development and will be added in the future.

Also, the core part of the compiler is not complete and is only working with lexical analysis and not code generation yet. This means that the compiler can only tokenize the source code and check for syntax errors, but it cannot produce valid bytecode instructions. The code generation part of the compiler is also still under development and will be added in the future.

For more information, please see the GitHub issues #32 and #28.

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