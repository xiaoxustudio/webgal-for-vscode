export class RuntimeVariable {
	public reference?: number;
	public desc?: "Array" | "Object" | string;
	public get value() {
		return this._value;
	}

	public set value(value: IRuntimeVariableType) {
		this._value = value;
	}

	constructor(
		public readonly name: string,
		private _value: IRuntimeVariableType
	) {}
}

export type IRuntimeVariableType =
	| number
	| boolean
	| string
	| RuntimeVariable[];

export enum DebugCommand {
	// 跳转
	JUMP,
	// 同步自客户端
	SYNCFC,
	// 同步自编辑器
	SYNCFE,
	// 执行指令
	EXE_COMMAND,
	// 重新拉取模板样式文件
	REFETCH_TEMPLATE_FILES
}

export interface IDebugMessage {
	event: string;
	data: {
		command: DebugCommand;
		sceneMsg: {
			sentence: number;
			scene: string;
		};
		message: string;
		stageSyncMsg: any;
	};
}

export interface IVToken {
	word: string; // 名称
	position?: any; // 位置
	input?: string; // 原始文本
	value?: string; // 值
	desc?: string; // 描述
	isGlobal?: boolean; // 是否是全局
	isGetUserInput?: boolean; // 是否是获取输入
}

export interface IVChooseToken {
	options: {
		text: string; // 文本
		value: string; // 值 (xxx.txt | <Label Name>)
	}[];
	line: number; // 行号
}

type IMapValue = Record<string, IVToken[]>;

type IChooseMapValue = Record<number, IVChooseToken>; // 行号: 选择

// 全局映射表
export interface IDefinetionMap {
	label: IMapValue;
	setVar: IMapValue;
	choose: IChooseMapValue;
}

// debugger
export interface FileAccessor {
	isWindows: boolean;
	readFile(path: string): Promise<Buffer>;
	writeFile(path: string, contents: Buffer): Promise<void>;
}
