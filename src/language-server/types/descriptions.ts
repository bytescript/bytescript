import type { AstNode } from "langium";
import type { Identifier, NumberLiteral, TypeExpression } from "../generated/ast";

export type TypeDescription =
	NumberType
	| FunctionType
	| ErrorType;

type NumberType =
	LiteralNumberType
	| I32NumberType
	| F64NumberType
	| F32NumberType;

// number

export interface LiteralNumberType {
	readonly $type: "number";
	readonly literal?: NumberLiteral;
}

export function createLiteralNumberType(literal?: NumberLiteral): LiteralNumberType {
	return {
		$type: "number",
		literal,
	};
}

export function isLiteralNumberType(item: TypeDescription): item is LiteralNumberType {
	return item.$type === "number";
}

// i32

export interface I32NumberType {
	readonly $type: "i32";
	readonly literal?: NumberLiteral;
}

export function createI32NumberType(literal?: NumberLiteral): I32NumberType {
	return {
		$type: "i32",
		literal,
	};
}

export function isI32NumberType(item: TypeDescription): item is I32NumberType {
	return item.$type === "i32";
}

// f32

export interface F32NumberType {
	readonly $type: "f32";
	readonly literal?: NumberLiteral;
}
export function createF32NumberType(literal?: NumberLiteral): F32NumberType {
	return {
		$type: "f32",
		literal,
	};
}

export function isF32NumberType(item: TypeDescription): item is F32NumberType {
	return item.$type === "f32";
}


// f64

export interface F64NumberType {
	readonly $type: "f64";
	readonly literal?: NumberLiteral;
}

export function createF64NumberType(literal?: NumberLiteral): F64NumberType {
	return {
		$type: "f64",
		literal,
	};
}

export function isF64NumberType(item: TypeDescription): item is F64NumberType {
	return item.$type === "f64";
}

// type

export interface TypeDeclaration {
	readonly $type: "type";
	readonly name?: Identifier;
	readonly value?: TypeExpression;
}

export function createTypeDeclaration(name: Identifier, value: TypeExpression): TypeDeclaration {
	return {
		$type: "type",
		name,
		value
	};
}

export function isTypeDeclaration(item: TypeDeclaration): item is TypeDeclaration {
	return item.$type === "type";
}

// function

export interface FunctionType {
	readonly $type: "function";
	readonly returnType: TypeDescription;
	readonly parameters: FunctionParameter[];
}

export interface FunctionParameter {
	name: string;
	type: TypeDescription;
}

// export function createFunctionType(func: ClassicFunction): FunctionType {
// const returnType: TypeDescription
// const parameters: FunctionParameter[]
export function createFunctionType(parameters: FunctionParameter[], returnType: TypeDescription): FunctionType {
	return {
		$type: "function",
		parameters,
		returnType,
	};
}

export function isFunctionType(item: TypeDescription): item is FunctionType {
	return item.$type === "function";
}

// error

export interface ErrorType {
	readonly $type: "error";
	readonly source?: AstNode;
	readonly message: string;
}

export function createErrorType(message: string, source?: AstNode): ErrorType {
	return {
		$type: "error",
		message,
		source,
	};
}

export function isErrorType(item: TypeDescription): item is ErrorType {
	return item.$type === "error";
}

export function typeToString(item: TypeDescription): string {
	if (isFunctionType(item)) {
		const params = item.parameters.map(e => `${e.name}: ${typeToString(e.type)}`).join(", ");
		return `(${params}) => ${typeToString(item.returnType)}`;
	} else {
		return item.$type;
	}
}
