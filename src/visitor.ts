import {AstNode} from 'langium'
import {
	FunctionDeclaration,
	NumberLiteral,
	Parameter,
	ReturnStatement,
	TypeExpression,
	isFunctionDeclaration,
	isNumberLiteral,
	isParameter,
	isReturnStatement,
	isTypeExpression,
} from './language-server/generated/ast'

export class Visitor {
	constructor() {}
	visit(node: AstNode) {
		if (isFunctionDeclaration(node)) {
			this.visitFunctionDeclaration(node)
		} else if (isReturnStatement(node)) {
			this.visitReturnStatement(node)
		} else if (isParameter(node)) {
			this.visitParameter(node)
		} else if (isTypeExpression(node)) {
			this.visitTypeExpression(node)
		} else if (isNumberLiteral(node)) {
			this.visitNumberLiteral(node)
		}
	}
	visitStatements(statements: AstNode[]) {
		for (const stmt of statements) {
			this.visit(stmt)
		}
	}
	visitFunctionDeclaration(node: FunctionDeclaration) {
		this.visitStatements(node.parameters)
		this.visitStatements(node.body.statements)
	}
	visitReturnStatement(node: ReturnStatement) {
		this.visit(node.expression)
	}
	visitParameter(node: Parameter) {
		if (node.type) this.visit(node.type!)
	}
	visitTypeExpression(node: TypeExpression) {}
	visitNumberLiteral(node: NumberLiteral) {}
}
