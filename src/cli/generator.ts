import fs from 'fs'
import {CompositeGeneratorNode, NL, toString} from 'langium'
import path from 'path'
import {
	TopLevel,
	isBinaryExpression,
	isExportedFunctionDeclaration,
	isOriginalFunctionDeclaration,
	isReturnStatement,
} from '../language-server/generated/ast.js'
import {extractDestinationAndName} from './cli-util.js'
import {isBinaryExpressionSum} from '../language-server/types/types.js'
import {getType} from '../language-server/types/types.js'
import {isI32NumberType} from '../language-server/types/descriptions.js'
import {isBinaryExpressionProduct} from '../language-server/types/types.js'

export function generateWasm(topLevel: TopLevel, filePath: string, destination: string | undefined): string {
	const data = extractDestinationAndName(filePath, destination)
	const generatedFilePath = `${path.join(data.destination, data.name)}.wat`

	const output = new CompositeGeneratorNode()
	output.append('(module', NL)
	output.indent()

	for (const stmt of topLevel.statements) {
		// export function foo(...) {...}
		if (isExportedFunctionDeclaration(stmt) && isOriginalFunctionDeclaration(stmt)) {
			// (func (param $a i32) (param $b i32) (result i32)
			//   ...
			// )
			const func = stmt
			output.append('(func $', func.name)

			for (const param of func.parameters) output.append(' (param $', param.name, ' ', param.type!.primitive, ')')
			if (func.returnType) output.append(' (result ', func.returnType.primitive, ')', NL)
			output.indent()

			for (const stmt of func.body.statements) {
				// Very naive algo to start off PoC: assumes we have "return a + b"
				if (isReturnStatement(stmt)) {
					const ret = stmt
					const exp = ret.expression

					if (isBinaryExpression(exp) && (isBinaryExpressionSum(exp) || isBinaryExpressionProduct(exp))) {
						const {operator: op} = exp
						const type = getType(exp.leftOperand)
						const operator =
							op === '+' ? 'add' : op === '-' ? 'sub' : op === '*' ? 'mul' : isI32NumberType(type) ? 'div_s' : 'div'

						// (i32.add
						// 	(local.get $a)
						// 	(local.get $b)
						// )
						output.append('(', type.$type, '.', operator, NL)
						output.indent()
						// Totally naive assumption for now, assumingtwo identifiers,  a + b.
						output.append('(local.get $', exp.leftOperand.$cstNode?.text, ')')
						output.append('(local.get $', exp.rightOperand.$cstNode?.text, ')')
						output.append(NL, ')')
					}
				}
			}

			output.append(NL, ')')

			// (export "foo" (func $foo))
			output.append(NL, `(export "${func.name}" (func $${func.name}))`)
		}
	}

	output.append(NL, ')', NL)

	if (!fs.existsSync(data.destination)) fs.mkdirSync(data.destination, {recursive: true})
	fs.writeFileSync(generatedFilePath, toString(output))
	return generatedFilePath
}
