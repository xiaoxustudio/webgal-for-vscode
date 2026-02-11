/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-10-12 13:30:40
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as Net from "net";
import * as vscode from "vscode";
import { XRDebugSession } from "./DebugSession";
import { fsAccessor } from "@/core";

let port = 0;
const args = process.argv.slice(2);
args.forEach(function (val) {
	const portMatch = /^--server=(\d{4,5})$/.exec(val);
	if (portMatch) {
		port = parseInt(portMatch[1], 10);
	}
});
const debug = vscode.debug.activeDebugSession;
if (port > 0 && debug) {
	console.error(`waiting for debug protocol on port ${port}`);
	Net.createServer((socket) => {
		console.error(">> accepted connection from client");
		socket.on("end", () => {
			console.error(">> client connection closed\n");
		});
		const session = new XRDebugSession(debug, fsAccessor);
		session.setRunAsServer(true);
		session.start(socket, socket);
	}).listen(port);
} else if (debug) {
	const session = new XRDebugSession(debug, fsAccessor);
	process.on("SIGTERM", () => {
		session.shutdown();
	});
	session.start(process.stdin, process.stdout);
}
