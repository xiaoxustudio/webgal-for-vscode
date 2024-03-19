/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-19 10:32:43
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
interface WarningToken {
	message: Function;
	DiagnosticInformation: string; // 警告类型
	pattern: RegExp;
	is_line: boolean; // 是否是行内警告
}

export const Warning: { [key: string]: WarningToken } = {
	"0001": {
		message: (...args: any[]) => {
			return `${args[0]} 前面包含一个以上的空格或换行`;
		},
		DiagnosticInformation: "指令格式不规范（%id%）",
		pattern: /\s{2,}-([A-Za-z]+)\b/g,
		is_line: false,
	},
	"0002": {
		message: (...args: any[]) => {
			return `${args[0]} 变量名开头为数字`;
		},
		DiagnosticInformation: "变量命名不规范（%id%）",
		pattern: /^setVar:\s*([0-9].*)\b/g,
		is_line: true,
	},
	"0003": {
		message: (...args: any[]) => {
			return `${args[0]} 冒号后面需要添加一个空格`;
		},
		DiagnosticInformation: "指令不规范（%id%）",
		pattern: /^([^\n\t:]*\S+:\S+){1}/g,
		is_line: true,
	},
};

/**
 * @description: 获取诊断结果
 * @param {string} id
 * @param {array} args
 * @return {*}
 */
export function message(id: string, ...args: any[]) {
	const _data = Warning[id];
	if (!_data) {
		return false;
	}
	return _data.message(...args);
}

/**
 * @description: 获取诊断类型信息
 * @param {string} id
 * @return {*}
 */
export function getDiagnosticInformation(id: string) {
	const _data = Warning[id];
	if (!_data) {
		return "未知错误类型";
	}
	return _data.DiagnosticInformation.replace(/%(\w+)%/g, function ($0) {
		return id;
	});
}
