/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-29 19:47:01
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as Net from "net";
import { XRDebugAdapter } from "./DebugSession";
import * as vscode from "vscode";

// first parse command line arguments to see whether the debug adapter should run as a server
let port = 0;
const args = process.argv.slice(2);
args.forEach(function (val, index, array) {
	const portMatch = /^--server=(\d{4,5})$/.exec(val);
	if (portMatch) {
		port = parseInt(portMatch[1], 10);
	}
});
const debug = vscode.debug.activeDebugSession;
if (port > 0 && debug) {
	// start a server that creates a new session for every connection request
	console.error(`waiting for debug protocol on port ${port}`);
	Net.createServer((socket) => {
		console.error(">> accepted connection from client");
		socket.on("end", () => {
			console.error(">> client connection closed\n");
		});
		const session = new XRDebugAdapter(debug);
		session.setRunAsServer(true);
		session.start(socket, socket);
	}).listen(port);
} else if (debug) {
	// start a single session that communicates via stdin/stdout
	const session = new XRDebugAdapter(debug);
	process.on("SIGTERM", () => {
		session.shutdown();
	});
	session.start(process.stdin, process.stdout);
}
