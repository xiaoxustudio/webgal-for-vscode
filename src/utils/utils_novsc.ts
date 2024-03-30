/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-30 13:58:15
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import acorn from "acorn";
export const source = "WebGal Script";
import { promises as fs } from "fs";
export interface FileAccessor {
	isWindows: boolean;
	readFile(path: string): Promise<Uint8Array>;
	writeFile(path: string, contents: Uint8Array): Promise<void>;
}
export const fsAccessor: FileAccessor = {
	isWindows: process.platform === "win32",
	readFile(path: string): Promise<Uint8Array> {
		return fs.readFile(path);
	},
	writeFile(path: string, contents: Uint8Array): Promise<void> {
		return fs.writeFile(path, contents);
	},
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
						ecmaVersion: 2020,
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
