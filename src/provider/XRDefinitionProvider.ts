/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-06-30 17:03:14
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import {
	CancellationToken,
	DefinitionProvider,
	Position,
	TextDocument
} from "vscode";
import { getVariableType } from "../utils/utils_novsc";
import { IVToken } from "../utils/utils";

export class XRDefinitionProvider implements DefinitionProvider {
	provideDefinition(
		document: TextDocument,
		position: Position,
		token: CancellationToken
	) {
		let _result: vscode.DefinitionLink[] = [];
		if (token.isCancellationRequested) return _result;
		const _Var_list: IVToken[] = [];
		const _Label_list: IVToken[] = [];
		const ALL_ARR = document.getText().split("\n");
		const _ALL_ARR_cache = [];
		for (let _d_index = 0; _d_index < ALL_ARR.length; _d_index++) {
			const _data = ALL_ARR[_d_index];
			let m = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(_data);
			let m1 = /label:(\S+);/g.exec(_data);
			if (m) {
				_Var_list.push({
					word: m[1],
					value: m[2],
					input: m.input,
					position: position.with(_d_index, 7),
					type: getVariableType(m[2])
				} as IVToken);
			} else if (m1) {
				_Label_list.push({
					word: m1[1],
					input: m1.input,
					position: position.with(_d_index, 6),
					desc: m1.input.substring(0, m1.input.indexOf(":"))
				} as IVToken);
			} else {
				_ALL_ARR_cache.push(_data);
			}
		}
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const position_select = editor.selection.active;
			const wordRange =
				editor.document.getWordRangeAtPosition(position_select);
			if (wordRange) {
				const _range = wordRange.with(
					wordRange.start.with(
						wordRange.start.line,
						wordRange.start.character - 1 > 0
							? wordRange.start.character - 1
							: wordRange.start.character
					),
					wordRange.end.with(
						wordRange.end.line,
						wordRange.end.character + 1
					)
				);
				const _range_label = editor.document.getWordRangeAtPosition(
					wordRange.start.with(
						wordRange.start.line,
						wordRange.start.character - 1 > 0
							? wordRange.start.character - 1
							: wordRange.start.character
					)
				);
				const _start_text = editor.document.getText(_range_label);
				const word = editor.document.getText(_range);
				const _length = word.length;
				const _word_no = word.substring(
					word.indexOf("{") + 1,
					_length - 1
				);
				const _word_no_1 = word.substring(
					word.indexOf(":") + 1,
					_length - 1
				);
				const _res = _Var_list.filter((val) => val.word === _word_no);
				const _res1 = _Label_list.filter(
					(val) => val.word === _word_no_1
				);
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
							)
						} as vscode.DefinitionLink);
					}
				} else if (
					_res1.every((val) => val.word === _word_no_1) &&
					_start_text === "jumpLabel"
				) {
					for (let _data of _res1) {
						_result.push({
							targetUri: document.uri,
							targetRange: wordRange.with(
								_data.position,
								_data.position?.with(
									_data.position?.line,
									_data.input?.indexOf(":")
								)
							)
						} as vscode.DefinitionLink);
					}
				}
			}
		}
		return _result;
	}
}
