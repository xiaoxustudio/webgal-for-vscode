/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-24 11:49:11
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

import { getConfig } from "../utils/utils";
import { get_var_type } from "../utils/utils_novsc";


export class XRInlayHintsProvider implements InlayHintsProvider {
	async provideInlayHints(
		document: TextDocument,
		range: Range,
		token: CancellationToken
	): Promise<InlayHint[]> {
		const hints: InlayHint[] = [];
		const _config = getConfig(document);
		const _config_isHint = _config.get("isShowHint");
		if (_config && _config_isHint === "关闭") {
			return hints;
		}
		const text = document.getText(range);
		const regex = /(setVar):([\w\d_]+)=(\S+)(.*);?/g;
		for (const match of text.matchAll(regex)) {
			if (token.isCancellationRequested) break;
			const _index = match.index || 0;
			let _pos;
			const p1 = _index;
			const p2 = _index + match[1].length + 1 + match[2].length;
			const p3 = _index + match[0].length;
			switch (_config_isHint) {
				case "最前面":
					_pos = p1;
					break;
				case "变量名后":
					_pos = p2;
					break;
				case "最后面":
					_pos = p3;
					break;
				default:
					_pos = p2;
					break;
			}
			const start = document.positionAt(_pos);
			const hint = new InlayHint(
				start,
				get_var_type(match[3]),
				InlayHintKind.Type
			);
			hints.push(hint);
		}
		return hints;
	}
}
