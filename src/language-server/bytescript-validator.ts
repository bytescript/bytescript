import {ValidationAcceptor, ValidationChecks} from 'langium'
import {ByteScriptAstType, ClassicFunction, VariableDeclaration} from './generated/ast'
import type {ByteScriptServices} from './bytescript-module'

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ByteScriptServices) {
	const registry = services.validation.ValidationRegistry
	const validator = services.validation.ByteScriptValidator
	const checks: ValidationChecks<ByteScriptAstType> = {
		VariableDeclaration: validator.checkVarDeclaration,
		ClassicFunction: validator.checkClassicFunction,
	}
	registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class ByteScriptValidator {
	checkVarDeclaration(varDecl: VariableDeclaration, accept: ValidationAcceptor): void {
		if (varDecl.name) {
			const firstChar = varDecl.name.substring(0, 1)
			if (firstChar.toUpperCase() !== firstChar)
				accept('error', 'Let statement: Expected upper case var name!', {node: varDecl, property: 'name'})
		}
	}
	checkClassicFunction(func: ClassicFunction, accept: ValidationAcceptor): void {
		console.log(func)
		if (func.name) {
			const firstChar = func.name.substring(0, 1)
			if (firstChar.toLowerCase() !== firstChar)
				accept('error', 'Function: Expected lower case name.', {node: func, property: 'name'})
		}
	}
}
