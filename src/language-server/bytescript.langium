grammar ByteScript

entry ByteScriptCode:
	statements+=Statement*;

Statement:
	VariableDeclaration | ClassicFunction | Block;

VariableDeclaration:
	('var' | 'let' | 'const') name=IDENTIFIER '=' value=Expression;

Expression:
	ClassicFunction | STRING | INT  | IDENTIFIER;

// Classic js `function`
ClassicFunction:
	'function' name=IDENTIFIER '(' ( params+=Param (',' params+=Param)* )? ')' Block;

Param:
	name=IDENTIFIER;

fragment Block:
	'{' body+=Statement* '}';

// Convention: terminals are named in all caps.
hidden terminal WS: /\s+/;
terminal IDENTIFIER: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
