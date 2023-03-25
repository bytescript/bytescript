grammar ByteScript

entry Program:
	statements+=TopLevelStatement*;

TopLevelStatement:
	Statement;

Statement:
	Declaration
	| WhileStatement
	| ForStatement
	| IfStatement
	| ReturnStatement
	| ExpressionStatement
	| EmptyStatement
	";";

Declaration:
	VariableDeclaration
	| FunctionDeclaration
	| ClassDeclaration
	| TypeDeclaration
	| EnumDeclaration
	| NamespaceDeclaration;

Expression:
	FunctionCallExpression
	AssignmentExpression
	| TernaryExpression;

ExpressionStatement:
	expression=Expression ";"?;

VariableDeclaration:
	(mutable?=("let" | "var") | "const") name=ID (":" type=TypeExpression)? ("=" value=Expression)?;
FunctionDeclaration:
	Decorators Export "function" GenericParameters (name=ID)? Parameters (":" returnType=TypeExpression)? block=BlockStatement;

ClassDeclaration:
	Decorators Export "class" name=ID GenericParameters ("extends" extends=TypeExpression) "{" members+=ClassMember* "}";

ClassMember:
	ConstructorClassMember | FieldClassMember | MethodClassMember | GetterClassMember | SetterClassMember;

FieldClassMember:
	Decorators (private?="private")? name=ID ":" type=TypeExpression ("=" initializer=Expression);

MethodClassMember:
	Decorators (private?="private")? name=ID GenericParameters Parameters ":" returnType=TypeExpression block=BlockStatement;

GetterClassMember:
	Decorators (private?="private")? "get" name=ID ":" returnType=TypeExpression block=BlockStatement;

SetterClassMember:
	Decorators (private?="private")? "set" name=ID "(" parameter=Parameter ")" block=BlockStatement;

ConstructorClassMember:
	Decorators (private?="private")? "constructor" Parameters block=BlockStatement;

TypeDeclaration:
	Decorators Export "type" name=ID "=" type=TypeExpression ";";

EnumDeclaration:
	Decorators Export "enum" name=ID "{" members+=EnumDeclarator ("," members+=EnumDeclarator)* "}";

NamespaceDeclaration:
	Decorators Export "namespace" name=ID "{" members+=Statement* "}";

EnumDeclarator:
	name=ID ("=" value=IntegerLiteral)?;

WhileStatement:
	"while" "(" condition=Expression ")" statement=Statement;

ForStatement: 
	"for" "(" conditions+=Expression* ";" (conditions+=Expression*)? ")" statement=Statement;

IfStatement:
	"if" "(" condition=ExpressionStatement ")" statement=Statement;

FunctionCallExpression:
	name=ID "(" args+=NumberLiteral | Identifier ("," args+=NumberLiteral | Identifier)? ")";

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
	value=Float;

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
	("<" typeParameters+=IdentifierExpression ("," typeParameters+=IdentifierExpression* ">")?);
 
fragment Parameters:
	"(" (parameters+=Parameter ("," parameters+=Parameter)*)? ")";

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal BINARY: /0b[10]+/;
terminal HEX: /0x[0-9a-fA-F]+/;
terminal OCTAL: /0o[0-7]+/;
terminal Float: /[-+]?[0-9]+[.][0-9]+([eE][-+]?[0-9]+)?/;
terminal FLOAT: /[-+]?[0-9]+/;
terminal STRING: /"([^"\r\n]|\\\.)*"/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
