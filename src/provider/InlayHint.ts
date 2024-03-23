/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-23 12:07:55
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	Range,
	TextDocument,
	CancellationToken,
	InlayHint,
	InlayHintKind,
	InlayHintsProvider,
} from "vscode";
import acorn from "acorn";

export function get_var_type(var_text: string): string {
	let label;
	if (["true", "false"].indexOf(var_text) !== -1) {
		label = "布尔值";
	} else {
		try {
			const __val_real = new Function("return " + var_text)();
			switch (typeof __val_real) {
				case "number":
					label = "数字";
					break;
				case "boolean":
					label = "布尔值";
					break;
				default:
					const _Res = (function () {
						try {
							acorn.parse(var_text, {
								sourceType: "module",
								ecmaVersion: 2020,
							});
							return true;
						} catch (error) {
							return false;
						}
					})();
					if (_Res) {
						label = "表达式";
					} else if (
						typeof new Function(`return '${var_text}'`)() === "string"
					) {
						label = "字符串";
					} else {
						label = "未知";
					}
					break;
			}
		} catch {
			const _Res = (function () {
				try {
					acorn.parse(var_text, {
						sourceType: "module",
						ecmaVersion: 2020,
					});
					return true;
				} catch (error) {
					return false;
				}
			})();
			if (_Res) {
				label = "表达式";
			} else if (typeof new Function(`return '${var_text}'`)() === "string") {
				label = "字符串";
			} else {
				label = "未知";
			}
		}
	}
	return ` ${label} `;
}
export class XRInlayHintsProvider implements InlayHintsProvider {
	async provideInlayHints(
		document: TextDocument,
		range: Range,
		token: CancellationToken
	): Promise<InlayHint[]> {
		const hints: InlayHint[] = [];
		const text = document.getText(range);
		const regex = /(setVar):([\w\d_]+)=([\S]+);?/g;
		for (const match of text.matchAll(regex)) {
			if (token.isCancellationRequested) break;
			if (match && match?.index) {
				const start = document.positionAt(
					match.index + match[1].length + 1 + match[2].length
				);
				const hint = new InlayHint(
					start,
					get_var_type(match[3]),
					InlayHintKind.Type
				);
				hints.push(hint);
			}
		}
		return hints;
	}
}
