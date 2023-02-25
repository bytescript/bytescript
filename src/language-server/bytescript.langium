grammar ByteScript

entry ByteScriptCode:
	statements+=Statement*;

Statement:
	VariableDeclaration
	| ClassicFunction<true>
	// For now, a function call is a statement (but later we'll want to allow
	// any expression to be a statement, and a function call can also be an
	// expression)
	| FunctionCall;

VariableDeclaration:
	variant=('var' | 'let' | 'const') name=IDENTIFIER (':' type=TypeExpression)? ('=' value=Expression)?;

Expression:
	NumberLiteral
	| Identifier
	// Disable for now, we don't support passing around lambdas yet.
	// | ClassicFunction<false>
;

NumberLiteral:
	FloatLiteral | IntegerLiteral;

FloatLiteral:
	value=FLOAT;

IntegerLiteral:
	value=INT;

Identifier:
	value=IDENTIFIER;

// Classic js `function`
ClassicFunction<nameRequired>:
	'function' (<nameRequired> name=IDENTIFIER | <!nameRequired> name=IDENTIFIER?) '('
		( params+=Param (',' params+=Param)* )?
	')' (':' returnType=TypeExpression)? Block;

Param:
	name=IDENTIFIER (':' type=TypeExpression)?;

FunctionCall:
	name=IDENTIFIER '('
		( args+=CallArgs (',' args+=CallArgs)* )?
	')';

// Normally function args can be any Expression, but for now we are limiting it
// to numbers or variables only.
CallArgs:
	NumberLiteral | Identifier;

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
