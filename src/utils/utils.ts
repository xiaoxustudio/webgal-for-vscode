import * as vscode from "vscode";
/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-30 13:49:44
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
let Game_Data = {}; // 游戏全局配置
let Game_Connect_Status = 0; // 游戏连接状态
let WS: any = null;

export function getGameData() {
	return Game_Data;
}
export function setGameData(data: object) {
	Game_Data = data;
}
export function enableGameStatus(_WS: any) {
	Game_Connect_Status = 1;
	setWS(_WS);
}
export function disableGameStatus() {
	Game_Connect_Status = 0;
}
function setWS(_WS: any) {
	WS = _WS;
}
export function getWS() {
	return WS;
}
export const selector = { scheme: "file", language: "webgal" };
export function rgba01To255(rgba: string): string {
	const matches = rgba.match(/rgba?\((.+?)\)/);
	if (!matches) {
		return rgba;
	}
	const values = matches[1].split(",").map(parseFloat);
	if (values.length !== 4) {
		return rgba;
	}
	const rgba255 = `rgba(${values
		.map((value) => (value <= 1 ? Math.round(value * 255) : value))
		.join(",")})`;
	return rgba255;
}
export function rgba255To01(rgba: string): string {
	const matches = rgba.match(/rgba?\((.+?)\)/);
	if (!matches) {
		return rgba;
	}
	const values = matches[1].split(",").map(parseFloat);
	if (values.length !== 4) {
		return rgba;
	}
	const rgba01 = `rgba(${values.map((value) => value / 255).join(",")})`;
	return rgba01;
}
export function isRgba255(rgba: string): boolean {
	const matches = rgba.match(/rgba?\((.+?)\)/);
	if (!matches) {
		return false;
	}
	const values = matches[1].split(",").map(parseFloat);
	return values.every((value) => value >= 1);
}
const fs = require("fs");
const path = require("path");

// 当前工作目录

export const currentDirectory =
	vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";

export function get_files(
	baseDir: string = currentDirectory,
	find_suffix: string[] = [".png"],
	absolute_path = true
) {
	let _arr: string[] = [];
	let _list = fs.readdirSync(baseDir);
	for (let file of _list) {
		const fullPath = path.join(baseDir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			_arr = [..._arr, ...get_files(fullPath, find_suffix, absolute_path)];
		} else if (find_suffix.includes(path.extname(file))) {
			const RelativePath = vscode.workspace.asRelativePath(fullPath);
			_arr.push(!absolute_path ? RelativePath : fullPath);
		}
	}
	return _arr;
}
export function getConfig(document: vscode.TextDocument) {
	return vscode.workspace.getConfiguration(
		"XRWebGalLanguageServer",
		document.uri
	);
}
