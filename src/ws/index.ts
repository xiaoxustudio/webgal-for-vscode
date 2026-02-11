import { DebugSession, Range, TextEditorDecorationType, window } from "vscode";
import {
	disableGameStatus,
	enableGameStatus,
	setGameData
} from "@/utils/utils";
import EventEmitter from "events";
import WebSocket, { WebSocket as WS } from "ws";
import { is_JSON } from "@/utils/utils_novsc";
import {
	DebugCommand,
	FileAccessor,
	IDebugMessage,
	RuntimeVariable
} from "@/core";

export function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class XRRuntime extends EventEmitter {
	private _WS!: WS;
	public variables = new Map<string, Map<string, RuntimeVariable>>([
		["local", new Map<string, RuntimeVariable>()],
		["env", new Map<string, RuntimeVariable>()],
		["scene", new Map<string, RuntimeVariable>()]
	]);
	private _config: any;
	public _clearFunc!: Function;
	constructor(
		public _ADP: DebugSession,
		public fileAccessor: FileAccessor
	) {
		super();
	}
	public setRunLine(Line: number = 1) {
		const msg: IDebugMessage = {
			event: "message",
			data: {
				command: DebugCommand.JUMP,
				sceneMsg: {
					scene: this._config.program,
					sentence: Line
				}, // @ts-ignore
				stageSyncMsg: {},
				message: "Sync"
			}
		};
		this._WS.send(JSON.stringify(msg));
	}
	public getLocalVariables(type: "env" | "scene" | "var"): RuntimeVariable[] {
		switch (type) {
			case "env": {
				return Array.from(
					this.variables.get("env") as Map<string, RuntimeVariable>,
					([name, value]) => value
				);
			}
			case "scene": {
				return Array.from(
					this.variables.get("scene") as Map<string, RuntimeVariable>,
					([name, value]) => value
				);
			}
			case "var": {
				return Array.from(
					this.variables.get("local") as Map<string, RuntimeVariable>,
					([name, value]) => value
				);
			}
			default: {
				return Array.from(
					this.variables.get("local") as Map<string, RuntimeVariable>,
					([name, value]) => value
				);
			}
		}
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
		this._clearFunc = _obj.clearDecorationType;
	}
	public sendEvent(event: string, ...args: any[]): void {
		setTimeout(() => {
			this.emit(event, ...args);
		}, 0);
	}
}

function createWS(_ADP: DebugSession, self: XRRuntime) {
	const config = _ADP.configuration;
	const _ws_host = config.ws || "ws://localhost:3001/api/webgalsync";
	const sock = new WebSocket(_ws_host);
	const editor = window.activeTextEditor;
	let _restart: NodeJS.Timeout | null;
	let _sendMy = false;
	let decorationType: TextEditorDecorationType;
	let last_line_num = -1;
	function clearDecorationType() {
		const editor = window.activeTextEditor;
		if (editor && decorationType) {
			editor.setDecorations(decorationType, []);
			decorationType?.dispose();
		}
	}
	sock.on("open", function () {
		if (sock.readyState === 1) {
			clearDecorationType();
			enableGameStatus(sock);
			const msg: IDebugMessage = {
				event: "message",
				data: {
					command: DebugCommand.JUMP,
					sceneMsg: {
						scene: config.program,
						sentence: 0
					}, // @ts-ignore
					stageSyncMsg: {},
					message: "徐然"
				}
			};
			sock.send(JSON.stringify(msg));
			window.showInformationMessage("(webgal)调试连接到：" + _ws_host);
			_restart = setTimeout(() => {
				sock.emit("close");
				console.log("(webgal)连接超时");
			}, 5000);
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
		_sendMy = false;
		_ADP.customRequest("close");
	});
	sock.on("runscript", function (e: string) {
		if (sock.readyState === 1) {
			const msg: IDebugMessage = {
				event: "message",
				data: {
					command: DebugCommand.EXE_COMMAND,
					sceneMsg: {
						scene: config.program,
						sentence: 1
					},
					stageSyncMsg: {},
					message: e
				}
			};
			sock.send(JSON.stringify(msg));
		}
	});

	sock.on("close", function () {
		setGameData({});
		disableGameStatus();
		window.showErrorMessage("(webgal)调试关闭！");
		console.log("(webgal)调试关闭！");
		clearDecorationType();
		last_line_num = -1;
		_sendMy = false;
		_ADP.customRequest("disconnect");
	});
	sock.on("message", function (data: Buffer) {
		if (!_sendMy) {
			_sendMy = true;
			clearTimeout(_restart!);
			_restart = null;
			return;
		} else if (_restart) {
			clearTimeout(_restart);
			return;
		} else if (!is_JSON(data.toString())) {
			return;
		}
		let _data = JSON.parse(data.toString()) as IDebugMessage;
		let newv = new Map<string, Map<string, RuntimeVariable>>([
			["local", new Map<string, RuntimeVariable>()],
			["env", new Map<string, RuntimeVariable>()],
			["scene", new Map<string, RuntimeVariable>()]
		]);
		for (let _var in _data.data.stageSyncMsg.GameVar) {
			const _val = _data.data.stageSyncMsg.GameVar[_var];
			const _local = newv.get("local");
			if (_local) {
				_local.set(_var, new RuntimeVariable(_var, _val));
			}
		}
		for (let _var in _data.data.stageSyncMsg) {
			const _val = _data.data.stageSyncMsg[_var];
			const _env = newv.get("env");
			if (_env && _var !== "GameVar") {
				_env.set(_var, new RuntimeVariable(_var, _val));
			}
		}
		const sceneMsg: Record<string, any> = _data.data.sceneMsg;
		for (let _var in sceneMsg) {
			const _val = sceneMsg[_var];
			const _scene = newv.get("scene");
			if (_scene) {
				_scene.set(_var, new RuntimeVariable(_var, _val));
			}
		}
		self.variables = newv;
		// self._ADP.customRequest("updatevar");
		setGameData(_data);
		if (!editor || !editor.document) return;
		const _fname = String(editor.document.fileName || "");
		const _dname = String(sceneMsg.scene || "");
		const _now = _fname.substring(_fname.lastIndexOf("\\") + 1);
		const _target = _dname.substring(_dname.lastIndexOf("\\") + 1);
		if (!_now || !_target) return;
		if (
			sceneMsg &&
			last_line_num !== sceneMsg.sentence &&
			_now === _target
		) {
			clearDecorationType();
			decorationType = window.createTextEditorDecorationType({
				backgroundColor: "rgba(150, 0, 0, 0.3)",
				isWholeLine: true
			});
			last_line_num = sceneMsg.sentence;
			const _num = Math.max(last_line_num - 1, 0);
			const range = new Range(
				_num,
				0,
				_num,
				editor.document.lineAt(_num).text.length
			);
			editor.setDecorations(decorationType, [range]);
		}
	});
	return { sock, config, clearDecorationType };
}
