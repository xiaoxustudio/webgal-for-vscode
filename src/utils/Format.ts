/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-06-30 18:54:44
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { FormatBlacklist } from "./FormatBlackList";
const _format_p = /(\s{2,}\-\S+)/;

class GoDocumentFormatter implements vscode.DocumentFormattingEditProvider {
	provideDocumentFormattingEdits(
		document: vscode.TextDocument,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.TextEdit[]> {
		// webgal不支持加空格的设置变量，格式化暂时下线
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
				if (_str.indexOf(";") === -1 && _str.length > 0 && _str !== "\r") {
					const _index = _str.indexOf(":");
					_str =
						_str.substring(0, _index) + _str.substring(_index).trimEnd() + ";";
				}
				// 处理冒号两侧空格
				if (_str.indexOf(":") !== -1) {
					const index = _str.indexOf(":");
					_str =
						_str.substring(0, index).trim() +
						": " +
						_str.substring(index + 1).trim();
				}
				return _str;
			};
			_out_sp.push(process(i));
		}
		return _out_sp.join("\n");
	}
}

export default GoDocumentFormatter;
