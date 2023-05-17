import chalk from 'chalk'
import {Command} from 'commander'
import type {TopLevel} from '../language-server/generated/ast'
import {ByteScriptLanguageMetaData} from '../language-server/generated/module'
import {createByteScriptServices} from '../language-server/bytescript-module'
import {extractAstNode} from './cli-util'
import {generateWasm} from './generator'
import {NodeFileSystem} from 'langium/node'

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
		.version(require('../../package.json').version)

	const fileExtensions = ByteScriptLanguageMetaData.fileExtensions.join(', ')
	program
		.command('compile')
		.argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
		.option('-d, --destination <dir>', 'destination directory of generating')
		.description('Compiles ByteScript source code to Wasm.')
		.action(generate)

	program.parse(process.argv)
}
