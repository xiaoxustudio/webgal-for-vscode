import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { Position, TextDocument } from "vscode-languageserver-textdocument";

/** 获取位置的指令单词 */
export function getWordAtPosition(
	doc: TextDocument,
	pos: Position
): { word: string; start: number; end: number } | null {
	const text = doc.getText();
	const offset = doc.offsetAt(pos);
	if (offset < 0 || offset > text.length) return null;

	// Unicode-aware "word" character test: letters, numbers, underscore
	// Requires JS RegExp Unicode flag (Node >= 10+)
	const isWordChar = (ch: string) => /\p{L}|\p{N}|_/u.test(ch);

	// expand left from offset-1
	let i = offset - 1;
	while (i >= 0 && isWordChar(text.charAt(i))) i--;
	const start = i + 1;

	// expand right from offset
	let j = offset;
	while (j < text.length && isWordChar(text.charAt(j))) j++;
	const end = j;

	if (start >= end) return null;
	return { word: text.slice(start, end), start, end };
}

/** Helper: 判断是否属于 路径字符 */
export function isPathChar(ch: string): boolean {
	return /[A-Za-z0-9_.\-\/~]/.test(ch);
}

/** 从 position 找到当前 token 的 start offset（用于 replacement range） */
export function findTokenRange(
	doc: TextDocument,
	pos: Position
): { startOffset: number; endOffset: number; token: string } {
	const text = doc.getText();
	const offset = doc.offsetAt(pos);
	let i = offset - 1;
	while (i >= 0 && isPathChar(text.charAt(i))) i--;
	const start = i + 1;
	let j = offset;
	while (j < text.length && isPathChar(text.charAt(j))) j++;
	const end = j;
	const token = text.slice(start, end);
	return { startOffset: start, endOffset: end, token };
}

// 根据文档 URI 和 token（如 "./src/fi"）列出目录下匹配项
export async function listPathCandidates(
	docUri: string,
	token: string
): Promise<Array<{ label: string; insertText: string; isDirectory: boolean }>> {
	try {
		// 1. 先把文档 URI 转成本地文件路径（如果是 file: scheme）
		let filePath: string | null = null;
		if (docUri.startsWith("file://")) {
			// fileURLToPath 会把 file:///C:/... 或 file:///home/... 转成本地路径
			filePath = fileURLToPath(docUri);
		} else {
			// 如果不是 file:，可以尝试作为普通路径（或者直接返回空）
			// 这里保守处理：不访问文件系统，返回空数组
			return [];
		}

		const baseDir = path.dirname(filePath);

		// 2. 根据 token 解析要列出的目录和 partial 前缀
		let resolvedBase: string;
		let partialName = "";

		if (token.startsWith("/")) {
			// 以 / 开头 — 当作绝对路径（UNIX 风格）；在 Windows 下可考虑驱动器字母处理
			const maybeDir = token.endsWith("/") ? token : path.dirname(token);
			resolvedBase = path.resolve(maybeDir);
			partialName = token.endsWith("/") ? "" : path.basename(token);
		} else if (token.startsWith("~")) {
			// ~ 映射到用户主目录（可选）
			const homedir = process.env.HOME || process.env.USERPROFILE || "";
			const afterTilde = token === "~" ? "" : token.slice(2); // "~/" 前缀处理
			const joined = path.join(homedir, afterTilde);
			resolvedBase = path.dirname(joined);
			partialName = path.basename(joined);
		} else {
			// 相对路径：基于当前文件夹解析
			if (token.includes("/")) {
				const tokenDir = token.slice(0, token.lastIndexOf("/"));
				partialName = token.slice(token.lastIndexOf("/") + 1);
				resolvedBase = path.resolve(baseDir, tokenDir || ".");
			} else {
				resolvedBase = baseDir;
				partialName = token;
			}
		}

		// 3. 读取目录并筛选
		const entries = await fs
			.readdir(resolvedBase, { withFileTypes: true })
			.catch(() => []);
		const candidates = entries
			.filter((e) => e.name.startsWith(partialName))
			.map((e) => {
				const isDir = e.isDirectory();
				const name = e.name + (isDir ? "/" : "");
				// 插入文本：保持 token 的前缀并补全剩余部分
				let insertText: string;
				if (token.includes("/")) {
					const prefix = token.slice(0, token.lastIndexOf("/") + 1);
					insertText = prefix + e.name + (isDir ? "/" : "");
				} else {
					insertText = e.name + (isDir ? "/" : "");
				}
				return { label: name, insertText, isDirectory: isDir };
			});

		return candidates;
	} catch (err) {
		return [];
	}
}
