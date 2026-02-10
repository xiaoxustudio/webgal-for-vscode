import {
	FoldingRange,
	FoldingRangeKind,
	FoldingRangeParams
} from "vscode-languageserver";
import { ConnectionHandler } from "../types";

// 折叠
export default <ConnectionHandler>function (documents, connection) {
	connection.onFoldingRanges((params: FoldingRangeParams) => {
		const doc = documents.get(params.textDocument.uri);
		if (!doc) return [];

		const docText = doc.getText();
		const foldingRanges: FoldingRange[] = [];

		const regex = /label:([\s\S]*?)(?=(?:\r?\n|^)end|(?:\r?\n|^)label:|$)/g;

		let match: RegExpExecArray | null;
		while ((match = regex.exec(docText))) {
			if (match != null) {
				const startLine = doc.positionAt(match.index).line;

				// match[0] 包含了从 label: 到结束标记之前的内容
				// 这里的 match[0] 结束位置正好指向结束标记（如 label:）的前面
				const endPos = doc.positionAt(match.index + match[0].length);

				let endLine = endPos.line;

				// 如果结束标记正好在行首（character === 0），说明内容在上一行结束
				if (endPos.character === 0) {
					endLine = endPos.line - 1;
				}

				if (endLine > startLine) {
					foldingRanges.push({
						startLine: startLine,
						endLine: endLine,
						collapsedText:
							match[1].split("\n")[0].replace(/;/g, "").trim() ||
							"...",
						kind: FoldingRangeKind.Region
					});
				}
			}
		}

		return foldingRanges;
	});
};
