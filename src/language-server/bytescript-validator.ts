import { ValidationAcceptor, ValidationChecks } from "langium";
import {
	ByteScriptAstType, FunctionDeclaration, VariableDeclaration,
} from "./generated/ast";
import { ByteScriptServices } from "./bytescript-module";
import { Scope } from "../scope";

const globalScope = new Scope();
/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ByteScriptServices) {
	const registry = services.validation.ValidationRegistry;
	const validator = services.validation.ByteScriptValidator;
	const checks: ValidationChecks<ByteScriptAstType> = {
		VariableDeclaration: validator.validateVariableDeclaration,
		FunctionDeclaration: validator.validateFunctionDeclaration
	};
	registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */

export class ByteScriptValidator {
	validateVariableDeclaration(node: VariableDeclaration, accept: ValidationAcceptor) {
		if (globalScope.has(node.name!)) {
			// It is the same node, so update it.
			if (globalScope.get(node.name!)?.$containerIndex! == node.$containerIndex!) {
				globalScope.add(node.name!, node);
				// Keep order precise.
				// The first declaration with name "bar" should be okay
				// But the second one with the name "bar" should error
			} else if (globalScope.get(node.name!)?.$containerIndex! < node.$containerIndex!) {
				// It already exists
				accept("error", `'${node.name!}' is already defined.`, {
					node: node,
					property: "name"
				});
			}
		} else {
			globalScope.add(node.name!, node);
		}
	}
	validateFunctionDeclaration(node: FunctionDeclaration, accept: ValidationAcceptor) {
		if (globalScope.has(node.name!)) {
			// FunctionDeclaration overrides VariableDeclaration
			if (globalScope.get(node.name!)?.$type == "VariableDeclaration") {
				accept("error", `${node.name!} is already defined.`, {
					node: globalScope.get(node.name!)!,
					property: "name"
				});
				globalScope.add(node.name!, node);
			} else if (globalScope.get(node.name!)?.$containerIndex! == node.$containerIndex!) {
				globalScope.add(node.name!, node);
			} else if (globalScope.get(node.name!)?.$containerIndex! < node.$containerIndex!) {
				accept("error", `${node.name!} is already defined.`, {
					node: node,
					property: "name"
				});
			}
		} else {
			globalScope.add(node.name!, node);
		}
	}
}
/*
function acceptErrorType(node: AstNode, type: TypeDescription, accept: ValidationAcceptor): boolean {
	if (isErrorType(type)) {
		accept("error", type.message, { node });
		return true;
	}

	return false;
}
*/