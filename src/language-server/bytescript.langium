grammar ByteScript

entry ByteScriptCode:
	statements+=TopLevelStatement*;

TopLevelStatement:
	ExportStatement
	| Statement;

ExportStatement:
	"export" statement=DeclarationStatement ";"?;

DeclarationStatement:
	VariableDeclaration | ClassicFunction<true>;

Statement:
	VariableDeclaration
	| ClassicFunction<true>
	| ReturnStatement
	// For now, a function call is a statement (but later we'll want to allow
	// any expression to be a statement, and a function call can also be an
	// expression)
	| ExpressionStatement
	| EmptyStatement;

EmptyStatement:
	empty?=";"+;

ExpressionStatement:
	expression=Expression ";"?;

ReturnStatement:
	"return" expression=Expression ";"?;

VariableDeclaration:
	variant=('var' | 'let' | 'const') name=IDENTIFIER (':' type=TypeExpression)? ('=' value=Expression)?;

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

// Classic js `function`
ClassicFunction<nameRequired>:
	'function' (<nameRequired> name=IDENTIFIER | <!nameRequired> name=IDENTIFIER?) '('
		( params+=Param (',' params+=Param)* )?
	')' (':' returnType=TypeExpression)? Block;

Param:
	name=IDENTIFIER (':' type=TypeExpression)?;


fragment Block:
	'{' body+=Statement* '}';

TypeExpression:
	primitive=('number' | 'i32' | 'f64');

// Convention: terminals are named in all caps.
hidden terminal WS: /\s+/;
terminal IDENTIFIER: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /[0-9]+\.[0-9]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/; // We're not handling strings yet.

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
