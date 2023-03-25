import {
    BinaryExpression,
    BlockStatement,
    FunctionDeclaration,
    Expression,
    FloatLiteral,
    Identifier,
    IntegerLiteral,
    NumberLiteral,
    Parameter,
    TypeExpression,
    VariableDeclaration,
    FunctionCallExpression,
} from "./language-server/generated/ast";

export abstract class Node {
    constructor() { }

    static createIdentifier(text: string): Identifier {
        // @ts-ignore
        return {
            value: text,
        };
    }

    static createNumberLiteral(num: string): NumberLiteral {
        // @ts-ignore
        return {
            value: num,
        };
    }

    static createBinaryExpression(
        left: Identifier | NumberLiteral,
        op: "*" | "+" | "-" | "/" | "=",
        right: Identifier | NumberLiteral,
    ): BinaryExpression {
        // @ts-ignore
        return {
            lhs: left,
            op: op,
            rhs: right,
        };
    }

    static createFunctionCallExpression(name: string, args: NumberLiteral[]): FunctionCallExpression {
        // @ts-ignore
        return {
            name: name,
            args: args
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
                parameters: params,
                body: body,
                returnType: returnType!,
            };
        } else {
            // @ts-ignore
            return {
                name: name,
                parameters: params,
                body: body,
            };
        }
    }

    static createFloatLiteral(num: string): FloatLiteral {
        // @ts-ignore
        return {
            value: num,
        };
    }

    static createIntegerLiteral(num: string): IntegerLiteral {
        // @ts-ignore
        return {
            value: num,
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
