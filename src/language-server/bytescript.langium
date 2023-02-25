grammar ByteScript

entry ByteScriptCode:
	statements+=Statement*;

Statement:
	VariableDeclaration | ClassicFunction<true> | Block;

VariableDeclaration:
	type=('var' | 'let' | 'const') name=IDENTIFIER '=' value=Expression;

Expression:
	ClassicFunction<false> | SimpleExpression;

SimpleExpression infers Expression:
	FloatExpression | IntExpression | IdentifierExpression;

FloatExpression:
	value=FLOAT;

IntExpression:
	value=INT;

IdentifierExpression:
	value=IDENTIFIER;

// Classic js `function`
ClassicFunction<nameRequired>:
	'function' (<nameRequired> name=IDENTIFIER | <!nameRequired>name=IDENTIFIER?) '('
		( params+=Param (',' params+=Param)* )?
	')' Block;

Param:
	name=IDENTIFIER;

fragment Block:
	'{' body+=Statement* '}';

// Convention: terminals are named in all caps.
hidden terminal WS: /\s+/;
terminal IDENTIFIER: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /[0-9]+\.[0-9]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
