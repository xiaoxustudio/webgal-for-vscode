/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-30 21:40:26
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from "vscode-languageclient/node";
import { ExtensionContext, workspace } from "vscode";
import path from "path";
import { selector } from "./utils/utils";

export function create_client(context: ExtensionContext): LanguageClient {
	const serverModule = context.asAbsolutePath(path.join("out", "server.js"));
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		},
	};
	const clientOptions: LanguageClientOptions = {
		documentSelector: [selector],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
		},
	};
	return new LanguageClient(
		"XRWEBGALlanguageServer",
		"XR WEBGAL Language Server",
		serverOptions,
		clientOptions
	);
}
