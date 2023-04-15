import {AstNode} from 'langium'
import {isFunctionDeclaration, isVariableStatement} from './language-server/generated/ast'

export class Scope {
	public nodes = new Map<string, AstNode>()
	constructor(public parentScope: Scope | null = null) {}
	add(name: string, node: AstNode): boolean {
		if (this.nodes.has(name)) {
			// VariableDeclaration and TypeDeclarations can exist together.
			// Only fail when there are two of the same declaration type.
			// TODO: TypeDeclaration and VariableExpression can co-exist together.
			return false
		} else {
			this.nodes.set(name, node)
			return true
		}
	}
	has(name: string): boolean {
		// Recursively searches scopes in reverse to make sure that the parent does not have scope name.
		return this.nodes.has(name) || this.parentScope?.has(name) || false
	}
	get(name: string): AstNode | null {
		// Get from parent scope
		return this.nodes.get(name) || this.parentScope?.get(name) || null
	}
}

export function isScopeType(node: AstNode): boolean {
	if (isVariableStatement(node)) {
		return true
	} else if (isFunctionDeclaration(node)) {
		return true
	}
	return false
}

export function getNameOfNode(node: AstNode): string | null {
	if (isVariableStatement(node)) {
		return node.name
	} else if (isFunctionDeclaration(node)) {
		return node.name!
	}
	return null
}
