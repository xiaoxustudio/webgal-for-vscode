/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-11-05 08:44:29
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import {
	createConnection,
	TextDocuments,
	ProposedFeatures
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import events from "./events";

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

events(documents, connection);

documents.listen(connection);
connection.listen();
