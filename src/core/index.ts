import * as expressions from "angular-expressions";
import * as fs from "fs/promises";
import { FileAccessor, IDefinetionMap } from "./types";

export const source = "WebGal Script";
export const SCHEME = "webgal-virtual-doc";

// 上一次全局映射表
export const GlobalMap: IDefinetionMap = {
	label: {},
	setVar: {},
	choose: {}
};

export const cleartGlobalMapAll = () => {
	GlobalMap.label = {};
	GlobalMap.setVar = {};
	GlobalMap.choose = {};
};

export const fsAccessor: FileAccessor = {
	isWindows: process.platform === "win32",
	readFile(path: string): Promise<Buffer> {
		return fs.readFile(path);
	},
	writeFile(path: string, contents: Buffer): Promise<void> {
		return fs.writeFile(path, contents.toString());
	}
};

export const runCode = (text: string, ops?: expressions.CompileFuncOptions) => {
	return expressions.compile(text, ops);
};

export * from "./types";
