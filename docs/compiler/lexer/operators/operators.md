# Operators

This document provides a summary of the operators in the script language, along with their types, descriptions, precedence, and associativity.

## Table of Operators

| Operator | Type | Description | Precedence | Associativity |
| --- | --- | --- | --- | --- |
| + | Arithmetic | Addition | Medium | Left |
| - | Arithmetic | Subtraction | Medium | Left |
| * | Arithmetic | Multiplication | High | Left |
| / | Arithmetic | Division | High | Left |
| % | Arithmetic | Modulus (Remainder) | High | Left |
| < | Relational | Less than | Low | Left |
| > | Relational | Greater than | Low | Left |
| <= | Relational | Less than or equal to | Low | Left |
| >= | Relational | Greater than or equal to | Low | Left |
| == | Relational | Equal to | Low | Left |
| != | Relational | Not equal to | Low | Left |
| === | Relational | Strict equal to | Low | Left |
| !== | Relational | Strict not equal to | Low | Left |
| && | Logical | Logical AND | Medium | Left |
| || | Logical | Logical OR | Medium | Left |
| ! | Logical | Logical NOT | High | Right |
| ?? | Logical | Nullish coalescing | Medium | Right |
| = | Assignment | Assignment | Low | Right |
| += | Assignment | Addition assignment | Low | Right |
| -= | Assignment | Subtraction assignment | Low | Right |
| *= | Assignment | Multiplication assignment | Low | Right |
| /= | Assignment | Division assignment | Low | Right |
| %= | Assignment | Modulus assignment | Low | Right |
| & | Bitwise | Bitwise AND | Medium | Left |
| \| | Bitwise | Bitwise OR | Medium | Left |
| ^ | Bitwise | Bitwise XOR | Medium | Left |
| ~ | Bitwise | Bitwise NOT | High | Right |
| << | Bitwise | Bitwise left shift | High | Left |
| >> | Bitwise | Bitwise right shift | High | Left |
| >>> | Bitwise | Bitwise unsigned right shift | High | Left |
| ?: | Conditional | Conditional (ternary) operator | Low | Right |

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

## Research

[Content from research.md]

## Comparison

[Content from comparison.md]

## Syntax

[Content from syntax.md]

## Testing

[Content from testing.md]

## Precedence

[Content from precedence.md]

## Reference

[Content from reference.md]