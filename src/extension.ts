/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-06-11 13:16:14
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	commands,
	debug,
	EvaluatableExpression,
	ExtensionContext,
	InlineValue,
	InlineValueContext,
	InlineValueVariableLookup,
	languages,
	Position,
	ProviderResult,
	Range,
	TextDocument,
	window,
	workspace
} from "vscode";
import DictionaryCompletionItemProvider from "./provider/CompletionProvider";
import DictionaryHoverProvider from "./provider/HoverProvider";
import XColorProvider from "./provider/ColorProvider";
import GoDocumentFormatter from "./utils/Format";
import { get_files, getWS, selector, selectorConfig } from "./utils/utils";
import { create_client } from "./client";
import { LanguageClient } from "vscode-languageclient/node";
import { XRDefinitionProvider } from "./provider/XRDefinitionProvider";
import { XRInlayHintsProvider } from "./provider/InlayHintProvider";
import { XRDocumentLinkProvider } from "./provider/DocumentLinkProvider";
import { XRDebugAdapterDescriptorFactory } from "./activeDebug";
import { XRDebugConfigurationProvider } from "./ws/config";
import { IDebugMessage, DebugCommand } from "./utils/utils_novsc";

let client: LanguageClient;
let run_Skip_Check = false;

function InitPlugin(context: ExtensionContext) {
	if (run_Skip_Check) {
		window.showInformationMessage("WebGal For Vscode 已经启动了哦！");
		return;
	}
	run_Skip_Check = true;
	client = create_client(context);
	context.subscriptions.push(
		languages.registerInlayHintsProvider(
			selector,
			new XRInlayHintsProvider()
		)
	);
	context.subscriptions.push(
		languages.registerCompletionItemProvider(
			selector,
			new DictionaryCompletionItemProvider()
		)
	);
	context.subscriptions.push(
		languages.registerHoverProvider(
			[selector, selectorConfig],
			new DictionaryHoverProvider()
		)
	);
	context.subscriptions.push(
		languages.registerDocumentFormattingEditProvider(
			selector,
			new GoDocumentFormatter()
		)
	);
	context.subscriptions.push(
		languages.registerDefinitionProvider(
			selector,
			new XRDefinitionProvider()
		)
	);
	context.subscriptions.push(
		languages.registerDocumentLinkProvider(
			[selector, selectorConfig],
			new XRDocumentLinkProvider()
		)
	);
	context.subscriptions.push(
		debug.registerDebugConfigurationProvider(
			selector.language,
			new XRDebugConfigurationProvider()
		)
	);
	context.subscriptions.push(
		languages.registerColorProvider(selector, new XColorProvider())
	);
	context.subscriptions.push(
		debug.registerDebugAdapterDescriptorFactory(
			"webgal",
			new XRDebugAdapterDescriptorFactory()
		)
	);

	commands.registerCommand("extension.goToDefinition", () => {
		languages.registerDefinitionProvider(
			selector,
			new XRDefinitionProvider()
		);
	});
	commands.registerCommand("extension.deletePreviousCharacter", (func) => {
		if (func instanceof Function) {
			func();
		}
	});
	commands.registerCommand("extension.RunLineScript", function () {
		const _ws = getWS();
		if (_ws && _ws._readyState === 1) {
			const active = window.activeTextEditor;
			if (active) {
				const scene_name = active.document.fileName.substring(
					active.document.fileName.lastIndexOf("\\") + 1
				);
				const line_number = active.selection.start.line;
				const msg: IDebugMessage = {
					event: "message",
					data: {
						command: DebugCommand.JUMP,
						sceneMsg: {
							scene: scene_name,
							sentence: line_number + 1
						}, // @ts-ignore
						stageSyncMsg: {},
						message: "徐然"
					}
				};
				_ws.send(JSON.stringify(msg));
			}
		} else {
			window.showErrorMessage("请先打开调试");
		}
	});
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
