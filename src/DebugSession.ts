/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-29 14:28:24
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
	Thread,
} from "@vscode/debugadapter";
import { DebugProtocol } from "@vscode/debugprotocol";
import { EventEmitter } from "events";
import { getGameData } from "./utils/utils";

export class MyDebugAdapter extends LoggingDebugSession {
	private _socket;
	private _variableHandles = new Handles<string>();
	constructor() {
		super("webgal-debug.txt");
		this.setDebuggerLinesStartAt1(false);
		this.setDebuggerColumnsStartAt1(false);
		const _ws = require("./ws");
		this._socket = _ws.default(this);
	}
	dispose() {
		this._socket.close();
	}
	protected initializeRequest(
		response: DebugProtocol.InitializeResponse
	): void {
		this.sendEvent(new InitializedEvent());
		response.body = response.body || {};
		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsEvaluateForHovers = true;
		response.body.supportsFunctionBreakpoints = true;
		response.body.supportsStepBack = false;
		response.body.supportsStepInTargetsRequest = false;
		response.body.supportsStepInTargetsRequest;
		response.body.supportsExceptionInfoRequest = false;
		response.body.supportsDelayedStackTraceLoading = true;
		this.sendEvent(new StoppedEvent("entry", 0));
		this.sendEvent(new StoppedEvent("breakpoint", 0));
		this.sendEvent(
			new BreakpointEvent("changed", {
				verified: true,
				id: 0,
			} as DebugProtocol.Breakpoint)
		);
		console.log("running");
		this.sendResponse(response);
	}
	protected launchRequest(request: DebugProtocol.LaunchResponse): void {
		this.sendEvent(new InitializedEvent());
		this.sendResponse(request);
	}
	protected BreakpointsRequest(
		response: DebugProtocol.Response,
		args: { breakpoints: any[] }
	) {
		response.body = {
			breakpoints: response,
		};
		this.sendResponse(response);
	}
	protected setBreakpointsRequest(
		response: DebugProtocol.Response,
		args: { breakpoints: any[] }
	) {
		const breakpoints = args.breakpoints.map((bp) => {
			const { line, verified } = bp;
			const id = this._variableHandles.create(`${line}`);
			return { line, id, verified };
		});
		breakpoints.forEach((bp) =>
			this.sendEvent(
				new BreakpointEvent("new", {
					id: bp.id,
					line: bp.line,
					verified: true,
				})
			)
		);
		response.body = {
			breakpoints: breakpoints,
		};
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
						response.body = {
							result: "null",
							variablesReference: 0,
						};
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
			threads: [new Thread(1, "thread 1")],
		};
		this.sendResponse(response);
	}
	protected stackTraceRequest(
		response: DebugProtocol.StackTraceResponse,
		args: any
	) {
		this.sendResponse(response);
	}
	protected scopesRequest(
		response: DebugProtocol.ScopesResponse,
		args: DebugProtocol.ScopesArguments
	): void {
		const frameReference = args.frameId;
		const scopes = new Array<Scope>();
		scopes.push(
			new Scope(
				"Local",
				this._variableHandles.create("local_" + frameReference),
				false
			)
		);
		response.body = {
			scopes: scopes,
		};
		this.sendResponse(response);
	}
	protected variablesRequest(
		response: DebugProtocol.VariablesResponse,
		args: DebugProtocol.VariablesArguments
	): void {
		const variables = new Array<DebugProtocol.Variable>();
		const scopeId = this._variableHandles.get(args.variablesReference);
		this.sendResponse(response);
	}
	protected disconnectRequest(request: DebugProtocol.DisconnectRequest): void {}

	customRequest(
		command: string,
		response: DebugProtocol.Response,
		args: any,
		request?: DebugProtocol.Request | undefined
	): void {
		this.sendResponse(response);
	}
}
