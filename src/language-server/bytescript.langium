grammar ByteScript

entry Program:
	statements+=TopLevelStatement*;

TopLevelStatement:
	ExportStatement
	| Statement;

ExportStatement:
	"export" statement=DeclarationStatement ";"?;

DeclarationStatement:
	VariableDeclaration | FunctionDeclaration<true>;

Statement:
	VariableDeclaration
	| FunctionDeclaration<true>
	| ReturnStatement
	| ExpressionStatement
	| EmptyStatement;

EmptyStatement:
	empty?=";"+;

ExpressionStatement:
	expression=Expression ";"?;

ReturnStatement:
	"return" expression=Expression ";"?;

VariableDeclaration:
	(mutable?=("let" | "var") | "const") name=IDENTIFIER (":" type=TypeExpression)? ("=" value=Expression)?;

Expression:
	AssignmentExpression;

AssignmentExpression:
	IdentifierExpression ({infer BinaryExpression.lhs=current} op="=" rhs=SumExpression)*
	| SumExpression;

SumExpression:
	ProductExpression ({infer BinaryExpression.lhs=current} op=("+" | "-") rhs=ProductExpression)*;

ProductExpression:
	PathExpression ({infer BinaryExpression.lhs=current} op=("*" | "/") rhs=PathExpression)*;

PathExpression:
	IdentifierExpression (
		{infer CallExpression.callee=current} "(" (args+=Expression ("," args+=Expression)* ","? )? ")"
	)*
	| PrimaryExpression;

PrimaryExpression:
	GroupLiteral | IdentifierExpression | NumberLiteral | InvalidParenthesis;

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

IdentifierExpression:
	text=IDENTIFIER;

// Classic js `function`
FunctionDeclaration<nameRequired>:
	"function" (<nameRequired> name=IDENTIFIER | <!nameRequired> name=IDENTIFIER?) "("
		( params+=Parameter ("," params+=Parameter)* )?
	")" (":" returnType=TypeExpression)? body=BlockStatement;

Parameter:
	name=IDENTIFIER (":" type=TypeExpression)?;

BlockStatement:
	"{" statements+=Statement* "}";

TypeExpression:
	text=IDENTIFIER;

// Convention: terminals are named in all caps.
hidden terminal WS: /\s+/;
terminal IDENTIFIER: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /[0-9]+\.[0-9]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|"[^"]*"/; // We"re not handling strings yet.

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
