/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-20 22:51:18
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import { commands, ExtensionContext, languages } from "vscode";
import DictionaryCompletionItemProvider from "./provider/CompletionProvider";
import DictionaryHoverProvider from "./provider/HoverProvider";
import XColorProvider from "./provider/ColorProvider";
import GoDocumentFormatter from "./utils/Format";
import { selector } from "./utils/utils";
import { create_client } from "./client";
import { LanguageClient } from "vscode-languageclient/node";
import { XRDefinitionProvider } from "./provider/XRDefinitionProvider";

let client: LanguageClient;
export function activate(context: ExtensionContext) {
	client = create_client(context);
	client.start();
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
		languages.registerDefinitionProvider(selector, new XRDefinitionProvider())
	);
	commands.registerCommand("extension.goToDefinition", () => {
		languages.registerDefinitionProvider(selector, new XRDefinitionProvider());
	});
	context.subscriptions.push(
		languages.registerColorProvider(selector, new XColorProvider())
	);
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
