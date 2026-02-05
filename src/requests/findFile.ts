import path from "path";
import fs from "fs";
import { LanguageClient } from "vscode-languageclient/node";

const searchFileRecursive = async (
	targetName: string,
	dir: string,
	ignoreDirs: string[] = ["node_modules", ".git", "dist", "build"]
): Promise<string | null> => {
	try {
		const dirents = fs.readdirSync(dir, {
			withFileTypes: true
		});

		for (const dirent of dirents) {
			const fullPath = path.join(dir, dirent.name);

			if (dirent.isFile() && dirent.name === targetName) {
				return fullPath;
			}

			if (dirent.isDirectory() && !ignoreDirs.includes(dirent.name)) {
				const result = await searchFileRecursive(
					targetName,
					fullPath,
					ignoreDirs
				);
				if (result) {
					return result; // 层层向上返回
				}
			}
		}
	} catch (error) {
		return null;
	}
	return null;
};

const findFile = (client: LanguageClient) =>
	client.onRequest("client/findFile", async ([startPath, targetName]) => {
		try {
			return searchFileRecursive(targetName, startPath);
		} catch (error) {
			return null;
		}
	});

export default findFile;
