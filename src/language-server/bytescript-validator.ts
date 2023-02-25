import {ValidationAcceptor, ValidationChecks} from 'langium'
import {ByteScriptAstType, VariableDeclaration} from './generated/ast'
import type {ByteScriptServices} from './bytescript-module'

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ByteScriptServices) {
	const registry = services.validation.ValidationRegistry
	const validator = services.validation.ByteScriptValidator
	const checks: ValidationChecks<ByteScriptAstType> = {
		VariableDeclaration: validator.checkLetStatement,
	}
	registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class ByteScriptValidator {
	checkLetStatement(varDecl: VariableDeclaration, accept: ValidationAcceptor): void {
		if (varDecl.name) {
			const firstChar = varDecl.name.substring(0, 1)
			if (firstChar.toUpperCase() !== firstChar)
				accept('error', 'Let statement: Expected upper case var name!', {node: varDecl, property: 'name'})
		}
	}
}
