grammar ByteScript

entry ByteScriptCode:
	statements+=TopLevelStatement*;

TopLevelStatement:
	( ImportDeclaration
	| ExportSpecifier
	| TypeDeclaration
	| Statement
	) ';'?;

Statement:
	( VariableDeclaration
	| ClassicFunction<true>
	| ReturnStatement
	| ExpressionStatement
	| EmptyStatement
	| Expression
	) ';'?;

// DECLARATION

// type foo = i32;
TypeDeclaration:
	"type" name=Identifier "=" value=TypeExpression;

// import { foo as bar } from "specifier";
ImportDeclaration:
	"import" "{" (bindings+=ImportSpecifier ("," bindings+=ImportSpecifier)*)? "}" "from" specifier=STRING;

// foo as bar
ImportSpecifier:
	name=Identifier ("as" alias=Identifier)?;

// export { foo as bar } from "specifier";
// export { foo, bar }
ExportSpecifier:
	"export" "{" (bindings+=ExportDeclarator ("," bindings+=ExportDeclarator)*)? "}" ("from" specifier=STRING)?;

// foo as bar
ExportDeclarator:
	name=Identifier ("as" alias=Identifier)?;

// [var | let | const] foo: f32 = 3.14;
VariableDeclaration:
	variant=("var" | "let" | "const") name=Identifier (":" type=TypeExpression)? ("=" value=Expression)?;

// STATEMENT

// Empty
EmptyStatement:
	empty?=";"+;

ExpressionStatement:
	expression=Expression;

// return foo;
ReturnStatement:
	"return" expression=Expression;

// EXPRESSION
Expression infers Expression: // why "infers Expression" here?
	AssignmentExpression;

AssignmentExpression infers Expression:
	SumExpression ({infer BinaryExpression.leftOperand=current} operator="=" rightOperand=SumExpression)*;

SumExpression infers Expression:
	ProductExpression ({infer BinaryExpression.leftOperand=current} operator=("+" | "-") rightOperand=ProductExpression)*;

ProductExpression infers Expression:
	PrimaryExpression ({infer BinaryExpression.leftOperand=current} operator=("*" | "/") rightOperand=PrimaryExpression)*;

PrimaryExpression infers Expression:
	GroupLiteral | Identifier | NumberLiteral | InvalidParenthesis | PathExpression;

PathExpression:
	function=[ClassicFunction:IDENTIFIER] ( {infer CallExpression.callee=current} CallArguments )*;

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
	name=IDENTIFIER;

ClassicFunction<nameRequired>:
	"function" (<nameRequired> name=IDENTIFIER | <!nameRequired> name=IDENTIFIER?)
	Parameters
	(":" ReturnType)? Block;

Parameter:
	name=IDENTIFIER (":" type=TypeExpression)?;

fragment Block:
	"{" body+=Statement* "}";

fragment Parameters:
	"(" ( parameters+=Parameter ("," parameters+=Parameter)* )? ")";

fragment CallArguments:
	"(" ( arguments+=Expression ("," arguments+=Expression)* )? ")";

fragment ReturnType:
	returnType=TypeExpression;

TypeExpression:
	primitive=("number" | "i32" | "f32" | "f64");

type NamedElement = Parameter | ClassicFunction | VariableDeclaration;

// Convention: terminals are named in all caps.
hidden terminal WS: /\s+/;
terminal IDENTIFIER: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /-?[0-9]+\.[0-9]*/;
terminal INT returns number: /-?[0-9]+/;
terminal STRING: /"[^"]*"|"[^"]*"/; // We"re not handling strings yet.

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
