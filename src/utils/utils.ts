import * as vscode from "vscode";
/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-06-30 17:45:45
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */

export interface IVToken {
	word: string;
	type: string;
	is_global?: boolean;
	position?: vscode.Position;
	input?: string;
	value?: string;
	desc: string;
}

export type VList = Record<string, IVToken>;

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
export const selectorConfig = { scheme: "file", language: "webgal-config" };

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
