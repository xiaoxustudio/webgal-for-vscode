/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-06-12 15:40:22
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	CancellationToken,
	DocumentLink,
	DocumentLinkProvider,
	Position,
	ProviderResult,
	Range,
	TextDocument,
} from "vscode";
import { get_res_dir, ResType_Map } from "../utils/CompletionResources";
import { currentDirectory } from "../utils/utils";
import * as vscode from "vscode";
import { existsSync } from "fs";
import path from "path";

export class XRDocumentLinkProvider implements DocumentLinkProvider {
	provideDocumentLinks(
		document: TextDocument,
		token: CancellationToken
	): ProviderResult<DocumentLink[]> {
		let _result: DocumentLink[] = [];
		const editor = vscode.window.activeTextEditor;
		if (!editor) return _result;
		let lines = document.getText().split("\n");
		for (let i = 0; i < lines.length; i++) {
			let _lines = lines[i];
			let _start_text = _lines.substring(
				0,
				_lines.indexOf(":") !== -1 ? _lines.indexOf(":") : _lines.indexOf(";")
			);
			_start_text = _start_text.startsWith(";")
				? _start_text.substring(1)
				: _start_text;
			let match;
			const regex =
				/[^:-\s]+?([^-;\s:<>/\\\|\?\*\"\']+)\.([^-;\s:<>/\\\|\?\*\"\']+)/g;
			while ((match = regex.exec(_lines))) {
				const _match_text = match[0];
				const _sp = editor.document.uri.fsPath.split("\\");
				const _w_dir =
					_sp[_sp.length - 3 > 0 ? _sp.length - 3 : _sp.length - 2];
				const is_config =
					_sp[_sp.length - 1] === "config.txt" &&
					_sp[_sp.length - 2] === "game" &&
					_w_dir === _sp[_sp.length - 3];
				const _prev_word = _lines[match.index - 1];
				const dir_res =
					get_res_dir(ResType_Map[_start_text]) ||
					(_prev_word == "-" ? get_res_dir(ResType_Map["playEffect"]) : "");
				let _need_find_dir;
				if (is_config) {
					_need_find_dir =
						currentDirectory +
						"\\game\\" +
						(dir_res ? dir_res : _match_text.endsWith(".txt") ? "scene" : "");
				} else {
					_need_find_dir =
						currentDirectory +
						(_w_dir == "game" && !currentDirectory.endsWith("game")
							? "\\game"
							: "") +
						"\\" +
						(dir_res ? dir_res : _match_text.endsWith(".txt") ? "scene" : "");
				}
				const _base_sp = path.join(
					_need_find_dir.endsWith("\\")
						? _need_find_dir + _match_text
						: _need_find_dir + "\\" + _match_text
				);
				const start = new Position(i, match.index);
				const end = new Position(i, match.index + _match_text.length);
				const r = new Range(start, end);
				let uri = (() => {
					if (existsSync(_base_sp))
						return document.uri.with({ path: _base_sp });
				})();
				let link;
				if (uri instanceof vscode.Uri) {
					link = {
						target: uri,
						range: r,
					} as DocumentLink;
					link.tooltip = _base_sp;
				} else {
					link = {
						range: r,
					} as DocumentLink;
					link.tooltip = "未识别到文件：" + _base_sp;
				}
				_result.push(link);
				if (regex.lastIndex === match.index) {
					regex.lastIndex++;
				}
			}
		}
		return _result;
	}
}
