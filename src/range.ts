export class StatementRange {
	public start!: Position
	public end!: Position
	public position!: number
	public statementPos!: number
	constructor(start: Position, end: Position, statementPos: number) {
		this.start = start
		this.end = end
		this.position = start.index
		this.statementPos = statementPos
	}
}

export class Position {
	public character!: number
	public line!: number
	public index!: number
	constructor(character: number, line: number, index: number) {
		this.character = character
		this.line = line
		this.index = index
	}
}
