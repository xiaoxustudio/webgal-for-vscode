import * as vsocde from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

const showTip = (client: LanguageClient) =>
	client.onRequest("client/showTip", async (message: string) => {
		try {
			return vsocde.window.showInformationMessage(message);
		} catch (e: any) {
			return null;
		}
	});

export default showTip;
