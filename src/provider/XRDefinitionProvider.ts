/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-24 12:48:41
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import {
	CancellationToken,
	DefinitionProvider,
	Position,
	TextDocument,
} from "vscode";
import { _VToken } from "./HoverProvider";
import { get_var_type } from "../utils/utils_novsc";

export class XRDefinitionProvider implements DefinitionProvider {
	provideDefinition(
		document: TextDocument,
		position: Position,
		token: CancellationToken
	) {
		let _result: vscode.DefinitionLink[] = [];
		const _Var_list: _VToken[] = [];
		const ALL_ARR = document.getText().split("\n");
		const _ALL_ARR_cache = [];
		for (let _d_index = 0; _d_index < ALL_ARR.length; _d_index++) {
			const _data = ALL_ARR[_d_index];
			let m = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(_data);
			if (m) {
				_Var_list.push({
					word: m[1],
					input: m.input,
					position: position.with(_d_index, 7),
					type: get_var_type(m[2]),
				} as _VToken);
			} else {
				_ALL_ARR_cache.push(_data);
			}
		}
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const position_select = editor.selection.active;
			const wordRange = editor.document.getWordRangeAtPosition(position_select);
			if (wordRange) {
				const _range = wordRange.with(
					wordRange.start.with(
						wordRange.start.line,
						wordRange.start.character - 1 > 0
							? wordRange.start.character - 1
							: wordRange.start.character
					),
					wordRange.end.with(wordRange.end.line, wordRange.end.character + 1)
				);
				const word = editor.document.getText(_range);
				const _length = word.length;
				const _word_no = word.substring(word.indexOf("{") + 1, _length - 1);
				const _res = _Var_list.filter((val) => val.word === _word_no);
				// 判断是否是有效word
				if (/{\S+}/.test(word) && _res.length > 0) {
					// 取出所有word变量
					for (let _data of _res) {
						_result.push({
							targetUri: document.uri,
							targetRange: wordRange.with(
								_data.position,
								_data.position?.with(
									_data.position?.line,
									_data.input?.indexOf("=")
								)
							),
						} as vscode.DefinitionLink);
					}
				}
			}
		}
		return _result;
	}
}
