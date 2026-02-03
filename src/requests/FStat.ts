import { statSync } from "fs";
import { LanguageClient } from "vscode-languageclient/node";

const FStat = (client: LanguageClient) =>
	client.onRequest("client/FStat", async (path: string) => {
		try {
			return statSync(path);
		} catch (e: any) {
			return null;
		}
	});

export default FStat;
