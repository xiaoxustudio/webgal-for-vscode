import { LanguageClient } from "vscode-languageclient/node";
import { getState } from "../utils/providerState";

const goPropertyDoc = (client: LanguageClient) => {
	client.onRequest("client/goPropertyDoc", async (pathSegments: string[]) => {
		try {
			return getState("stage", pathSegments);
		} catch (e: any) {
			return null;
		}
	});
	client.onRequest(
		"client/goPropertyDocUserData",
		async (pathSegments: string[]) => {
			try {
				return getState("user", pathSegments);
			} catch (e: any) {
				return null;
			}
		}
	);
};

export default goPropertyDoc;
