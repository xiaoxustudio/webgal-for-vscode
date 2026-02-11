import {
	DocumentDiagnosticReport,
	DocumentDiagnosticReportKind
} from "vscode-languageserver";
import { ConnectionHandler } from "@/server/types";
import { validateTextDocument } from "@/server/utils";

export default <ConnectionHandler>function (documents, connection) {
	connection.languages.diagnostics.on(async (params) => {
		const document = documents.get(params.textDocument.uri);
		if (document !== undefined) {
			return {
				kind: DocumentDiagnosticReportKind.Full,
				items: await validateTextDocument(connection, document)
			} satisfies DocumentDiagnosticReport;
		} else {
			return {
				kind: DocumentDiagnosticReportKind.Full,
				items: []
			} satisfies DocumentDiagnosticReport;
		}
	});
};
