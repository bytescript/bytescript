grammar ByteScript

entry ByteScriptCode:
	statements+=Statement*
	declarations+=DeclarationStatement*;

DeclarationStatement:
	VariableDeclaration
	| ClassicFunction<true>
	| ImportDeclaration
	| ExportDeclaration;

Statement:
	VariableDeclaration
	| ClassicFunction<true>
	| ReturnStatement
	| ExpressionStatement
	| EmptyStatement;

// DECLARATION

// import { foo as bar } from "path";
ImportDeclaration:
    "import" "{" (declarators+=ImportDeclarator ("," declarators+=ImportDeclarator)*)? "}" "from" path=STRING ";";

// foo as bar
ImportDeclarator:
    name=Identifier ("as" alias=Identifier)?;

// export { foo as bar } from "path";
ExportDeclaration:
    "export" "{" declarators+=ExportDeclarator ("," declarators+=ExportDeclarator)* "}";

// foo as bar
ExportDeclarator:
    name=Identifier ("as" alias=Identifier)?;

// [var | let | const] foo: f32 = 3.14;
VariableDeclaration:
	variant=("var" | "let" | "const") name=IDENTIFIER (":" type=TypeExpression)? ("=" value=Expression)?;

// STATEMENT

// Empty
EmptyStatement:
	empty?=";"+;

ExpressionStatement:
	expression=Expression ";"?;

// return foo;
ReturnStatement:
	"return" expression=Expression ";"?;

// EXPRESSION
Expression:
	AssignmentExpression;

AssignmentExpression:
	Identifier ({infer BinaryExpression.lhs=current} op="=" rhs=SumExpression)*
	| SumExpression;

SumExpression:
	ProductExpression ({infer BinaryExpression.lhs=current} op=("+" | "-") rhs=ProductExpression)*;

ProductExpression:
	PathExpression ({infer BinaryExpression.lhs=current} op=("*" | "/") rhs=PathExpression)*;

PathExpression:
	Identifier (
		{infer CallExpression.callee=current} "(" (args+=Expression ("," args+=Expression)* ","? )? ")"
	)*
	| PrimaryExpression;

PrimaryExpression:
	GroupLiteral | Identifier | NumberLiteral | InvalidParenthesis;

NumberLiteral:
	FloatLiteral | IntegerLiteral;

FloatLiteral:
	value=FLOAT;

IntegerLiteral:
	value=INT;

GroupLiteral:
	"(" value=Expression ")";

InvalidParenthesis:
	empty?="(" ")";

Identifier:
	value=IDENTIFIER;

ClassicFunction<nameRequired>:
	"function" (<nameRequired> name=IDENTIFIER | <!nameRequired> name=IDENTIFIER?) "("
		( params+=Parameter ("," params+=Parameter)* )?
	")" (":" returnType=TypeExpression)? Block;

Parameter:
	name=IDENTIFIER (":" type=TypeExpression)?;

fragment Block:
	"{" body+=Statement* "}";

fragment Parameters:
    "(" (parameters+=Parameter ("," parameters+=Parameter)*)? ")";

fragment ReturnType:
    returnType=TypeExpression;

TypeExpression:
	primitive=("number" | "i32" | "f32" | "f64");

// Convention: terminals are named in all caps.
hidden terminal WS: /\s+/;
terminal IDENTIFIER: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /[0-9]+\.[0-9]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|"[^"]*"/; // We"re not handling strings yet.

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
