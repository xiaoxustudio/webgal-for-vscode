import { DidChangeConfigurationNotification } from "vscode-languageserver";
import { ConnectionHandler } from "@/server/types";
import { StateConfig } from "@/server/utils";

export default <ConnectionHandler>function (documents, connection) {
	connection.onInitialized(() => {
		if (StateConfig.hasConfigurationCapability) {
			connection.client.register(
				DidChangeConfigurationNotification.type,
				undefined
			);
		}
		if (StateConfig.hasWorkspaceFolderCapability) {
			connection.workspace.onDidChangeWorkspaceFolders((_event) => {
				connection.console.log(
					"Workspace folder change event received."
				);
			});
		}

		connection.sendRequest("client/showTip", "WebGal LSP Initialized");
	});
};
