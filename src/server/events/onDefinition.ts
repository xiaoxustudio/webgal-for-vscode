import { GlobalMap } from "@/core";
import { ConnectionHandler } from "@/server/types";
import { getWordAtPosition, updateGlobalMap } from "@/server/utils";
import {
	DefinitionLink,
	LocationLink,
	Position,
	Range,
	TextDocumentPositionParams
} from "vscode-languageserver";

// 跳转定义
export default <ConnectionHandler>function (documents, connection) {
	connection.onDefinition(
		async (textDocumentPosition: TextDocumentPositionParams) => {
			const uri: string = textDocumentPosition.textDocument.uri;
			const doc = documents.get(uri);
			if (!doc) return [];
			const text = doc.getText();
			const findWord = getWordAtPosition(
				doc,
				textDocumentPosition.position
			);
			let definitionLinks: DefinitionLink[] = [];
			if (!findWord) return definitionLinks;
			const documentTextArray = text.split("\n");
			const currentLine =
				documentTextArray[textDocumentPosition.position.line];

			const commandType = currentLine.substring(
				0,
				currentLine.indexOf(":") !== -1
					? currentLine.indexOf(":")
					: currentLine.indexOf(";")
			);

			updateGlobalMap(documentTextArray);
			const jumpLabelMap = GlobalMap.label;
			const setVarMap = GlobalMap.setVar;

			const targetPool = ["jumpLabel", "choose"].includes(commandType)
				? jumpLabelMap
				: setVarMap;
			if (!targetPool) return definitionLinks;
			const targetPoolArray = targetPool[findWord.word];
			// 变量未定义
			if (!targetPoolArray) return definitionLinks;
			// 在池中找对应变量
			for (const current of targetPoolArray) {
				if (current.word === findWord.word) {
					definitionLinks.push(
						LocationLink.create(
							uri,
							Range.create(
								Position.create(
									textDocumentPosition.position.line,
									findWord.start
								),
								Position.create(
									textDocumentPosition.position.line,
									findWord.end
								)
							),
							Range.create(current.position, current.position),
							Range.create(
								Position.create(0, 0),
								Position.create(0, 0)
							)
						)
					);
				}
			}
			return definitionLinks;
		}
	);
};
