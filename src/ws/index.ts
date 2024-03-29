import { DebugSession, Range, TextEditorDecorationType, window } from "vscode";
import {
	disableGameStatus,
	enableGameStatus,
	setGameData,
} from "../utils/utils";

/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-29 21:18:05
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
const WS = require("ws");
export default function createWS(_ADP: DebugSession) {
	const config = _ADP.configuration;
	const _ws_host = config.ws || "ws://localhost:9999/";
	const sock = new WS("ws://localhost:9999/");
	const editor = window.activeTextEditor;
	let decorationType: TextEditorDecorationType;
	let last_line_num = -1;
	function clearDecorationType() {
		const editor = window.activeTextEditor;
		if (editor && decorationType) {
			editor.setDecorations(decorationType, []);
		}
	}
	sock.on("open", function () {
		if (sock.readyState === 1) {
			enableGameStatus(sock);
			const msg = {
				command: 0,
				sceneMsg: {
					scene: config.program,
					sentence: 1,
				},
				stageSyncMsg: {},
				message: "徐然",
			};
			sock.send(JSON.stringify(msg));
			window.showInformationMessage("(webgal)调试连接到：" + _ws_host);
		} else {
			window.showErrorMessage("(webgal)调试连接错误，请重试！");
			clearDecorationType();
		}
	});

	sock.on("error", function () {
		disableGameStatus();
		window.showErrorMessage("(webgal)调试连接错误，请重试！");
		clearDecorationType();
		last_line_num = -1;
	});
	sock.on("runscript", function (e: string) {
		if (sock.readyState === 1) {
			const msg = {
				command: 3,
				sceneMsg: {
					scene: config.program,
					sentence: 1,
				},
				stageSyncMsg: {},
				message: e,
			};
			sock.send(JSON.stringify(msg));
		}
	});

	sock.on("close", function () {
		setGameData({});
		disableGameStatus();
		window.showErrorMessage("(webgal)调试关闭！");
		clearDecorationType();
		last_line_num = -1;
	});
	sock.on("message", function (data: Buffer) {
		let _data = JSON.parse(data.toString());
		setGameData(_data);
		if (!editor) return;
		const _fname = String(editor.document.fileName || "");
		const _dname = String(_data.sceneMsg.scene || "");
		const _now = _fname.substring(_fname.lastIndexOf("\\") + 1);
		const _target = _dname.substring(_dname.lastIndexOf("\\") + 1);
		if (!_now || !_target) return;
		if (
			_data.sceneMsg &&
			last_line_num !== _data.sceneMsg.sentence &&
			_now === _target
		) {
			clearDecorationType();
			decorationType = window.createTextEditorDecorationType({
				backgroundColor: "rgba(150, 0, 0, 0.3)",
				isWholeLine: true,
			});
			last_line_num = _data.sceneMsg.sentence;
			const _num = last_line_num - 1;
			const range = new Range(
				_num,
				0,
				_num,
				editor.document.lineAt(_num).text.length
			);
			editor.setDecorations(decorationType, [range]);
		}
	});
	return sock;
}
