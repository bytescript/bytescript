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
	isIdentifier,
	isBinaryExpression,
	isParameter,
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
		// debugger
	}

	if (types.has(node)) return types.get(node)!

	// Prevent recursive inference errors
	types.set(node, createTypeInferenceError('Recursive definition', node))

	let type: TypeDescription | null = null

	if (isIdentifier(node)) {
		if (!node.element.ref) {
			type = createTypeInferenceError(`'${node.element.$refText}' is not defined.`, node)
		} else {
			type = getType(node.element.ref)
		}
	} else if (isBinaryExpression(node)) {
		// For sake of simplicity for the first PoC, if there are no type
		// errors, it means the left and right operands are the same type (for
		// now), so simply get the left operand type.
		// TODO Update this when/if we have type conversions depending on the
		// operands.
		type = getType(node.leftOperand)
	} else if (isFloatLiteral(node)) {
		type = createF64NumberType(node)
	} else if (isIntegerLiteral(node)) {
		type = createI32NumberType(node)
	} else if (isTypeExpression(node)) {
		type = inferTypeExpression(node)
	} else if (isReturnStatement(node) || isArrowReturnExpression(node)) {
		type = getType(node.expression)
	} else if (isParameter(node)) {
		if (!node.type) {
			type = createTypeInferenceError('Parameter type annotations are required (no call site inference yet).', node)
		} else {
			type = getType(node.type)
		}
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
						'Parameter type annotations are required (no call site inference yet).',
						param,
					)

					break
				}

				const paramType: FunctionTypeParameter = {
					name: param.name,
					type: getType(param),
				}

				paramTypes.push(paramType)
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

export function isBinaryExpressionAssignment(expr: BinaryExpression): boolean {
	return expr.operator === '='
}

export function isBinaryExpressionSum(expr: BinaryExpression): boolean {
	return expr.operator === '+' || expr.operator === '-'
}

export function isBinaryExpressionProduct(expr: BinaryExpression): boolean {
	return expr.operator === '*' || expr.operator === '/'
}
