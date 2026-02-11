import { Connection } from "vscode-languageserver";
import { ConnectionDocumentsType, ConnectionHandler } from "@/server/types";

// handlers
import onCompletion from "./onCompletion";
import onDefinition from "./onDefinition";
import onDid from "./onDid";
import onDocumentLinks from "./onDocumentLinks";
import onFoldingRanges from "./onFoldingRanges";
import onHover from "./onHover";
import onInitialize from "./onInitialize";
import onInitialized from "./onInitialized";
import onDiagnostics from "./onDiagnostics";

const handlers: ConnectionHandler[] = [
	onHover,
	onCompletion,
	onDefinition,
	onDocumentLinks,
	onFoldingRanges,
	onInitialize,
	onInitialized,
	onDiagnostics,
	onDid
];

export default function (
	documents: ConnectionDocumentsType,
	connection: Connection
) {
	for (const handler of handlers) {
		handler(documents, connection);
	}
}
