import {
	CompletionItem,
	CompletionItemKind,
	InsertTextFormat,
	MarkupContent,
	MarkupKind
} from "vscode-languageserver";

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

export const WebGALCommandPrefix =
	"https://docs.openwebgal.com/script-reference/commands/";

interface IArgs {
	arg: string;
	desc: string;
}

type GetEnumKeysAsString<T> = Extract<keyof T, string>;

export type CommandNames = Extract<GetEnumKeysAsString<commandType>, "video"> &
	"playVideo";

export type WebGALKeyWords = Record<
	keyof CommandNames,
	{
		type: commandType;
		desc: string;
		args: IArgs[];
	} & Partial<CompletionItem>
>;

export const argsMap = {
	when: {
		arg: "when",
		desc: "条件",
		label: "-when",
		kind: CompletionItemKind.Constant,
		documentation: `条件执行本句
  changeScene:2.txt -when=a>1;a>1时跳转到场景2`,
		detail: `option -when=<condition>`,
		insertText: "when="
	},
	next: {
		arg: "next",
		desc: "下一句对话",
		label: "-next",
		kind: CompletionItemKind.Constant,
		documentation: `连续执行本句和下一句`,
		detail: `option -next`,
		insertText: "next"
	},
	notend: {
		arg: "notend",
		desc: "本句对话连接在上一句对话之后",
		label: "-notend",
		kind: CompletionItemKind.Constant,
		documentation: `用于对话，表示该对话未结束`,
		detail: `option -notend`,
		insertText: "notend"
	},
	concat: {
		arg: "concat",
		desc: "本句对话没有结束，在后面可能连接演出或对话。",
		label: "-concat",
		kind: CompletionItemKind.Constant,
		documentation: `用于对话，将该对话与上一句连接`,
		detail: `option -concat`,
		insertText: "concat"
	},
	hold: {
		arg: "hold",
		desc: "独白结束后保持独白界面",
		label: "-hold",
		kind: CompletionItemKind.Constant,
		documentation: `结束后保持`,
		detail: `option -hold`,
		insertText: "hold"
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
		desc: "放置位置",
		label: "-left",
		kind: CompletionItemKind.Constant,
		documentation: `立绘设置在左侧`,
		detail: `option -left`,
		insertText: "left"
	},
	right: {
		arg: "right",
		desc: "放置位置",
		label: "-right",
		kind: CompletionItemKind.Constant,
		documentation: `立绘设置在右侧`,
		detail: `option -right`,
		insertText: "right"
	},
	id: {
		arg: "id",
		desc: "对应ID",
		label: "-id",
		kind: CompletionItemKind.Constant,
		documentation: `设置立绘 ID`,
		detail: `option -id=<figureId>`,
		insertText: "id="
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
		desc: "变换和滤镜效果",
		label: "-transform",
		kind: CompletionItemKind.Constant,
		documentation: `设置一些变换和滤镜效果`,
		detail: `option -transform`,
		insertText: "transform"
	},
	duration: {
		arg: "duration",
		desc: "持续时间",
		label: "-duration",
		kind: CompletionItemKind.Constant,
		documentation: `设置持续时间`,
		detail: `option -duration=<number>`,
		insertText: "duration="
	},
	volume: {
		arg: "volume",
		desc: "音量",
		label: "-volume",
		kind: CompletionItemKind.Constant,
		documentation: `调整它的音量，默认值 100`,
		detail: `option -volume`,
		insertText: "volume"
	},
	skipOff: {
		arg: "skipOff",
		desc: "关闭跳过",
		label: "-skipOff",
		kind: CompletionItemKind.Constant,
		documentation: `阻止用户跳过视频`,
		detail: `option -skipOff`,
		insertText: "skipOff"
	},
	enter: {
		arg: "enter",
		desc: "进行淡入播放"
	},
	global: {
		arg: "global",
		desc: "全局变量",
		label: "-global",
		kind: CompletionItemKind.Constant,
		documentation: `设置长效（全局）变量`,
		detail: `option -global`,
		insertText: "global"
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
		desc: "字体大小",
		label: "-fontSize",
		kind: CompletionItemKind.Constant,
		documentation: `文字大小`,
		detail: `option -fontSize`,
		insertText: "fontSize"
	},
	fontColor: {
		arg: "fontColor",
		desc: "字体颜色",
		label: "-fontColor",
		kind: CompletionItemKind.Constant,
		documentation: `字体颜色`,
		detail: `option -fontColor`,
		insertText: "fontColor"
	},
	backgroundColor: {
		arg: "backgroundColor",
		desc: "背景颜色",
		label: "-backgroundColor",
		kind: CompletionItemKind.Constant,
		documentation: `背景颜色`,
		detail: `option -backgroundColor`,
		insertText: "backgroundColor"
	},
	backgroundImage: {
		arg: "backgroundImage",
		desc: "背景图片"
	},
	animation: {
		arg: "animation",
		desc: "动画效果",
		label: "-animation",
		kind: CompletionItemKind.Constant,
		documentation: `过渡动画`,
		detail: `option -animation`,
		insertText: "animation"
	},
	delay: {
		arg: "delay",
		desc: "延迟时间",
		label: "-delay",
		kind: CompletionItemKind.Constant,
		documentation: `动画延迟时间`,
		detail: `option -delay`,
		insertText: "delay"
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
		desc: "作用目标",
		label: "-target",
		kind: CompletionItemKind.Constant,
		documentation: `设置动画目标 ID`,
		detail: `option -target=<targetId>`,
		insertText: "target="
	},
	name: {
		arg: "name",
		desc: "名称",
		label: "-name",
		kind: CompletionItemKind.Constant,
		documentation: `设置名称`,
		detail: `option -name`,
		insertText: "name"
	},
	writeDefault: {
		arg: "writeDefault",
		desc: "变换与效果属性写入默认值"
	},
	keep: {
		arg: "keep",
		desc: "将该动画转换为跨语句动画"
	}
} satisfies Record<string, IArgs & Partial<CompletionItem>>;

// 通用全局参数
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
export const WebGALKeywords: WebGALKeyWords = {
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
		],
		label: "say",
		kind: CompletionItemKind.Function,
		documentation: `对话
		\`\`\`webgal
		say:你好;
		\`\`\``,
		detail: `say:<content> [...args];`,
		insertText: "say:$1;$2"
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
		],
		label: "changeBg",
		kind: CompletionItemKind.Function,
		documentation: `更新背景图片
		\`\`\`webgal
		changeBg:testBG03.jpg -next;
		\`\`\``,
		detail: `changeBg:<fileName> [-next];`,
		insertText: "changeBg:$1;$2"
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
		],
		label: "changeFigure",
		kind: CompletionItemKind.Function,
		documentation: `更新立绘
		\`\`\`webgal
		changeFigure:testFigure03.png -left -next;
		\`\`\``,
		detail: `changeFigure:<fileName> [-left] [-right] [id=figureId] [-next];`,
		insertText: "changeFigure:$1;$2"
	},
	bgm: {
		type: commandType.bgm,
		desc: "更改背景音乐命令。",
		args: [
			argsMap.volume,
			argsMap.duration,
			argsMap.series,
			argsMap.unlockname
		],
		label: "bgm",
		kind: CompletionItemKind.Function,
		documentation: `背景音乐（BGM）
		\`\`\`webgal
		bgm:夏影.mp3;
		\`\`\``,
		detail: `bgm:<fileName>;`,
		insertText: "bgm:$1;$2"
	},
	playVideo: {
		type: commandType.video,
		desc: "播放视频命令。",
		args: [argsMap.skipOff],
		label: "playVideo",
		kind: CompletionItemKind.Function,
		documentation: `播放视频
		\`\`\`webgal
		playVideo:OP.mp4;
		\`\`\``,
		detail: `playVideo:<fileName>;`,
		insertText: "playVideo:$1;$2"
	},
	pixiPerform: {
		type: commandType.pixi,
		desc: "添加舞台特效",
		args: [],
		label: "pixiPerform",
		kind: CompletionItemKind.Function,
		documentation: `初始化 Pixi 特效
		注意：特效作用后，如果没有初始化，特效会一直运行。`,
		detail: `pixiPerform:<performName>;`,
		insertText: "pixiPerform:$1;$2"
	},
	pixiInit: {
		type: commandType.pixiInit,
		desc: "pixi初始化命令。",
		args: [],
		label: "pixiInit",
		kind: CompletionItemKind.Function,
		documentation: `初始化 Pixi 特效
		1.如果你要使用特效，那么你必须先运行这个命令来初始化 Pixi。
		2.如果你想要消除已经作用的效果，你可以使用这个语法来清空效果。`,
		detail: `pixiInit;`,
		insertText: "pixiInit;"
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
		],
		label: "intro",
		kind: CompletionItemKind.Function,
		documentation: `黑屏独白
		在许多游戏中，会以黑屏显示一些文字，用来引入主题或表现人物的心理活动。你可以使用 intro 命令来演出独白。
		独白的分拆以分隔符(|)来分割，也就是说，每一个 | 代表一个换行。

		\`\`\`webgal
		intro:回忆不需要适合的剧本，|反正一说出口，|都成了戏言。;
		\`\`\``,
		detail: `intro:<text> [|<text of line 2>] ...;`,
		insertText: "intro:$1;$2"
	},
	miniAvatar: {
		type: commandType.miniAvatar,
		desc: "小头像命令。",
		args: [],
		label: "miniAvatar",
		kind: CompletionItemKind.Function,
		documentation: `放置小头像
		很多游戏可以在文本框的左下角放置小头像，以下是在本引擎中使用的语法

		\`\`\`webgal
		miniAvatar:minipic_test.png;显示
		miniAvatar:none;关闭
		\`\`\``,
		detail: `miniAvatar:<fileName>;`,
		insertText: "miniAvatar"
	},
	changeScene: {
		type: commandType.changeScene,
		desc: "切换场景命令。",
		args: [],
		label: "changeScene",
		kind: CompletionItemKind.Function,
		documentation: `场景跳转
		你可以将你的剧本拆分成多个 txt 文档，并使用一个简单的语句来切换当前运行的剧本。
		\`\`\`webgal
		changeScene:Chapter-2.txt;
		\`\`\``,
		detail: `changeScene:<newSceneFileName>;`,
		insertText: "changeScene:$1;$2"
	},
	choose: {
		type: commandType.choose,
		desc: "分支选择命令。",
		args: [],
		label: "choose",
		kind: CompletionItemKind.Function,
		documentation: `分支选择
		如果你的剧本存在分支选项，你希望通过选择不同的选项进入不同的章节，请使用以下语句。
		其中，|是分隔符。
		\`\`\`webgal
		choose:叫住她:Chapter-2.txt|回家:Chapter-3.txt;
		\`\`\``,
		detail: `choose:<chooseText:newSceneName> [|<chooseText:newSceneName>] ...;`,
		insertText: "choose:$1|$2;"
	},
	end: {
		type: commandType.end,
		desc: "结束游戏命令。",
		args: [],
		label: "end",
		kind: CompletionItemKind.Function,
		documentation: `结束游戏并返回到标题
		\`\`\`webgal
		end;
		\`\`\``,
		detail: `end;`,
		insertText: "end;"
	},
	setComplexAnimation: {
		type: commandType.setComplexAnimation,
		desc: "动画演出命令。",
		args: [argsMap.target, argsMap.duration],
		label: "setComplexAnimation",
		kind: CompletionItemKind.Function,
		documentation: `填写复杂动画的名称。
		目前 WebGAL 提供的复杂动画有：
		universalSoftIn：通用透明度淡入
		universalSoftOff：通用透明度淡出

		\`\`\`webgal
		setComplexAnimation:universalSoftIn -target=aaa -duration=1000;
		\`\`\``,
		detail: `setComplexAnimation:<name> [-target=...|-duration=...];`,
		insertText: "setComplexAnimation:$1;$2"
	},
	label: {
		type: commandType.label,
		desc: "标签命令。",
		args: [],
		label: "label",
		kind: CompletionItemKind.Function,
		documentation: `定义标签`,
		detail: `label:<Name>;`,
		insertText: "label:$1;$2"
	},
	jumpLabel: {
		type: commandType.jumpLabel,
		desc: "跳转标签命令。",
		args: [],
		label: "jumpLabel",
		kind: CompletionItemKind.Function,
		documentation: `跳转到指定标签`,
		detail: `jumpLabel:<Laebl Name>;`,
		insertText: "jumpLabel:$1;$2"
	},
	setVar: {
		type: commandType.setVar,
		desc: "设置变量命令。",
		args: [argsMap.global],
		label: "setVar",
		kind: CompletionItemKind.Function,
		documentation: `使用变量
		\`\`\`webgal
		setVar:a=1;可以设置数字
		setVar:a=true;可以设置布尔值
		setVar:a=人物名称;可以设置字符串
		\`\`\``,
		detail: `setVar:<expression>;`,
		insertText: "setVar:$1;$2"
	},
	callScene: {
		type: commandType.callScene,
		desc: "调用场景命令。",
		args: [],
		label: "callScene",
		kind: CompletionItemKind.Function,
		documentation: `
		如果你需要在执行完调用的场景后回到先前的场景（即父场景），你可以使用 callScene 来调用场景
		\`\`\`webgal
		callScene:Chapter-2.txt;
		\`\`\``,
		detail: `callScene:<newSceneFileName>;`,
		insertText: "callScene:$1;$2"
	},
	showVars: {
		type: commandType.showVars,
		desc: "显示所有本地/全局变量值",
		args: [],
		label: "showVars",
		kind: CompletionItemKind.Function,
		documentation: `在对话框中，显示所有本地变量与全局变量的值。
		\`\`\`webgal
		showVars;
		\`\`\``,
		detail: `showVars;`,
		insertText: "showVars;"
	},
	unlockCg: {
		type: commandType.unlockCg,
		desc: "解锁立绘命令。",
		args: [argsMap.name, argsMap.series],
		label: "unlockCg",
		kind: CompletionItemKind.Function,
		documentation: `解锁 CG 鉴赏
		\`\`\`webgal
		unlockCg:xgmain.jpeg -name=星光咖啡馆与死神之蝶 -series=1;
		\`\`\``,
		detail: `unlockCg:<fileName> -name=cgName -series=serisId;`,
		insertText: "unlockCg:$1;$2"
	},
	unlockBgm: {
		type: commandType.unlockBgm,
		desc: "解锁背景音乐命令。",
		args: [argsMap.name, argsMap.series],
		label: "unlockBgm",
		kind: CompletionItemKind.Function,
		documentation: `解锁 BGM 鉴赏
		\`\`\`webgal
		unlockBgm:s_Title.mp3 -name=Smiling-Swinging!!;
		\`\`\``,
		detail: `unlockBgm:<fileName> -name=bgmName;`,
		insertText: "unlockBgm:$1;$2"
	},
	filmMode: {
		type: commandType.filmMode,
		desc: "电影模式命令。",
		args: [],
		label: "filmMode",
		kind: CompletionItemKind.Function,
		documentation: `当不填写或填写 none 时，关闭电影模式。其他任何字符串均表示开启电影模式。
		\`\`\`webgal
		filmMode:on;
		角色A:真相只有一个;
		filmMode:none;
		\`\`\``,
		detail: `filmMode:[on|none];`,
		insertText: "filmMode:$1;$2"
	},
	setTextbox: {
		type: commandType.setTextbox,
		desc: "设置文本框命令。",
		args: [],
		label: "setTextbox",
		kind: CompletionItemKind.Function,
		documentation: `设置文本框开启/关闭
		\`\`\`webgal
		setTextbox:hide;关闭文本框
		setTextbox:on;开启文本框，可以是除 hide 以外的任意值。
		\`\`\``,
		detail: `setTextbox:[hide] [others];`,
		insertText: "setTextbox:$1;$2"
	},
	setAnimation: {
		type: commandType.setAnimation,
		desc: "设置动画命令。",
		args: [argsMap.target, argsMap.writeDefault, argsMap.keep],
		label: "setAnimation",
		kind: CompletionItemKind.Function,
		documentation: `设置动画
		\`\`\`webgal
		setAnimation:enter-from-bottom -target=fig-center -next;为中间立绘设置一个从下方进入的动画，并转到下一句。
		\`\`\``,
		detail: `setAnimation:<animationName> -target=targetId;`,
		insertText: "setAnimation"
	},
	playEffect: {
		type: commandType.playEffect,
		desc: "播放效果命令。",
		args: [argsMap.id],
		label: "playEffect",
		kind: CompletionItemKind.Function,
		documentation: `效果音
		\`\`\`webgal
		playEffect:xxx.mp3;
		\`\`\``,
		detail: `playEffect:<fileName>;`,
		insertText: "playEffect:$1;$2"
	},
	setTempAnimation: {
		type: commandType.setTempAnimation,
		desc: "设置临时动画命令。",
		args: [argsMap.target, argsMap.writeDefault, argsMap.keep],
		label: "setTempAnimation",
		kind: CompletionItemKind.Function,
		documentation: `与 setAnimation 读取动画文件不同，setTempAnimation 允许用户直接在代码里定义多段动画。
		语句内容格式为动画文件的单行形式，即 [{},{},{}] 。

		相关信息

		如果您想复用动画，请使用 setAnimation 命令。
		如果您只想设置单段动画，请使用 setTransform 命令。
		
		\`\`\`webgal
		changeFigure:1/open_eyes.png -id=aaa;
		; 闪光弹动画
		setTempAnimation:[{"duration":0},{"brightness":2,"contrast":0,"duration":200,"ease":"circIn"},{"brightness":1,"contrast":1,"duration":200},{"brightness":2,"contrast":0,"duration":200,"ease":"circIn"},{"brightness":1,"contrast":1,"duration":2500}] -target=aaa;
		\`\`\`
		`,
		detail: `setTempAnimation:<name>|<JSON> [-target=...|-writeDefault...|-keep=...];";`,
		insertText: "setTempAnimation:$1;$2"
	},
	setTransform: {
		type: commandType.setTransform,
		desc: "设置变换命令。",
		args: [
			argsMap.target,
			argsMap.duration,
			argsMap.writeDefault,
			argsMap.keep
		],
		label: "setTransform",
		kind: CompletionItemKind.Function,
		documentation: `设置效果`,
		detail: `setTransform:<expression>;`,
		insertText: "setTransform:"
	},
	setTransition: {
		type: commandType.setTransition,
		desc: "设置过渡命令。",
		args: [argsMap.target, argsMap.enter, argsMap.exit],
		label: "setTransition",
		kind: CompletionItemKind.Function,
		documentation: `不需要填写任何语句内容。
		详情请见设置进出场效果。
		
		\`\`\`webgal
		changeFigure:1/open_eyes.png -id=aaa -next;
		setTransition: -target=aaa -enter=enter-from-left;
		角色A: 你好！
		setTransition: -target=aaa -exit=exit-to-right;
		changeFigure:none -id=aaa -next;
		角色A: 再见！
		\`\`\``,
		detail: `setTransition:[name] [-target=...|-enter=...|-exit=...];`,
		insertText: "setTransition:$1;$2"
	},
	getUserInput: {
		type: commandType.getUserInput,
		desc: "获取用户输入命令。",
		label: "getUserInput",
		args: [argsMap.title, argsMap.buttonText, argsMap.defaultValue],
		kind: CompletionItemKind.Function,
		documentation: `获取用户输入
		\`\`\`webgal
		填写变量名称，用户输入的值将保存在该变量中。
		角色B:真的是太感谢您了，能告诉我您的名字吗？;
		getUserInput:player_name -title=您的名字 -buttonText=确认 -defaultValue=Bob;
		角色B:{player_name}，我记住了。;
		\`\`\`
`,
		detail: `getUserInput:[...args];`,
		insertText: "getUserInput:$1;$2"
	},
	applyStyle: {
		type: commandType.applyStyle,
		desc: "应用样式命令。",
		args: [],
		label: "applyStyle",
		kind: CompletionItemKind.Function,
		documentation: `首先需要在 UI 模板中新写一个样式，然后可以用 applyStyle 命令，将新样式替换原样式。
		原样式名与新样式名之间用 -> 连接，您可以同时替换多个样式，每个替换之间用英文逗号 , 分隔。
		格式如:原样式名->新样式名,原样式名2->新样式名2,...
		\`\`\`webgal
		; 将角色名背景替换为红色，前提是在 UI 模板里写了新样式
		applyStyle:TextBox_ShowName_Background->TextBox_ShowName_Background_Red;
		角色名:这是一句话;
		; 同时替换多个样式
		applyStyle:TextBox_ShowName_Background->TextBox_ShowName_Background_Green,TextBox_main->TextBox_main_Black;
		无论原样式被替换为什么新样式，替换样式依旧是原样式名在前;
		applyStyle:原样式名->新样式名1;
		applyStyle:新样式名1->新样式名2; 错误
		applyStyle:原样式名->新样式名2;
		\`\`\``,
		detail: `applyStyle:<old_style_name>-><new_style_name>;`,
		insertText: "applyStyle:$1;$2"
	},
	wait: {
		type: commandType.wait,
		desc: "等待命令。",
		args: [],
		label: "wait",
		kind: CompletionItemKind.Function,
		documentation: `填写一个数字，作为等待时间，单位为毫秒。
		有时出于演出效果的需要，可能需要等待一段时间，再执行下一句。
		\`\`\`webgal
		角色A:让我想想;
		角色A:......;
		wait:5000; 等待 5 秒
		角色A:想不出来，算了。;
		\`\`\``,
		detail: `wait:<number>;`,
		insertText: "wait:$1;$2"
	}
};
export const WebGALKeywordsKeys = Object.keys(WebGALKeywords);

/* server可用补全Map */
export const WebgGALKeywordsCompletionMap = WebGALKeywordsKeys.map(
	(v) =>
		({
			label: WebGALKeywords[v]?.label || v,
			kind: WebGALKeywords[v]?.kind || CompletionItemKind.Keyword,
			documentation: {
				kind: MarkupKind.Markdown,
				value:
					(WebGALKeywords[v].documentation as string)?.replace(
						/\t+/g,
						""
					) || WebGALKeywords[v].desc
			} as MarkupContent,
			detail: WebGALKeywords[v]?.detail || WebGALKeywords[v].desc,
			insertText: WebGALKeywords[v]?.insertText || v,
			insertTextFormat: InsertTextFormat.Snippet
		}) satisfies CompletionItem
);

export interface WebGALConfigToken extends Partial<CompletionItem> {
	desc: string; // 描述
	require?: boolean; // 是否必须
}

export const WebGALConfigMap: Record<string, WebGALConfigToken> = {
	Game_name: {
		desc: "游戏名称",
		require: true
	},
	Game_key: {
		desc: "游戏识别码，长度 6-10 字符，不要与别的游戏重复",
		require: true
	},
	Title_img: {
		desc: "标题图片，放在 background 文件夹",
		require: true
	},
	Title_bgm: {
		desc: "标题背景音乐，放在 bgm 文件夹",
		require: true
	},
	Game_Logo: {
		desc: "游戏 Logo，可以显示多个，用 | 分割"
	},
	Enable_Appreciation: {
		desc: "是否启用鉴赏功能，包括 CG 和背景音乐鉴赏。"
	},
	Default_Language: {
		desc: "默认语言，可设置为 'zh_CN', 'zh_TW', 'en', 'ja', 'fr', 'de'"
	},
	Show_panic: {
		desc: "是否启用紧急回避功能，设置为 true 或 false"
	},
	Legacy_Expression_Blend_Mode: {
		desc: "是否启用 Live2D 的旧表情混合模式，设置为 true 或 false"
	}
};

export const WebGALConfigCompletionMap = Object.fromEntries(
	Object.entries(WebGALConfigMap).map(([key, token]) => {
		const label = key;
		const documentation = token?.documentation ?? token?.desc ?? "";
		const detail = `${key}:<value>;`;
		const insertText = `${key}:$1;`;

		const completion: CompletionItem = {
			...token,
			label,
			kind: CompletionItemKind.Function,
			documentation,
			detail,
			insertText,
			insertTextFormat: InsertTextFormat.Snippet
		};
		return [key, completion];
	})
) as Record<string, WebGALConfigToken & CompletionItem>;
