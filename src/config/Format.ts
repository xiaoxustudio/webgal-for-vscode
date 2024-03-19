import * as vscode from "vscode";
import { FormatBlacklist } from "./FormatBlackList";

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
		const _text_sp = text.split("\n");
		const _out_sp = [];
		for (let i of _text_sp) {
			const _index = i.indexOf(":");
			const _start_formats = i.substring(0, _index);
			const _end_formats = i.substring(_index);
			if (_index === -1) {
				i = _start_formats + _end_formats;
				_out_sp.push(i);
				continue;
			} else if (i.substring(_index + 1, _index + 2) === " ") {
				i = _start_formats + _end_formats;
				_out_sp.push(i);
				continue;
			} else if (FormatBlacklist.includes(_start_formats)) {
				i = _start_formats + _end_formats;
				_out_sp.push(i);
				continue;
			} else {
				i = _start_formats + ": " + i.substring(_index + 1);
				_out_sp.push(i);
			}
		}
		return _out_sp.join("\n");
	}
}

export default GoDocumentFormatter;
