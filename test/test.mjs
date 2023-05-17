import fs from 'fs'

const wasmBuffer = fs.readFileSync('./generated/poc1.wasm')

const wasmModule = await WebAssembly.instantiate(wasmBuffer)

const {add} = wasmModule.instance.exports
const sum = add(5, 6)

console.assert(sum === 11, 'expected 5+6 = 11')
