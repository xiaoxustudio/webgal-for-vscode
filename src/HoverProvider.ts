/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-17 18:25:17
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { dictionary } from "./config/HoverSnippet";
export default class DictionaryHoverProvider implements vscode.HoverProvider {
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		const lineText = document.lineAt(position).text;
		const pos = document.getWordRangeAtPosition(position);
		const word = document.getText(pos);
		if (pos?.start.character === 0) {
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
		} else {
			const beforepos = new vscode.Range(
				new vscode.Position(
					pos?.start.line || 0,
					pos?.start.character! - 1 || 0
				),
				pos?.start! || 0
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
