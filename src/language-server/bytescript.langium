grammar ByteScript

entry Program:
	statements+=TopLevelStatement*;

TopLevelStatement:
	Statement;

Statement:
	Declaration
	| FunctionCallExpression ";"?
	| WhileStatement ";"?
	| ForStatement ";"?
	| IfElseStatement ";"?
	| ReturnStatement ";"?
	| BlockStatement ";"?
	| EmptyStatement ";"?;

Declaration:
	VariableStatement ";"?
	| FunctionDeclaration ";"?
	| ClassDeclaration ";"?
	| TypeDeclaration ";"?
	| EnumDeclaration ";"?
	| NamespaceDeclaration ";"?;

Expression:
	FunctionCallExpression
	| AssignmentExpression
	| TernaryExpression
	| ArrowFunction;

ExpressionStatement:
	Expression;

IfElseStatement:
	"if" "(" condition=Expression ")" truthy=Statement ("else" falsy=Statement)?;

VariableStatement:
	(mutable?=("let" | "var") | "const") name=ID (":" type=TypeExpression)? "=" value=Expression;

FunctionDeclaration:
	Decorators Export "function" name=ID GenericParameters? Parameters (":" returnType=TypeExpression)? body=BlockStatement;

ClassDeclaration:
	Decorators "class" name=ID GenericParameters? ("extends" extends=TypeExpression)? "{" members+=ClassMember* "}";

ClassMember:
	ConstructorClassMember | FieldClassMember | MethodClassMember | GetterClassMember | SetterClassMember;

FieldClassMember:
	(private?=("private" | "public"))? name=ID ":" type=TypeExpression ("=" initializer=Expression);

MethodClassMember:
	(private?=("private" | "public"))? name=ID GenericParameters Parameters ":" returnType=TypeExpression block=BlockStatement;

GetterClassMember:
	(private?=("private" | "public"))? "get" name=ID ":" returnType=TypeExpression block=BlockStatement;

SetterClassMember:
	(private?=("private" | "public"))? "set" name=ID "(" parameter=Parameter ")" block=BlockStatement;

ConstructorClassMember:
	(private?=("private" | "public"))? "constructor" Parameters block=BlockStatement;

TypeDeclaration:
	"type" name=ID "=" type=TypeExpression;

EnumDeclaration:
	"enum" name=ID "{" members+=EnumDeclarator ("," members+=EnumDeclarator)* "}";

NamespaceDeclaration:
	"namespace" name=ID "{" members+=Statement* "}";

EnumDeclarator:
	name=ID ("=" value=IntegerLiteral)?;

WhileStatement:
	"while" "(" condition=Expression ")" statement=Statement;

ForStatement:
	"for" "(" conditions+=Expression* ";" (conditions+=Expression*)? ")" statement=Statement;

ArrowFunction:
	Parameters ":" (returnType=TypeExpression)? "=>" body=Statement;

FunctionCallExpression:
	name=ID "(" (args+=NumberLiteral | Identifier | StringLiteral)? ("," args+=NumberLiteral | Identifier)? ")";

TernaryExpression:
	condition=AssignmentExpression "?" truthy=ExpressionStatement ":" falsy=ExpressionStatement;

Parameter:
	name=ID (":" type=TypeExpression)?;

BlockStatement:
	"{" statements+=Statement* "}";

EmptyStatement:
	empty?=";"+;

ReturnStatement:
	"return" expression=Expression ";"?;

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
	value=Float;

StringLiteral:
	value=STRING;

IntegerLiteral:
	value=FLOAT;

GroupLiteral:
	"(" value=Expression ")";

InvalidParenthesis:
	empty?="(" ")";

Identifier:
	value=ID;

TypeExpression:
	NamedTypeExpression;

NamedTypeExpression:
	name=ID TypeParameters;

Decorator:
	"@" name=ID CallParameters?;

fragment Export:
	(export?="export");

fragment Decorators:
	decorators+=Decorator*;

fragment CallParameters:
	"(" (parameters+=Expression ("," parameters+=Expression)*)? ")";

fragment TypeParameters:
	("<" typeParameters+=TypeExpression ("," typeParameters+=TypeExpression)* ">")?;

fragment GenericParameters:
	("<" typeParameters+=Identifier ("," typeParameters+=Identifier* ">")?);

fragment Parameters:
	"(" (parameters+=Parameter ("," parameters+=Parameter)*)? ")";

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal BINARY: /0b[10]+/;
terminal HEX: /0x[0-9a-fA-F]+/;
terminal OCTAL: /0o[0-7]+/;
terminal Float: /[-+]?[0-9]+[.][0-9]+([eE][-+]?[0-9]+)?/;
terminal FLOAT: /[-+]?[0-9]+/;
terminal STRING: /"[^"]*"/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;