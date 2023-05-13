grammar ByteScript

entry TopLevel:
	statements+=TopLevelStatement*;

TopLevelStatement:
	( ImportDeclaration
	| ExportSpecifier
	| TypeDeclaration
	| Statement
	) ';'?;

Statement:
	( VariableDeclaration
	| FunctionDeclaration
	| ReturnStatement
	// | ExpressionStatement
	| Block
	| EmptyStatement
	| Expression
	) ';'?;

// DECLARATION

// type foo = i32;
TypeDeclaration:
	"type" name=IDENTIFIER "=" value=TypeExpression;

// import { foo as bar } from "specifier";
ImportDeclaration:
	"import" "{" (bindings+=ImportSpecifier ("," bindings+=ImportSpecifier)*)? "}" "from" specifier=STRING;

// foo as bar
ImportSpecifier:
	name=IDENTIFIER ("as" alias=IDENTIFIER)?;

// export { foo as bar } from "specifier";
// export { foo, bar }
ExportSpecifier:
	"export" "{" (bindings+=ExportDeclarator ("," bindings+=ExportDeclarator)*)? "}" ("from" specifier=STRING)?;

// foo as bar
ExportDeclarator:
	element=[NamedElement:IDENTIFIER] ("as" alias=IDENTIFIER)?;

// [var | let | const] foo: f32 = 3.14;
VariableDeclaration:
	variant=("var" | "let" | "const") name=IDENTIFIER (":" type=TypeExpression)? ("=" value=Expression)?;

// STATEMENT

// Empty
EmptyStatement:
	empty?=";"+;

// ExpressionStatement:
// 	expression=Expression;

// return foo;
ReturnStatement:
	"return" expression=Expression;

// Used for blockless arrow function returns
ArrowReturnExpression:
	expression=Expression;

// EXPRESSION
Expression infers Expression: // why "infers Expression" here?
	AssignmentExpression;

AssignmentExpression infers Expression:
	SumExpression ({infer BinaryExpression.leftOperand=current} operator="=" rightOperand=SumExpression)*;

SumExpression infers Expression:
	ProductExpression ({infer BinaryExpression.leftOperand=current} operator=("+" | "-") rightOperand=ProductExpression)*;

ProductExpression infers Expression:
	PrimaryExpression ({infer BinaryExpression.leftOperand=current} operator=("*" | "/") rightOperand=PrimaryExpression)*;

// Identifier:
// 	name=IDENTIFIER;

PrimaryExpression infers Expression:
	GroupLiteral
	// | Identifier
	| NumberLiteral | InvalidParenthesis | PossibleCallExpression;

PossibleCallExpression infers Expression:
	// Not called
	({infer Identifier} element=[NamedElement:IDENTIFIER] )
	// Called
	// TODO For now only function declarations are callable, and a named function cannot yet reference itself (no recursion).
	| ({infer CallExpression} callee=[FunctionDeclaration:IDENTIFIER] CallArguments );

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

FunctionDeclaration:
	OriginalFunctionDeclaration | GeneratorFunctionDeclaration;

OriginalFunctionDeclaration:
	"function" name=IDENTIFIER Parameters (":" ReturnType)? body=Block;

GeneratorFunctionDeclaration:
	"function" "*" name=IDENTIFIER Parameters (":" ReturnType)? body=Block;

FunctionExpression:
	OriginalFunctionExpression | GeneratorFunctionExpression | ArrowFunctionExpression;

OriginalFunctionExpression:
	"function" name=IDENTIFIER? Parameters (":" ReturnType)? body=Block;

GeneratorFunctionExpression:
	"function" "*" name=IDENTIFIER? Parameters (":" ReturnType)? body=Block;

ArrowFunctionExpression:
	Parameters (":" ReturnType)? "=>" body=(ArrowReturnExpression | Block);

Parameter:
	name=IDENTIFIER (":" type=TypeExpression)?;

Block:
	"{" statements+=Statement* "}";

fragment Parameters:
	"(" ( parameters+=Parameter ("," parameters+=Parameter)* )? ")";

fragment CallArguments:
	"(" ( arguments+=Expression ("," arguments+=Expression)* )? ")";

fragment ReturnType:
	returnType=TypeExpression;

TypeExpression:
	primitive=("number" | "i32" | "f32" | "f64");

type NamedElement =
	Parameter
	| FunctionDeclaration
	| VariableDeclaration
	| ImportSpecifier
	;

// Convention: terminals are named in all caps.
hidden terminal WS: /\s+/;
terminal IDENTIFIER: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /-?[0-9]+\.[0-9]*/;
terminal INT returns number: /-?[0-9]+/;
terminal STRING: /"[^"]*"|"[^"]*"/; // We"re not handling strings yet.

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
