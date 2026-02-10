import path from "path";
import { LanguageClient } from "vscode-languageclient/node";

const FJoin = (client: LanguageClient) =>
	client.onRequest("client/FJoin", async (args: string | string[]) => {
		try {
			return path.join(...(Array.isArray(args) ? args : [args]));
		} catch (e: any) {
			return null;
		}
	});

export default FJoin;
