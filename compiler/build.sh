#!/bin/bash

# build.sh
# author: @zoedreams
# date: 230617
# description: used to build the compiler called `bsc` using CMake

# Check to see if we pass in the debug switch

if [ -z "$1" ]; then
  config=Debug
else
  config=$1
fi

echo
echo -e "\e[34mBuilding \`bsc\` ($config) with \e[01mCMake\e[0m...\e[0m"
echo

# Check to see if the config value is valid

if [ "$config" == "Debug" ] || [ "$config" == "Release" ]; then
  # The first command (cmake -S . -B ./build) is the configure step, 
  # where cmake generates the build system for the project

  status=0

  cmake -S . -B .
  if [ $? -ne 0 ]; then
    echo "CMake failed with error code $?"
    status=1
  fi

  # The second command (cmake --build ./build --config $config) is the 
  # build step, where cmake compiles the project into `./bin/$config/bsc`

  cmake --build . --config $config
  if [ $? -ne 0 ]; then
    echo "CMake failed with error code $?"
    status=1
  fi

else
  echo "Invalid configuration: $config"
  echo "Please use Debug or Release as the argument."
fi

echo
if [ "$status" -eq 0 ]; then
  echo -e "\e[92m Build completed \e[1mSuccessfully! \e[0m \e[0m"
else
  echo -e "\e[91m Build was \e[1mUnsuccessfully :( \e[0m \e[0m"
fi
echo

