grammar ByteScript

entry Code:
    statements+=Statement*;

Statement:
    LetStatement | ConstStatement | ClassicFunction | Block;

LetStatement:
    'let' name=Identifier '=' value=Expression;

ConstStatement:
    'const' name=Identifier '=' value=Expression;

Expression:
    ClassicFunction | STRING | INT  | Identifier;

// This is called Functionn for now, because it complains that Function is taken
// for JS.
ClassicFunction:
    'function' name=Identifier '(' ( params+=Param (',' params+=Param)* )? ')' Block;

Param:
    name=Identifier;

fragment Block:
    '{' body+=Statement* '}';

hidden terminal WS: /\s+/;
terminal Identifier: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
