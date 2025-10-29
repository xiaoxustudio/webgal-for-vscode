/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-07-04 18:11:28
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import js_beautify from "js-beautify";
const _format_p = /(\s{2,}\-\S+)/;

class GoDocumentFormatter implements vscode.DocumentFormattingEditProvider {
	provideDocumentFormattingEdits(
		document: vscode.TextDocument,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.TextEdit[]> {
		const text = document.getText();
		const formattedText = this.formatText(text);
		const edit = new vscode.TextEdit(
			new vscode.Range(
				document.positionAt(0),
				document.positionAt(text.length)
			),
			formattedText
		);
		return [edit];
	}
	private formatText(text: string): string {
		// 参数格式化
		while (_format_p.test(text)) {
			text = text.replace(_format_p, (val, match: string) => {
				return val.replace(/^[\s]+/, " ");
			});
		}
		const _text_sp = text.split("\n");
		const _out_sp = [];
		for (let i of _text_sp) {
			const process = (_str: string) => {
				// 处理末尾没有;
				if (
					_str.indexOf(";") === -1 &&
					_str.length > 0 &&
					_str !== "\r"
				) {
					const _index = _str.indexOf(":");
					_str =
						_str.substring(0, _index) +
						_str.substring(_index).trimEnd() +
						";";
				}
				// 处理冒号两侧空格
				if (_str.indexOf(":") !== -1) {
					const index = _str.indexOf(":");
					_str =
						_str.substring(0, index).trim() +
						": " +
						_str.substring(index + 1).trim();
				}
				const _exp = ["setVar"];
				const _exp_bool = _exp.every((val) => _str.startsWith(val));
				// 处理等号后面符号的空格
				if (_exp_bool && _str.indexOf("=") !== -1) {
					const options = {
						indent_size: 2,
						space_in_empty_paren: true
					};
					const code = js_beautify(
						_str.substring(_str.indexOf("=") + 1),
						options
					);
					_str = _str.substring(0, _str.indexOf("=")) + "=" + code;
				}
				// 处理开头为空格;
				if (_str.startsWith(" ")) {
					_str = _str.match(/\s+(.*)/i)![1];
				}
				return _str;
			};
			const _code_format = process(i);
			_out_sp.push(_code_format);
		}
		return _out_sp.join("\n");
	}
}

export default GoDocumentFormatter;
