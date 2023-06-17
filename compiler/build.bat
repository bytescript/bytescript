@echo off

REM build.bat
REM author: @zoedreams
REM date: 230617
REM description: used to build the compiler called `bsc.exe` using CMake

@echo.
@echo Building bsc.exe with CMake...
@echo.

REM Check to see if we pass in the debug switch

@if "%1" == "" (
  @set config=Debug
) else (
  @set config=%1
)

REM Check to see if the config value is valid

@if /I "%config%" == "Debug" goto valid
@if /I "%config%" == "Release" goto valid
@echo Invalid configuration: %config%
@echo Please use Debug or Release as the argument.
@goto end

:valid
REM The first command (@cmake -S . -B ./build) is the configure step, 
REM where cmake generates the build system for the project

@cmake -S . -B .
IF %ERRORLEVEL% NEQ 0 (
  ECHO CMake failed with error code %ERRORLEVEL%
  EXIT /B %ERRORLEVEL%
)

REM The second command (@cmake --build ./build --config %config%) is the 
REM build step, where cmake compiles the project into `./bin/%config%/bsc.exe`

@cmake --build . --config %config%
IF %ERRORLEVEL% NEQ 0 (
  ECHO CMake failed with error code %ERRORLEVEL%
  EXIT /B %ERRORLEVEL%
)

:end
@echo.
@echo Build completed successfully.
@echo.
