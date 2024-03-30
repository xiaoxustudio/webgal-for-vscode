/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-30 18:03:24
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
import * as vscode from "vscode";
import { XRDebugSession } from "./DebugSession";
import { fsAccessor } from "./utils/utils_novsc";
export class XRDebugAdapterDescriptorFactory
	implements vscode.DebugAdapterDescriptorFactory
{
	createDebugAdapterDescriptor(
		session: vscode.DebugSession,
		executable: vscode.DebugAdapterExecutable | undefined
	): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		// 创建并返回一个新的调试器实例
		return new vscode.DebugAdapterInlineImplementation(
			new XRDebugSession(session, fsAccessor)
		);
	}
}
