import { DebugSession, Range, TextEditorDecorationType, window } from "vscode";
import {
	disableGameStatus,
	enableGameStatus,
	setGameData,
} from "../utils/utils";

/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-29 09:35:28
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
const ws = require("ws");
export default function createWS(_ADP: DebugSession) {
	const _ws_host = "ws://localhost:9999";
	const sock = new ws(_ws_host);
	sock.on("open", function (e: any) {
		enableGameStatus(sock);
		window.showInformationMessage("(webgal)调试连接到：" + _ws_host);
	});

	sock.on("error", function (err: any) {
		disableGameStatus();
		window.showErrorMessage("(webgal)调试连接错误，请重试！");
	});

	sock.on("close", function () {
		setGameData({});
		disableGameStatus();
		window.showErrorMessage("(webgal)调试关闭！");
	});
	// 创建一个装饰器类型
	let decorationType: TextEditorDecorationType;
	let last_line_num = -1;
	sock.on("message", (data: Buffer) => {
		const _data = JSON.parse(data.toString());
		setGameData(_data);
		const editor = window.activeTextEditor;
		if (editor && _data.sceneMsg && last_line_num !== _data.sceneMsg.sentence) {
			if (decorationType) {
				editor.setDecorations(decorationType, []);
			}
			decorationType = window.createTextEditorDecorationType({
				backgroundColor: "rgba(150, 0, 0, 0.3)",
				isWholeLine: true,
			});
			last_line_num = _data.sceneMsg.sentence;
			const range = new Range(
				_data.sceneMsg.sentence,
				0,
				_data.sceneMsg.sentence,
				editor.document.lineAt(_data.sceneMsg.sentence).text.length
			);
			editor.setDecorations(decorationType, [range]);
		}
	});
	return sock;
}
