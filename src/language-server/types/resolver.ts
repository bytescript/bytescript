/*import type { Expression, TypeExpression } from "../../language-server/generated/ast";

abstract class Type { }

class TypeResolutionContext {
    private parent: TypeResolutionContext | null = null;
    private variables: Map<string, Type> = new Map();
    private types: Map<string, Type> = new Map();

    lookupVariable(name: string): Type | undefined {
        if (this.variables.has(name)) {
            return this.variables.get(name);
        }
        if (this.parent !== null) return this.parent.lookupVariable(name);
        return undefined;
    }

    setVariable(name: string, value: Type) {
        return this.variables.set(name, value);
    }

    lookupType(name: string): Type | undefined {
        if (this.types.has(name)) {
            return this.types.get(name);
        }
        if (this.parent !== null) return this.parent.lookupType(name);
        return undefined;
    }

    setType(name: string, value: Type) {
        return this.types.set(name, value);
    }

    push() {
        const map = new TypeResolutionContext();
        map.parent = this;
        return map;
    }
}

function resolveTypeExpression(context: TypeResolutionContext, expression: TypeExpression) {
switch(expo)
}

function resolveExpression(context: TypeResolutionContext, expression: Expression) {
    switch (expression.$type) {
        case "ArrowFunction":
            const newContext = context.push();
            for (const parameter of expression.parameters) {
                newContext.setVariable(par)
            }
            break;
        case "BinaryExpression":
        case "Identifier":
        case "FunctionCallExpression":
        case "CallExpression":
        case "GroupLiteral":
        case "InvalidParenthesis":
        case "FloatLiteral":
        case "IntegerLiteral":
        //case "DoExpression":
        case "TernaryExpression":
    }
};*/
