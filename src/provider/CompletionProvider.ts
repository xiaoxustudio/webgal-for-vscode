/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-06-30 17:42:00
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { _VToken, currentDirectory, get_files, VList } from "../utils/utils";
import { resources_map } from "../utils/CompletionResources";
import { accessSync, constants } from "node:fs";
import { CancellationToken } from "vscode-languageclient";
import { get_desc_variable, get_var_type } from "../utils/utils_novsc";
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
		const _arr: VList = {};
		const ALL_ARR = AllText.split("\n");
		for (let _d_index = 0; _d_index < ALL_ARR.length; _d_index++) {
			const _data = ALL_ARR[_d_index];
			let _exec_cache = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(_data);
			if (_exec_cache) {
				const _one_exec = _exec_cache[1];
				_arr[_one_exec] = {
					word: _one_exec,
					value: _exec_cache[2],
					input: _exec_cache.input,
					position: position.with(_d_index + 1, 5),
					type: get_var_type(_exec_cache[2]),
				} as _VToken;
				if (
					_arr[_one_exec] &&
					_arr[_one_exec]?.position &&
					_arr[_one_exec].position instanceof vscode.Position
				) {
					const _v_pos = _arr[_one_exec].position;
					const _v_line = _v_pos?.line ? _v_pos.line : -1;
					_arr[_one_exec].desc = get_desc_variable(ALL_ARR, _v_line);
				}
			}
		}
		if (line.includes("{") && BeforeText !== "$") {
			const _arr_cache = [...new Set(Object.keys(_arr))];
			for (const keyword of _arr_cache) {
				const item = new vscode.CompletionItem(
					keyword,
					vscode.CompletionItemKind.Variable
				);
				item.documentation = new vscode.MarkdownString(_arr[keyword].desc);
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
