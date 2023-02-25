import fs from 'fs'
import {CompositeGeneratorNode, NL, toString} from 'langium'
import path from 'path'
import {ByteScriptCode} from '../language-server/generated/ast'
import {extractDestinationAndName} from './cli-util'

export function generateJavaScript(code: ByteScriptCode, filePath: string, destination: string | undefined): string {
	const data = extractDestinationAndName(filePath, destination)
	const generatedFilePath = `${path.join(data.destination, data.name)}.js`

	const fileNode = new CompositeGeneratorNode()
	fileNode.append('"use strict";', NL, NL)
	code.statements.forEach(stmt => fileNode.append(`console.log('Hello, ${stmt.$type}!');`, NL))

	if (!fs.existsSync(data.destination)) fs.mkdirSync(data.destination, {recursive: true})
	fs.writeFileSync(generatedFilePath, toString(fileNode))
	return generatedFilePath
}
