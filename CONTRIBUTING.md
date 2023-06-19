# Contributing

# Editor Setup

Make sure you install [Prettier](https://prettier.io) and
[Editorconfig](https://editorconfig.org) plugins for your editor.

# Building

Run `npm run langium:generate` to generate TypeScript parser/AST code from our
`.langium` grammar. Run `npm run langium:watch` to do the same in watch mode.

Run `npm run build` to compile our TypeScript code (including both Langium's
generated TypeScript code and our hand-written TypeScript code depending on the
generated code) to `out/`. Run `npm run watch` to do the same thing in watch
mode.

For a dev session, you will typically run both `npm run langium:watch` and `npm
run watch` at the same time: as you edit the grammar in `.langium` files, this
will update generated TypeScript code, which will trigger a rebuild of
TypeScript code including our hand-written code.

# Running tests

Run `npm test` to run automated tests. This will compile sample ByteScript code and run it in Node.js and in Chrome headless.

# Manual testing the LSP VS Code plugin

Hit `F5` in VS Code to open a new VS Code window that has a preview of the local
VS Code extension enabled, and then you can open any ByteScript code or project in that dev
window to test out the grammar, autocompletion, etc.
