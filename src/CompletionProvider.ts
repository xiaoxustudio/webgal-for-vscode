/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-19 15:55:41
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
export const _setvar_pattern = /setVar:\s*(\w+)\s*=/g;
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
