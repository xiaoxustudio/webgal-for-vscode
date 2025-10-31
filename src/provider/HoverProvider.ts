/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-10-29 16:10:27
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { dictionary, config_dictionary } from "../utils/HoverSnippet";
import { _setvar_pattern } from "./CompletionProvider";
import {
	get_desc_variable,
	get_var_type,
	setGlobalVar
} from "../utils/utils_novsc";
import { VList, _VToken } from "../utils/utils";

const prefix = "https://docs.openwebgal.com/script-reference/commands/";

export default class DictionaryHoverProvider implements vscode.HoverProvider {
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position
	): vscode.ProviderResult<vscode.Hover> {
		const file_name = document.fileName;
		const lineText = document.lineAt(position).text;
		const pos = document.getWordRangeAtPosition(position);
		const _arr: VList = {};
		const ALL_ARR = document.getText().split("\n");
		for (let _d_index = 0; _d_index < ALL_ARR.length; _d_index++) {
			const _data = ALL_ARR[_d_index];
			let m = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(_data);
			if (m) {
				_arr[m[1]] = {
					word: m[1],
					value: m[2],
					input: m.input,
					position: position.with(_d_index + 1, 5),
					type: get_var_type(m[2])
				} as _VToken;
				if (
					_arr[m[1]] &&
					_arr[m[1]]?.position &&
					_arr[m[1]].position instanceof vscode.Position
				) {
					const _v_pos = _arr[m[1]].position;
					const _v_line = _v_pos?.line ? _v_pos.line : -1;
					_arr[m[1]].desc = get_desc_variable(ALL_ARR, _v_line);
				}
			}
		}
		setGlobalVar(_arr);
		// 获取上下文全部变量
		const word = document.getText(pos);
		const _new_pos = document.positionAt(document.offsetAt(position) + 1);
		const pos_func = document.getWordRangeAtPosition(_new_pos, /:\S+\(\)/g);
		const _text = document.getText(pos_func).replace(/^:/, "");
		const _var_test = document.getWordRangeAtPosition(position, /{(\w+)}/);
		const _var_test_text = document.getText(_var_test);
		if (file_name.endsWith("\\game\\config.txt")) {
			for (let i in config_dictionary) {
				const kw_val = config_dictionary[i];
				if (lineText.startsWith(i)) {
					const hoverContent = new vscode.MarkdownString(
						`**${word}**`
					);
					hoverContent.isTrusted = true;
					hoverContent.supportHtml = true;
					hoverContent.appendMarkdown(`\n\n${kw_val.desc}`);
					hoverContent.appendMarkdown(` \n <hr>  `);
					const hover = new vscode.Hover(hoverContent);
					return hover;
				}
			}
		}
		if (`{${word}}` === _var_test_text) {
			const hoverContent = new vscode.MarkdownString(
				`### 变量 **${word}** `
			);
			hoverContent.isTrusted = true;
			hoverContent.supportHtml = true;
			if (_arr[word].desc.length > 0) {
				hoverContent.appendMarkdown(` \n <hr>  `);
				const desc = ` \n\n ${_arr[word].desc} `;
				hoverContent.appendMarkdown(desc);
			}
			hoverContent.appendMarkdown(` \n <hr>  `);
			if (word in _arr) {
				hoverContent.appendMarkdown(
					`\n\n\n  类型 : <span style="color:#4db1e5;">${_arr[word].type}</span>  `
				);
				hoverContent.appendMarkdown(
					`\n\n 位置 : 位于第${_arr[word].position?.line}行`
				);
				hoverContent.appendCodeblock(_arr[word].input!, "webgal");
			} else {
				hoverContent.appendMarkdown(` \n 未定义变量`);
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
					const hoverContent = new vscode.MarkdownString(
						`**${word}**`
					);
					hoverContent.isTrusted = true;
					hoverContent.supportHtml = true;
					hoverContent.appendMarkdown(`\n\n${func_val.desc}`);
					hoverContent.appendMarkdown(` \n <hr>  `);
					if (func_val.APIL) {
						const _t = func_val.APIL.split("|");
						hoverContent.appendMarkdown(`\n\n`);
						hoverContent.appendMarkdown(
							`**API** : [${_t[0]}](${_t[1]})`
						);
					}
					const hover = new vscode.Hover(hoverContent);
					return hover;
				}
			}
		} else if (pos?.start.character === 0) {
			for (let i in dictionary.kw) {
				const kw_val = dictionary.kw[i];
				if (lineText.startsWith(i)) {
					const hoverContent = new vscode.MarkdownString(
						`**${word}**`
					);
					hoverContent.isTrusted = true;
					hoverContent.supportHtml = true;
					hoverContent.appendMarkdown(`\n\n${kw_val.desc}`);
					hoverContent.appendMarkdown(` \n <hr>  `);
					if (kw_val.APIL) {
						const _t = kw_val.APIL;
						hoverContent.appendMarkdown(`\n\n`);
						hoverContent.appendMarkdown(
							`**API** : [${_t}](${prefix}${i}.html)`
						);
					}
					const hover = new vscode.Hover(hoverContent);
					return hover;
				}
			}
		} else if (pos) {
			const _base_pos = new vscode.Position(
				pos.start.line || 0,
				pos.start.character! - 1 || 0
			);
			const _before_pos = new vscode.Range(
				_base_pos.with(
					_base_pos.line,
					_base_pos.character - 1 > 0
						? _base_pos.character - 1
						: _base_pos.character
				),
				pos.start! || 0
			);
			let _s = document.getText(_before_pos);
			const _d_cmd = dictionary.cmd[word];
			if (_d_cmd && _s === " -") {
				const hoverContent = new vscode.MarkdownString(
					`**${word}** \n\n `
				);
				hoverContent.isTrusted = true;
				hoverContent.supportHtml = true;
				hoverContent.appendMarkdown(` \n <hr>  `);
				hoverContent.appendMarkdown(` \n\n${_d_cmd.desc}`);
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
