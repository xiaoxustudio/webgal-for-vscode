/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-31 16:26:45
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	ExitedEvent,
	Handles,
	InitializedEvent,
	Logger,
	logger,
	LoggingDebugSession,
	Scope,
	StackFrame,
	StoppedEvent,
	Thread,
} from "@vscode/debugadapter";
import { DebugProtocol } from "@vscode/debugprotocol";
import { getGameData } from "./utils/utils";
import { debug, DebugSession } from "vscode";
import XRRuntime, { RuntimeVariable } from "./ws";
import { FileAccessor } from "./utils/utils_novsc";
import { WebSocket } from "ws";
interface IAttachRequestArguments extends ILaunchRequestArguments {}
interface ILaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	program: string;
	stopOnEntry?: boolean;
	trace?: boolean;
	noDebug?: boolean;
	compileError?: "default" | "show" | "hide";
}

export class XRDebugSession extends LoggingDebugSession {
	private static threadID = 1;
	private _socket!: WebSocket;
	private _socket_real: XRRuntime;
	private _variableHandles = new Handles<
		"locals" | "globals" | "env" | "scene" | RuntimeVariable
	>();
	private _valuesInHex = false;
	constructor(_s: DebugSession, private FileAccess: FileAccessor) {
		super("webgal-debug.txt");
		this.setDebuggerLinesStartAt1(false);
		this.setDebuggerColumnsStartAt1(false);
		const _ws = new XRRuntime(_s, FileAccess);
		this._socket_real = _ws;
	}
	dispose() {
		this._socket.close();
	}
	protected initializeRequest(
		response: DebugProtocol.InitializeResponse
	): void {
		// 告诉调试器我们支持的功能
		response.body = response.body || {};
		response.body.supportsSetVariable = true;
		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsStepBack = false;
		response.body.supportsSteppingGranularity = false;
		response.body.supportsEvaluateForHovers = false;
		response.body.supportsStepBack = false;
		response.body.supportsRestartFrame = false;
		response.body.supportsGotoTargetsRequest = false;
		response.body.supportsStepInTargetsRequest = false;
		response.body.supportsCompletionsRequest = false;
		response.body.supportsCancelRequest = false;
		response.body.supportsBreakpointLocationsRequest = false;
		this.sendResponse(response);
		console.log("(webgal)initializing");
		this.sendEvent(new InitializedEvent());
	}
	protected attachRequest(
		response: DebugProtocol.AttachResponse,
		args: IAttachRequestArguments
	) {
		return this.launchRequest(response, args);
	}
	protected restartRequest(
		response: DebugProtocol.RestartResponse,
		args: DebugProtocol.RestartArguments,
		request?: DebugProtocol.Request | undefined
	): void {
		this._socket_real._clearFunc();
		this.sendResponse(response);
	}
	protected launchRequest(
		response: DebugProtocol.LaunchResponse,
		args: ILaunchRequestArguments
	): void {
		logger.setup(
			args.trace ? Logger.LogLevel.Verbose : Logger.LogLevel.Stop,
			false
		);
		this._socket_real.start(args.program);
		this._socket = this._socket_real.getWS();
		this.sendEvent(new StoppedEvent("entry", XRDebugSession.threadID));
		this.sendResponse(response);
	}
	protected evaluateRequest(
		response: DebugProtocol.EvaluateResponse,
		args: DebugProtocol.EvaluateArguments
	): void {
		if (args.context === "repl") {
			const expression = args.expression;
			const _data = getGameData() as any;
			const _stage = _data?.stageSyncMsg;
			const _scene = _data?.sceneMsg;
			const _start = expression.substring(0, 1);
			if (
				_stage &&
				_start &&
				_start === "$" &&
				Object.keys(_stage).indexOf(expression.substring(1)) !== -1
			) {
				response.body = {
					result: String(_stage[expression.substring(1)]),
					variablesReference: 0,
				};
			} else if (
				_stage &&
				_start &&
				_start === "#" &&
				Object.keys(_scene).indexOf(expression.substring(1)) !== -1
			) {
				response.body = {
					result: String(_scene[expression.substring(1)]),
					variablesReference: 0,
				};
			} else if (_stage && _start && _start === "@") {
				switch (expression) {
					case "@run":
						response.body = {
							result: String(Object.keys(_scene)),
							variablesReference: 0,
						};
						break;
					case "@env":
						response.body = {
							result: String(Object.keys(_stage)),
							variablesReference: 0,
						};
						break;
					default:
						const _ex = /@set\s+(\S+)\s+(\S+)/.exec(expression);
						const _ex_run = /@script\s+(.*)/.exec(expression);
						if (_ex) {
							this._socket.emit("runscript", `setVar:${_ex[1]}=${_ex[2]};`);
							response.body = {
								result: _ex[2],
								variablesReference: 0,
							};
						} else if (_ex_run) {
							this._socket.emit("runscript", `${_ex_run[1]}`);
							response.body = {
								result: _ex_run[1],
								variablesReference: 0,
							};
						} else {
							response.body = {
								result: "null",
								variablesReference: 0,
							};
						}
						break;
				}
			} else if (
				_stage &&
				Object.keys(_stage).indexOf("GameVar") !== -1 &&
				Object.keys(_stage.GameVar).indexOf(expression) !== -1
			) {
				response.body = {
					result: String(_stage.GameVar[expression]),
					variablesReference: 0,
				};
			} else {
				response.body = {
					result: "null",
					variablesReference: 0,
				};
			}
		}
		this.sendResponse(response);
	}
	protected configurationDoneRequest(
		response: DebugProtocol.Response,
		args: any
	) {
		this.sendResponse(response);
	}
	protected threadsRequest(response: DebugProtocol.Response) {
		response.body = {
			threads: [new Thread(XRDebugSession.threadID, "thread 1")],
		};

		this.sendResponse(response);
	}
	protected stackTraceRequest(
		response: DebugProtocol.StackTraceResponse,
		args: any
	) {
		response.body = {
			stackFrames: [new StackFrame(1, "XRWebGalruntime")],
		};
		this.sendResponse(response);
	}
	protected scopesRequest(
		response: DebugProtocol.ScopesResponse,
		args?: DebugProtocol.ScopesArguments
	): void {
		response.body = {
			scopes: [
				new Scope("Locals", this._variableHandles.create("locals"), false),
				new Scope("Env", this._variableHandles.create("env"), false),
				new Scope("Scene", this._variableHandles.create("scene"), false),
			],
		};
		this.sendResponse(response);
	}
	protected variablesRequest(
		response: DebugProtocol.VariablesResponse,
		args: DebugProtocol.VariablesArguments
	): void {
		const _nfef = this._variableHandles.get(args.variablesReference);
		let vs: DebugProtocol.Variable[] = [];
		if (_nfef === "locals") {
			vs = (
				this._socket_real.getLocalVariables("var") as RuntimeVariable[]
			).map((v) =>
				this.convertFromRuntime(v, args.variablesReference)
			) as DebugProtocol.Variable[];
		} else if (_nfef === "scene") {
			vs = (
				this._socket_real.getLocalVariables("scene") as RuntimeVariable[]
			).map((v) =>
				this.convertFromRuntime(v, args.variablesReference)
			) as DebugProtocol.Variable[];
		} else if (_nfef === "env") {
			vs = (
				this._socket_real.getLocalVariables("env") as RuntimeVariable[]
			).map((v) =>
				this.convertFromRuntime(v, args.variablesReference)
			) as DebugProtocol.Variable[];
		} else {
			if (_nfef instanceof RuntimeVariable) {
				if (typeof _nfef.value === "object" && _nfef.desc === "Array") {
					for (let i in _nfef.value) {
						const _val = _nfef.value[i];
						const _val_name = _val.desc ?? String(_val.value);
						let _var = {
							name: _val.name,
							value: _val_name,
							variablesReference: _val.reference ?? 0,
						} as DebugProtocol.Variable;
						vs.push(_var);
					}
				} else if (typeof _nfef.value === "object" && _nfef.desc === "Object") {
					const _keys = _nfef.value;
					for (let i in _keys) {
						const _val = _keys[i] as RuntimeVariable;
						const _val_name = _val.desc ?? String(_val.value);
						let _var = {
							name: _val.name,
							value: _val_name,
							variablesReference: _val.reference ?? 0,
						} as DebugProtocol.Variable;
						vs.push(_var);
					}
				} else {
					let _var = {
						name: _nfef.name,
						value: String(_nfef.value),
						variablesReference: 0,
					} as DebugProtocol.Variable;
					vs.push(_var);
				}
			}
		}
		response.body = {
			variables: vs,
		};
		this.sendResponse(response);
	}
	protected setVariableRequest(
		response: DebugProtocol.SetVariableResponse,
		args: DebugProtocol.SetVariableArguments,
		request?: DebugProtocol.Request | undefined
	): void {
		const _origin_var = this._variableHandles.get(args.variablesReference);
		if (_origin_var === "locals") {
			this._socket.emit("runscript", `setVar:${args.name}=${args.value};`);
			response.body = {
				...args,
			};
		}
		this.sendResponse(response);
	}
	private formatNumber(x: number) {
		return this._valuesInHex ? "0x" + x.toString(16) : x.toString(10);
	}
	private convertFromRuntime(
		v: RuntimeVariable,
		vref?: number
	): DebugProtocol.Variable {
		let dapVariable: DebugProtocol.Variable = {
			name: v.name,
			value: "???",
			type: typeof v.value,
			variablesReference: 0,
			evaluateName: v.name,
		};
		if (v.value instanceof Object) {
			v.reference ??= this._variableHandles.create(v);
			dapVariable.variablesReference = v.reference;
			const _to_runtimeval = (_runVal: Array<any>): RuntimeVariable[] => {
				let _arr: Array<any> = [];
				for (let _rK in _runVal) {
					let _rV = _runVal[_rK];
					const _r = new RuntimeVariable(_rK, _rV);
					if (Array.isArray(_rV)) {
						_r.reference ??= this._variableHandles.create(_r);
						_r.desc = "Array";
						_r.value = _to_runtimeval(_rV);
					} else if (typeof _rV === "object") {
						_r.reference ??= this._variableHandles.create(_r);
						_r.desc = "Object";
						_r.value = _to_runtimeval_obj(_rV);
					}
					_arr.push(_r);
				}
				return _arr;
			};
			const _to_runtimeval_obj = (_runVal: {
				[key: string]: any;
			}): RuntimeVariable[] => {
				let r: RuntimeVariable[] = [];
				const _keys = Object.keys(_runVal);
				for (let _rK in _keys) {
					const ___r = _keys[_rK];
					let _rV = _runVal[___r];
					const _r = new RuntimeVariable(___r, _rV);
					if (Array.isArray(_rV)) {
						_r.reference ??= this._variableHandles.create(_r);
						_r.desc = "Array";
						_r.value = _to_runtimeval(_rV);
					} else if (typeof _rV === "object") {
						_r.reference ??= this._variableHandles.create(_r);
						_r.desc = "Object";
						_r.value = _to_runtimeval_obj(_rV);
					}
					r.push(_r);
				}
				return r;
			};
			if (Array.isArray(v.value)) {
				dapVariable.value = "Array ";
				v.value = _to_runtimeval(v.value);
				v.desc = "Array";
			} else if (v.value) {
				dapVariable.value = "Object";
				v.value = _to_runtimeval_obj(v.value);
				v.desc = "Object";
			}
		} else {
			switch (typeof v.value) {
				case "number":
					if (Math.round(v.value) === v.value) {
						dapVariable.value = this.formatNumber(v.value);
						(<any>dapVariable).__vscodeVariableMenuContext = "simple";
						dapVariable.type = "integer";
					} else {
						dapVariable.value = v.value.toString();
						dapVariable.type = "float";
					}
					break;
				case "string":
					dapVariable.value = `"${v.value}"`;
					break;
				case "boolean":
					dapVariable.value = v.value ? "true" : "false";
					break;
				default:
					dapVariable.value = typeof v.value;
					break;
			}
		}

		return dapVariable;
	}
	protected disconnectRequest(request: DebugProtocol.DisconnectRequest): void {}
	protected customRequest(
		command: string,
		response: DebugProtocol.Response
	): void {
		switch (command) {
			case "updatevar":
				{
					// let vs = (
					// 	this._socket_real.getLocalVariables() as RuntimeVariable[]
					// ).map((v) => this.convertFromRuntime(v)) as DebugProtocol.Variable[];
					// response.body = {
					// 	variables: vs,
					// };
					// response.success = true;
					// response.command = "variables";
					// response.type = "response";
					this.sendResponse(response);
				}
				return;
			case "close":
				debug.stopDebugging();
				this.sendResponse(response);
				break;
			default:
				this.sendResponse(response);
				break;
		}
	}
}
