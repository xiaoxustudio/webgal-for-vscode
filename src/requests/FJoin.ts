import path from "path";
import { LanguageClient } from "vscode-languageclient/node";

const FJoin = (client: LanguageClient) =>
	client.onRequest("client/FJoin", async (p: string) => {
		try {
			return path.join(p);
		} catch (e: any) {
			return null;
		}
	});

export default FJoin;
