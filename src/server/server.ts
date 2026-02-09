/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-11-05 08:44:29
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	DocumentDiagnosticReportKind,
	type DocumentDiagnosticReport,
	CompletionItemKind,
	Hover,
	Position,
	MarkupKind,
	MarkupContent,
	InlayHint,
	InlayHintKind,
	DocumentLink,
	DocumentLinkParams,
	Range,
	FoldingRangeParams,
	FoldingRange,
	FoldingRangeKind,
	DefinitionLink,
	LocationLink
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import { Warning, message, getDiagnosticInformation } from "../utils/Warnings";
import {
	CommandNames,
	globalArgs,
	WebGALCommandPrefix,
	WebGALConfigCompletionMap,
	WebGALConfigMap,
	WebGALKeywords,
	WebgGALKeywordsCompletionMap
} from "../utils/provider";
import {
	findTokenRange,
	getPatternAtPosition,
	getStageCompletionContext,
	getWordAtPosition,
	updateGlobalMap
} from "./utils";

import { GlobalMap, source } from "../utils/utils_novsc";
import { ServerSettings } from "./types";
import { getTypeDirectory, resourcesMap } from "../utils/resources";
import { StateMap } from "../utils/providerState";

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false; // 是否支持配置能力
let hasWorkspaceFolderCapability = false; // 是否支持工作区文件夹能力
let hasDiagnosticRelatedInformationCapability = false; // 是否支持诊断相关信息的能力

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);
	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: {
				triggerCharacters: [".", ":", "-", "/"]
			},
			hoverProvider: true,
			diagnosticProvider: {
				interFileDependencies: false,
				workspaceDiagnostics: false
			},
			documentLinkProvider: {
				resolveProvider: true
			},
			foldingRangeProvider: true,
			definitionProvider: true
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined
		);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders((_event) => {
			connection.console.log("Workspace folder change event received.");
		});
	}

	connection.sendRequest("client/showTip", "WebGal LSP Initialized");
});

const defaultSettings = {
	maxNumberOfProblems: 1000,
	isShowWarning: true,
	isShowHint: "变量名后"
} satisfies ServerSettings;

let globalSettings: ServerSettings = defaultSettings;

const documentSettings: Map<string, Thenable<ServerSettings>> = new Map();

// 获取文档设置
function getDocumentSettings(url: string): Thenable<ServerSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(url);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: url,
			section: "WEBGAL Language Server"
		});
		documentSettings.set(url, result);
	}
	return result;
}

documents.onDidClose((e) => {
	documentSettings.delete(e.document.uri); // 关闭文档时删除设置缓存
});

// 校验内容
async function validateTextDocument(
	textDocument: TextDocument
): Promise<Diagnostic[]> {
	const settings = await getDocumentSettings(textDocument.uri);
	if (!settings?.isShowWarning) {
		return [];
	}
	const text = textDocument.getText();
	let m: RegExpExecArray | null;
	let problems = 0;
	const diagnostics: Diagnostic[] = [];
	let _sp = text.split(/\n|\t\n|\r\n/);
	for (let i in Warning) {
		const _token = Warning[i];
		const _pattern = _token.pattern as RegExp;
		if (_token.is_line) {
			continue;
		}
		if (_token.customCheck && _token.customCheck instanceof Function) {
			const _custom_res = _token.customCheck(textDocument, text);
			if (typeof _custom_res === "object" && _custom_res !== null) {
				diagnostics.push(_custom_res);
			}
			continue;
		}
		while (
			(m = _pattern.exec(text)) &&
			problems < settings.maxNumberOfProblems
		) {
			// enable
			if (_token?.enable === false) {
				continue;
			}
			// 通过
			problems++;
			const range = {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			};
			const diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Warning,
				range,
				message: message(i, m[0].trim()),
				source
			};
			if (hasDiagnosticRelatedInformationCapability) {
				diagnostic.relatedInformation = [
					{
						location: {
							uri: textDocument.uri,
							range: Object.assign({}, diagnostic.range)
						},
						message: getDiagnosticInformation(i)
					}
				];
			}
			diagnostics.push(diagnostic);
		}
	}
	for (let _line_index = 0; _line_index < _sp.length; _line_index++) {
		const _line_text = _sp[_line_index];
		for (let i in Warning) {
			const _token = Warning[i];
			const _pattern = _token.pattern as RegExp;
			if (!_token.is_line) {
				continue;
			}
			const _newarr = _sp.slice(0, _line_index).join();
			if (_token.customCheck && _token.customCheck instanceof Function) {
				const _custom_res = _token.customCheck(
					textDocument,
					_line_text,
					_newarr.length,
					_sp.slice(0, _line_index)
				);
				if (typeof _custom_res === "object" && _custom_res !== null) {
					diagnostics.push(_custom_res);
				}
				continue;
			}
			while (
				(m = _pattern.exec(_line_text)) &&
				problems < settings.maxNumberOfProblems
			) {
				// enable
				if (_token?.enable === false) {
					continue;
				}
				// 通过
				problems++;
				const range = {
					start: textDocument.positionAt(_newarr.length + 1),
					end: textDocument.positionAt(
						_newarr.length + m.input.length
					)
				};
				const diagnostic: Diagnostic = {
					severity: DiagnosticSeverity.Warning,
					range,
					message: message(i, m.input.trim()),
					source: "WebGal Script"
				};
				if (hasDiagnosticRelatedInformationCapability) {
					diagnostic.relatedInformation = [
						{
							location: {
								uri: textDocument.uri,
								range: Object.assign({}, diagnostic.range)
							},
							message: getDiagnosticInformation(i)
						}
					];
				}
				diagnostics.push(diagnostic);
			}
		}
	}
	return diagnostics;
}

connection.languages.diagnostics.on(async (params) => {
	const document = documents.get(params.textDocument.uri);
	if (document !== undefined) {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: await validateTextDocument(document)
		} satisfies DocumentDiagnosticReport;
	} else {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: []
		} satisfies DocumentDiagnosticReport;
	}
});

// 客户端配置改变通知
connection.onDidChangeConfiguration((change) => {
	if (hasConfigurationCapability) {
		// 如果支持 workspace/configuration，我们只是清空缓存，下一次请求会重新通过 getConfiguration 拉取
		documentSettings.clear();
	} else {
		// 客户端不支持 workspace/configuration，settings 值随 didChangeConfiguration 通过参数下发
		globalSettings = <ServerSettings>(
			(change.settings.XRWebGalLanguageServer || defaultSettings)
		);
	}
	connection.languages.diagnostics.refresh(); // 重新校验
});

// 补全
connection.onCompletion(
	async (
		_textDocumentPosition: TextDocumentPositionParams
	): Promise<CompletionItem[]> => {
		const document = documents.get(_textDocumentPosition.textDocument.uri);
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
			const info = await connection.sendRequest<
				StateMap | Record<string, StateMap>
			>(
				"client/goPropertyDoc",
				querySegments.length ? querySegments : fullSegments
			);

			if (info) {
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
		const isSayCommandType = !resourcesMap[commandType];

		// 资源文件路径
		if (
			token.startsWith("./") ||
			Object.keys(resourcesMap).includes(commandType) ||
			token.startsWith("-")
		) {
			const resourceBaseDir = isSayCommandType
				? "vocal"
				: resourcesMap[commandType];
			if (resourceBaseDir) {
				const dirs = await connection.sendRequest<any>(
					"client/getResourceDirectory",
					resourceBaseDir
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
					WebGALKeywords[wordMeta.word] ?? WebGALKeywords["say"];

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
						GlobalMap.setVar[key][GlobalMap.setVar[key].length - 1];
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

		return CompletionItemSuggestions;
	}
);

// 悬浮
connection.onHover(
	async (
		_textDocumentPosition: TextDocumentPositionParams
	): Promise<Hover> => {
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		if (!document) return { contents: [] };
		const file_name = document.uri;
		const text = document.getText();
		const documentTextArray = text.split("\n");
		const lineText = documentTextArray[_textDocumentPosition.position.line];
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
			if (info)
				return {
					contents: {
						kind: MarkupKind.Markdown,
						value: [
							`### ${info.key}`,
							`\`${findWordWithPattern.text}\``,
							`${info?.description}`
						].join("\n\n")
					} as MarkupContent,
					range: Range.create(
						findWordWithPattern.startPos,
						findWordWithPattern.endPos
					)
				};
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
							value: [`**${i}**`, `\n${kw_val.desc}`].join("\n")
						} as MarkupContent
					};
				}
			}
			return { contents: [] };
		}

		updateGlobalMap(documentTextArray);

		/* 指令 hover */
		for (const key in WebGALKeywords) {
			const keyData = WebGALKeywords[key as CommandNames];
			if (findWord.word === key && commandType === key) {
				return {
					contents: {
						kind: MarkupKind.Markdown,
						value: [
							`### ${key}`,
							(keyData.documentation as string)?.replace(
								/\t+/g,
								""
							) || keyData.desc,
							`${WebGALCommandPrefix}${key}`
						].join("\n\n")
					} as MarkupContent
				};
			}
		}

		updateGlobalMap(documentTextArray);

		/* 引用变量 hover */
		if (
			findWordWithPattern &&
			`{${findWord.word}}` === findWordWithPattern.text
		) {
			const current = GlobalMap.setVar[findWord.word];
			if (!current || current.length <= 0) return { contents: [] };
			const currentVariable = current[current.length - 1];
			const hoverContent = [`### ${findWord.word}`];
			if (!currentVariable) return { contents: [] };
			if (currentVariable.desc.length > 0) {
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
					`${currentVariable.input?.replace(/\t\r\n/g, "")} \`\`\``
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

// 链接定义
connection.onDocumentLinks(
	async (textDocumentLinkParams: DocumentLinkParams) => {
		const uri: string = textDocumentLinkParams.textDocument.uri;
		const doc = documents.get(uri);
		if (!doc) return [];
		const text = doc.getText();
		const documentTextArray = text.split("\n");
		const _textDocument = textDocumentLinkParams.textDocument;
		const pathArray = _textDocument.uri.split("/");
		const currentDirectory = await connection.sendRequest<string>(
			"client/currentDirectory"
		);
		let documentLinks: DocumentLink[] = [];
		for (let i = 0; i < documentTextArray.length; i++) {
			const currentLine = documentTextArray[i];
			let startText = currentLine.substring(
				0,
				currentLine.indexOf(":") !== -1
					? currentLine.indexOf(":")
					: currentLine.indexOf(";")
			);
			startText = startText.startsWith(";")
				? startText.substring(1)
				: startText; // 去除开头的分号
			let match: RegExpExecArray | null;
			const regex = /\$?\{?(\w+)\.(\w+)\}?/g;

			while ((match = regex.exec(currentLine))) {
				if (match[0].startsWith("$")) continue;
				const matchText = match[0];
				const pathName =
					pathArray[
						pathArray.length - 3 > 0
							? pathArray.length - 3
							: pathArray.length - 2
					];
				const isConfig =
					pathArray[pathArray.length - 1] === "config.txt" &&
					pathArray[pathArray.length - 2] === "game" &&
					pathName === pathArray[pathArray.length - 3];

				const command = match.input.substring(
					0,
					match.input.indexOf(":")
				);
				const dirResources = getTypeDirectory(command, matchText); // 路径类型
				let targetPath: string;
				if (isConfig) {
					targetPath = await connection.sendRequest<string>(
						"client/FJoin",
						currentDirectory + "/"
					);
				} else {
					targetPath = await connection.sendRequest<string>(
						"client/FJoin",
						currentDirectory + "/" + dirResources
					);
				}
				let basePath = await connection.sendRequest<string>(
					"client/FJoin",
					targetPath + "/" + matchText
				);

				const stat = await connection.sendRequest<string>(
					"client/FStat",
					basePath
				);
				// 如果文件找不到，则尝试全局搜索
				if (!stat) {
					basePath = await connection.sendRequest<string>(
						"client/findFile",
						[currentDirectory, matchText]
					);
				}

				documentLinks.push({
					target: "file:///" + basePath,
					range: Range.create(
						Position.create(i, match.index),
						Position.create(i, match.index + matchText.length)
					),
					tooltip: basePath
				} as DocumentLink);

				if (regex.lastIndex === match.index) {
					regex.lastIndex++;
				}
			}
		}

		return [...documentLinks];
	}
);

connection.onDocumentLinkResolve((documentLink: DocumentLink) => documentLink);

connection.onDefinition(
	async (textDocumentPosition: TextDocumentPositionParams) => {
		const uri: string = textDocumentPosition.textDocument.uri;
		const doc = documents.get(uri);
		if (!doc) return [];
		const text = doc.getText();
		const findWord = getWordAtPosition(doc, textDocumentPosition.position);
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

		const targetPool =
			commandType === "jumpLabel" ? jumpLabelMap : setVarMap;
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

// 折叠
connection.onFoldingRanges((params: FoldingRangeParams) => {
	const doc = documents.get(params.textDocument.uri);
	if (!doc) return [];

	const docText = doc.getText();
	const foldingRanges: FoldingRange[] = [];

	const regex = /label:([\s\S]*?)(?=(?:\r?\n|^)end|(?:\r?\n|^)label:|$)/g;

	let match: RegExpExecArray | null;
	while ((match = regex.exec(docText))) {
		if (match != null) {
			const startLine = doc.positionAt(match.index).line;

			// match[0] 包含了从 label: 到结束标记之前的内容
			// 这里的 match[0] 结束位置正好指向结束标记（如 label:）的前面
			const endPos = doc.positionAt(match.index + match[0].length);

			let endLine = endPos.line;

			// 如果结束标记正好在行首（character === 0），说明内容在上一行结束
			if (endPos.character === 0) {
				endLine = endPos.line - 1;
			}

			if (endLine > startLine) {
				foldingRanges.push({
					startLine: startLine,
					endLine: endLine,
					collapsedText:
						match[1].split("\n")[0].replace(/;/g, "").trim() ||
						"...",
					kind: FoldingRangeKind.Region
				});
			}
		}
	}

	return foldingRanges;
});

documents.listen(connection);

connection.listen();
