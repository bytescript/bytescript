cmake_minimum_required(VERSION 3.10)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "./bin")
project(compiler)

# Add the subfolder containing main.cpp
add_subdirectory (src)

# Add any other files or libraries that you need
file (GLOB_RECURSE SOURCES RELATIVE ${CMAKE_SOURCE_DIR} "src/*.cpp")
add_executable(bsc ${SOURCES})
