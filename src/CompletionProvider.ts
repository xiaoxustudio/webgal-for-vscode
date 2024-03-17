/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-17 18:25:17
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { dictionary } from "./config/HoverSnippet";
export default class DictionaryCompletionItemProvider
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
