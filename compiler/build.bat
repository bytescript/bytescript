@echo off

REM build.bat
REM author: @zoedreams
REM date: 230617
REM description: used to build the compiler called `bsc.exe` using CMake

REM Check to see if we pass in the debug switch

@if "%1" == "" (
  @set config=Debug
) else (
  @set config=%1
)

@echo.
@echo   [34mBuilding `bsc` (%config%) with [01mCMake[0m...[0m
@echo.

REM Check to see if the config value is valid

@if /I "%config%" == "Debug" goto valid
@if /I "%config%" == "Release" goto valid
@echo Invalid configuration: %config%
@echo Please use Debug or Release as the argument.
@goto end

:valid
REM The first command (@cmake -S . -B ./build) is the configure step, 
REM where cmake generates the build system for the project

@set status=0

@cmake -S . -B .
IF %ERRORLEVEL% NEQ 0 (
  ECHO CMake failed with error code %ERRORLEVEL%
  @set status=1
)

REM The second command (@cmake --build ./build --config %config%) is the 
REM build step, where cmake compiles the project into `./bin/%config%/bsc.exe`

@cmake --build . --config %config%
IF %ERRORLEVEL% NEQ 0 (
  ECHO CMake failed with error code %ERRORLEVEL%
  @set status=1
)

:end
ECHO.
IF "%status%" EQU "0" (
  ECHO   [92m Build completed [1mSuccessfully! [0m [0m
) ELSE (
  ECHO   [91m Build was [1mUnsuccessfully :( [0m [0m
)
ECHO.
