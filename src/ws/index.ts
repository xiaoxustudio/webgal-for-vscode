import { DebugSession, Range, TextEditorDecorationType, window } from "vscode";
import {
	disableGameStatus,
	enableGameStatus,
	setGameData,
} from "../utils/utils";
import EventEmitter from "events";
import { WebSocket } from "ws";
import { FileAccessor } from "../utils/utils_novsc";

/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-30 18:56:33
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
const WS = require("ws");

interface IRuntimeStackFrame {
	index: number;
	name: string;
	file: string;
	line: number;
	column?: number;
	instruction?: number;
}

export type IRuntimeVariableType =
	| number
	| boolean
	| string
	| RuntimeVariable[];

export class RuntimeVariable {
	public reference?: number;

	public get value() {
		return this._value;
	}

	public set value(value: IRuntimeVariableType) {
		this._value = value;
	}

	constructor(
		public readonly name: string,
		private _value: IRuntimeVariableType
	) {}
}

export function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class XRRuntime extends EventEmitter {
	private _WS!: WebSocket;
	public variables = new Map<string, RuntimeVariable>();
	private _config: any;
	constructor(public _ADP: DebugSession, public fileAccessor: FileAccessor) {
		super();
	}
	public setRunLine(Line: number = 1) {
		const msg = {
			command: 0,
			sceneMsg: {
				scene: this._config.program,
				sentence: Line,
			},
			stageSyncMsg: {},
			message: "徐然",
		};
		this._WS.send(JSON.stringify(msg));
	}
	public getLocalVariables(): RuntimeVariable[] {
		return Array.from(this.variables, ([name, value]) => value);
	}
	getWS() {
		return this._WS;
	}
	private normalizePathAndCasing(path: string) {
		if (this.fileAccessor.isWindows) {
			return (
				this._ADP.workspaceFolder?.uri.path.substring(3) +
				"/game/scene/" +
				path.replace(/\//g, "\\").toLowerCase()
			);
		} else {
			return (
				this._ADP.workspaceFolder?.uri.path! +
				"/game/scene/" +
				path.replace(/\\/g, "/")
			);
		}
	}
	async start(program: string) {
		const _obj = createWS(this._ADP, this);
		this._WS = _obj.sock;
		this._config = _obj.config;
	}
	public sendEvent(event: string, ...args: any[]): void {
		setTimeout(() => {
			this.emit(event, ...args);
		}, 0);
	}
}

function createWS(_ADP: DebugSession, self: XRRuntime) {
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
		let newv = new Map<string, RuntimeVariable>();
		for (let _var in _data.stageSyncMsg.GameVar) {
			const _val = _data.stageSyncMsg.GameVar[_var];
			newv.set(_var, new RuntimeVariable(_var, _val));
		}
		self.variables = newv;
		self._ADP.customRequest("updatevar");
		self._ADP.customRequest("variables");
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
	return { sock, config };
}
