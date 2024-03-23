/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-23 11:18:13
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	commands,
	ExtensionContext,
	languages,
	Position,
	Selection,
	TextEditorEdit,
	window,
	workspace,
} from "vscode";
import DictionaryCompletionItemProvider from "./provider/CompletionProvider";
import DictionaryHoverProvider from "./provider/HoverProvider";
import XColorProvider from "./provider/ColorProvider";
import GoDocumentFormatter from "./utils/Format";
import { get_files, selector } from "./utils/utils";
import { create_client } from "./client";
import { LanguageClient } from "vscode-languageclient/node";
import { XRDefinitionProvider } from "./provider/XRDefinitionProvider";
import { XRInlayHintsProvider } from "./provider/InlayHint";
let client: LanguageClient;
let run_Skip_Check = false;

function InitPlugin(context: ExtensionContext) {
	if (run_Skip_Check) {
		window.showInformationMessage("WebGal For Vscode 已经启动了哦！");
		return;
	}
	context.subscriptions.push(
		commands.registerCommand(
			"extension.deletePreviousCharacter",
			function (func) {
				if (func instanceof Function) {
					func();
				}
			}
		)
	);
	run_Skip_Check = true;
	client = create_client(context);
	context.subscriptions.push(
		languages.registerInlayHintsProvider(selector, new XRInlayHintsProvider())
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
		languages.registerDefinitionProvider(selector, new XRDefinitionProvider())
	);
	commands.registerCommand("extension.goToDefinition", () => {
		languages.registerDefinitionProvider(selector, new XRDefinitionProvider());
	});
	context.subscriptions.push(
		languages.registerColorProvider(selector, new XColorProvider())
	);
	client.start();
}

export function activate(context: ExtensionContext) {
	const _res = workspace.workspaceFolders?.every((val) => {
		const _Arr = get_files(val.uri.fsPath, [".txt"], false);
		for (let i of _Arr) {
			const _sub = i.split("/");
			if (_sub[_sub.length - 1] == "config.txt") {
				return true;
			}
		}
		return false;
	});
	context.subscriptions.push(
		commands.registerCommand("extension.XRStartWFV", () => {
			InitPlugin(context);
		})
	);
	if (_res) {
		InitPlugin(context);
	}
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
