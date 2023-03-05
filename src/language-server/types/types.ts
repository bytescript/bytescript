import type {AstNode} from 'langium'
import {
	isClassicFunction,
	isFloatLiteral,
	isIntegerLiteral,
	isTypeExpression,
	isVariableDeclaration,
	TypeExpression,
} from '../generated/ast'
import {
	createErrorType,
	createFunctionType,
	createI32NumberType,
	createLiteralNumberType,
	F64NumberType,
	FunctionParameter,
	TypeDescription,
} from './descriptions'

const types = new Map<AstNode, TypeDescription>()

export function getType(node: AstNode): TypeDescription {
	if (types.has(node)) return types.get(node)!

	// Prevent recursive inference errors
	types.set(node, createErrorType('Recursive definition', node))

	let type: TypeDescription | null = null

	if (isFloatLiteral(node)) {
		type = new F64NumberType(node)
	} else if (isIntegerLiteral(node)) {
		type = createI32NumberType(node)
	} else if (isTypeExpression(node)) {
		type = inferTypeExpression(node)
	} else if (isVariableDeclaration(node)) {
		if (node.type) {
			type = getType(node.type)
		} else if (node.value) {
			type = getType(node.value)
		} else {
			type = createErrorType('All variable declarations need values for now', node)
		}
	} else if (isClassicFunction(node)) {
		if (!node.returnType) {
			type = createErrorType('No return type inference yet (use a return type annotation)', node)
		} else {
			const paramTypes: FunctionParameter[] = []

			for (const param of node.params) {
				if (!param.type) {
					type = createErrorType(
						'Parameter types not inferred from call sites yet (use parameter type annotations)',
						node,
					)

					break
				}

				paramTypes.push({
					name: node.name,
					type: getType(param.type),
				})
			}

			// If all params have a type (no generic inference from callsites yet).
			if (!type) type = createFunctionType(paramTypes, getType(node.returnType))
		}
	} else {
		type = createErrorType('Could not infer type for ' + node.$type, node)
	}

	types.set(node, type)

	return type
}

function inferTypeExpression(node: TypeExpression): TypeDescription {
	if (node.primitive === 'number') return createLiteralNumberType()
	else if (node.primitive === 'i32') return createI32NumberType()
	else if (node.primitive === 'f64') return new F64NumberType()
	else return createErrorType('Only `number`, `i32`, and `f64` types supported for now', node)
}

export function isAssignable(from: TypeDescription, to: TypeDescription): boolean {
	return from.$type === to.$type
}