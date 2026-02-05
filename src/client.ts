/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-07-02 10:38:21
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from "vscode-languageclient/node";
import path from "path";
import requests from "./requests";
import { ExtensionContext, workspace } from "vscode";
import { selector, selectorConfig } from "./utils/utils";

export function create_client(context: ExtensionContext): LanguageClient {
	const serverModule = context.asAbsolutePath(
		path.join("out", "server", "server.js")
	);

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc
		}
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [selector, selectorConfig],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc")
		}
	};

	const client = new LanguageClient(
		"XR WEBGAL Language Server",
		"XR WEBGAL Language Server",
		serverOptions,
		clientOptions
	);

	for (const bindingFunction of requests) {
		bindingFunction(client);
	}

	return client;
}
