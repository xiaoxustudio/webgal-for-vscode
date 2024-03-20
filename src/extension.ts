/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-20 12:11:24
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import { workspace, ExtensionContext, languages } from "vscode";
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from "vscode-languageclient/node";
import DictionaryCompletionItemProvider from "./CompletionProvider";
import DictionaryHoverProvider from "./HoverProvider";
import XColorProvider from "./ColorProvider";
import path from "path";
import GoDocumentFormatter from "./config/Format";

const selector = { scheme: "file", language: "webgal" };
let client: LanguageClient;
export function activate(context: ExtensionContext) {
	const serverModule = context.asAbsolutePath(path.join("out", "server.js"));
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		},
	};
	const clientOptions: LanguageClientOptions = {
		documentSelector: [selector],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
		},
	};

	client = new LanguageClient(
		"XRWEBGALlanguageServer",
		"XR WEBGAL Language Server",
		serverOptions,
		clientOptions
	);
	context.subscriptions.push(
		languages.registerCompletionItemProvider(
			selector,
			new DictionaryCompletionItemProvider()
		)
	);
	context.subscriptions.push(
		languages.registerHoverProvider(selector, new DictionaryHoverProvider())
	);
	context.subscriptions.push(
		languages.registerDocumentFormattingEditProvider(
			selector,
			new GoDocumentFormatter()
		)
	);
	context.subscriptions.push(
		languages.registerColorProvider(selector, new XColorProvider())
	);
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
