import { workspace } from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

const currentDirectory = (client: LanguageClient) =>
	client.onRequest("client/currentDirectory", async () => {
		try {
			if (!workspace.workspaceFolders) return null;
			const currentDirectory = workspace.workspaceFolders[0].uri.fsPath;
			return currentDirectory;
		} catch (e: any) {
			return null;
		}
	});

export default currentDirectory;
