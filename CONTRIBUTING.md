# Contributing

# Editor Setup

Make sure you install [Prettier](https://prettier.io) and
[Editorconfig](https://editorconfig.org) plugins for your editor.

# Development

Run `npm run langium:generate` to generate TypeScript parser/AST code from our
`.langium` grammar. Run `npm run langium:watch` to do the same in watch mode.

Run `npm run build` to compile our TypeScript code (including both manual and
generated TypeScript code) to `out/`. Run `npm run watch` to do the same thing
in watch mode.

For a dev session, you will typically run both `npm run langium:watch` and `npm
run watch` at the same time: as you edit the grammar, this will update
TypeScript code, which will re-trigger TypeScript build.

Hit `F5` in VS Code to open a new VS Code window that has a preview of the local
VS Code extension enabled, and then you can open any code or project in that dev
window to test out the grammar, autocompletion, etc.
