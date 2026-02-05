import * as vscode from "vscode";
/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-06-30 17:45:45
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
export const selectorConfig = { scheme: "file", language: "webgal-config" };
