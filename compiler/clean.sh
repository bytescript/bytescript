#!/bin/bash

# clean.sh
# author: @zoedreams
# date: 230617
# description: used to remove build and output directories used by CMake

# check if the bin folder exists and delete it if yes

if [ -d "./bin" ]; then
  rm -rf "./bin"
  echo "Folder ./bin deleted successfully."
else
  echo "Folder ./bin does not exist."
fi

# check if the build folder exists and delete it if yes

if [ -d "./build" ]; then
  rm -rf "./build"
  echo "Folder ./build deleted successfully."
else
  echo "Folder ./build does not exist."
fi

# check if the bsc.dir folder exists and delete it if yes

if [ -d "./bsc.dir" ]; then
  rm -rf "./bsc.dir"
  echo "Folder ./bsc.dir deleted successfully."
else
  echo "Folder ./bsc.dir does not exist."
fi

# check if the CMakeFiles folder exists and delete it if yes

if [ -d "./CMakeFiles" ]; then
  rm -rf "./CMakeFiles"
  echo "Folder ./CMakeFiles deleted successfully."
else
  echo "Folder ./CMakeFiles does not exist."
fi

# also look for cmakefiles inside of the src directory

if [ -d "./src/CMakeFiles" ]; then
  rm -rf "./src/CMakeFiles"
  echo "Folder ./src/CMakeFiles deleted successfully."
else
  echo "Folder ./src/CMakeFiles does not exist."
fi

# check if the Debug folder exists and delete it if yes

if [ -d "./Debug" ]; then
  rm -rf "./Debug"
  echo "Folder ./Debug deleted successfully."
else
  echo "Folder ./Debug does not exist."
fi

# check if the Release folder exists and delete it if yes

if [ -d "./Release" ]; then
  rm -rf "./Release"
  echo "Folder ./Release deleted successfully."
else
  echo "Folder ./Release does not exist."
fi

# check if the x64 folder exists and delete it if yes

if [ -d "./x64" ]; then
  rm -rf "./x64"
  echo "Folder ./x64 deleted successfully."
else
  echo "Folder ./x64 does not exist."
fi


