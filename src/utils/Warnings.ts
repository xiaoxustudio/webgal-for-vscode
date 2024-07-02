import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { source } from "./utils_novsc";

/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-07-02 09:18:18
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
interface WarningToken {
	message: Function;
	DiagnosticInformation: string; // 警告类型
	pattern: RegExp;
	is_line: boolean; // 是否是行内警告
	customCheck?: Function; // 自定义检测警告
	id: string; // id
	enable?: boolean;
}
function remove_space(_text: string) {
	// 去除空白
	_text = _text.replace(/^([\n\r\t]+)/, function (input, match) {
		return input.slice(match.length);
	});
	return _text;
}
export const Warning: { [key: string]: WarningToken } = {
	"0001": {
		id: "0001",
		message: (...args: any[]) => {
			return `${args[0]} 前面包含一个以上的空格或换行`;
		},
		DiagnosticInformation: "指令格式不规范（%id%）",
		pattern: /(\s{2,}-[A-Za-z]+)\b/g,
		is_line: false,
	},
	"0002": {
		id: "0002",
		message: (...args: any[]) => {
			return `${args[0]} 变量名开头为数字`;
		},
		DiagnosticInformation: "变量命名不规范（%id%）",
		pattern: /^setVar:([0-9]+\S+);/g,
		is_line: true,
		customCheck: function (
			textDocument: TextDocument,
			_text: string,
			base_offset: number,
			_newarr: string[]
		) {
			const _ori_text = _text;
			_text = remove_space(_text);
			let _offset = 0;
			for (let i = 0; i < _newarr.length; i++) {
				const _data = _newarr[i];
				if (/(\r\n)/.test(_data) || _data == "\\r\\n") {
					_offset += 2;
				} else {
					_offset += _data.length;
				}
			}
			const _res_match = this.pattern.exec(_text);
			if (_res_match) {
				const diagnostic: Diagnostic = {
					severity: DiagnosticSeverity.Warning,
					range: {
						start: textDocument.positionAt(_offset),
						end: textDocument.positionAt(_offset + _text.length),
					},
					message: message(this.id, _ori_text.trim()),
					source,
				};
				diagnostic.relatedInformation = [
					{
						location: {
							uri: textDocument.uri,
							range: Object.assign({}, diagnostic.range),
						},
						message: getDiagnosticInformation(this.id),
					},
				];
				return diagnostic;
			}
			return null;
		},
	},
	"0003": {
		id: "0003",
		message: (...args: any[]) => {
			return `${args[0]} 冒号后面需要添加一个空格`;
		},
		DiagnosticInformation: "指令不规范（%id%）",
		pattern: /^([^\s]+):[^\s](.+)/g,
		is_line: true,
	},
	"0004": {
		id: "0004",
		message: (...args: any[]) => {
			return `${args[0]} 插值变量周围存在空格`;
		},
		DiagnosticInformation: "变量插值不规范（%id%）",
		pattern: /{(\S+\s{1,}|\s{1,}\S+|\s{1,}\S+\s{1,})}/g,
		is_line: false,
	},
	"0005": {
		id: "0005",
		message: (...args: any[]) => {
			return `${args[0]} 语句缺少结束标识`;
		},
		DiagnosticInformation: "语句不规范（%id%）",
		pattern: /none/g,
		customCheck: function (
			textDocument: TextDocument,
			_text: string,
			base_offset: number,
			_newarr: string[]
		) {
			const _ori_text = _text;
			_text = remove_space(_text);
			let _offset = 0;
			for (let i = 0; i < _newarr.length; i++) {
				const _data = _newarr[i];
				if (/(\r\n)/.test(_data) || _data == "\\r\\n") {
					_offset += 2;
				} else {
					_offset += _data.length;
				}
			}
			const _res_match_start = _text.endsWith(";") ? true : false;
			const _res = _text.startsWith(";") || _res_match_start ? true : false;
			const _condition = !_text.includes(";") && !_res && _text.length > 0;
			if (_condition) {
				const diagnostic: Diagnostic = {
					severity: DiagnosticSeverity.Warning,
					range: {
						start: textDocument.positionAt(_offset),
						end: textDocument.positionAt(_offset + _text.trim().length),
					},
					message: message(this.id, _text.trim()),
					source,
				};
				diagnostic.relatedInformation = [
					{
						location: {
							uri: textDocument.uri,
							range: Object.assign({}, diagnostic.range),
						},
						message: getDiagnosticInformation(this.id),
					},
				];
				return diagnostic;
			}
			return null;
		},
		is_line: true,
	},
};

/**
 * @description: 获取诊断结果
 * @param {string} id
 * @param {array} args
 * @return {*}
 */
export function message(id: string, ...args: any[]): any {
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
export function getDiagnosticInformation(id: string): any {
	const _data = Warning[id];
	if (!_data) {
		return "未知错误类型";
	}
	return _data.DiagnosticInformation.replace(/%(\w+)%/g, function ($0) {
		return id;
	});
}
