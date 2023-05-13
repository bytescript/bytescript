import type {AstNode} from 'langium'
import {
	BinaryExpression,
	isFunctionDeclaration,
	isFunctionExpression,
	isFloatLiteral,
	isIntegerLiteral,
	isReturnStatement,
	isTypeExpression,
	isVariableDeclaration,
	TypeExpression,
	isArrowReturnExpression,
} from '../generated/ast'
import {
	createTypeInferenceError,
	createF64NumberType,
	createFunctionType,
	createI32NumberType,
	createLiteralNumberType,
	FunctionTypeParameter,
	TypeDescription,
} from './descriptions'

const types = new Map<AstNode, TypeDescription>()

export function getType(node: AstNode): TypeDescription {
	if (!node) {
		console.log('UNDEFINED NODE:', node)
		debugger
	}

	if (types.has(node)) return types.get(node)!

	// Prevent recursive inference errors
	types.set(node, createTypeInferenceError('Recursive definition', node))

	let type: TypeDescription | null = null

	if (isFloatLiteral(node)) {
		type = createF64NumberType(node)
	} else if (isIntegerLiteral(node)) {
		type = createI32NumberType(node)
	} else if (isTypeExpression(node)) {
		type = inferTypeExpression(node)
	} else if (isReturnStatement(node) || isArrowReturnExpression(node)) {
		type = getType(node.expression)
	} else if (isVariableDeclaration(node)) {
		if (node.type) {
			type = getType(node.type)
		} else if (node.value) {
			type = getType(node.value)
		} else {
			type = createTypeInferenceError('All variable declarations need values for now', node)
		}
	} else if (isFunctionDeclaration(node) || isFunctionExpression(node)) {
		if (!node.returnType) {
			type = createTypeInferenceError('UNEXPECTED: Missing return type.', node)
		} else {
			const paramTypes: FunctionTypeParameter[] = []

			for (const param of node.parameters) {
				if (!param.type) {
					type = createTypeInferenceError(
						'Use parameter type annotations (parameter types not inferred from call sites yet).',
						param,
					)

					break
				}

				paramTypes.push({
					name: param.name,
					type: getType(param.type),
				})
			}

			// If all params have a type (no generic inference from callsites yet).
			if (!type) type = createFunctionType(paramTypes, getType(node.returnType))
		}
	} else {
		type = createTypeInferenceError(`Could not infer type for ${node.$type}.`, node)
	}

	types.set(node, type)

	return type
}

function inferTypeExpression(node: TypeExpression): TypeDescription {
	if (node.primitive === 'number') return createLiteralNumberType()
	else if (node.primitive === 'i32') return createI32NumberType()
	else if (node.primitive === 'f64') return createF64NumberType()
	else return createTypeInferenceError('Only `number`, `i32`, and `f64` types supported for now', node)
}

export function isAssignable(from: TypeDescription, to: TypeDescription): boolean {
	// class Foo
	// class Bar extends Foo
	// let b: Foo = new Bar
	// Need to add more logic here on assignability.
	return from.$type === to.$type
}

export function isAssignmentExpression(expr: BinaryExpression): boolean {
	return expr.operator === '='
}
