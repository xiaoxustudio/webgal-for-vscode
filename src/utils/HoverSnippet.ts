/*
 * @Author: xuranXYS
 * @LastEditTime: 2025-10-29 16:25:11
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
export interface CToken {
	desc: string; // 描述
	Equal?: boolean;
}

export const dictionary: { [key: string]: DIC } = {
	cmd: {
		next: <DToken>{
			desc: "在执行完本条语句后立刻跳转到下一条语句",
			Equal: false,
			APIL: "将立绘放在不同的位置"
		},
		none: <DToken>{
			desc: "在设置立绘、BGM、背景等 资源 时，通过设置为 none，可以关闭这个对象"
		},
		concat: <DToken>{
			desc: "本句对话连接在上一句对话之后"
		},
		duration: <DToken>{
			desc: "持续时间（毫秒ms）"
		},
		notend: <DToken>{
			desc: "本句对话没有结束，在后面可能连接演出或对话。"
		},
		left: <DToken>{
			desc: "左边显示",
			Equal: false,
			APIL: "将立绘放在不同的位置"
		},
		right: <DToken>{
			desc: "右边显示",
			Equal: false,
			APIL: "将立绘放在不同的位置"
		},
		center: <DToken>{
			desc: "中间显示",
			Equal: false,
			APIL: "将立绘放在不同的位置"
		},
		figureId: <DToken>{
			desc: "关联立绘ID",
			Equal: false
		},
		id: <DToken>{
			desc: "指定id",
			APIL: "将立绘放在不同的位置"
		},
		series: <DToken>{
			desc: "代表当前立绘属于哪个系列。同系列的立绘以后会合并展示（即展示成可以切换的同系列CG）。",
			APIL: "解锁 CG 以供鉴赏"
		},
		transform: <DToken>{
			desc: "设置一些变换和滤镜效果",
			APIL: "设置立绘时设置效果"
		},
		enter: <DToken>{
			desc: "淡入播放，默认值 0",
			Equal: true,
			APIL: "播放背景音乐（BGM）"
		},
		volume: <DToken>{
			desc: "调整它的音量，默认值 100",
			Equal: true,
			APIL: "播放背景音乐（BGM）"
		},
		skipOff: <DToken>{
			desc: "阻止用户跳过视频",
			APIL: "为已有的立绘设置变换效果"
		},
		when: <DToken>{
			desc: "条件执行",
			Equal: true,
			APIL: "条件执行"
		},
		global: <DToken>{
			desc: "设置长效（全局）变量",
			APIL: "长效变量（全局变量）"
		},
		target: <DToken>{
			desc: "作用目标",
			APIL: "为背景或立绘设置动画"
		},
		name: <DToken>{
			desc: "解锁名称"
		},
		fontSize: <DToken>{
			desc: "文字大小"
		},
		backgroundColor: <DToken>{
			desc: "背景颜色"
		},
		fontColor: <DToken>{
			desc: "字体颜色"
		},
		animation: <DToken>{
			desc: "过渡动画"
		},
		delayTime: <DToken>{
			desc: "动画延迟时间"
		},
		buttonText: <DToken>{
			desc: "确认按钮的文本"
		},
		hold: <DToken>{
			desc: "结束后保持"
		}
	}, // 指令参数
	func: {
		"random()": <DToken>{
			desc: "生成随机数"
		}
	}, // 内置函数
	kw: {
		wait: <DToken>{
			desc: "等待一段时间",
			APIL: "等待一段时间"
		},
		intro: <DToken>{
			desc: "在许多游戏中，会以黑屏显示一些文字，用来引入主题或表现角色的心理活动。你可以使用 intro 命令来演出独白",
			APIL: "黑屏文字"
		},
		getUserInput: <DToken>{
			desc: "使用getUserInput 指令来获取用户输入，并写入变量",
			APIL: "获取用户输入"
		},
		setTextbox: <DToken>{
			desc: `
			有时候，为了一些特殊的演出效果，可能你希望临时关闭文本框，所以你可以使用以下指令来关闭文本框：
			setTextbox:hide; // 关闭文本框
			当 setTextbox 指令的值为 hide 时，会关闭文本框，且用户无法以任何方式打开。如果想要重新显示文本框，请再次调用此命令，并输入除hide以外的任意值。
			setTextbox:on; // 可以是除 hide 以外的任意值。
			`,
			APIL: "关闭文本框"
		},
		changeBg: <DToken>{
			desc: "改变/关闭(none)背景",
			APIL: "改变背景/人物立绘"
		},
		changeFigure: <DToken>{
			desc: "改变/关闭(none)人物立绘",
			APIL: "改变背景/人物立绘"
		},
		miniAvatar: <DToken>{
			desc: "文本框的左下角放置小头像",
			APIL: "放置小头像"
		},
		unlockCg: <DToken>{
			desc: "使用 unlockCg 来解锁 CG 鉴赏中的 CG",
			APIL: "解锁 CG 以供鉴赏"
		},
		setTransform: <DToken>{
			desc: "为已有的立绘设置效果",
			APIL: "为已有的立绘设置变换效果"
		},
		bgm: <DToken>{
			desc: "播放背景音乐",
			APIL: "播放背景音乐（BGM）"
		},
		playEffect: <DToken>{
			desc: "播放效果音",
			APIL: "播放效果音"
		},
		unlockBgm: <DToken>{
			desc: "解锁音频鉴赏中的音频",
			APIL: "解锁音频以供鉴赏"
		},
		playVideo: <DToken>{
			desc: "播放视频",
			APIL: "播放视频"
		},
		changeScene: <DToken>{
			desc: "场景跳转",
			APIL: "场景跳转"
		},
		callScene: <DToken>{
			desc: "如果你需要在一个场景中调用另一段场景，你可以使用 callScene，在调用的场景运行完毕后会回到原场景。",
			APIL: "场景调用"
		},
		choose: <DToken>{
			desc: "如果你的剧本存在分支选项，你希望通过选择不同的选项进入不同的章节，请使用 choose。使用 选择项文本:章节文件名 定义一个选择项。使用 ",
			APIL: "分支选择"
		},
		jumpLabel: <DToken>{
			desc: "标签跳转",
			APIL: "标签跳转"
		},
		label: <DToken>{
			desc: "创建标签",
			APIL: "创建标签（label）"
		},
		setVar: <DToken>{
			desc: "设置变量",
			APIL: "使用变量"
		},
		setAnimation: <DToken>{
			desc: "为背景或立绘设置动画",
			APIL: "为背景或立绘设置动画"
		},
		pixiInit: <DToken>{
			desc: "初始化 Pixi",
			APIL: "初始化 Pixi"
		},
		pixiPerform: <DToken>{
			desc: "添加特效",
			APIL: "添加特效"
		},
		applyStyle: <DToken>{
			desc: "更换 UI 样式",
			APIL: "更换 UI 样式"
		},
		setTransition: <DToken>{
			desc: "设置舞台对象的入场或出场动画。",
			APIL: "设置舞台对象的入场或出场动画"
		},
		setTempAnimation: <DToken>{
			desc: "设置临时动画。",
			APIL: "设置临时动画"
		},
		filmMode: <DToken>{
			desc: "开启和关闭电影模式的二合一命令。",
			APIL: "开启和关闭电影模式"
		},
		setComplexAnimation: <DToken>{
			desc: "设置复杂动画。",
			APIL: "设置复杂动画"
		}
	} // 内置关键字
};
// 配置Hover
export const config_dictionary: { [key: string]: CToken } = {
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
