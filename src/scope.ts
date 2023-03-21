import { AstNode } from "langium";
import { isFunctionDeclaration, isVariableDeclaration } from "./language-server/generated/ast";

export class Scope {
    public nodes = new Map<string, AstNode>();
    constructor(public parentScope: Scope | null = null) { }
    add(name: string, node: AstNode): boolean {
        if (this.nodes.has(name)) {
            // VariableDeclaration and TypeDeclarations can exist together.
            // Only fail when there are two of the same declaration type.

            // TODO: TypeDeclaration and VariableExpression can co-exist together.
            return false;
        } else {
            this.nodes.set(name, node);
            return true;
        }
    }
    has(name: string): boolean {
        return this.nodes.has(name) || this.parentScope?.has(name) || false;
    }
    get(name: string): AstNode | null {
        return this.nodes.has(name) ? this.nodes.get(name)! : null;
    }
}

export function isScopeType(node: AstNode): boolean {
    if (isVariableDeclaration(node)) {
        return true;
    } else if (isFunctionDeclaration(node)) {
        return true;
    }
    return false;
}

export function getNameOfNode(node: AstNode): string | null {
    if (isVariableDeclaration(node)) {
        return node.name;
    } else if (isFunctionDeclaration(node)) {
        return node.name;
    }
    return null;
}