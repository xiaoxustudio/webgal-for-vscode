/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-22 13:04:03
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import {
	CancellationToken,
	Definition,
	DefinitionProvider,
	Position,
	TextDocument,
} from "vscode";
import { _find_variable_type, _VToken } from "./HoverProvider";

export class XRDefinitionProvider implements DefinitionProvider {
	provideDefinition(
		document: TextDocument,
		position: Position,
		token: CancellationToken
	) {
		const _arr: { [key: string]: _VToken } = {};
		const ALL_ARR = document.getText().split("\n");
		const _ALL_ARR_cache = [];
		const _arrType = [];
		for (let _d_index = 0; _d_index < ALL_ARR.length; _d_index++) {
			const _data = ALL_ARR[_d_index];
			let m = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(_data);
			if (m) {
				_arr[m[1]] = {
					word: m[1],
					input: m.input,
					position: position.with(_d_index, 7),
				} as _VToken;
				_arrType.push(_find_variable_type(m.input, m[1], _arr));
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
				// 判断是否是有效word
				if (/{\S+}/.test(word) && _arr[_word_no]) {
					return [
						{
							uri: document.uri,
							range: wordRange.with(
								_arr[_word_no].position,
								_arr[_word_no].position?.with(
									_arr[_word_no].position?.line,
									_arr[_word_no].input?.indexOf("=")
								)
							),
						},
					] as Definition;
				}
			}
		}
	}
}
