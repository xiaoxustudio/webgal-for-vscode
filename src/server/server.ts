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
	MarkupContent
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
	WebGALKeywordsKeys
} from "../utils/provider";
import {
	findTokenRange,
	getPatternAtPosition,
	getWordAtPosition
} from "./utils";
import { IVToken, VList } from "../utils/utils";
import {
	getVariableType,
	getVariableTypeDesc,
	setGlobalVar
} from "../utils/utils_novsc";

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

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
				resolveProvider: true
			},
			hoverProvider: true,
			diagnosticProvider: {
				interFileDependencies: false,
				workspaceDiagnostics: false
			}
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
});

interface ServerSettings {
	maxNumberOfProblems: number;
	isShowWarning: boolean; // 是否显示警告
	isShowHint: "关闭" | "最前面" | "变量名前" | "变量名后" | "最后面";
}

const defaultSettings = {
	maxNumberOfProblems: 1000,
	isShowWarning: true,
	isShowHint: "变量名后"
} satisfies ServerSettings;
let globalSettings: ServerSettings = defaultSettings;

const documentSettings: Map<string, Thenable<ServerSettings>> = new Map();

connection.onDidChangeConfiguration((change) => {
	if (hasConfigurationCapability) {
		documentSettings.clear();
	} else {
		globalSettings = <ServerSettings>(
			(change.settings.XRWebGalLanguageServer || defaultSettings)
		);
	}
	connection.languages.diagnostics.refresh();
});

connection.onDidChangeTextDocument((change) => {});

function getDocumentSettings(resource: string): Thenable<ServerSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: "XRWebGalLanguageServer"
		});
		documentSettings.set(resource, result);
	}
	return result;
}

documents.onDidClose((e) => {
	documentSettings.delete(e.document.uri);
});

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

documents.onDidChangeContent((change) => {
	validateTextDocument(change.document);
});

// 警告
async function validateTextDocument(
	textDocument: TextDocument
): Promise<Diagnostic[]> {
	const settings = await getDocumentSettings(textDocument.uri);
	if (!settings.isShowWarning) {
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

connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		if (!document) return [];
		const file_name = document.uri;
		const { token } = findTokenRange(
			document,
			_textDocumentPosition.position
		);
		const CompletionItemSuggestions = [];
		const wordMeta = getWordAtPosition(
			document,
			Position.create(_textDocumentPosition.position.line, 0)
		); // 获得当前单词

		console.log(token, wordMeta);

		if (!wordMeta) return [];

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

		/* 场景文件 */
		for (const key in WebGALKeywords) {
			const keyData = WebGALKeywords[key as CommandNames];
			// 如果输入的文本以关键词开头，则匹配相应的参数
			if (token.startsWith("-") && wordMeta.word === key) {
				const data = [...keyData.args, ...globalArgs].map((arg) => {
					return {
						label: arg.arg,
						kind: CompletionItemKind.Constant,
						documentation: arg.desc,
						detail: arg.desc
					};
				}) as CompletionItem[];
				return data.filter((item, index, self) => {
					return (
						self.findIndex((t) => t.label === item.label) === index
					);
				});
			}
		}

		if (
			token.startsWith("./") ||
			token.startsWith("../") ||
			token.startsWith("/") ||
			token.startsWith("~") ||
			token.includes("/")
		) {
			// 路径
		}

		// 尝试提取
		CompletionItemSuggestions.push(
			...WebGALKeywordsKeys.map(
				(v) =>
					({
						label: WebGALKeywords[v]?.label || v,
						kind:
							WebGALKeywords[v]?.kind ||
							CompletionItemKind.Keyword,
						documentation: {
							kind: MarkupKind.Markdown,
							value:
								(
									WebGALKeywords[v].documentation as string
								)?.replace(/\t+/g, "") || WebGALKeywords[v].desc
						} as MarkupContent,
						detail:
							WebGALKeywords[v]?.detail || WebGALKeywords[v].desc
					}) satisfies CompletionItem
			)
		);
		return CompletionItemSuggestions;
	}
);

connection.onCompletionResolve((item: CompletionItem): CompletionItem => item);

connection.onHover(
	(_textDocumentPosition: TextDocumentPositionParams): Hover => {
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		if (!document) return { contents: [] };
		const file_name = document.uri;
		const documentTextArray = document.getText().split("\n");
		const lineText = documentTextArray[_textDocumentPosition.position.line];
		const findWord = getWordAtPosition(
			document,
			_textDocumentPosition.position
		);
		const findWordWithPattern = getPatternAtPosition(
			document,
			_textDocumentPosition.position,
			/\{(\w+)\}/
		);

		if (!findWord) return { contents: [] };
		// 配置文件 hover
		if (file_name.endsWith("/game/config.txt")) {
			for (const i in WebGALConfigMap) {
				const kw_val = WebGALConfigMap[i];
				if (lineText.startsWith(i)) {
					let hoverContent = `**${findWord.word}**`;
					hoverContent += `\n\n${kw_val.desc}`;
					hoverContent += ` \n <hr>  `;
					return {
						contents: {
							kind: MarkupKind.Markdown,
							value: hoverContent
						} as MarkupContent
					};
				}
			}
			return { contents: [] };
		}

		// 生成全局映射表
		const GlobalVariables: VList = {}; // 全局变量
		for (let index = 0; index < documentTextArray.length; index++) {
			const currentLine = documentTextArray[index];
			const matches = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(
				currentLine
			);
			if (matches) {
				const [, d_word, d_value] = matches;
				GlobalVariables[d_word] = {
					word: d_word,
					value: d_value,
					input: matches.input,
					position: Position.create(index, 0),
					type: getVariableType(d_value)
				} as IVToken;
				if (
					GlobalVariables[d_word] &&
					GlobalVariables[d_word]?.position
				) {
					const _v_pos = GlobalVariables[d_word].position;
					const _v_line = _v_pos?.line ? _v_pos.line : -1;
					GlobalVariables[d_word].desc = getVariableTypeDesc(
						documentTextArray,
						_v_line
					);
				}
			}
		}
		setGlobalVar(GlobalVariables);

		/* 指令 hover */
		const wordMeta = getWordAtPosition(
			document,
			_textDocumentPosition.position
		); // 获得当前单词
		if (!wordMeta) return { contents: [] };
		for (const key in WebGALKeywords) {
			const keyData = WebGALKeywords[key as CommandNames];
			// 如果输入的文本以关键词开头，则匹配相应的参数
			if (wordMeta.word.startsWith(key)) {
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
						].join("\n")
					} as MarkupContent
				};
			}
		}

		/* 引用变量 hover */
		if (!findWordWithPattern) return { contents: [] };
		if (`{${findWord.word}}` === findWordWithPattern.text) {
			let hoverContent = `### 变量 **${findWord.word}** `;
			const currentVariable = GlobalVariables[findWord.word];
			if (currentVariable.desc.length > 0) {
				hoverContent += ` \n <hr>  `;
				hoverContent += ` \n\n ${currentVariable.desc} `;
			}
			hoverContent += ` \n <hr>  `;
			if (findWord.word in GlobalVariables) {
				hoverContent += `\n\n\n  类型 : \`${currentVariable.type}\`  `;
				hoverContent += `\n\n 位置 : 位于第${currentVariable.position?.line}行`;
			} else {
				hoverContent += ` \n 未定义变量`;
			}
			return {
				contents: {
					kind: MarkupKind.Markdown,
					value: hoverContent
				} as MarkupContent
			};
		}
		return { contents: [] };
	}
);

documents.listen(connection);

connection.listen();
