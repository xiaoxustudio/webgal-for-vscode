export enum commandType {
	say, // 对话
	changeBg, // 更改背景
	changeFigure, // 更改立绘
	bgm, // 更改背景音乐
	video, // 播放视频
	pixi, // pixi演出
	pixiInit, // pixi初始化
	intro, // 黑屏文字演示
	miniAvatar, // 小头像
	changeScene, // 切换场景
	choose, // 分支选择
	end, // 结束游戏
	setComplexAnimation, // 动画演出
	setFilter, // 设置效果
	label, // 标签
	jumpLabel, // 跳转标签
	chooseLabel, // 选择标签
	setVar, // 设置变量
	if, // 条件跳转
	callScene, // 调用场景
	showVars,
	unlockCg,
	unlockBgm,
	filmMode,
	setTextbox,
	setAnimation,
	playEffect,
	setTempAnimation,
	comment,
	setTransform,
	setTransition,
	getUserInput,
	applyStyle,
	wait,
	callSteam // 调用Steam功能
}

export interface ISceneEntry {
	sceneName: string; // 场景名称
	sceneUrl: string; // 场景url
	continueLine: number; // 继续原场景的行号
}

/**
 * 单个参数接口
 * @interface arg
 */
export interface arg {
	key: string; // 参数键
	value: string | boolean | number; // 参数值
}
export enum fileType {
	background,
	bgm,
	figure,
	scene,
	tex,
	vocal,
	video
}
/**
 * 资源接口
 * @interface IAsset
 */
export interface IAsset {
	name: string; // 资源名称
	type: fileType; // 资源类型
	url: string; // 资源url
	lineNumber: number; // 触发资源语句的行号
}

/**
 * 单条语句接口
 * @interface ISentence
 */
export interface ISentence {
	command: commandType; // 语句类型
	commandRaw: string; // 命令的原始内容，方便调试
	content: string; // 语句内容
	args: Array<arg>; // 参数列表
	sentenceAssets: Array<IAsset>; // 语句携带的资源列表
	subScene: Array<string>; // 语句包含子场景列表
	inlineComment: string; // 行内注释
}

/**
 * 场景接口
 * @interface IScene
 */
export interface IScene {
	sceneName: string; // 场景名称
	sceneUrl: string; // 场景url
	sentenceList: Array<ISentence>; // 语句列表
	assetsList: Array<IAsset>; // 资源列表
	subSceneList: Array<string>; // 子场景的url列表
}

/**
 * 当前的场景数据
 * @interface ISceneData
 */
export interface ISceneData {
	currentSentenceId: number; // 当前语句ID
	sceneStack: Array<ISceneEntry>; // 场景栈
	currentScene: IScene; // 当前场景数据
}

/**
 * 处理后的命令接口
 * @interface parsedCommand
 */
export interface parsedCommand {
	type: commandType;
	additionalArgs: Array<arg>;
}

/**
 * 游戏内变量
 * @interface IGameVar
 */
export interface IGameVar {
	[propName: string]:
		| string
		| boolean
		| number
		| Array<string | boolean | number>;
}

export interface ISetGameVar {
	key: string;
	value: string | boolean | number;
}

/**
 * 单个选项
 * @interface IChooseItem
 */
export interface IChooseItem {
	key: string; // 选项名称
	targetScene: string; // 选项target
	isSubScene: boolean; // 是否是子场景调用
}

export interface ITransform {
	alpha: number;
	scale: {
		x: number;
		y: number;
	};
	// pivot: {
	//   x: number;
	//   y: number;
	// };
	position: {
		x: number;
		y: number;
	};
	rotation: number;
	blur: number;
	brightness: number;
	contrast: number;
	saturation: number;
	gamma: number;
	colorRed: number;
	colorGreen: number;
	colorBlue: number;
	bevel: number;
	bevelThickness: number;
	bevelRotation: number;
	bevelSoftness: number;
	bevelRed: number;
	bevelGreen: number;
	bevelBlue: number;
	bloom: number;
	bloomBrightness: number;
	bloomBlur: number;
	bloomThreshold: number;
	shockwaveFilter: number;
	radiusAlphaFilter: number;
}

/**
 * 基本效果接口
 * @interface IEffect
 */
export interface IEffect {
	target: string; // 作用目标
	transform?: ITransform; // 变换
}

export interface IStageAnimationSetting {
	target: string;
	enterAnimationName?: string;
	exitAnimationName?: string;
	enterDuration?: number;
	exitDuration?: number;
}

export type StageAnimationSettingUpdatableKey = Exclude<
	keyof IStageAnimationSetting,
	"target"
>;

export interface IUpdateAnimationSettingPayload {
	target: string;
	key: StageAnimationSettingUpdatableKey;
	value: IStageAnimationSetting[StageAnimationSettingUpdatableKey];
}

export interface IFreeFigure {
	basePosition: "left" | "center" | "right";
	name: string;
	key: string;
}

export interface IFigureAssociatedAnimation {
	mouthAnimation: IMouthAnimationFile;
	blinkAnimation: IEyesAnimationFile;
	targetId: string;
	animationFlag: string;
}

export interface IMouthAnimationFile {
	open: string;
	close: string;
	halfOpen: string;
}

export interface IEyesAnimationFile {
	open: string;
	close: string;
}

/**
 * 启动演出接口
 * @interface IRunPerform
 */
export interface IRunPerform {
	id: string;
	isHoldOn: boolean; // 演出类型
	script: ISentence; // 演出脚本
}

export interface ILive2DMotion {
	target: string;
	motion: string;
	overrideBounds?: [number, number, number, number];
}

export interface ILive2DExpression {
	target: string;
	expression: string;
}

export interface FocusParam {
	x: number; // 焦点X位置
	y: number; // 焦点Y位置
	instant: boolean; // 是否瞬间切换焦点
}

export interface BlinkParam {
	blinkInterval: number; // 眨眼间隔
	blinkIntervalRandom: number; // 眨眼间隔随机范围
	closingDuration: number; // 闭眼
	closedDuration: number; // 保持闭眼
	openingDuration: number; // 睁眼
}

export interface ILive2DBlink {
	target: string;
	blink: BlinkParam;
}

export interface ILive2DFocus {
	target: string;
	focus: FocusParam;
}

export interface IFigureMetadata {
	zIndex?: number;
	blendMode?: string;
}

type figureMetaData = Record<string, IFigureMetadata>;

/**
 * @interface ISetStagePayload 设置舞台状态的Action的Payload的数据接口
 */
export interface ISetStagePayload {
	key: keyof IStageState;
	value: any;
}

/**
 * 播放速度的枚举类型
 */
export enum playSpeed {
	slow, // 慢
	normal, // 中
	fast // 快
}

export enum textSize {
	small,
	medium,
	large
}

export enum voiceOption {
	yes,
	no
}

export enum fullScreenOption {
	on,
	off
}

export enum language {
	zhCn,
	en,
	jp,
	fr,
	de,
	zhTw
}

/**
 * @interface IOptionData 用户设置数据接口
 */
export interface IOptionData {
	volumeMain: number; // 主音量
	textSpeed: number; // 文字速度
	autoSpeed: number; // 自动播放速度
	textSize: textSize;
	vocalVolume: number; // 语音音量
	bgmVolume: number; // 背景音乐音量
	seVolume: number; // 音效音量
	uiSeVolume: number; // 用户界面音效音量
	slPage: number; // 存读档界面所在页面
	textboxFont: number;
	textboxOpacity: number;
	language: language;
	voiceInterruption: voiceOption; // 是否中断语音
	fullScreen: fullScreenOption;
}

/**
 * 场景存档接口
 * @interface ISaveScene
 */
export interface ISaveScene {
	currentSentenceId: number; // 当前语句ID
	sceneStack: Array<ISceneEntry>; // 场景栈
	sceneName: string; // 场景名称
	sceneUrl: string; // 场景url
}
export interface IBacklogItem {
	currentStageState: IStageState;
	saveScene: ISaveScene;
}
/**
 * @interface ISaveData 存档文件接口
 */
export interface ISaveData {
	nowStageState: IStageState;
	backlog: Array<IBacklogItem>; // 舞台数据
	index: number; // 存档的序号
	saveTime: string; // 保存时间
	sceneData: ISaveScene; // 场景数据
	previewImage: string;
}

export interface IAppreciationAsset {
	name: string;
	url: string;
	series: string;
}

export interface IAppreciation {
	bgm: Array<IAppreciationAsset>;
	cg: Array<IAppreciationAsset>;
}

/**
 * @interface IStageState 游戏舞台数据接口
 */
export interface IStageState {
	oldBgName: string; // 旧背景的文件路径
	bgName: string; // 背景文件地址（相对或绝对）
	figName: string; // 立绘_中 文件地址（相对或绝对）
	figNameLeft: string; // 立绘_左 文件地址（相对或绝对）
	figNameRight: string; // 立绘_右 文件地址（相对或绝对）
	// 自由立绘
	freeFigure: Array<IFreeFigure>;
	figureAssociatedAnimation: Array<IFigureAssociatedAnimation>;
	showText: string; // 文字
	showTextSize: number; // 文字
	showName: string; // 人物名
	command: string; // 语句指令
	choose: Array<IChooseItem>; // 选项列表
	vocal: string; // 语音 文件地址（相对或绝对）
	playVocal: string; // 真实播放语音
	vocalVolume: number; // 语音 音量调整（0 - 100）
	bgm: {
		// 背景音乐
		src: string; // 背景音乐 文件地址（相对或绝对）
		enter: number; // 背景音乐 淡入或淡出的毫秒数
		volume: number; // 背景音乐 音量调整（0 - 100）
	};
	uiSe: string; // 用户界面音效 文件地址（相对或绝对）
	miniAvatar: string; // 小头像 文件地址（相对或绝对）
	GameVar: IGameVar; // 游戏内变量
	effects: Array<IEffect>; // 应用的变换
	animationSettings: Array<IStageAnimationSetting>;
	bgTransform: string;
	bgFilter: string;
	PerformList: Array<IRunPerform>; // 要启动的演出列表
	currentDialogKey: string; // 当前对话的key
	live2dMotion: ILive2DMotion[];
	live2dExpression: ILive2DExpression[];
	live2dBlink: ILive2DBlink[];
	live2dFocus: ILive2DFocus[];
	// 当前演出的延迟，用于做对话插演出！
	// currentPerformDelay:number
	currentConcatDialogPrev: string;
	// 测试：电影叙事
	enableFilm: string;
	isDisableTextbox: boolean;
	replacedUIlable: Record<string, string>;
	figureMetaData: figureMetaData;
}

/**
 * @interface IUserData 用户数据接口
 */
export interface IUserData {
	scriptManagedGlobalVar: string[];
	globalGameVar: IGameVar; // 不跟随存档的全局变量
	optionData: IOptionData; // 用户设置选项数据
	appreciationData: IAppreciation;
	gameConfigInit: IGameVar;
}
