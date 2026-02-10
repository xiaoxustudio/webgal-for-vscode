/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-10-31 20:58:50
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as expressions from "angular-expressions";
import { promises as fs } from "fs";

export const source = "WebGal Script";
export const SCHEME = "webgal-virtual-doc";

export interface FileAccessor {
	isWindows: boolean;
	readFile(path: string): Promise<Buffer>;
	writeFile(path: string, contents: Buffer): Promise<void>;
}
export class RuntimeVariable {
	public reference?: number;
	public desc?: "Array" | "Object" | string;
	public get value() {
		return this._value;
	}

	public set value(value: IRuntimeVariableType) {
		this._value = value;
	}

	constructor(
		public readonly name: string,
		private _value: IRuntimeVariableType
	) {}
}

export type IRuntimeVariableType =
	| number
	| boolean
	| string
	| RuntimeVariable[];

export enum DebugCommand {
	// 跳转
	JUMP,
	// 同步自客户端
	SYNCFC,
	// 同步自编辑器
	SYNCFE,
	// 执行指令
	EXE_COMMAND,
	// 重新拉取模板样式文件
	REFETCH_TEMPLATE_FILES
}

export interface IDebugMessage {
	event: string;
	data: {
		command: DebugCommand;
		sceneMsg: {
			sentence: number;
			scene: string;
		};
		message: string;
		stageSyncMsg: any;
	};
}

export interface IVToken {
	word: string; // 名称
	position?: any; // 位置
	input?: string; // 原始文本
	value?: string; // 值
	desc: string; // 描述
	isGlobal?: boolean; // 是否是全局
	isGetUserInput?: boolean; // 是否是获取输入
}

type IMapValue = Record<string, IVToken[]>;

// 全局映射表
export interface IDefinetionMap {
	label: IMapValue;
	setVar: IMapValue;
	choose: IMapValue;
}

// 上一次全局映射表
export const GlobalMap: IDefinetionMap = {
	label: {},
	setVar: {},
	choose: {}
};

export const cleartGlobalMapAll = () => {
	GlobalMap.label = {};
	GlobalMap.setVar = {};
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

// 获取变量的描述
export function getVariableTypeDesc(ALL_ARR: string[], _start_line: number) {
	let _desc_arr = [];
	for (let _d_index = _start_line - 2; _d_index > 0; _d_index--) {
		const _data = ALL_ARR[_d_index];
		if (_data.startsWith(";") && _data.length > 0) {
			_desc_arr.unshift(_data.substring(1));
		} else if (_data.length > 0) {
			break;
		} else {
			continue;
		}
	}
	return _desc_arr.join("\n");
}

const runCode = (text: string, ops?: expressions.CompileFuncOptions) => {
	return expressions.compile(text, ops);
};

export function getVariableType(expr: string): string {
	if (expr.includes("$stage") || expr.includes("$userData")) {
		return "expression";
	}
	const evaluatorFunc = runCode(expr);
	const res = typeof evaluatorFunc();
	return res;
}

export function is_JSON(_likely_josn: any) {
	try {
		return !!JSON.parse(_likely_josn);
	} catch {
		return false;
	}
}
