# `bytescript`

Compile TypeScript code to WebAssembly<!-- and native-->.

A compiler that transforms TypeScript code to WebAssembly<!-- and native-->, and
runs it with a provided set of web-standard APIs.

# About

ByteScript

- compiles a subset of TypeScript language to WebAssembly<!-- and native-->.
- also compiles to JavaScript for compatibility with existing JavaScript
  applications.
- provides better type safety than plain TypeScript due to stricter type
  checking required for WebAssembly.

Soon ByteScript will also

- provide a web-standard library for symmetric usage whether inside or outside
  of a browser environment, f.e. for writing web apps _or_ native apps, either way
  using familiar web APIs such as the File System API for working with files.
- provide simple interoperability with existing JavaScript and TypeScript
  projects by allowing devs to import ByteScript code into regular JavaScript or
  TypeScript, and TypeScript into ByteScript.
- optionally run your ByteScript code, f.e. `bytescript run main.ts`.
- support importing ES Modules from URLs as per standard ES Module spec.

# Compiling

ByteScript can run your code with its runtime, but if you want to compile your
code for bespoke purposes, you can do so.

To compile ByteScript code to WebAssembly, use ByteScript's `compile` command:

```sh
bytescript compile <file>
```

where `<file>` is a ByteScript-flavored TypeScript file. For example:

```sh
bytescript compile my-program.ts
```

> **Note** `bs` is a shortcut for `bytescript`, so `bs compile my-program.ts`
> will also work.

This will output a sibling `my-program.wasm` file. Optionally specify the output file:

```sh
bytescript compile my-program.ts -o some/place/foo.wasm
```

# Wasm exports

To export functions from your ByteScript WebAssembly module, use the `export` key word, the same as with JavaScript and TypeScript modules:

```ts
export function add(a: i32, b: i32): i32 {
	return a + b
}
```

If you are compiling, instantiating, then using the module directly (as opposed
to importing it in another file, or running the program with `bs run`), then the
exported function can be used as with exports of any Wasm module:

```js
console.log(module.exports.add(1, 2)) // 3
```

<!-- TODO -->

# Running

Use the `run` command to run your ByteScript program locally in a WebAssembly
runtime<!-- or as a bare-metal native binary-->:

```sh
bs run <file>
```

where `<file>` is a ByteScript-flavored TypeScript file. For example:

```sh
bs run app.ts
```

<!--
TODO

# Interoperability

In interoperable mode, ByteScript can compile or run a project with both regular
TypeScript and ByteScript code, making imports across both types of files work
seamlessly. This allows a regular TypeScript file to import ByteScript code, and
vice versa. This is useful for incrementally adopting ByteScript by introducing
ByteScript code while compiling the rest of an app as regular TypeScript.

To do this, use the `--interop` flag:

```sh
bs run --interop <file>
```

where `<file>` is a TypeScript or ByteScript entrypoint. In this mode, only
`.ts` files inside of `bs/` folders will be considered to be ByteScript, and all
other `.ts` files will be treated as regular TypeScript.

> **Note** In interoperable mode, a project can only run in a JavaScript
> environment such as in Node.js or a browser, not native. This can be useful for existing
> Node.js or browser apps that would like to start adopting WebAssembly for use
> cases such as speeding up hot code paths.

# Installing libraries

ByteScript supports loading libraries from NPM. To use a library from NPM, you can install it, then import it.

```sh
npm install some-lib
```

then

```js
import {someFunction} from 'some-lib'

someFunction(1, 2, 3)
```

-->

# Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
