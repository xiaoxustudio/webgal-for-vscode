/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-10-12 13:36:39
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import acorn from "acorn";
export const source = "WebGal Script";
import { promises as fs } from "fs";

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
// 上一次全局变量表
export let GlobalVar: {
	[key: PropertyKey]: any;
} = {};
export const setGlobalVar = (_gv: object) => {
	GlobalVar = _gv;
};
export const getGlobalVar = () => {
	// to key:value
	let _o: Record<string, any> = {};
	Object.keys(GlobalVar).forEach(() => {
		_o[GlobalVar.word] = GlobalVar.value;
	});
	return _o;
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
export function get_desc_variable(ALL_ARR: string[], _start_line: number) {
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
export function get_var_type(var_text: string): string {
	let label;
	if (["true", "false"].indexOf(var_text) !== -1) {
		label = "布尔值";
	} else {
		try {
			const __val_real = new Function("return " + var_text).bind(
				getGlobalVar()
			);
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
								ecmaVersion: 2020
							});
							return true;
						} catch (error) {
							return false;
						}
					})();
					if (
						var_text.indexOf("+") === -1 ||
						var_text.indexOf("+") === -1 ||
						var_text.indexOf("+") === -1 ||
						var_text.indexOf("+") === -1
					) {
						label = "字符串";
					} else if (_Res) {
						label = "表达式";
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
						ecmaVersion: 2020
					});
					return true;
				} catch (error) {
					return false;
				}
			})();
			if (
				var_text.indexOf("+") === -1 ||
				var_text.indexOf("+") === -1 ||
				var_text.indexOf("+") === -1 ||
				var_text.indexOf("+") === -15
			) {
				label = "字符串";
			} else if (_Res) {
				label = "表达式";
			} else {
				label = "未知";
			}
		}
	}
	return ` ${label} `;
}

export function is_JSON(_likely_josn: any) {
	try {
		return !!JSON.parse(_likely_josn);
	} catch {
		return false;
	}
}
