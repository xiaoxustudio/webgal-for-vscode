import {
	Hover,
	MarkupContent,
	MarkupKind,
	Range,
	TextDocumentPositionParams
} from "vscode-languageserver";
import {
	argsMap,
	WebGALConfigMap,
	WebGALKeywords,
	CommandNameSpecial,
	WebGALCommandPrefix
} from "../../utils/provider";
import { StateMap } from "../../utils/providerState";
import { GlobalMap } from "../../utils/utils_novsc";
import { ConnectionHandler } from "../types";
import {
	getPatternAtPosition,
	getWordAtPosition,
	updateGlobalMap
} from "../utils";

// 悬浮
export default <ConnectionHandler>function (documents, connection) {
	connection.onHover(
		async (
			_textDocumentPosition: TextDocumentPositionParams
		): Promise<Hover> => {
			const document = documents.get(
				_textDocumentPosition.textDocument.uri
			);
			if (!document) return { contents: [] };
			const file_name = document.uri;
			const text = document.getText();
			const documentTextArray = text.split("\n");
			const currentLine =
				documentTextArray[_textDocumentPosition.position.line];

			const commandType = currentLine.substring(
				0,
				currentLine.indexOf(":") !== -1
					? currentLine.indexOf(":")
					: currentLine.indexOf(";")
			);

			let findWordWithPattern = getPatternAtPosition(
				document,
				_textDocumentPosition.position,
				/\{([^}]*)\}/
			);

			/* 参数 hover */
			findWordWithPattern = getPatternAtPosition(
				document,
				_textDocumentPosition.position,
				/(?<=-)[\w]+/
			);
			if (findWordWithPattern) {
				const argsData = argsMap[findWordWithPattern.text];
				if (argsData) {
					return {
						contents: {
							kind: MarkupKind.Markdown,
							value: [
								`### ${argsData.label}`,
								`${argsData?.documentation}`,
								`\`${argsData.detail}\``
							].join("\n\n")
						} as MarkupContent,
						range: Range.create(
							findWordWithPattern.startPos,
							findWordWithPattern.endPos
						)
					};
				}
			}

			/* 舞台状态 */
			findWordWithPattern = getPatternAtPosition(
				document,
				_textDocumentPosition.position,
				/\$(stage|userData)((?:\.[\w-]+)+|\b)/
			);
			if (findWordWithPattern) {
				const strArray = findWordWithPattern.text.slice(1).split(".");
				const info = await connection.sendRequest<StateMap>(
					"client/goPropertyDoc",
					strArray
				);
				if (info) {
					return {
						contents: {
							kind: MarkupKind.Markdown,
							value: [
								`### ${info.key ?? findWordWithPattern.text}`,
								`\`${info.__WG$key ?? info.type?.key ?? ""}\``,
								`${info?.description ?? info.__WG$description}`
							].join("\n\n")
						} as MarkupContent,
						range: Range.create(
							findWordWithPattern.startPos,
							findWordWithPattern.endPos
						)
					};
				}
			}

			const findWord = getWordAtPosition(
				document,
				_textDocumentPosition.position
			);

			if (!findWord) return { contents: [] };
			// 配置文件 hover
			if (file_name.endsWith("/game/config.txt")) {
				for (const i in WebGALConfigMap) {
					const kw_val = WebGALConfigMap[i];
					if (findWord.word === i) {
						return {
							contents: {
								kind: MarkupKind.Markdown,
								value: [`**${i}**`, `\n${kw_val.desc}`].join(
									"\n"
								)
							} as MarkupContent
						};
					}
				}
				return { contents: [] };
			}

			/* 指令 hover */
			const maybeCommandMap =
				WebGALKeywords[commandType as CommandNameSpecial];
			if (maybeCommandMap) {
				for (const key in WebGALKeywords) {
					if (findWord.word === key && commandType === key) {
						return {
							contents: {
								kind: MarkupKind.Markdown,
								value: [
									`### ${key}`,
									(
										maybeCommandMap.documentation as string
									)?.replace(/\t+/g, "") ||
										maybeCommandMap.desc,
									`${WebGALCommandPrefix}${key}`
								].join("\n\n")
							} as MarkupContent
						};
					}
				}
			}

			updateGlobalMap(documentTextArray);

			/* 引用变量 hover */
			if (findWord && `{${findWord.word}}` !== "{}") {
				const current = GlobalMap.setVar[findWord.word];
				if (!current || current.length <= 0) return { contents: [] };
				const currentVariable = current[current.length - 1]; // 取最后一个变量用作hover
				const hoverContent = [`### ${findWord.word}`];
				if (!currentVariable) return { contents: [] };
				if (currentVariable.desc && currentVariable.desc.length > 0) {
					hoverContent.push("<hr>");
					hoverContent.push(currentVariable.desc);
				}
				hoverContent.push("<hr>");
				if (findWord.word in GlobalMap.setVar) {
					hoverContent.push(
						`Position: ${currentVariable.position?.line + 1},${currentVariable.position?.character + 1}`
					);
					hoverContent.push(`\`\`\`webgal`);
					hoverContent.push(
						`${currentVariable.input?.replace(/\t\r\n/g, "")}\n\n\`\`\``
					);
				}
				return {
					contents: {
						kind: MarkupKind.Markdown,
						value: hoverContent.join("\n\n")
					} as MarkupContent
				};
			}

			return { contents: [] };
		}
	);
};
