/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-23 18:45:45
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
export interface DIC {
	[key: string]: DToken;
}
export interface DToken {
	desc: string; // 描述
	APIL?: string; // api链接
	Equal?: boolean;
}
export const dictionary: { [key: string]: DIC } = {
	cmd: {
		next: <DToken>{
			desc: "在执行完本条语句后立刻跳转到下一条语句",
			Equal: false,
			APIL: "将立绘放在不同的位置|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E5%B0%86%E7%AB%8B%E7%BB%98%E6%94%BE%E5%9C%A8%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE",
		},
		none: <DToken>{
			desc: "在设置立绘、BGM、背景等 资源 时，通过设置为 none，可以关闭这个对象",
		},
		concat: <DToken>{
			desc: "本句对话连接在上一句对话之后",
		},
		duration: <DToken>{
			desc: "持续时间（毫秒ms）",
		},
		notend: <DToken>{
			desc: "本句对话没有结束，在后面可能连接演出或对话。",
		},
		left: <DToken>{
			desc: "左边显示",
			Equal: false,
			APIL: "将立绘放在不同的位置|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E5%B0%86%E7%AB%8B%E7%BB%98%E6%94%BE%E5%9C%A8%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE",
		},
		right: <DToken>{
			desc: "右边显示",
			Equal: false,
			APIL: "将立绘放在不同的位置|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E5%B0%86%E7%AB%8B%E7%BB%98%E6%94%BE%E5%9C%A8%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE",
		},
		id: <DToken>{
			desc: "指定id",
			APIL: "将立绘放在不同的位置|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E5%B0%86%E7%AB%8B%E7%BB%98%E6%94%BE%E5%9C%A8%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE",
		},
		series: <DToken>{
			desc: "代表当前立绘属于哪个系列。同系列的立绘以后会合并展示（即展示成可以切换的同系列CG）。",
			APIL: "解锁 CG 以供鉴赏|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E8%A7%A3%E9%94%81-cg-%E4%BB%A5%E4%BE%9B%E9%89%B4%E8%B5%8F",
		},
		transform: <DToken>{
			desc: "设置一些变换和滤镜效果",
			APIL: "设置立绘时设置效果|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E8%AE%BE%E7%BD%AE%E7%AB%8B%E7%BB%98%E6%97%B6%E8%AE%BE%E7%BD%AE%E6%95%88%E6%9E%9C",
		},
		enter: <DToken>{
			desc: "淡入播放，默认值 0",
			Equal: true,
			APIL: "播放背景音乐（BGM）|https://docs.openwebgal.com/webgal-script/audio.html#%E6%92%AD%E6%94%BE%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90-bgm",
		},
		volume: <DToken>{
			desc: "调整它的音量，默认值 100",
			Equal: true,
			APIL: "播放背景音乐（BGM）|https://docs.openwebgal.com/webgal-script/audio.html#%E6%92%AD%E6%94%BE%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90-bgm",
		},
		skipOff: <DToken>{
			desc: "阻止用户跳过视频",
			APIL: "为已有的立绘设置变换效果|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E8%AE%BE%E7%BD%AE%E7%AB%8B%E7%BB%98%E6%97%B6%E8%AE%BE%E7%BD%AE%E6%95%88%E6%9E%9C",
		},
		when: <DToken>{
			desc: "条件执行",
			Equal: true,
			APIL: "条件执行|https://docs.openwebgal.com/webgal-script/variable.html#%E6%9D%A1%E4%BB%B6%E6%89%A7%E8%A1%8C",
		},
		global: <DToken>{
			desc: "设置长效（全局）变量",
			APIL: "长效变量（全局变量）|https://docs.openwebgal.com/webgal-script/variable.html#%E9%95%BF%E6%95%88%E5%8F%98%E9%87%8F-%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F",
		},
		target: <DToken>{
			desc: "作用目标",
			APIL: "为背景或立绘设置动画|https://docs.openwebgal.com/webgal-script/animation.html#%E4%B8%BA%E8%83%8C%E6%99%AF%E6%88%96%E7%AB%8B%E7%BB%98%E8%AE%BE%E7%BD%AE%E5%8A%A8%E7%94%BB",
		},
		name: <DToken>{
			desc: "解锁名称",
		},
		fontSize: <DToken>{
			desc: "文字大小",
		},
		backgroundColor: <DToken>{
			desc: "背景颜色",
		},
		fontColor: <DToken>{
			desc: "字体颜色",
		},
		animation: <DToken>{
			desc: "过渡动画",
		},
		delayTime: <DToken>{
			desc: "动画延迟时间",
		},
		hold: <DToken>{
			desc: "结束后保持",
		},
	}, // 指令参数
	func: {
		"random()": <DToken>{
			desc: "生成随机数",
		},
	}, // 内置函数
	kw: {
		intro: <DToken>{
			desc: "在许多游戏中，会以黑屏显示一些文字，用来引入主题或表现角色的心理活动。你可以使用 intro 命令来演出独白",
			APIL: "黑屏文字|https://docs.openwebgal.com/webgal-script/dialogue.html#%E9%BB%91%E5%B1%8F%E6%96%87%E5%AD%97",
		},
		getUserInput: <DToken>{
			desc: "使用getUserInput 指令来获取用户输入，并写入变量",
			APIL: "获取用户输入|https://docs.openwebgal.com/webgal-script/dialogue.html#%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5",
		},
		setTextbox: <DToken>{
			desc: `
			有时候，为了一些特殊的演出效果，可能你希望临时关闭文本框，所以你可以使用以下指令来关闭文本框：
			setTextbox:hide; // 关闭文本框
			当 setTextbox 指令的值为 hide 时，会关闭文本框，且用户无法以任何方式打开。如果想要重新显示文本框，请再次调用此命令，并输入除hide以外的任意值。
			setTextbox:on; // 可以是除 hide 以外的任意值。
			`,
			APIL: "关闭文本框|https://docs.openwebgal.com/webgal-script/dialogue.html#%E5%85%B3%E9%97%AD%E6%96%87%E6%9C%AC%E6%A1%86",
		},
		changeBg: <DToken>{
			desc: "改变/关闭(none)背景",
			APIL: "改变背景/人物立绘|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E6%94%B9%E5%8F%98%E8%83%8C%E6%99%AF-%E4%BA%BA%E7%89%A9%E7%AB%8B%E7%BB%98",
		},
		changeFigure: <DToken>{
			desc: "改变/关闭(none)人物立绘",
			APIL: "改变背景/人物立绘|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E6%94%B9%E5%8F%98%E8%83%8C%E6%99%AF-%E4%BA%BA%E7%89%A9%E7%AB%8B%E7%BB%98",
		},
		miniAvatar: <DToken>{
			desc: "文本框的左下角放置小头像",
			APIL: "放置小头像|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%A4%B4%E5%83%8F",
		},
		unlockCg: <DToken>{
			desc: "使用 unlockCg 来解锁 CG 鉴赏中的 CG",
			APIL: "解锁 CG 以供鉴赏|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%A4%B4%E5%83%8F",
		},
		setTransform: <DToken>{
			desc: "为已有的立绘设置效果",
			APIL: "为已有的立绘设置变换效果|https://docs.openwebgal.com/webgal-script/bg-and-figure.html#%E8%AE%BE%E7%BD%AE%E7%AB%8B%E7%BB%98%E6%97%B6%E8%AE%BE%E7%BD%AE%E6%95%88%E6%9E%9C",
		},
		bgm: <DToken>{
			desc: "播放背景音乐",
			APIL: "播放背景音乐（BGM）|https://docs.openwebgal.com/webgal-script/audio.html#%E6%92%AD%E6%94%BE%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90-bgm",
		},
		playEffect: <DToken>{
			desc: "播放效果音",
			APIL: "播放效果音|https://docs.openwebgal.com/webgal-script/audio.html#%E6%92%AD%E6%94%BE%E6%95%88%E6%9E%9C%E9%9F%B3",
		},
		unlockBgm: <DToken>{
			desc: "解锁音频鉴赏中的音频",
			APIL: "解锁音频以供鉴赏|https://docs.openwebgal.com/webgal-script/audio.html#%E8%A7%A3%E9%94%81%E9%9F%B3%E9%A2%91%E4%BB%A5%E4%BE%9B%E9%89%B4%E8%B5%8F",
		},
		playVideo: <DToken>{
			desc: "播放视频",
			APIL: "播放视频|https://docs.openwebgal.com/webgal-script/video.html#%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91",
		},
		changeScene: <DToken>{
			desc: "场景跳转",
			APIL: "场景跳转|https://docs.openwebgal.com/webgal-script/scenes.html#%E5%9C%BA%E6%99%AF%E8%B7%B3%E8%BD%AC",
		},
		callScene: <DToken>{
			desc: "如果你需要在一个场景中调用另一段场景，你可以使用 callScene，在调用的场景运行完毕后会回到原场景。",
			APIL: "场景调用|https://docs.openwebgal.com/webgal-script/scenes.html#%E5%9C%BA%E6%99%AF%E8%B0%83%E7%94%A8",
		},
		choose: <DToken>{
			desc: "如果你的剧本存在分支选项，你希望通过选择不同的选项进入不同的章节，请使用 choose。使用 选择项文本:章节文件名 定义一个选择项。使用 | 来分隔不同选择项。",
			APIL: "分支选择|https://docs.openwebgal.com/webgal-script/scenes.html#%E5%88%86%E6%94%AF%E9%80%89%E6%8B%A9",
		},
		jumpLabel: <DToken>{
			desc: "标签跳转",
			APIL: "标签跳转|https://docs.openwebgal.com/webgal-script/scenes.html#%E6%A0%87%E7%AD%BE%E8%B7%B3%E8%BD%AC",
		},
		label: <DToken>{
			desc: "创建标签",
			APIL: "创建标签（label）|https://docs.openwebgal.com/webgal-script/scenes.html#%E5%88%9B%E5%BB%BA%E6%A0%87%E7%AD%BE-label",
		},
		setVar: <DToken>{
			desc: "设置变量",
			APIL: "使用变量|https://docs.openwebgal.com/webgal-script/variable.html#%E4%BD%BF%E7%94%A8%E5%8F%98%E9%87%8F",
		},
		setAnimation: <DToken>{
			desc: "为背景或立绘设置动画",
			APIL: "为背景或立绘设置动画|https://docs.openwebgal.com/webgal-script/animation.html#%E4%B8%BA%E8%83%8C%E6%99%AF%E6%88%96%E7%AB%8B%E7%BB%98%E8%AE%BE%E7%BD%AE%E5%8A%A8%E7%94%BB",
		},
		pixiInit: <DToken>{
			desc: "初始化 Pixi",
			APIL: "初始化 Pixi|https://docs.openwebgal.com/webgal-script/special-effect.html#%E5%88%9D%E5%A7%8B%E5%8C%96-pixi",
		},
		pixiPerform: <DToken>{
			desc: "添加特效",
			APIL: "添加特效|https://docs.openwebgal.com/webgal-script/special-effect.html#%E6%B7%BB%E5%8A%A0%E7%89%B9%E6%95%88",
		},
	}, // 内置关键字
};
