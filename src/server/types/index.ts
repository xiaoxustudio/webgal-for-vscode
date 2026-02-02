export interface ServerSettings {
	maxNumberOfProblems: number;
	isShowWarning: boolean; // 是否显示警告
	isShowHint: "关闭" | "最前面" | "变量名前" | "变量名后" | "最后面";
}
