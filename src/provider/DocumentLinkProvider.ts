import { accessSync, constants } from "fs";
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
			const _line_start_text = lines[i].substring(
				0,
				lines[i].indexOf(":") !== -1
					? lines[i].indexOf(":")
					: lines[i].indexOf(";")
			);
			const _word_text = lines[i].substring(
				lines[i].indexOf(":") !== -1
					? lines[i].indexOf(":") + 1
					: lines[i].indexOf(";") - 1,
				lines[i].indexOf(";") !== -1 ? lines[i].indexOf(";") : lines[i].length
			);
			const match = _word_text.match(/(.[^;\s]+)\.(.[^;\s]+)/);
			if (match) {
				const _sp = editor.document.uri.fsPath.split("\\");
				const _w_dir =
					_sp[_sp.length - 3 > 0 ? _sp.length - 3 : _sp.length - 2];
				const dir_res = get_res_dir(ResType_Map[_line_start_text]);
				const _need_find_dir =
					currentDirectory +
						(_w_dir == "game" && !currentDirectory.endsWith("game")
							? "\\game"
							: "") +
						"\\" +
						dir_res ?? "";
				try {
					accessSync(_need_find_dir, constants.R_OK);
					const _base_sp = _need_find_dir + "\\" + _word_text;
					const start = new Position(
						i,
						_line_start_text.length + 1 + (match.index ?? 0)
					);
					const end = new Position(
						i,
						_line_start_text.length + 1 + (match.index ?? 0) + match[0].length
					);
					const r = new Range(start, end);
					let uri = document.uri.with({ path: _base_sp });
					if (uri instanceof vscode.Uri) {
						let link = {
							target: uri,
							range: r,
						} as DocumentLink;
                        link.tooltip = _base_sp
						_result.push(link);
					}
				} catch {}
			}
		}
		return _result;
	}
}
