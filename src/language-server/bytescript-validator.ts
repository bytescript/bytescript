import type { AstNode, ValidationAcceptor, ValidationChecks } from "langium";
import {
	ByteScriptAstType,
	ClassicFunction,
	VariableDeclaration,
	CallExpression,
	isIdentifier,
	InvalidParenthesis,
	ReturnStatement,
	isReturnStatement,
} from "./generated/ast";
import type { ByteScriptServices } from "./bytescript-module";
import { getType, isAssignable } from "./types/types";
import { isErrorType, TypeDescription, typeToString } from "./types/descriptions";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ByteScriptServices) {
	const registry = services.validation.ValidationRegistry;
	const validator = services.validation.ByteScriptValidator;
	const checks: ValidationChecks<ByteScriptAstType> = {
		VariableDeclaration: validator.checkVarDeclaration,
		ClassicFunction: validator.checkClassicFunction,
		CallExpression: validator.checkCallExpression,
		InvalidParenthesis: validator.checkInvalidParenthesis,
	};
	registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ByteScriptValidator {
	checkVarDeclaration(varDecl: VariableDeclaration, accept: ValidationAcceptor): void {
		const declType = getType(varDecl);

		if (acceptErrorType(varDecl, declType, accept)) return;

		if (varDecl.type || varDecl.value) {
			if (varDecl.value) {
				const valueType = getType(varDecl.value);

				if (acceptErrorType(varDecl.value, valueType, accept)) return;

				if (varDecl.type) {
					if (!isAssignable(valueType, declType)) {
						accept(
							"error",
							`Type '${typeToString(valueType)}' is not assignable to type '${typeToString(declType)}'.`,
							{ node: varDecl, property: "value" },
						);
					}
				} else {
					// Value is assignable because it was used to infer the declaration type.
				}
			}
		} else if (!varDecl.type && !varDecl.value) {
			accept("error", "Variable declarations require a type annotation and an assigned value", {
				node: varDecl,
				property: "name",
			});
		}
	}

	checkClassicFunction(node: ClassicFunction, accept: ValidationAcceptor): void {
		const type = getType(node);
		const returnType = getType(node.returnType!);
		let returnStmt: ReturnStatement | null = null;
		for (const member of node.body) if (isReturnStatement(member)) returnStmt = member;
		if (!node.returnType!) {
			if (returnStmt) {
				// TODO: Infer function return type from return value expression
			}
		} else if (!returnStmt) {
			accept("error", "A function whose declared type is not 'void' must return a value", { node: node.returnType! });
		} else {
			const returnStmtType = getType(returnStmt!);
			if (!isAssignable(returnType, returnStmtType)) {
				accept(
					"error",
					`Type '${typeToString(returnType)}' is not assignable to type '${typeToString(returnStmtType)}'.`,
					{ node: returnStmt },
				);
			}
		}
		if (acceptErrorType(node, type, accept)) return;
	}

	checkCallExpression(call: CallExpression, accept: ValidationAcceptor) {
		if (isIdentifier(call.callee)) {
			const identifier = call.callee;
			const char = identifier.value.charAt(0);
			if (char.toLowerCase() !== char) {
				accept("error", "FunctionCall: Expected lower case name.", { node: call, property: "callee" });
			}
		}
	}

	checkInvalidParenthesis(expression: InvalidParenthesis, accept: ValidationAcceptor) {
		accept("error", "SyntaxError: Expected expression.", { node: expression });
	}
}

function acceptErrorType(node: AstNode, type: TypeDescription, accept: ValidationAcceptor): boolean {
	if (isErrorType(type)) {
		accept("error", type.message, { node });
		return true;
	}

	return false;
}
