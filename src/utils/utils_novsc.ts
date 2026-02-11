/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-10-31 20:58:50
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */

import { runCode } from "@/core";

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
