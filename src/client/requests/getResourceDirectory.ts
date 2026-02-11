import { readdirSync } from "fs";
import path from "path";
import { workspace } from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

const getResourceDirectory = (client: LanguageClient) =>
	client.onRequest("client/getResourceDirectory", async (urls: string[]) => {
		try {
			if (!workspace.workspaceFolders) return null;
			const currentDirectory = workspace.workspaceFolders[0].uri.fsPath;
			const url = path.join(currentDirectory, ...urls);
			const data = readdirSync(url, {
				withFileTypes: true
			});
			return data.map((file) => ({
				...file,
				isDirectory: file.isDirectory()
			}));
		} catch (e: any) {
			return null;
		}
	});

export default getResourceDirectory;
