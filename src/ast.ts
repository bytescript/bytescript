import {
    BinaryExpression,
    BlockStatement,
    CallExpression,
    FunctionDeclaration,
    Expression,
    FloatLiteral,
    IdentifierExpression,
    IntegerLiteral,
    NumberLiteral,
    Parameter,
    TypeExpression,
    VariableDeclaration,
} from "./language-server/generated/ast";

export abstract class Node {
    constructor() { }
    static createIdentifierExpression(text: string): IdentifierExpression {
        // @ts-ignore
        return {
            text: text,
        };
    }
    static createNumberLiteral(num: string): NumberLiteral {
        // @ts-ignore
        return {
            value: num.includes(".") ? parseFloat(num) : parseInt(num),
        };
    }
    static createBinaryExpression(
        left: IdentifierExpression | NumberLiteral,
        op: "*" | "+" | "-" | "/" | "=",
        right: IdentifierExpression | NumberLiteral,
    ): BinaryExpression {
        // @ts-ignore
        return {
            lhs: left,
            op: op,
            rhs: right,
        };
    }
    static createCallExpression(calling: IdentifierExpression, args: Expression[]): CallExpression {
        // @ts-ignore
        return {
            callee: calling,
            args: args,
        };
    }
    static createFunctionDeclaration(
        name: string,
        params: Parameter[],
        body: BlockStatement,
        returnType: TypeExpression | null = null,
    ): FunctionDeclaration {
        if (returnType) {
            // @ts-ignore
            return {
                name: name,
                params: params,
                body: body,
                returnType: returnType!,
            };
        } else {
            // @ts-ignore
            return {
                name: name,
                params: params,
                body: body,
            };
        }
    }
    static createFloatLiteral(num: string): FloatLiteral {
        // @ts-ignore
        return {
            value: parseFloat(num),
        };
    }
    static createIntegerLiteral(num: string): IntegerLiteral {
        // @ts-ignore
        return {
            value: parseInt(num),
        };
    }
    static createParameter(name: string, type: TypeExpression): Parameter {
        // @ts-ignore
        return {
            name: name,
            type: type,
        };
    }
    static createReturnStatement(expression: Expression) {
        // @ts-ignore
        return {
            expression: expression,
        };
    }
    static createVariableDeclaration(
        name: string,
        mutable: boolean,
        type: TypeExpression | null = null,
        value: Expression | null = null,
    ): VariableDeclaration {
        if (!type && !value) {
            throw new Error("Cannot create variable declaration if both type and value are not supplied.");
        } else if (value) {
            //type = getType(value);
        }
        // @ts-ignore
        return {
            name: name,
            mutable: mutable,
            type: type!,
            // @ts-ignore
            value: value,
        };
    }
}
