import { Uri, workspace } from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

const readDirectory = (client: LanguageClient) =>
	client.onRequest("client/readDirectory", async (uriString: string) => {
		try {
			const uri = Uri.parse(uriString);
			const data = await workspace.fs.readDirectory(uri);
			return data;
		} catch (e: any) {
			return null;
		}
	});

export default readDirectory;
