#!/usr/bin/env node

// TODO convert ESM output format instead of CommonJS for our TypeScript code.
// import {createRequire} from 'module'
// const require = createRequire(import.meta.url)
// require('../out/cli').default()

import run from '../out/cli/index.js'
run()
