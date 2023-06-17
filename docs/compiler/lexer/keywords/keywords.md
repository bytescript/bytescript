# Keywords

This document provides a comprehensive list of all keywords in the [ByteScript](https://github.com/bytescript/bytescript) language. Keywords are reserved words that have a special meaning and function in the language. They cannot be used as identifiers for variables, functions, classes, or any other user-defined entities. Each keyword is accompanied by a brief description and an example of its usage in ByteScript code.

> Please note that this list of keywords is based on the current version of the ByteScript specification document, which can be found here: [ByteScript Specification Document](https://github.com/bytescript/bytescript/blob/master/docs/specification.md). As the ByteScript language continues to evolve, new keywords may be added or existing ones may change, so be sure to check back for updates.

## Table of Contents

- [const](#const)
- [export](#export)
- [from](#from)
- [function](#function)
- [import](#import)
- [let](#let)
- [return](#return)
- [type](#type)
- [var](#var)
- [Conclusion](#conclusion)
- [Cross-References](#cross-references)

## const

A keyword that declares a constant variable with a block scope and assigns it an initial value. The value of a constant variable cannot be changed after declaration.

Example:
```bytescript
const x = 123
```

## export

A keyword that exports a variable, function, or module so that it can be imported by other modules.

Example:
```bytescript
export function foo() { }
```

## from

A keyword that specifies the source module of an import statement.

Example:
```bytescript
import { foo } from "./bar"
```

## function

A keyword that defines a named block of code that can take parameters and return a value.

Example:
```bytescript
function add(a: i32, b: i32): i32 { return a + b }
```

## import

A keyword that imports a variable, function, or module from another module.

Example:
```bytescript
import { foo } from "./bar"
```

## let

A keyword that declares a variable with a block scope and assigns it an initial value.

Example:
```bytescript
let x = 123
```

## return

A keyword that specifies the value to be returned by a function.

Example:
```bytescript
function add(a: i32, b: i32): i32 { return a + b }
```

## type

A keyword that defines a new data type as an alias for an existing data type.

Example:
```bytescript
type Foo = i32
```

## var

A keyword that declares a variable with a global scope and assigns it an initial value.

Example:
```bytescript
var x = 123
```

## Conclusion

In this document, we have provided a comprehensive list of all keywords in the ByteScript language. These keywords are reserved words that have a special meaning and function in the language, and cannot be used as identifiers for user-defined entities. We have also provided brief descriptions and examples of each keyword to help you understand their usage in ByteScript code.

We hope that this document will serve as a useful reference for ByteScript developers, and help them write clear and efficient code using the language's keywords. As the language continues to evolve, new keywords may be added or existing ones may change, so be sure to check back for updates.

## Cross-References

If you want to learn more about the ByteScript language and its features, you might want to check out some of the following documents or resources that explain more details or concepts related to the keywords, such as data types, modules, functions, or scopes:

- Data types: [ByteScript Data Types](https://github.com/bytescript/bytescript/blob/master/docs/compiler/types/types.md)
- Modules: [ByteScript Modules](https://github.com/bytescript/bytescript/blob/master/docs/compiler/modules/modules.md)
- Functions: [ByteScript Functions](https://github.com/bytescript/bytescript/blob/master/docs/compiler/functions/functions.md)
- Scopes: [ByteScript Scopes](https://github.com/bytescript/bytescript/blob/master/docs/compiler/scopes/scopes.md)

These documents or resources will help you understand how to use the keywords in different contexts and scenarios, and how they interact with other elements of the ByteScript language.

## References

1. [ByteScript GitHub Repository](https://github.com/bytescript/bytescript) *Accessed on 2023-06-16*
2. [ByteScript Specification Issue #28](https://github.com/bytescript/bytescript/issues/28) *Accessed on 2023-06-16*
3. [ByteScript Keywords Issue #33](https://github.com/bytescript/bytescript/issues/33) *Accessed on 2023-06-16*
4. [ByteScript Lexer Issue #32](https://github.com/bytescript/bytescript/issues/32) *Accessed on 2023-06-16*
5. [WebAssembly Specification](https://webassembly.github.io/spec/core/index.html) *Accessed on 2023-06-16*
6. [WebAssembly Text Format Specification](https://webassembly.github.io/spec/core/text/index.html) *Accessed on 2023-06-16*
7. [WebAssembly Binary Format Specification](https://webassembly.github.io/spec/core/binary/index.html) *Accessed on 2023-06-16*
8. [WebAssembly Reference Manual](https://webassembly.org/docs/reference-manual/) *Accessed on 2023-06-16*
9. [WebAssembly Tutorial](https://www.tutorialspoint.com/webassembly/index.htm) *Accessed on 2023-06-16*
10. [WebAssembly Introduction](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts) *Accessed on 2023-06-16*
11. [Keywords and Identifiers in C programming - Codeforwin](https://codeforwin.org/c-programming/keywords-identifiers-c) *Accessed on 2023-06-16*
12. [The Go Programming Language Specification - Lexical Elements](https://go.dev/ref/spec#Lexical_elements) *Accessed on 2023-06-16*
13. [Lexical grammar - JavaScript | MDN - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar) *Accessed on 2023-06-16*
14. [C Tokens | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/c-language/c-tokens?view=msvc-170) *Accessed on 2023-06-16*