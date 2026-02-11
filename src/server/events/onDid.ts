import { ConnectionHandler, ServerSettings } from "@/server/types";
import {
	defaultSettings,
	documentSettings,
	setGlobalSettings,
	StateConfig
} from "@/server/utils";

export default <ConnectionHandler>function (documents, connection) {
	// 关闭文档时删除设置缓存
	documents.onDidClose((e) => {
		documentSettings.delete(e.document.uri);
	});
	// 客户端配置改变通知
	connection.onDidChangeConfiguration((change) => {
		if (StateConfig.hasConfigurationCapability) {
			// 如果支持 workspace/configuration，我们只是清空缓存，下一次请求会重新通过 getConfiguration 拉取
			documentSettings.clear();
		} else {
			// 客户端不支持 workspace/configuration，settings 值随 didChangeConfiguration 通过参数下发
			setGlobalSettings(
				<ServerSettings>(
					(change.settings.XRWebGalLanguageServer || defaultSettings)
				)
			);
		}
		connection.languages.diagnostics.refresh(); // 重新校验
	});
};
