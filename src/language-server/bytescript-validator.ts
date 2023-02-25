import type {AstNode, ValidationAcceptor, ValidationChecks} from 'langium'
import type {ByteScriptAstType, ClassicFunction, VariableDeclaration, FunctionCall} from './generated/ast'
import type {ByteScriptServices} from './bytescript-module'
import {getType, isAssignable} from './types/types'
import {isErrorType, TypeDescription, typeToString} from './types/descriptions'

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ByteScriptServices) {
	const registry = services.validation.ValidationRegistry
	const validator = services.validation.ByteScriptValidator
	const checks: ValidationChecks<ByteScriptAstType> = {
		VariableDeclaration: validator.checkVarDeclaration,
		ClassicFunction: validator.checkClassicFunction,
		FunctionCall: validator.checkFunctionCall,
	}
	registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class ByteScriptValidator {
	checkVarDeclaration(varDecl: VariableDeclaration, accept: ValidationAcceptor): void {
		const declType = getType(varDecl)

		if (acceptErrorType(varDecl, declType, accept)) return

		if (varDecl.type || varDecl.value) {
			if (varDecl.value) {
				const valueType = getType(varDecl.value)

				if (acceptErrorType(varDecl.value, valueType, accept)) return

				if (varDecl.type) {
					if (!isAssignable(valueType, declType)) {
						accept(
							'error',
							`Type '${typeToString(valueType)}' is not assignable to type '${typeToString(declType)}'.`,
							{node: varDecl, property: 'value'},
						)
					}
				} else {
					// Value is assignable because it was used to infer the declaration type.
				}
			}
		} else if (!varDecl.type && !varDecl.value) {
			accept('error', 'Variable declarations require a type annotation and an assigned value', {
				node: varDecl,
				property: 'name',
			})
		}
	}

	checkClassicFunction(func: ClassicFunction, accept: ValidationAcceptor): void {
		const type = getType(func)
		if (acceptErrorType(func, type, accept)) return
	}

	checkFunctionCall(call: FunctionCall, accept: ValidationAcceptor) {
		console.log(call)
		if (call.name) {
			const firstChar = call.name.substring(0, 1)
			if (firstChar.toLowerCase() !== firstChar)
				accept('error', 'FunctionCall: Expected lower case name.', {node: call, property: 'name'})
		}
	}
}

function acceptErrorType(node: AstNode, type: TypeDescription, accept: ValidationAcceptor): boolean {
	if (isErrorType(type)) {
		accept('error', type.message, {node})
		return true
	}

	return false
}
