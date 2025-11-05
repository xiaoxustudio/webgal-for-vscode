/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-11-05 08:21:47
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { dictionary } from "../utils/HoverSnippet";
import {
	get_desc_variable,
	get_var_type,
	setGlobalVar
} from "../utils/utils_novsc";
import { VList, _VToken } from "../utils/utils";
import { configMap } from "../utils/provider";

const prefix = "https://docs.openwebgal.com/script-reference/commands/";

export default class DictionaryHoverProvider implements vscode.HoverProvider {
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position
	): vscode.ProviderResult<vscode.Hover> {
		const file_name = document.fileName;
		const lineText = document.lineAt(position).text;
		const pos = document.getWordRangeAtPosition(position);
		const find_variables: VList = {};
		const ALL_ARR = document.getText().split("\n");
		// 查找变量并生成MAP
		for (let d_index = 0; d_index < ALL_ARR.length; d_index++) {
			const _data = ALL_ARR[d_index];
			let m = /setVar:\s*(\w+)\s*=\s*([^;]*\S+);?/g.exec(_data);
			if (m) {
				const [, d_word, d_value] = m;
				find_variables[d_word] = {
					word: d_word,
					value: d_value,
					input: m.input,
					position: position.with(d_index + 1, 5),
					type: get_var_type(d_value)
				} as _VToken;
				if (
					find_variables[d_word] &&
					find_variables[d_word]?.position &&
					find_variables[d_word].position instanceof vscode.Position
				) {
					const _v_pos = find_variables[d_word].position;
					const _v_line = _v_pos?.line ? _v_pos.line : -1;
					find_variables[d_word].desc = get_desc_variable(
						ALL_ARR,
						_v_line
					);
				}
			}
		}
		setGlobalVar(find_variables);
		// 获取上下文全部变量
		const word = document.getText(pos);
		const _new_pos = document.positionAt(document.offsetAt(position) + 1);
		const pos_func = document.getWordRangeAtPosition(_new_pos, /:\S+\(\)/g);
		const _text = document.getText(pos_func).replace(/^:/, "");
		const _var_test = document.getWordRangeAtPosition(position, /{(\w+)}/);
		const _var_test_text = document.getText(_var_test);

		// 配置文件 hover
		if (file_name.endsWith("\\game\\config.txt")) {
			for (const i in configMap) {
				const kw_val = configMap[i];
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

		// 引用变量 hover
		if (`{${word}}` === _var_test_text) {
			const hoverContent = new vscode.MarkdownString(
				`### 变量 **${word}** `
			);
			hoverContent.isTrusted = true;
			hoverContent.supportHtml = true;
			if (find_variables[word].desc.length > 0) {
				hoverContent.appendMarkdown(` \n <hr>  `);
				const desc = ` \n\n ${find_variables[word].desc} `;
				hoverContent.appendMarkdown(desc);
			}
			hoverContent.appendMarkdown(` \n <hr>  `);
			if (word in find_variables) {
				hoverContent.appendMarkdown(
					`\n\n\n  类型 : <span style="color:#4db1e5;">${find_variables[word].type}</span>  `
				);
				hoverContent.appendMarkdown(
					`\n\n 位置 : 位于第${find_variables[word].position?.line}行`
				);
				hoverContent.appendCodeblock(
					find_variables[word].input!,
					"webgal"
				);
			} else {
				hoverContent.appendMarkdown(` \n 未定义变量`);
			}
			const hover = new vscode.Hover(hoverContent, _var_test);
			return hover;
		} else if (
			Object.keys(dictionary.func).indexOf(_text) !== -1 &&
			_text === word + "()" // 调用函数 hover
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
			// 关键字 hover
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
				// 参数 hover
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
