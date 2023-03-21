import { NodeFileSystem } from "langium/node";
import { Program, TopLevelStatement } from "./language-server/generated/ast";
import { createByteScriptServices } from "./language-server/bytescript-module";

const ByteScript = createByteScriptServices(NodeFileSystem).ByteScript;

export function parse(contents: string): TopLevelStatement[] {
	const ast = ByteScript.parser.LangiumParser.parse<Program>(contents);

	if (ast.parserErrors.length) {
		for (const err of ast.parserErrors) {
			console.error(err);
		}
	}

	return ast.value.statements;
}