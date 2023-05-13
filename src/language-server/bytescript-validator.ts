import type {AstNode, ValidationAcceptor, ValidationChecks} from 'langium'
import {
	ByteScriptAstType,
	TopLevel,
	VariableDeclaration,
	CallExpression,
	isIdentifier,
	InvalidParenthesis,
	ReturnStatement,
	isReturnStatement,
	// Expression,
	BinaryExpression,
	FunctionExpression,
	FunctionDeclaration,
	Block,
	ArrowReturnExpression,
	TypeDeclaration,
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
		FunctionExpression: validator.checkFunction,
		FunctionDeclaration: validator.checkFunction,
		CallExpression: validator.checkCallExpression,
		InvalidParenthesis: validator.checkInvalidParenthesis,
		Block: validator.checkBlock,
		TypeDeclaration: validator.checkTypeDeclaration,
		TopLevel: validator.checkTopLevel,
	}
	registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class ByteScriptValidator {
	checkTopLevel(topLevel: TopLevel, accept: ValidationAcceptor) {
		for (const stmt of topLevel.statements) {
			if (stmt.$type === 'ReturnStatement')
				accept('error', 'SyntaxError: Return statements are allowed only inside functions.', {node: stmt})
		}
	}

	checkBinaryExpression(expr: BinaryExpression, accept: ValidationAcceptor) {
		if (isAssignmentExpression(expr)) {
			this.checkAssignmentExpression(expr, accept)
		}
	}

	checkAssignmentExpression(expr: BinaryExpression, accept: ValidationAcceptor) {
		if (!isIdentifier(expr.leftOperand)) {
			accept('error', `Only identifiers are currently supported on the left of an assignment expression.`, {
				node: expr.leftOperand,
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
			if (!varDecl.value) {
				accept('error', 'Variable declarations must have a value assigned up front.', {node: varDecl})
				return
			}

			// Cast because we know the value exists (that's checked in getType)
			const valueType = getType(varDecl.value)

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

	checkFunction(func: FunctionDeclaration | FunctionExpression, accept: ValidationAcceptor): void {
		if (func.$type === 'GeneratorFunctionDeclaration' || func.$type === 'GeneratorFunctionExpression') {
			accept('error', 'Generator functions are not supported yet.', {node: func})
			return
		}

		// TODO remove this when we implement inferring from return statements.
		if (!func.returnType) {
			accept('error', 'Return type annotations are required.', {node: func})
			return
		}

		const type = getType(func)
		checkTypeError(func, type, accept)

		const returnType = getType(func.returnType)
		checkTypeError(func, type, accept)

		console.log('function return type:', type.$type)

		let returnStmtOrExpr: ReturnStatement | ArrowReturnExpression | null = null

		if (func.body.$type !== 'Block') {
			// blockless arrow function
			returnStmtOrExpr = func.body
		} else {
			// function with block
			for (const stmt of func.body.statements) if (isReturnStatement(stmt)) returnStmtOrExpr = stmt
			// TODO: Show an error for any statements after the first return.
		}

		if (!func.returnType) {
			if (returnStmtOrExpr) {
				// TODO: Infer function return type from return value expression
			}
		} else if (!returnStmtOrExpr) {
			// TODO underline the function header only, instead of the whole function body which is annoying.
			accept('error', "A function whose return type is not 'void' must return a value.", {node: func})
		} else {
			const returnStmtType = getType(returnStmtOrExpr)
			checkTypeError(func, type, accept)

			if (!isAssignable(returnType, returnStmtType)) {
				accept(
					'error',
					`Type '${typeToString(returnStmtType)}' is not assignable to type '${typeToString(returnType)}'.`,
					{node: returnStmtOrExpr},
				)
			}
		}
	}

	checkCallExpression(call: CallExpression, accept: ValidationAcceptor) {
		// TODO get references working properly.
		if (!call.callee.ref) {
			accept('error', `Cannot find function named '${call.callee.$refText}'.`, {node: call, property: 'callee'})
			return
		}

		const char = call.callee.ref.name.charAt(0)
		if (char.toLowerCase() !== char) {
			accept('error', 'Expected lower case name.', {node: call, property: 'callee'})
		}
	}

	checkInvalidParenthesis(expression: InvalidParenthesis, accept: ValidationAcceptor) {
		accept('error', 'SyntaxError: Expected expression.', {node: expression})
	}

	checkBlock(block: Block, accept: ValidationAcceptor) {
		for (const stmt of block.statements) {
			if (stmt.$type === 'ReturnStatement') {
				const block = stmt.$container
				const func = block.$container

				if (
					func?.$type !== 'ArrowFunctionExpression' &&
					func?.$type !== 'OriginalFunctionExpression' &&
					func?.$type !== 'OriginalFunctionDeclaration' &&
					func?.$type !== 'GeneratorFunctionDeclaration' &&
					func?.$type !== 'GeneratorFunctionExpression'
				) {
					console.log('statement container:', func?.$type)
					accept('error', 'SyntaxError: Return statements are currently allowed only at the top-level of a function.', {
						node: stmt,
					})
				}
			}
		}
	}

	checkTypeDeclaration(node: TypeDeclaration, accept: ValidationAcceptor) {
		accept('error', 'Type expressions are not supported yet.', {node})
	}
}

function checkTypeError(node: AstNode, type: TypeDescription, accept: ValidationAcceptor): type is TypeInferenceError {
	if (isTypeInferenceError(type)) {
		accept('error', type.message, {node})
		return true
	}

	return false
}
