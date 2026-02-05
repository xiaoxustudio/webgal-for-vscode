/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-30 22:18:12
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { fsAccessor } from "../utils/utils_novsc";
import { XRDebugSession } from "./DebugSession";
export class XRDebugAdapterDescriptorFactory
	implements vscode.DebugAdapterDescriptorFactory
{
	createDebugAdapterDescriptor(
		session: vscode.DebugSession,
		executable: vscode.DebugAdapterExecutable | undefined
	): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		return new vscode.DebugAdapterInlineImplementation(
			new XRDebugSession(session, fsAccessor)
		);
	}
}
