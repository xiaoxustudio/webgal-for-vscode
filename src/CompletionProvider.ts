/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-19 09:18:21
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { dictionary } from "./config/HoverSnippet";
const _setvar_pattern = /setVar:\s*(\w+)\s*=/g;
export default class DictionaryCompletionItemProvider
	implements vscode.CompletionItemProvider
{
	provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position
	) {
		const _start = new vscode.Position(position.line, position.character - 1);
		const _range = new vscode.Range(_start, position);
		const line = document.lineAt(position.line).text;
		const BeforeText = document.getText(_range);
		const AllText = document.getText();
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
		const _arr = [];
		let m;
		while ((m = _setvar_pattern.exec(AllText))) {
			_arr.push(m[1]);
		}
		if (line.includes("{")) {
			for (const keyword of _arr) {
				const item = new vscode.CompletionItem(
					keyword,
					vscode.CompletionItemKind.Variable
				);
				suggestions.push(item);
			}
		}
		return suggestions;
	}
}
