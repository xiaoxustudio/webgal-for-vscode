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
	wait
}

interface IArgs {
	arg: string;
	desc: string;
}

type GetEnumKeysAsString<T> = Extract<keyof T, string>;

export type CommandNames = Extract<GetEnumKeysAsString<commandType>, "video"> &
	"playVideo";

export type WGKeyWords = Record<
	keyof CommandNames,
	{
		type: commandType;
		desc: string;
		args: IArgs[];
	}
>;

export const argsMap = {
	when: {
		arg: "when",
		desc: "条件"
	},
	next: {
		arg: "next",
		desc: "下一句对话"
	},
	notend: {
		arg: "notend",
		desc: "本句对话连接在上一句对话之后"
	},
	concat: {
		arg: "concat",
		desc: "本句对话没有结束，在后面可能连接演出或对话。"
	},
	hold: {
		arg: "hold",
		desc: "独白结束后保持独白界面"
	},
	title: {
		arg: "title",
		desc: "标题"
	},
	buttonText: {
		arg: "buttonText",
		desc: "按钮文字"
	},
	defaultValue: {
		arg: "defaultValue",
		desc: "默认文字"
	},
	left: {
		arg: "left",
		desc: "放置位置"
	},
	right: {
		arg: "right",
		desc: "放置位置"
	},
	id: {
		arg: "id",
		desc: "对应ID"
	},
	zIndex: {
		arg: "zIndex",
		desc: "立绘层级"
	},
	none: {
		arg: "none",
		desc: "将语句内容替换为空字符串"
	},
	animationFlag: {
		arg: "animationFlag",
		desc: "动画标识"
	},
	mouthOpen: {
		arg: "mouthOpen",
		desc: "立绘张嘴立绘差分"
	},
	mouthHalfOpen: {
		arg: "mouthHalfOpen",
		desc: "立绘半张嘴立绘差分"
	},
	mouthClose: {
		arg: "mouthClose",
		desc: "立绘闭嘴立绘差分"
	},
	eyesOpen: {
		arg: "eyesOpen",
		desc: "立绘睁眼立绘差分"
	},
	eyesClose: {
		arg: "eyesClose",
		desc: "立绘闭眼立绘差分"
	},
	motion: {
		arg: "motion",
		desc: "立绘动作"
	},
	expression: {
		arg: "expression",
		desc: "立绘表情"
	},
	bounds: {
		arg: "bounds",
		desc: "拓展或收缩立绘的显示区域"
	},
	series: {
		arg: "series",
		desc: "收录到指定名称的系列中"
	},
	transform: {
		arg: "transform",
		desc: "变换和滤镜效果"
	},
	duration: {
		arg: "duration",
		desc: "持续时间"
	},
	volume: {
		arg: "volume",
		desc: "音量"
	},
	skipOff: {
		arg: "skipOff",
		desc: "关闭跳过"
	},
	enter: {
		arg: "enter",
		desc: "进行淡入播放"
	},
	global: {
		arg: "global",
		desc: "全局变量"
	},
	exit: {
		arg: "exit",
		desc: "进行淡出播放"
	},
	ease: {
		arg: "ease",
		desc: "缓动类型"
	},
	unlockname: {
		arg: "unlockname",
		desc: "鉴赏将收录该音乐"
	},
	speaker: {
		arg: "speaker",
		desc: "说话者"
	},
	clear: {
		arg: "clear",
		desc: "清除说话者"
	},
	vocal: {
		arg: "vocal",
		desc: "说话时将播放该声音文件。"
	},
	fontSize: {
		arg: "fontSize",
		desc: "字体大小"
	},
	fontColor: {
		arg: "fontColor",
		desc: "字体颜色"
	},
	backgroundColor: {
		arg: "backgroundColor",
		desc: "背景颜色"
	},
	backgroundImage: {
		arg: "backgroundImage",
		desc: "背景图片"
	},
	animation: {
		arg: "animation",
		desc: "动画效果"
	},
	delay: {
		arg: "delay",
		desc: "延迟时间"
	},
	useForward: {
		arg: "useForward",
		desc: "需要用户手动点击屏幕"
	},
	center: {
		arg: "center",
		desc: "驱动中间立绘张嘴说话"
	},
	figureId: {
		arg: "figureId",
		desc: "驱动对应 id 的立绘张嘴说话"
	},
	target: {
		arg: "target",
		desc: "作用目标"
	},
	name: {
		arg: "name",
		desc: "名称"
	},
	writeDefault: {
		arg: "writeDefault",
		desc: "变换与效果属性写入默认值"
	},
	keep: {
		arg: "keep",
		desc: "将该动画转换为跨语句动画"
	}
} satisfies Record<string, IArgs>;

export const globalArgs = [
	argsMap.when,
	argsMap.next,
	argsMap.notend,
	argsMap.concat,
	argsMap.hold
];

export const commandURL =
	"https://docs.openwebgal.com/script-reference/commands/";

/**
 * @description: 关键字
 */
export const WebGALKeywords: WGKeyWords = {
	say: {
		type: commandType.say,
		desc: "对话命令。任何识别不了的命令，都将尝试作为对话命令执行。",
		args: [
			argsMap.notend,
			argsMap.concat,
			argsMap.hold,
			argsMap.speaker,
			argsMap.clear,
			argsMap.vocal,
			argsMap.fontSize,
			argsMap.figureId,
			argsMap.center,
			argsMap.left,
			argsMap.right
		]
	},
	changeBg: {
		type: commandType.changeBg,
		desc: "更改背景命令。",
		args: [
			argsMap.transform,
			argsMap.enter,
			argsMap.exit,
			argsMap.duration,
			argsMap.ease,
			argsMap.unlockname,
			argsMap.series
		]
	},
	changeFigure: {
		type: commandType.changeFigure,
		desc: "更改立绘命令。",
		args: [
			argsMap.transform,
			argsMap.enter,
			argsMap.exit,
			argsMap.duration,
			argsMap.ease,
			argsMap.left,
			argsMap.right,
			argsMap.id,
			argsMap.zIndex,
			argsMap.none,
			argsMap.animationFlag,
			argsMap.mouthOpen,
			argsMap.mouthHalfOpen,
			argsMap.mouthClose,
			argsMap.eyesOpen,
			argsMap.eyesClose,
			argsMap.motion,
			argsMap.expression,
			argsMap.bounds
		]
	},
	bgm: {
		type: commandType.bgm,
		desc: "更改背景音乐命令。",
		args: [
			argsMap.volume,
			argsMap.duration,
			argsMap.series,
			argsMap.unlockname
		]
	},
	playVideo: {
		type: commandType.video,
		desc: "播放视频命令。",
		args: [argsMap.skipOff]
	},
	pixiPerform: {
		type: commandType.pixi,
		desc: "添加舞台特效",
		args: []
	},
	pixiInit: {
		type: commandType.pixiInit,
		desc: "pixi初始化命令。",
		args: []
	},
	intro: {
		type: commandType.intro,
		desc: "黑屏文字演示命令。",
		args: [
			argsMap.fontSize,
			argsMap.fontColor,
			argsMap.backgroundColor,
			argsMap.backgroundImage,
			argsMap.animation,
			argsMap.delay,
			argsMap.useForward
		]
	},
	miniAvatar: {
		type: commandType.miniAvatar,
		desc: "小头像命令。",
		args: []
	},
	changeScene: {
		type: commandType.changeScene,
		desc: "切换场景命令。",
		args: []
	},
	choose: {
		type: commandType.choose,
		desc: "分支选择命令。",
		args: []
	},
	end: {
		type: commandType.end,
		desc: "结束游戏命令。",
		args: []
	},
	setComplexAnimation: {
		type: commandType.setComplexAnimation,
		desc: "动画演出命令。",
		args: [argsMap.target, argsMap.duration]
	},
	label: {
		type: commandType.label,
		desc: "标签命令。",
		args: []
	},
	jumpLabel: {
		type: commandType.jumpLabel,
		desc: "跳转标签命令。",
		args: []
	},
	setVar: {
		type: commandType.setVar,
		desc: "设置变量命令。",
		args: [argsMap.global]
	},
	callScene: {
		type: commandType.callScene,
		desc: "调用场景命令。",
		args: []
	},
	showVars: {
		type: commandType.showVars,
		desc: "显示变量命令。",
		args: []
	},
	unlockCg: {
		type: commandType.unlockCg,
		desc: "解锁立绘命令。",
		args: [argsMap.name, argsMap.series]
	},
	unlockBgm: {
		type: commandType.unlockBgm,
		desc: "解锁背景音乐命令。",
		args: [argsMap.name, argsMap.series]
	},
	filmMode: {
		type: commandType.filmMode,
		desc: "电影模式命令。",
		args: []
	},
	setTextbox: {
		type: commandType.setTextbox,
		desc: "设置文本框命令。",
		args: []
	},
	setAnimation: {
		type: commandType.setAnimation,
		desc: "设置动画命令。",
		args: [argsMap.target, argsMap.writeDefault, argsMap.keep]
	},
	playEffect: {
		type: commandType.playEffect,
		desc: "播放效果命令。",
		args: [argsMap.id]
	},
	setTempAnimation: {
		type: commandType.setTempAnimation,
		desc: "设置临时动画命令。",
		args: [argsMap.target, argsMap.writeDefault, argsMap.keep]
	},
	setTransform: {
		type: commandType.setTransform,
		desc: "设置变换命令。",
		args: [
			argsMap.target,
			argsMap.duration,
			argsMap.writeDefault,
			argsMap.keep
		]
	},
	setTransition: {
		type: commandType.setTransition,
		desc: "设置过渡命令。",
		args: [argsMap.target, argsMap.enter, argsMap.exit]
	},
	getUserInput: {
		type: commandType.getUserInput,
		desc: "获取用户输入命令。",
		args: [argsMap.title, argsMap.buttonText, argsMap.defaultValue]
	},
	applyStyle: {
		type: commandType.applyStyle,
		desc: "应用样式命令。",
		args: []
	},
	wait: {
		type: commandType.wait,
		desc: "等待命令。",
		args: []
	}
};

export interface CToken {
	desc: string; // 描述
	Equal?: boolean;
}

export const configMap: Record<string, CToken> = {
	Game_name: {
		desc: "游戏名称",
		Equal: true
	},
	Game_key: {
		desc: "游戏唯一标识"
	},
	Title_img: {
		desc: "标题图片"
	},
	Title_bgm: {
		desc: "标题背景bgm"
	},
	Textbox_theme: {
		desc: "对话框样式"
	}
};
