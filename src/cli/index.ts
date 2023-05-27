import chalk from 'chalk'
import {Command} from 'commander'
import type {TopLevel} from '../language-server/generated/ast.js'
import {ByteScriptLanguageMetaData} from '../language-server/generated/module.js'
import {createByteScriptServices} from '../language-server/bytescript-module.js'
import {extractAstNode} from './cli-util.js'
import {generateWasm} from './generator.js'
import {NodeFileSystem} from 'langium/node.js'

// This is better, but changes the tsc compiler root, resulting in out/src/...
// Perhaps put output next to source files?
// import pkg from '../../package.json' assert {type: 'json'}

import fs from 'fs'
const relative = (path: string, base: string) => new URL(path, base).href.split('file://')[1]
const pkgFile = relative('../../package.json', import.meta.url)
const pkg = JSON.parse(fs.readFileSync(pkgFile).toString())

export async function generate(fileName: string, opts: GenerateOptions): Promise<void> {
	const services = createByteScriptServices(NodeFileSystem).ByteScript
	const ast = await extractAstNode<TopLevel>(fileName, services)
	const generatedFilePath = generateWasm(ast, fileName, opts.destination)
	console.log(chalk.green(`Build successful: ${generatedFilePath}`))
}

export type GenerateOptions = {
	destination?: string
}

export default function (): void {
	const program = new Command()

	program
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		// .version(require('../../package.json').version)
		.version(pkg.version)

	const fileExtensions = ByteScriptLanguageMetaData.fileExtensions.join(', ')
	program
		.command('compile')
		.argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
		.option('-d, --destination <dir>', 'destination directory of generating')
		.description('Compiles ByteScript source code to Wasm.')
		.action(generate)

	program.parse(process.argv)
}
