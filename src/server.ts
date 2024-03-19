/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-19 09:03:25
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
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import { Warning, message, getDiagnosticInformation } from "./config/Warnings";

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
				resolveProvider: true,
			},
			diagnosticProvider: {
				interFileDependencies: false,
				workspaceDiagnostics: false,
			},
		},
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true,
			},
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
}

const defaultSettings: ServerSettings = { maxNumberOfProblems: 1000 };
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

function getDocumentSettings(resource: string): Thenable<ServerSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: "XRWebGalLanguageServer",
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
			items: await validateTextDocument(document),
		} satisfies DocumentDiagnosticReport;
	} else {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: [],
		} satisfies DocumentDiagnosticReport;
	}
});

documents.onDidChangeContent((change) => {
	validateTextDocument(change.document);
});

async function validateTextDocument(
	textDocument: TextDocument
): Promise<Diagnostic[]> {
	const settings = await getDocumentSettings(textDocument.uri);
	const text = textDocument.getText();
	let m: RegExpExecArray | null;

	let problems = 0;
	const diagnostics: Diagnostic[] = [];
	let _sp = text.split("\n");
	for (let i in Warning) {
		const _token = Warning[i];
		const _pattern = _token.pattern as RegExp;
		if (_token.is_line) {
			continue;
		}
		while (
			(m = _pattern.exec(text)) &&
			problems < settings.maxNumberOfProblems
		) {
			problems++;
			const diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Warning,
				range: {
					start: textDocument.positionAt(m.index),
					end: textDocument.positionAt(m.index + m[0].length),
				},
				message: message(i, m[0].trim()),
				source: "WebGal Script",
			};
			if (hasDiagnosticRelatedInformationCapability) {
				diagnostic.relatedInformation = [
					{
						location: {
							uri: textDocument.uri,
							range: Object.assign({}, diagnostic.range),
						},
						message: getDiagnosticInformation(i),
					},
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
			while (
				(m = _pattern.exec(_line_text)) &&
				problems < settings.maxNumberOfProblems
			) {
				problems++;
				const _newarr = _sp.slice(0, _line_index).join();
				const diagnostic: Diagnostic = {
					severity: DiagnosticSeverity.Warning,
					range: {
						start: textDocument.positionAt(_newarr.length + 8),
						end: textDocument.positionAt(_newarr.length + m.input.length),
					},
					message: message(i, m[0].trim()),
					source: "WebGal Script",
				};
				if (hasDiagnosticRelatedInformationCapability) {
					diagnostic.relatedInformation = [
						{
							location: {
								uri: textDocument.uri,
								range: Object.assign({}, diagnostic.range),
							},
							message: getDiagnosticInformation(i),
						},
					];
				}
				diagnostics.push(diagnostic);
			}
		}
	}
	return diagnostics;
}

connection.onDidChangeWatchedFiles((_change) => {
	// connection.console.log("We received a file change event");
});

connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		return [];
	}
);

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return item;
});

documents.listen(connection);

connection.listen();