// When running debugger (in VS Code hit F5, or hit the play button in "Run and
// Debug" in the sidebar, or run the "Debug: Start Debugging" command), in the
// new VS Code window (which is now running our extension) you can paste this
// code to see the errors with squiggly underlines, type checking, and
// intellisense (i.e. tooltips when hovering on code or errors).

/////////////////////////////////////////////////////////
// Testing Code ////////////////////////////////////////
type i32 = number
type f64 = number
let foo = 2.32
let foo = 321
function foo(bar: i32): f64 {
}

function foo(bar: i32): f64 {
	let boo = 123
	let boo = 123
	return 3.14
}

function bar(bar: i32): f64 {
	return 2
}

/**
 * Hello *there*
 */
var a = 456
const b: i32 = 456
let c = 1.0
let d: f64 = 1.0

// type error
let e: f64 = 1
let f: i32 = 456.0

let rock = 1
const car = 2
var boat = 3

// Not supported yet (we will need to figure out how the Wasm output will handle function expressions).
// let func = function (foo) {
//   let foo = 456
// }

class Vec3<A, B> {
	public x: f64 = 0
	public y: f64 = 0
	private z: f64 = 0
	constructor(x: f64, y: f64, z: f64) {}
	set x
}

class Player extends Vec3 {}

while (1) {
	
}
function foo(foo: i32): f64 {
	/**
	 * This is a var
	 */
	let bar = 456

	return 2.5 + foo * bar()
}

foo()
foo(123, 1.2)
foo (a, b, c)
foo
() // error, expect expression inside parens

// (a, b, c) // comma-separated expressions in parens not handled yet

function bar(a: f64, b: f64): f64 {
	return a * b
	() // error, expect expression inside parens
}

function baz(a: f64, b: f64): f64 {
	return a * b
	() // ok, parens on new line
}

// error missing return type annotation (no inference for now)
function baz(a: f64, b: f64) { }

// error missing parameter type annotation (no callsite generic inference yet)
function baz(a: f64, b): i32 { }
