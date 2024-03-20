/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-20 22:59:51
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { dictionary } from "./config/HoverSnippet";
import { _setvar_pattern } from "./CompletionProvider";

export interface _VToken {
	word: string;
	type?: string;
	is_global?: boolean;
	position?: vscode.Position;
	input?: string;
}
export function _find_variable_type(sources: string, _w: string, _arr: any) {
	let _find = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(sources);
	if (!_find || _find[1].trim() !== _w.trim()) {
		_arr[_w].type = "未知";
		return;
	}
	const _is_global = _find[2].indexOf("-global") !== -1 ? true : false;
	let _val;
	if (_is_global) {
		_val = _find[2].substring(
			_find[2].indexOf("="),
			_find[2].lastIndexOf(" -")
		);
	} else {
		_val = _find[2].substring(_find[2].indexOf("="), _find[2].lastIndexOf(";"));
	}
	try {
		const __val_real = new Function("return " + _val)();
		switch (typeof __val_real) {
			case "number":
				_arr[_w].type = "数字";
				break;
			case "boolean":
				_arr[_w].type = "布尔值";
				break;
			default:
				_arr[_w].type = "字符串";
				break;
		}
	} catch {
		if (typeof new Function(`return '${_val}'`)() === "string") {
			_arr[_w].type = "字符串";
		} else {
			_arr[_w].type = "未知";
		}
	}
	return;
}
export default class DictionaryHoverProvider implements vscode.HoverProvider {
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		const lineText = document.lineAt(position).text;
		const pos = document.getWordRangeAtPosition(position);
		const _arr: { [key: string]: _VToken } = {};
		const _arrType = [];
		let m;
		const ALL_ARR = document.getText().split("\n");
		for (let _d_index = 0; _d_index < ALL_ARR.length; _d_index++) {
			const _data = ALL_ARR[_d_index];
			let m = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(_data);
			if (m) {
				_arr[m[1]] = {
					word: m[1],
					input: m.input,
					position: position.with(_d_index + 1, 5),
				} as _VToken;
				_arrType.push(_find_variable_type(m.input, m[1], _arr));
			}
		}
		// 获取上下文全部变量
		const word = document.getText(pos);
		const _new_pos = document.positionAt(document.offsetAt(position) + 1);
		const pos_func = document.getWordRangeAtPosition(_new_pos, /:\S+\(\)/g);
		const _text = document.getText(pos_func).replace(/^:/, "");
		const _var_test = document.getWordRangeAtPosition(position, /{(\w+)}/);
		const _var_test_text = document.getText(_var_test);
		if (`{${word}}` === _var_test_text) {
			const hoverContent = new vscode.MarkdownString(`变量 **${word}** `);
			hoverContent.isTrusted = true;
			hoverContent.supportHtml = true;
			if (word in _arr) {
				hoverContent.appendMarkdown(
					`\n\n Type : <span style="color:#f00;">**${_arr[word].type}**</span>`
				);
				hoverContent.appendMarkdown(
					`\n\n position : 位于第${_arr[word].position?.line}行`
				);
			} else {
				hoverContent.appendMarkdown(`\n\n 未定义变量`);
			}
			const hover = new vscode.Hover(hoverContent, _var_test);
			return hover;
		} else if (
			Object.keys(dictionary.func).indexOf(_text) !== -1 &&
			_text === word + "()"
		) {
			for (let i in dictionary.func) {
				const func_val = dictionary.func[i];
				if (i.indexOf(_text) !== -1 && _text === word + "()") {
					const hoverContent = new vscode.MarkdownString(`**${word}**`);
					hoverContent.isTrusted = true;
					hoverContent.supportHtml = true;
					hoverContent.appendMarkdown(`\n\n${func_val.desc}`);
					if (func_val.APIL) {
						const _t = func_val.APIL.split("|");
						hoverContent.appendMarkdown(`\n\n`);
						hoverContent.appendMarkdown(`**API** : [${_t[0]}](${_t[1]})`);
					}
					const hover = new vscode.Hover(hoverContent);
					return hover;
				}
			}
		} else if (pos?.start.character === 0) {
			for (let i in dictionary.kw) {
				const kw_val = dictionary.kw[i];
				if (lineText.startsWith(i)) {
					const hoverContent = new vscode.MarkdownString(`**${word}**`);
					hoverContent.isTrusted = true;
					hoverContent.supportHtml = true;
					hoverContent.appendMarkdown(`\n\n${kw_val.desc}`);
					if (kw_val.APIL) {
						const _t = kw_val.APIL.split("|");
						hoverContent.appendMarkdown(`\n\n`);
						hoverContent.appendMarkdown(`**API** : [${_t[0]}](${_t[1]})`);
					}
					const hover = new vscode.Hover(hoverContent);
					return hover;
				}
			}
		} else if (pos) {
			const beforepos = new vscode.Range(
				new vscode.Position(pos.start.line || 0, pos.start.character! - 1 || 0),
				pos.start! || 0
			);
			let _s = document.getText(beforepos);
			const _d_cmd = dictionary.cmd[word];
			if (_d_cmd && _s === "-") {
				const hoverContent = new vscode.MarkdownString(
					`**${word}** \n\n ${_d_cmd.desc}`
				);
				hoverContent.isTrusted = true;
				hoverContent.supportHtml = true;
				if (_d_cmd.APIL) {
					const _t = _d_cmd.APIL.split("|");
					hoverContent.appendMarkdown(`\n\n`);
					hoverContent.appendMarkdown(`API : [${_t[0]}](${_t[1]})`);
				}
				const hover = new vscode.Hover(hoverContent);
				return hover;
			}
		}
	}
}
