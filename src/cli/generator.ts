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
import {TypeDescription, isI32NumberType} from '../language-server/types/descriptions.js'
import {isBinaryExpressionProduct} from '../language-server/types/types.js'

// @ts-expect-error modulreResolution:nodenext bug with type imports. https://github.com/microsoft/TypeScript/issues/54523
import type {NumericDataType, Add, Sub, Mul, DivSigned, DivUnsigned} from 'wazum'

// import binaryen from 'binaryen'
// import {createRequire} from 'module'
// const require = createRequire(import.meta.url) // Needed for ESM
// const binaryen = require('binaryen')

// This isn't long term, but for now we branch compile method to study which method we like more.
const compileMethod: 'wat-template' | 'binaryen-tree' | 'wazum-tree' = 'wazum-tree'

export async function generateWasm(
	topLevel: TopLevel,
	filePath: string,
	destination: string | undefined,
): Promise<string> {
	const data = extractDestinationAndName(filePath, destination)
	const generatedFilePath = `${path.join(data.destination, data.name)}.wat`

	if (compileMethod === 'binaryen-tree') {
		const binaryen = (await import('binaryen')).default
		// const binaryen = (await eval('import("binaryen")')).default
		const {Module, createType, i32} = binaryen

		// We'll construct our output AST with this. This is the top level node.
		const module = new Module()

		for (const stmt of topLevel.statements) {
			// export function foo(...) {...}
			if (isExportedFunctionDeclaration(stmt) && isOriginalFunctionDeclaration(stmt)) {
				// (func (param $a i32) (param $b i32) (result i32)
				//   ...
				// )
				const func = stmt

				// Example function
				// mod.addFunction(
				// 	func.name,
				// 	createType([i32, i32]),
				// 	i32,
				// 	[],
				// 	mod.return(mod.i32.add(mod.local.get(0, i32), mod.local.get(1, i32))),
				// )

				const params = func.parameters.map(param => getBinaryenWasmType(binaryen, param.type!.primitive))

				if (!func.returnType) throw new Error('Return type annotations are required for now.')
				const languageReturnType = getType(func.returnType).$type
				// For some reason this causes all of `binaryen/index.js` source code to be logged to console. Why???????
				// const languageReturnType = getType(func).$type

				if (!isWasmPrimitiveType(languageReturnType)) {
					throw new Error(
						'Only i32 types for now. There should be no "error" types if type checks are good. Got: ' +
							languageReturnType,
					)
				}
				const wasmReturnType = getBinaryenWasmType(binaryen, languageReturnType)
				let wasmReturn: number

				for (const stmt of func.body.statements) {
					// Very naive algo to start off PoC: assumes we have "return a + b"
					if (isReturnStatement(stmt)) {
						const ret = stmt
						const exp = ret.expression

						let expr: number

						if (isBinaryExpression(exp) && (isBinaryExpressionSum(exp) || isBinaryExpressionProduct(exp))) {
							// Totally naive assumption for now, assuming two things to add are two arguments to a function (a: i32, b: i32).
							const left = module.local.get(0, i32)
							const right = module.local.get(1, i32)

							const {operator: op} = exp
							const type = getType(exp.leftOperand)

							const operator =
								op === '+' ? 'add' : op === '-' ? 'sub' : op === '*' ? 'mul' : isI32NumberType(type) ? 'div_s' : 'div'

							// f.e.
							// (i32.add
							// 	(local.get $a)
							// 	(local.get $b)
							// )

							if (operator === 'add') {
								expr = module.i32.add(left, right)
							} else if (operator === 'sub') {
								expr = module.i32.sub(left, right)
							} else if (operator === 'mul') {
								expr = module.i32.mul(left, right)
							} else if (operator === 'div') {
								expr = module.i32.div_u(left, right)
							} else {
								expr = module.i32.div_s(left, right)
							}
						}

						wasmReturn = module.return(expr!)
					}
				}

				module.addFunction(func.name, createType(params), wasmReturnType, [], wasmReturn!)

				// (export "foo" (func $foo))
				module.addFunctionExport(func.name, func.name)
			}
		}

		if (!fs.existsSync(data.destination)) fs.mkdirSync(data.destination, {recursive: true})
		fs.writeFileSync(generatedFilePath, module.emitText())
		return generatedFilePath
	} else if (compileMethod === 'wazum-tree') {
		const w = await import('wazum')

		const module = new w.Module()

		for (const stmt of topLevel.statements) {
			// export function foo(...) {...}
			if (isExportedFunctionDeclaration(stmt) && isOriginalFunctionDeclaration(stmt)) {
				// (func (param $a i32) (param $b i32) (result i32)
				//   ...
				// )
				const func = stmt

				// Example:
				// w.func(
				// 	func.name,
				// 	{
				// 		params: [
				// 			['i32', 'a'],
				// 			['i32', 'a'],
				// 		],
				// 		returnType: 'i32',
				// 		locals: [],
				// 	},
				// 	w.add('i32', w.local.get('i32', 'a'), w.local.get('i32', 'b')),
				// )

				const params = func.parameters.map(
					param => [unaliasNumberType(param.type!.primitive), param.name] as [NumericDataType, string],
				)

				if (!func.returnType) throw new Error('Return type annotations are required for now.')
				const languageReturnType = getType(func.returnType).$type

				if (!isWasmPrimitiveType(languageReturnType)) {
					throw new Error(
						'Only primitive types for now. An "error" type should be caught by type checking.' + languageReturnType,
					)
				}
				let wasmReturn: Add | Sub | Mul | DivSigned | DivUnsigned | null = null

				for (const stmt of func.body.statements) {
					// Very naive algo to start off PoC: assumes we have "return a + b"
					if (isReturnStatement(stmt)) {
						const ret = stmt
						const exp = ret.expression

						let expr: Add | Sub | Mul | DivSigned | DivUnsigned | null = null

						if (isBinaryExpression(exp) && (isBinaryExpressionSum(exp) || isBinaryExpressionProduct(exp))) {
							// Totally naive assumption for now, assuming two things to add are two arguments to a function (a: i32, b: i32).
							const left = w.local.get('i32', exp.leftOperand.$cstNode!.text)
							const right = w.local.get('i32', exp.rightOperand.$cstNode!.text)

							const {operator: op} = exp
							const type = getType(exp.leftOperand)

							const operator =
								op === '+' ? 'add' : op === '-' ? 'sub' : op === '*' ? 'mul' : isI32NumberType(type) ? 'div_s' : 'div'

							// f.e.
							// (i32.add
							// 	(local.get $a)
							// 	(local.get $b)
							// )

							const opType = 'i32' // TODO derive this fro the expression type

							if (operator === 'add') {
								expr = w.add(opType, left, right)
							} else if (operator === 'sub') {
								expr = w.sub(opType, left, right)
							} else if (operator === 'mul') {
								expr = w.mul(opType, left, right)
							} else if (operator === 'div') {
								expr = w.divUnsigned(opType, left, right)
							} else {
								expr = w.divSigned(opType, left, right)
							}
						}

						if (!expr) throw new Error('How can a return not have an expression?')

						wasmReturn = expr
					}
				}

				if (!wasmReturn) throw new Error('This is very naive.')

				module.addFunc(
					w.func(func.name, {params, locals: [], returnType: unaliasNumberType(languageReturnType)}, wasmReturn),
					true, // TODO export name (true means same as function name)
				)
			}
		}

		if (!fs.existsSync(data.destination)) fs.mkdirSync(data.destination, {recursive: true})
		fs.writeFileSync(generatedFilePath, module.compile())
		return generatedFilePath
	}

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
						// Totally naive assumption for now, assuming two identifiers,  a + b.
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

type WasmType = 'i32' | 'f32' | 'f64' | 'number'

// TODO: no any. TS can't handle `typeof import('binaryen').default` syntax when module:commonjs and moduleResolution:nodenext*/
function getBinaryenWasmType(binaryen: any, type: WasmType) {
	if (type === 'i32') {
		return binaryen.i32
	} else {
		throw new Error('Only i32 supported for now. Got: ' + type)
		// We'd also need to alias 'number' to 'f32' or 'f64'.
	}
}

function isWasmPrimitiveType(type: TypeDescription['$type']): type is WasmType {
	return type === 'i32' || type === 'f32' || type === 'f64' || type === 'number'
}

function unaliasNumberType(type: WasmType): 'i32' | 'f32' | 'f64' {
	if (type === 'number') return 'f64'
	return type
}
