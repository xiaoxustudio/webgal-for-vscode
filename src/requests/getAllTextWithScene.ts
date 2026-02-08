import { readdirSync, readFileSync } from "fs";
import path from "path";
import { workspace } from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

const getAllTextWithScene = (client: LanguageClient) =>
	client.onRequest("client/getAllTextWithScene", async () => {
		try {
			if (!workspace.workspaceFolders) return null;
			const currentDirectory = workspace.workspaceFolders[0].uri.fsPath;
			const dir = path.join(currentDirectory, "scene");
			const dirents = readdirSync(dir, {
				withFileTypes: true
			});

			const map: Record<string, any> = {};

			for (const dirent of dirents) {
				const fullPath = path.join(dir, dirent.name);
				if (dirent.isFile() && dirent.name.endsWith(".txt")) {
					map[dirent.name] = {
						path: fullPath,
						name: dirent.name,
						text: readFileSync(fullPath, "utf-8"),
						fullPath
					};
				}
			}
			return map;
		} catch (e: any) {
			return null;
		}
	});

export default getAllTextWithScene;
