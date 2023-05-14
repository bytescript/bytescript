// When running debugger (in VS Code hit F5, or hit the play button in "Run and
// Debug" in the sidebar, or run the "Debug: Start Debugging" command), in the
// new VS Code window (which is now running our extension) you can paste this
// code to see the errors with squiggly underlines, type checking, and
// intellisense (i.e. tooltips when hovering on code or errors).

/////////////////////////////////////////////////////////
// Testing Code ////////////////////////////////////////
type Foo = number;
type Bar = number;

return 123;

import { xxh3, foo } from "./src/hash.bs";

// TODO ScopeProvider needs to be customized to find the xxh3 *inside* the import statement
export { xxh3 } from "./src/hash.bs";

export {
	foo1,
	foo2,
	foo3
}

function foo1(bar: i32): f64 {
}

function foo2(bar: i32): f64 {
	return 3.14;
}

function foo3(bar: i32): f64 {
	return 2;
}

function foo3(bar: i32): i32 {
	return 2.0;
}

asdf;
qwerty = 2.3;

// function *gen() {} // generators notsup

/**
 * Hello *there*
 */
var a = 456
a = 1.2
a = 3
const b: i32 = 456
let c = 1.0;
let d: f64 = 1.0

a + b
a + d
a * b
a * d

// 5 = 5; // error (good), can't assign to non-identifier

// foo = 123.2;

// foo = (foo: i32): f64 => 2.5; // TODO Arrow functions not working yet because ambiguous with (...) expressions.

// foo.bar = 123; // TODO property access

a;
b;
foo(b)

// type error
let e: f64 = 1
let f: i32 = 456.0;

f = a + b
f = a + d
f = c + d

let rock = 1
const car = 2
car = 3 // TODO can't assign to const
var boat = 3;

// Not supported yet (we will need to figure out how the Wasm output will handle function expressions).
// let func = function (foo) {
//   let foo = 456
// }

/**
 * This is a function called `foo`!
 */
export function foo(foo: i32): f64 {
	/**
	 * This is a var
	 */
	let bar = 5.6

	// returns in blocks not supported yet
	// {
	// 	return 123;
	// }

	return 2.5 + 4.5 + bar;
}

foo()
foo(123, 1.2);
foo (a, b, c)
foo;
() // error, expect expression inside parens

// (a, b, c); // comma-separated expressions in parens not handled yet

function bar(a: f64, b: f64): f64 {
	return a * b;
	(); // error, expect expression inside parens
}

function baz(a: f64, b: f64): f64 {
	// TODO infer type of call expression
	return a * b
	(); // ok, parens on new line
}

// error missing return type annotation (no inference for now)
function baz(a: f64, b: f64) { }

// error missing parameter type annotation (no callsite generic inference yet)
function baz(a: f64, b): i32 { }

function () {} // error

// totally bad top level syntax
const d Car = 2
doSomething(foo) { // this will be ok in a class body
	let Foo = 456
}
