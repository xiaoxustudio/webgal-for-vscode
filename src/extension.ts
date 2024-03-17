/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-17 18:26:34
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import DictionaryCompletionItemProvider from "./CompletionProvider";
import DictionaryHoverProvider from "./HoverProvider";
import XColorProvider from "./ColorProvider";


const selector = { scheme: "file", language: "webgal" };
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			selector,
			new DictionaryCompletionItemProvider()
		)
	);
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(
			selector,
			new DictionaryHoverProvider()
		)
	);
	context.subscriptions.push(
		vscode.languages.registerColorProvider(selector, new XColorProvider())
	);
}

export function deactivate() {}
