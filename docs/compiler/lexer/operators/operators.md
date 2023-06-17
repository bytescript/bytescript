# Operators

This document provides a summary of the operators in the script language, along with their types, descriptions, precedence, and associativity.

## Comparison of Operators

Bytescript is a script language that has a rich set of operators for performing various operations on data. Similar script languages such as JavaScript, Python, Ruby, and Lua also have a wide range of operators that can be used for arithmetic, comparison, logical, and other operations.

### JavaScript

JavaScript has several types of operators including arithmetic, assignment, comparison, string, logical, bitwise, and ternary operators. For example, the addition operator (+) can be used to add numbers or concatenate strings. The assignment operator (=) assigns a value to a variable. The comparison operators (==, ===, !=, !==) compare values for equality or inequality. The logical operators (&&, ||) perform logical AND and OR operations.

### Lua

Lua also has a rich set of built-in operators including arithmetic, relational, logical, and miscellaneous operators. For example, the concatenation operator (..) concatenates two strings. The length operator (#) returns the length of a string or table.

### Benefits and Drawbacks

Having a wide range of operators can provide benefits such as increased expressiveness and readability of the script language. However, it can also introduce drawbacks such as increased complexity and potential for confusion or errors.

It is important to carefully evaluate the benefits and drawbacks of including or excluding certain operators in bytescript. Consider how they affect the readability, expressiveness, and performance of the script language.

## Table of Operators

| Operator | Type | Description | Precedence | Associativity | Example |
| --- | --- | --- | --- | --- | --- |
| * | Arithmetic | Multiplication | High | Left | `x = 3 * 4` |
| / | Arithmetic | Division | High | Left | `x = 3 / 4` |
| % | Arithmetic | Modulus (Remainder) | High | Left | `x = 3 % 4` |
| + | Arithmetic | Addition | Medium | Left | `x = 3 + 4` |
| - | Arithmetic | Subtraction | Medium | Left | `x = 3 - 4` |
| < | Relational | Less than | Low | Left | `x < y` |
| > | Relational | Greater than | Low | Left | `x > y` |
| <= | Relational | Less than or equal to| Low| Left| `x <= y`|
| >= | Relational | Greater than or equal to| Low| Left| `x >= y`|
| == | Relational | Equal to| Low| Left| `x == y`|
| != | Relational | Not equal to| Low| Left| `x != y`|
| === | Relational | Strict equal to| Low| Left| `x === y`|
| !== | Relational | Strict not equal to| Low| Left| `x !== y`|
| ! | Logical | Logical NOT | High | Right | `! x`|
| && | Logical | Logical AND| Medium| Left| `(x > 0) && (y > 0)`|
| \|\| | Logical | Logical OR| Medium| Left| `(x > 0) \|\|(y > 0)`|
| ?? | Logical | Nullish coalescing | Medium | Right | `x ?? y` |
| = | Assignment | Assignment | Low | Right | `x = y` |
| += | Assignment | Addition assignment | Low | Right | `x += y` |
| -= | Assignment | Subtraction assignment | Low | Right | `x -= y` |
| *= | Assignment | Multiplication assignment | Low | Right | `x *= y` |
| /= | Assignment | Division assignment | Low | Right | `x /= y` |
| %= | Assignment | Modulus assignment | Low | Right | `x %= y` |
| ~ | Bitwise | Bitwise NOT | High | Right | `~x` |
| << | Bitwise | Bitwise left shift| High| Left| `x << 2`|
| >> | Bitwise | Bitwise right shift| High| Left| `x >> 2`|
| >>>| Bitwise | Bitwise unsigned right shift| High| Left| `x >>> 2`|
| & | Bitwise | Bitwise AND | Medium | Left | `x & y` |
| \| | Bitwise | Bitwise OR | Medium | Left | `x \| y` |
| ^ | Bitwise | Bitwise XOR | Medium | Left | `x ^ y` |
| ?:| Conditional | Conditional (ternary) operator| Low| Right| `x ? y : z`|

## Arithmetic Operators

Arithmetic operators perform basic mathematical operations such as addition, subtraction, multiplication, and division.

### Addition `+`

The addition operator `+` adds two numbers together and returns their sum.

### Subtraction `-`

The subtraction operator `-` subtracts one number from another and returns their difference.

### Multiplication `*`

The multiplication operator `*` multiplies two numbers together and returns their product.

### Division `/`

The division operator `/` divides one number by another and returns their quotient.

## Relational Operators

Relational operators compare two values and return a boolean value indicating whether the comparison is true or false.

### Less than `<`

The less than operator `<` returns true if the left operand is less than the right operand, otherwise it returns false.

### Greater than `>`

The greater than operator `>` returns true if the left operand is greater than the right operand, otherwise it returns false.

### Less than or equal to `<=`

The less than or equal to operator `<=` returns true if the left operand is less than or equal to the right operand, otherwise it returns false.

### Greater than or equal to `>=`

The greater than or equal to operator `>=` returns true if the left operand is greater than or equal to the right operand, otherwise it returns false.

## Logical Operators

Logical operators perform logical operations on boolean values.

### Logical AND `&&`

The logical AND operator `&&` returns true if both operands are true, otherwise it returns false.

### Logical OR `||`

The logical OR operator `||` returns true if either operand is true, otherwise it returns false.

### Logical NOT `!`

The logical NOT operator `!` negates a boolean value and returns its opposite value.

## Assignment Operators

Assignment operators assign a value to a variable.

### Assignment `=`

The assignment operator `=` assigns a value to a variable.

### Addition assignment `+=`

The addition assignment operator `+=` adds a value to a variable and assigns the result to the variable.

### Subtraction assignment `-=`

The subtraction assignment operator `-=` subtracts a value from a variable and assigns the result to the variable.

### Multiplication assignment `*=`

The multiplication assignment operator `*=` multiplies a variable by a value and assigns the result to the variable.

### Division assignment `/=`

The division assignment operator `/=` divides a variable by a value and assigns the result to the variable.

## Bitwise Operators

Bitwise operators perform bitwise operations on integer values.

### Bitwise AND `&`

The bitwise AND operator `&` performs a bitwise AND operation on two integer values and returns an integer result.

### Bitwise OR `|`

The bitwise OR operator `|` performs a bitwise OR operation on two integer values and returns an integer result.

### Bitwise XOR `^`

The bitwise XOR operator `^` performs a bitwise XOR operation on two integer values and returns an integer result.

### Bitwise NOT `~`

The bitwise NOT operator `~` negates an integer value by flipping all its bits and returning an integer result.

## Conditional Operator

The conditional operator `?:` is a ternary operator that takes three operands. It evaluates a condition and returns one of two values depending on whether the condition is true or false.
