import { DebugSession, Range, TextEditorDecorationType, window } from "vscode";
import {
	disableGameStatus,
	enableGameStatus,
	setGameData,
} from "../utils/utils";

/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-29 14:32:45
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
const ws = require("ws");
export default function createWS(_ADP: DebugSession) {
	const _ws_host = "ws://localhost:9999";
	const sock = new ws(_ws_host);
	let decorationType: TextEditorDecorationType;
	let last_line_num = -1;
	function clearDecorationType() {
		const editor = window.activeTextEditor;
		if (editor && decorationType) {
			editor.setDecorations(decorationType, []);
		}
	}
	sock.on("open", function (e: any) {
		if (sock._readyState === 1) {
			enableGameStatus(sock);
			window.showInformationMessage("(webgal)调试连接到：" + _ws_host);
		} else {
			window.showErrorMessage("(webgal)调试连接错误，请重试！");
			clearDecorationType();
		}
	});

	sock.on("error", function (err: any) {
		disableGameStatus();
		window.showErrorMessage("(webgal)调试连接错误，请重试！");
		clearDecorationType();
	});
	sock.on("clear", function () {
		clearDecorationType();
	});

	sock.on("close", function () {
		setGameData({});
		disableGameStatus();
		window.showErrorMessage("(webgal)调试关闭！");
		clearDecorationType();
	});
	sock.on("message", (data: Buffer) => {
		const _data = JSON.parse(data.toString());
		setGameData(_data);
		_ADP.customRequest("var", {
			body: {
				variables: [
					{
						name: "myVariable",
						value: "123",
						variablesReference: 0,
					},
				],
			},
		});
		const editor = window.activeTextEditor;
		clearDecorationType();
		if (
			editor &&
			_data.sceneMsg &&
			last_line_num !== _data.sceneMsg.sentence &&
			editor.document.fileName.substring(
				editor.document.fileName.lastIndexOf("\\") + 1
			) === _data.sceneMsg.scene
		) {
			decorationType = window.createTextEditorDecorationType({
				backgroundColor: "rgba(150, 0, 0, 0.3)",
				isWholeLine: true,
			});
			last_line_num = _data.sceneMsg.sentence - 1;
			const range = new Range(
				_data.sceneMsg.sentence - 1,
				0,
				_data.sceneMsg.sentence - 1,
				editor.document.lineAt(_data.sceneMsg.sentence - 1).text.length
			);
			editor.setDecorations(decorationType, [range]);
		}
	});
	return sock;
}
