@echo off

REM clean.bat
REM author: @zoedreams
REM date: 230617
REM description: used to remove build and output directories used by CMake

REM check if the bin folder exists and delete it if yes

@echo.
@if exist "./bin\" (
  @RD /S /Q "./bin"
  @echo Folder ./bin deleted successfully.
) else (
  @echo Folder ./bin does not exist.
)

REM check if the build folder exists and delete it if yes

@if exist "./build\" (
  @RD /S /Q "./build"
  @echo Folder ./build deleted successfully.
) else (
  @echo Folder ./build does not exist.
)

REM check if the bsc.dir folder exists and delete it if yes

@if exist "./bsc.dir\" (
  @RD /S /Q "./bsc.dir"
  @echo Folder ./bsc.dir deleted successfully.
) else (
  @echo Folder ./bsc.dir does not exist.
)

REM check if the CMakeFiles folder exists and delete it if yes

@if exist "./CMakeFiles\" (
  @RD /S /Q "./CMakeFiles"
  @echo Folder ./CMakeFiles deleted successfully.
) else (
  @echo Folder ./CMakeFiles does not exist.
)

REM also look for cmakefiles inside of the src directory

@if exist "./src/CMakeFiles\" (
  @RD /S /Q "./src/CMakeFiles"
  @echo Folder ./src/CMakeFiles deleted successfully.
) else (
  @echo Folder ./src/CMakeFiles does not exist.
)

REM check if the Debug folder exists and delete it if yes

@if exist "./Debug\" (
  @RD /S /Q "./Debug"
  @echo Folder ./Debug deleted successfully.
) else (
  @echo Folder ./Debug does not exist.
)

REM check if the Release folder exists and delete it if yes

@if exist "./Release\" (
  @RD /S /Q "./Release"
  @echo Folder ./Release deleted successfully.
) else (
  @echo Folder ./Release does not exist.
)

REM check if the x64 folder exists and delete it if yes

@if exist "./x64\" (
  @RD /S /Q "./x64"
  @echo Folder ./x64 deleted successfully.
) else (
  @echo Folder ./x64 does not exist.
)
@echo.
