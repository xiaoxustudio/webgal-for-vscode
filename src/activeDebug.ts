/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-29 14:58:20
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { XRDebugAdapter } from "./DebugSession";
export class XRDebugAdapterDescriptorFactory
	implements vscode.DebugAdapterDescriptorFactory
{
	createDebugAdapterDescriptor(
		session: vscode.DebugSession,
		executable: vscode.DebugAdapterExecutable | undefined
	): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		// 创建并返回一个新的调试器实例
		return new vscode.DebugAdapterInlineImplementation(
			new XRDebugAdapter(session)
		);
	}
}
