/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-17 15:02:23
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";

import { dictionary } from "./config/HoverSnippet";

export function activate(context: vscode.ExtensionContext) {
	const provider = vscode.languages.registerCompletionItemProvider(
		"webgal",
		new DictionaryCompletionItemProvider()
	);
	context.subscriptions.push(provider);
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(
			{ scheme: "file", language: "webgal" },
			new DictionaryHoverProvider()
		)
	);
}
class DictionaryCompletionItemProvider
	implements vscode.CompletionItemProvider
{
	provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position
	) {
		5;
		const suggestions: vscode.CompletionItem[] = [];
		for (const keyword in dictionary.kw) {
			const description = dictionary.kw[keyword];
			const item = new vscode.CompletionItem(
				keyword,
				vscode.CompletionItemKind.Keyword
			);
			item.detail = description.desc;
			suggestions.push(item);
		}
		for (const keyword in dictionary.cmd) {
			const description = dictionary.cmd[keyword];
			const item = new vscode.CompletionItem(
				"-" + keyword,
				vscode.CompletionItemKind.Property
			);
			item.detail = description.desc;
			suggestions.push(item);
		}
		for (const keyword in dictionary.func) {
			const description = dictionary.func[keyword];
			const item = new vscode.CompletionItem(
				keyword,
				vscode.CompletionItemKind.Function
			);
			item.detail = description.desc;
			suggestions.push(item);
		}
		return suggestions;
	}
}

class DictionaryHoverProvider implements vscode.HoverProvider {
	// 实现 provideHover 方法
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		const lineText = document.lineAt(position).text;
		const pos = document.getWordRangeAtPosition(position);
		const word = document.getText(pos);
		if (pos?.start.character === 0) {
			for (let i in dictionary.kw) {
				const kw_val = dictionary.kw[i];
				if (lineText.startsWith(i)) {
					const hoverContent = new vscode.MarkdownString(`**${word}**`);
					hoverContent.isTrusted = true;
					hoverContent.supportHtml = true;
					hoverContent.appendMarkdown(`\n\n${kw_val.desc}`);
					if (kw_val.APIL) {
						const _t = kw_val.APIL.split("|");
						hoverContent.appendMarkdown(`\n\n`);
						hoverContent.appendMarkdown(`**API** : [${_t[0]}](${_t[1]})`);
					}
					const hover = new vscode.Hover(hoverContent);
					return hover;
				}
			}
		} else {
			const beforepos = new vscode.Range(
				new vscode.Position(
					pos?.start.line || 0,
					pos?.start.character! - 1 || 0
				),
				pos?.start! || 0
			);
			let _s = document.getText(beforepos);
			const _d_cmd = dictionary.cmd[word];
			if (_d_cmd && _s === "-") {
				const hoverContent = new vscode.MarkdownString(
					`**${word}** \n\n ${_d_cmd.desc}`
				);
				hoverContent.isTrusted = true;
				hoverContent.supportHtml = true;
				if (_d_cmd.APIL) {
					const _t = _d_cmd.APIL.split("|");
					hoverContent.appendMarkdown(`\n\n`);
					hoverContent.appendMarkdown(`API : [${_t[0]}](${_t[1]})`);
				}
				const hover = new vscode.Hover(hoverContent);
				return hover;
			}
		}
	}
}

export function deactivate() {}
