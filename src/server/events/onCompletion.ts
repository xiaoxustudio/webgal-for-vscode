import {
	CompletionItem,
	CompletionItemKind,
	Position,
	TextDocumentPositionParams
} from "vscode-languageserver";
import {
	WebGALConfigCompletionMap,
	CommandNameSpecial,
	WebGALKeywords,
	globalArgs,
	WebgGALKeywordsCompletionMap
} from "../../utils/provider";
import { StateMap } from "../../utils/providerState";
import { resourcesMap } from "../../utils/resources";
import { GlobalMap } from "../../utils/utils_novsc";
import { ConnectionHandler } from "../types";
import {
	findTokenRange,
	getPatternAtPosition,
	getStageCompletionContext,
	getWordAtPosition,
	updateGlobalMap
} from "../utils";

// 补全
export default <ConnectionHandler>function (documents, connection) {
	connection.onCompletion(
		async (
			_textDocumentPosition: TextDocumentPositionParams
		): Promise<CompletionItem[]> => {
			const document = documents.get(
				_textDocumentPosition.textDocument.uri
			);
			if (!document) return [];
			const file_name = document.uri;
			const documentTextArray = document.getText().split("\n");

			const { token } = findTokenRange(
				document,
				_textDocumentPosition.position
			);

			const CompletionItemSuggestions: CompletionItem[] = [];

			/* 配置文件 */
			if (file_name.endsWith("/game/config.txt")) {
				const completionItems = [];
				for (const key in WebGALConfigCompletionMap) {
					const keyData = WebGALConfigCompletionMap[key];
					// 如果输入的文本以关键词开头，则匹配相应的参数
					if (key.toLowerCase().includes(token.toLowerCase())) {
						completionItems.push(keyData);
					}
				}
				return completionItems;
			}

			const findWordWithPattern = getPatternAtPosition(
				document,
				_textDocumentPosition.position,
				/\$(stage|userData)(?:\.[\w-]*)*/
			);
			const isStateMap = (
				value: StateMap | Record<string, StateMap>
			): value is StateMap => {
				return (
					typeof (value as StateMap).key === "string" &&
					typeof (value as StateMap).description === "string"
				);
			};

			/* 舞台状态 */
			if (findWordWithPattern) {
				const { replaceRange, fullSegments, querySegments, prefix } =
					getStageCompletionContext(
						document,
						_textDocumentPosition.position,
						findWordWithPattern
					);
				let info = await connection.sendRequest<
					StateMap | Record<string, StateMap>
				>(
					"client/goPropertyDoc",
					querySegments.length ? querySegments : fullSegments
				);

				if (info) {
					// 删除多余的属性
					delete info.__WG$key;
					delete info.__WG$description;
					if (!isStateMap(info)) {
						for (const key in info) {
							if (prefix && !key.includes(prefix)) continue;
							const current = info[key] as StateMap;
							CompletionItemSuggestions.push({
								label: key,
								kind: CompletionItemKind.Constant,
								documentation: current.description,
								filterText: key,
								textEdit: {
									range: replaceRange,
									newText: key
								}
							} satisfies CompletionItem);
						}
					} else {
						if (prefix && !info.key.includes(prefix)) {
							return CompletionItemSuggestions;
						}
						CompletionItemSuggestions.push({
							label: info.key,
							kind: CompletionItemKind.Constant,
							documentation: info.description,
							filterText: info.key,
							textEdit: {
								range: replaceRange,
								newText: info.key
							}
						} satisfies CompletionItem);
					}
				}
				return CompletionItemSuggestions;
			}

			const wordMeta = getWordAtPosition(
				document,
				Position.create(_textDocumentPosition.position.line, 0)
			); // 获得当前单词

			const currentLine =
				documentTextArray[_textDocumentPosition.position.line];
			const commandType = currentLine.substring(
				0,
				currentLine.indexOf(":") !== -1
					? currentLine.indexOf(":")
					: currentLine.indexOf(";")
			);
			const isSayCommandType =
				!resourcesMap[commandType as CommandNameSpecial];

			// 资源文件路径
			if (
				token.startsWith("./") ||
				!!~token.indexOf("/") ||
				Object.keys(resourcesMap).includes(commandType) ||
				token.startsWith("-")
			) {
				const resourceBaseDir = isSayCommandType
					? "vocal"
					: resourcesMap[commandType];
				if (resourceBaseDir) {
					const dirs = await connection.sendRequest<any>(
						"client/getResourceDirectory",
						[resourceBaseDir, token]
					);
					if (dirs) {
						for (const dir of dirs) {
							CompletionItemSuggestions.push({
								label: dir.name,
								kind: dir.isDirectory
									? CompletionItemKind.Folder
									: CompletionItemKind.File
							} satisfies CompletionItem);
						}
					}
				}

				if (wordMeta && token.startsWith("-")) {
					// 如果输入的文本以关键词开头，则匹配相应的参数
					let keyData =
						WebGALKeywords[wordMeta.word as CommandNameSpecial] ??
						WebGALKeywords["say"];

					const data = [...keyData.args, ...globalArgs].map((arg) => {
						return {
							label: arg.arg,
							kind: CompletionItemKind.Constant,
							documentation: arg.desc,
							detail: arg.desc
						};
					}) as CompletionItem[];

					// 去除重复项
					const uniqueData = data.filter(
						(parentItem, index, self) =>
							index ===
							self.findIndex(
								(item) => item.label === parentItem.label
							)
					);
					CompletionItemSuggestions.push(...uniqueData);
				}
				return CompletionItemSuggestions;
			}

			// 变量
			if (token) {
				updateGlobalMap(documentTextArray);
				const currentPool = GlobalMap.setVar;
				for (const key in currentPool) {
					if (key.includes(token)) {
						const latest =
							GlobalMap.setVar[key][
								GlobalMap.setVar[key].length - 1
							];
						CompletionItemSuggestions.push({
							label: key,
							kind: CompletionItemKind.Variable,
							documentation: latest.desc
						} satisfies CompletionItem);
					}
				}
			}

			/* 新行无内容或直接输入 */
			if (
				(!wordMeta && _textDocumentPosition.position.character === 0) ||
				(token && !~currentLine.indexOf(":"))
			) {
				CompletionItemSuggestions.push(...WebgGALKeywordsCompletionMap);
			}

			// 全局变量(舞台状态)
			CompletionItemSuggestions.push(
				{
					label: "$stage",
					kind: CompletionItemKind.Variable
				},
				{
					label: "$userData",
					kind: CompletionItemKind.Variable
				}
			);
			return CompletionItemSuggestions;
		}
	);
};
