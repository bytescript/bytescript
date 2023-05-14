export function lorem(b: i32): i32 {
	// TODO should be an error, but it refs the `a` in the other file, haha
	return a
}
