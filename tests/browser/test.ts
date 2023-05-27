import {expect} from '@open-wc/testing'

describe('poc1', () => {
	it('add sums up 2 numbers', async () => {
		const wasmModule = await WebAssembly.instantiateStreaming(await fetch('/generated/poc1.wasm'))

		const {add} = wasmModule.instance.exports as {add(a: number, b: number): number}

		expect(add(1, 1)).to.equal(2)
		expect(add(3, 12)).to.equal(15)
	})
})
