/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-29 09:01:13
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	BreakpointEvent,
	Handles,
	InitializedEvent,
	LoggingDebugSession,
	Scope,
	StoppedEvent,
} from "@vscode/debugadapter";
import { DebugProtocol } from "@vscode/debugprotocol";
import { EventEmitter } from "events";
import { getGameData } from "./utils/utils";

export class MyDebugAdapter extends LoggingDebugSession {
	private _socket: EventEmitter;
	private _variableHandles = new Handles<"locals" | "globals">();
	constructor() {
		super();
		this.setDebuggerLinesStartAt1(false);
		this.setDebuggerColumnsStartAt1(false);
		this._socket = new EventEmitter();
		this._socket.on("message", (message: DebugProtocol.ProtocolMessage) =>
			this.handleMessage(message as DebugProtocol.ProtocolMessage)
		);
		this._socket.on("close", () => console.log("Connection closed."));
		this._socket.on("connection", () => {
			const _ws = require("./ws");
			_ws.default(this);
		});
	}
	dispose() {}
	async initializeRequest(
		response: DebugProtocol.InitializeResponse
	): Promise<void> {
		this.sendEvent(new InitializedEvent());
		// 设置断点
		const breakpoints: DebugProtocol.Breakpoint[] = [
			{
				line: 1,
				verified: true,
			},
		];
		// 发送设置断点的请求
		this.sendEvent(new BreakpointEvent("new", breakpoints[0]));
		this.sendEvent(new StoppedEvent("entry", 0));
		console.log("running");
		this._socket.emit("connection");
		this.sendResponse(response);
	}
	async launchRequest(request: DebugProtocol.LaunchResponse): Promise<void> {
		this.sendEvent(new InitializedEvent());
		this.sendResponse(request);
	}
	async setBreakpointsRequest(
		response: DebugProtocol.Response,
		args: { breakpoints: any[] }
	) {
		response.body = {
			breakpoints: args.breakpoints.map((bp: { line: any }) => ({
				verified: true,
				line: bp.line,
			})),
		};
		this.sendResponse(response);
	}
	async evaluateRequest(
		response: DebugProtocol.EvaluateResponse,
		args: DebugProtocol.EvaluateArguments
	): Promise<void> {
		if (args.context === "repl") {
			// 用户在调试控制台输入的表达式
			const expression = args.expression;
			const _data = getGameData() as any;
			const _stage = _data?.stageSyncMsg;
			if (
				_stage &&
				Object.keys(_stage).indexOf("GameVar") !== -1 &&
				Object.keys(_stage.GameVar).indexOf(expression) !== -1
			) {
				response.body = {
					result: String(_stage.GameVar[expression]),
					variablesReference: 0, // 表示没有更多的变量层次结构
				};
			} else {
				response.body = {
					result: "null",
					variablesReference: 0, // 表示没有更多的变量层次结构
				};
			}
		}
		this.sendResponse(response);
	}
	async configurationDoneRequest(response: DebugProtocol.Response, args: any) {
		this.sendResponse(response);
	}
	async threadsRequest(response: DebugProtocol.Response) {
		response.body = {
			threads: [
				{
					id: 1,
					name: "MyThread",
				},
			],
		};
		this.sendResponse(response);
	}

	async stackTraceRequest(
		response: DebugProtocol.StackTraceResponse,
		args: any
	) {
		response.body = {
			stackFrames: [
				{
					id: 1,
					name: "MyStackFrame",
					line: 1,
					column: 1,
				},
			],
		};
		this.sendResponse(response);
	}
	async scopesRequest(response: DebugProtocol.Response, args: any) {
		response.body = {
			scopes: [
				new Scope("Locals", this._variableHandles.create("locals"), false),
				new Scope("Globals", this._variableHandles.create("globals"), true),
			],
		};
		this.sendResponse(response);
	}
	async variablesRequest(
		request: DebugProtocol.VariablesResponse,
		args: DebugProtocol.VariablesArguments
	): Promise<void> {
		request.body = {
			variables: [
				{
					name: "myVariable",
					value: "123",
					variablesReference: 0,
				},
			],
		};
		this.sendResponse(request);
	}
	async disconnectRequest(
		request: DebugProtocol.DisconnectRequest
	): Promise<void> {
		// 断开连接
	}

	customRequest(
		command: string,
		response: DebugProtocol.Response,
		args: any,
		request?: DebugProtocol.Request | undefined
	): void {
		this.sendResponse(response as DebugProtocol.VariablesResponse);
	}
}
