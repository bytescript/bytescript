// There should be no type errors in this file (commented invalid code is ok,
// uncomment to test, but don't commit it uncommented).

// Some stuff in here may be "valid", but we may not want it to be vali. When we
// add errors for it, we should move it to another file.

export function validFunc1(a: i32, b: i32): i32 {
	return a + b
}

export function validFunc2(b: i32): i32 {
	return b
}

function validFunc3(
	// TODO Should be an error that b is not used for anything.
	b: i32,
): i32 {
	// TODO should be a type error, `a` is not defined inside this file and is
	// not a global (our files will all be ES Modules by default, so no global
	// vars by default, and we may or may not add a way to define global vars).
	return a
}

validFunc1(1.3, 2.4) // TODO should be a type error, f64's not assignable to i32's

let num1 = 123
let num2: i32 = num1
let num3 = num1
// num3 = 1.2 // uncomment to show f64 not assignable to i32

// num3 = validFunc3(1) // TODO

num3 = 1 - 2 // sum expression is assignable to the var
