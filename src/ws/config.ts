import * as vscode from "vscode";
export class XRDebugConfigurationProvider
	implements vscode.DebugConfigurationProvider
{
	resolveDebugConfiguration?(
		folder: vscode.WorkspaceFolder | undefined,
		debugConfiguration: vscode.DebugConfiguration,
		token?: vscode.CancellationToken
	): vscode.ProviderResult<vscode.DebugConfiguration> {
		return debugConfiguration;
	}
}
