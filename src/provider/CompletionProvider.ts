/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-22 20:51:27
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { currentDirectory, get_files, selector } from "../utils/utils";
import { resources_map } from "../utils/CompletionResources";
import { accessSync, constants } from "node:fs";
import { CancellationToken } from "vscode-languageclient";
export const _setvar_pattern = /setVar:\s*(\w+)\s*=/g;
export default class DictionaryCompletionItemProvider
	implements vscode.CompletionItemProvider
{
	provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: CancellationToken,
		context: vscode.CompletionContext
	) {
		const _start = new vscode.Position(
			position.line,
			position.character - 2 > 0
				? position.character - 2
				: position.character - 1
		);
		const _end = new vscode.Position(
			position.line,
			position.character - 1 > 0 ? position.character - 1 : position.character
		);
		const _range = new vscode.Range(_start, _end);
		const line = document.lineAt(position.line).text;
		const BeforeText = document.getText(_range);
		const B_BeforeText = document.getText(
			document.getWordRangeAtPosition(_start)
		);
		const AllText = document.getText();
		const suggestions: vscode.CompletionItem[] = [];
		const _arr = [];
		let m;
		while ((m = _setvar_pattern.exec(AllText))) {
			_arr.push(m[1]);
		}
		if (line.includes("{") && BeforeText !== "$") {
			for (const keyword of _arr) {
				const item = new vscode.CompletionItem(
					keyword,
					vscode.CompletionItemKind.Variable
				);
				suggestions.push(item);
			}
		} else if (
			BeforeText === "$" &&
			Object.keys(resources_map).includes(B_BeforeText) &&
			vscode.window.activeTextEditor
		) {
			const _sp =
				vscode.window.activeTextEditor.document.uri.fsPath.split("\\");
			const _w_dir = _sp[_sp.length - 3 > 0 ? _sp.length - 3 : _sp.length - 2];
			const _need_find_dir =
				currentDirectory +
				(_w_dir == "game" && !currentDirectory.endsWith("game")
					? "\\game"
					: "") +
				"\\" +
				B_BeforeText;
			try {
				accessSync(_need_find_dir, constants.R_OK);
				const _resources = get_files(
					_need_find_dir,
					resources_map[B_BeforeText],
					false
				);
				for (const _file_path of _resources) {
					const _base_sp = _file_path.split("/");
					const _base_name = _file_path.substring(
						_file_path.lastIndexOf("/") + 1
					);
					if (_base_name) {
						const item = new vscode.CompletionItem(
							_base_name,
							vscode.CompletionItemKind.File
						);
						item.insertText = _base_name;
						const mk = new vscode.MarkdownString();
						mk.value =
							`**父级目录：${_base_sp[_base_sp.length - 2]}**\n\n` +
							"路径：" +
							_file_path;
						item.documentation = mk;
						suggestions.push(item);
					}
				}
			} catch {}
		}
		return suggestions;
	}
	resolveCompletionItem(item: vscode.CompletionItem, token: CancellationToken) {
		const _activeEditor = vscode.window.activeTextEditor;
		const docment = _activeEditor?.document;
		const _select = _activeEditor?.selection;
		if (docment && _select && _activeEditor) {
			const _range = docment.getWordRangeAtPosition(
				_select.start.with(
					_select.start.line,
					_select.start.character - 2 > 0
						? _select.start.character - 2
						: _select.start.character - 1
				)
			);
			if (_range) {
				const _r = _range.with(
					_range.start,
					_range.end.with(_range.end.line, _range.end.character + 1)
				);
				let command = {};
				item.command = {
					command: "extension.deletePreviousCharacter",
					title: "Delete Previous Character",
					arguments: [
						() => {
							_activeEditor.edit(
								(_edit: vscode.TextEditorEdit) => {
									return _edit.delete(_r);
								},
								{ undoStopAfter: false, undoStopBefore: false }
							);
						},
					],
				} as vscode.Command;
			}
		}
		return item;
	}
}
