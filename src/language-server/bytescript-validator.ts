import type {AstNode, ValidationAcceptor, ValidationChecks} from 'langium'
import {
	ByteScriptAstType,
	ClassicFunction,
	VariableDeclaration,
	CallExpression,
	isIdentifier,
	InvalidParenthesis,
	ReturnStatement,
	isReturnStatement,
	// Expression,
	BinaryExpression,
} from './generated/ast'
import type {ByteScriptServices} from './bytescript-module'
import {getType, isAssignable, isAssignmentExpression} from './types/types'
import {TypeInferenceError, isTypeInferenceError, TypeDescription, typeToString} from './types/descriptions'

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ByteScriptServices) {
	const registry = services.validation.ValidationRegistry
	const validator = services.validation.ByteScriptValidator
	const checks: ValidationChecks<ByteScriptAstType> = {
		// Expression: validator.checkExpression,
		BinaryExpression: validator.checkBinaryExpression,
		VariableDeclaration: validator.checkVarDeclaration,
		ClassicFunction: validator.checkClassicFunction,
		CallExpression: validator.checkCallExpression,
		InvalidParenthesis: validator.checkInvalidParenthesis,
	}
	registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class ByteScriptValidator {
	checkBinaryExpression(expr: BinaryExpression, accept: ValidationAcceptor) {
		if (isAssignmentExpression(expr)) {
			this.checkAssignmentExpression(expr, accept)
		}
	}

	checkAssignmentExpression(expr: BinaryExpression, accept: ValidationAcceptor) {
		if (!isIdentifier(expr.leftOperand)) {
			accept('error', `Only identifiers are currently supported on the left of an assignment expression.`, {
				node: expr.leftOperand,
				property: 'value',
			})
			return
		}

		console.log('assignment expr:', expr)

		// TODO SCOPES: this cannot infer a type, we need to know the scope and the variable declaration from which to get the type from.
		const leftType = getType(expr.leftOperand)
		if (checkTypeError(expr.leftOperand, leftType, accept)) return

		const rightType = getType(expr.leftOperand)
		if (checkTypeError(expr.rightOperand, rightType, accept)) return

		if (!isAssignable(rightType, leftType)) {
			accept('error', `Type '${typeToString(rightType)}' is not assignable to type '${typeToString(leftType)}'.`, {
				node: expr,
				property: 'rightOperand',
			})
		}
	}

	checkVarDeclaration(varDecl: VariableDeclaration, accept: ValidationAcceptor): void {
		const declType = getType(varDecl)
		if (checkTypeError(varDecl, declType, accept)) return

		console.log('declaration type:', declType.$type)

		if (varDecl.type) {
			// Cast because we know the value exists (that's checked in getType)
			const valueType = getType(varDecl.value!)

			if (!isAssignable(valueType, declType)) {
				accept('error', `Type '${typeToString(valueType)}' is not assignable to type '${typeToString(declType)}'.`, {
					node: varDecl,
					property: 'value',
				})
			}
		} else {
			// Otherwise the value is assignable because it was used to infer the declaration type.
		}
	}

	checkClassicFunction(node: ClassicFunction, accept: ValidationAcceptor): void {
		const type = getType(node)
		checkTypeError(node, type, accept)

		const returnType = getType(node.returnType!)
		checkTypeError(node, type, accept)

		console.log('function return type:', type.$type)

		let returnStmt: ReturnStatement | null = null
		for (const member of node.body) if (isReturnStatement(member)) returnStmt = member
		if (!node.returnType) {
			if (returnStmt) {
				// TODO: Infer function return type from return value expression
			}
		} else if (!returnStmt) {
			accept('error', "A function whose declared type is not 'void' must return a value", {node: node.returnType!})
		} else {
			const returnStmtType = getType(returnStmt!)
			checkTypeError(node, type, accept)

			if (!isAssignable(returnType, returnStmtType)) {
				accept(
					'error',
					`Type '${typeToString(returnStmtType)}' is not assignable to type '${typeToString(returnType)}'.`,
					{node: returnStmt},
				)
			}
		}
	}

	checkCallExpression(call: CallExpression, accept: ValidationAcceptor) {
		// if (isIdentifier(call.function.ref!.name)) {
		// ^ isIdentifier check not needed if using refs??

		// TODO get references working properly.
		if (!call.callee.function.ref) {
			accept('error', `Cannot find name.`, {node: call, property: 'callee'})
			return
		}

		const char = call.callee.function.ref.name.charAt(0)
		if (char.toLowerCase() !== char) {
			accept('error', 'Expected lower case name.', {node: call, property: 'callee'})
		}
		// }
	}

	checkInvalidParenthesis(expression: InvalidParenthesis, accept: ValidationAcceptor) {
		accept('error', 'SyntaxError: Expected expression.', {node: expression})
	}
}

function checkTypeError(node: AstNode, type: TypeDescription, accept: ValidationAcceptor): type is TypeInferenceError {
	if (isTypeInferenceError(type)) {
		accept('error', type.message, {node})
		return true
	}

	return false
}
