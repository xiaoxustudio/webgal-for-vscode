import { CompletionItem, CompletionItemKind } from "vscode-languageserver";

export const commandSuggestions: CompletionItem[] = [
	{
		label: "intro",
		kind: CompletionItemKind.Function,
		documentation: `黑屏独白
  在许多游戏中，会以黑屏显示一些文字，用来引入主题或表现人物的心理活动。你可以使用 intro 命令来演出独白。
  独白的分拆以分隔符(|)来分割，也就是说，每一个 | 代表一个换行。
  intro:回忆不需要适合的剧本，|反正一说出口，|都成了戏言。;`,
		detail: `command intro:<text> [|<text of line 2>] ...;`,
		insertText: "intro:",
	},
	{
		label: "changeBg",
		kind: CompletionItemKind.Function,
		documentation: `更新背景图片
  changeBg:testBG03.jpg -next;`,
		detail: `command changeBg:<fileName> [-next];`,
		insertText: "changeBg",
	},
	{
		label: "changeFigure",
		kind: CompletionItemKind.Function,
		documentation: `更新立绘
  changeFigure:testFigure03.png -left -next;`,
		detail: `command changeFigure:<fileName> [-left] [-right] [id=figureId] [-next];`,
		insertText: "changeFigure",
	},
	{
		label: "miniAvatar",
		kind: CompletionItemKind.Function,
		documentation: `放置小头像
  很多游戏可以在文本框的左下角放置小头像，以下是在本引擎中使用的语法
  miniAvatar:minipic_test.png;显示
  miniAvatar:none;关闭`,
		detail: `command miniAvatar:<fileName>;`,
		insertText: "miniAvatar",
	},
	{
		label: "changeScene",
		kind: CompletionItemKind.Function,
		documentation: `场景跳转
  你可以将你的剧本拆分成多个 txt 文档，并使用一个简单的语句来切换当前运行的剧本。
  changeScene:Chapter-2.txt;`,
		detail: `command changeScene:<newSceneFileName>;`,
		insertText: "changeScene",
	},
	{
		label: "callScene",
		kind: CompletionItemKind.Function,
		documentation: `场景调用
  如果你需要在执行完调用的场景后回到先前的场景（即父场景），你可以使用 callScene 来调用场景
  callScene:Chapter-2.txt;`,
		detail: `command callScene:<newSceneFileName>;`,
		insertText: "callScene",
	},
	{
		label: "choose",
		kind: CompletionItemKind.Function,
		documentation: `分支选择
  如果你的剧本存在分支选项，你希望通过选择不同的选项进入不同的章节，请使用以下语句。
  其中，|是分隔符。
  choose:叫住她:Chapter-2.txt|回家:Chapter-3.txt;`,
		detail: `command choose:<chooseText:newSceneName> [|<chooseText:newSceneName>] ...;`,
		insertText: "choose: | ;",
	},
	{
		label: "end",
		kind: CompletionItemKind.Function,
		documentation: `结束游戏并返回到标题
  end;`,
		detail: `command end;`,
		insertText: "end;",
	},
	{
		label: "bgm",
		kind: CompletionItemKind.Function,
		documentation: `背景音乐（BGM）
  bgm:夏影.mp3;`,
		detail: `command bgm:<fileName>;`,
		insertText: "bgm",
	},
	{
		label: "playEffect",
		kind: CompletionItemKind.Function,
		documentation: `效果音
  playEffect:xxx.mp3;`,
		detail: `command playEffect:<fileName>;`,
		insertText: "playEffect",
	},
	{
		label: "playVideo",
		kind: CompletionItemKind.Function,
		documentation: `播放视频
  playVideo:OP.mp4;`,
		detail: `command playVideo:<fileName>;`,
		insertText: "playVideo",
	},
	{
		label: "unlockCg",
		kind: CompletionItemKind.Function,
		documentation: `解锁 CG 鉴赏
  unlockCg:xgmain.jpeg -name=星光咖啡馆与死神之蝶 -series=1;`,
		detail: `command unlockCg:<fileName> -name=cgName -series=serisId;`,
		insertText: "unlockCg",
	},
	{
		label: "unlockBgm",
		kind: CompletionItemKind.Function,
		documentation: `解锁 BGM 鉴赏
  unlockBgm:s_Title.mp3 -name=Smiling-Swinging!!;`,
		detail: `command unlockBgm:<fileName> -name=bgmName;`,
		insertText: "unlockBgm",
	},
	{
		label: "setTextbox",
		kind: CompletionItemKind.Function,
		documentation: `设置文本框开启/关闭
  setTextbox:hide;关闭文本框
  setTextbox:on;开启文本框，可以是除 hide 以外的任意值。`,
		detail: `command setTextbox:[hide] [others];`,
		insertText: "setTextbox",
	},
	{
		label: "setAnimation",
		kind: CompletionItemKind.Function,
		documentation: `设置动画
  setAnimation:enter-from-bottom -target=fig-center -next;为中间立绘设置一个从下方进入的动画，并转到下一句。`,
		detail: `command setAnimation:<animationName> -target=targetId;`,
		insertText: "setAnimation",
	},
	{
		label: "pixiInit",
		kind: CompletionItemKind.Function,
		documentation: `初始化 Pixi 特效
  1.如果你要使用特效，那么你必须先运行这个命令来初始化 Pixi。
  2.如果你想要消除已经作用的效果，你可以使用这个语法来清空效果。`,
		detail: `command pixiInit;`,
		insertText: "pixiInit;",
	},
	{
		label: "pixiPerform",
		kind: CompletionItemKind.Function,
		documentation: `初始化 Pixi 特效
  注意：特效作用后，如果没有初始化，特效会一直运行。`,
		detail: `command pixiPerform:<performName>;`,
		insertText: "pixiPerform",
	},
	{
		label: "setVar",
		kind: CompletionItemKind.Function,
		documentation: `使用变量
  setVar:a=1;可以设置数字
  setVar:a=true;可以设置布尔值
  setVar:a=人物名称;可以设置字符串`,
		detail: `command setVar:<expression>;`,
		insertText: "setVar:",
	},
	{
		label: "setTransform",
		kind: CompletionItemKind.Function,
		documentation: `设置效果`,
		detail: `command setTransform:<expression>;`,
		insertText: "setTransform:",
	},
	{
		label: "jumpLabel",
		kind: CompletionItemKind.Function,
		documentation: `跳转到指定标签`,
		detail: `command jumpLabel:<Laebl Name>;`,
		insertText: "jumpLabel:",
	},
	{
		label: "label",
		kind: CompletionItemKind.Function,
		documentation: `定义标签`,
		detail: `command label:<Name>;`,
		insertText: "label:",
	},
];
export const abbrKeys: CompletionItem[] = [
	{
		label: "-next",
		kind: CompletionItemKind.Constant,
		documentation: `连续执行本句和下一句`,
		detail: `option -next`,
		insertText: "next",
	},
	{
		label: "-notend",
		kind: CompletionItemKind.Constant,
		documentation: `用于对话，表示该对话未结束`,
		detail: `option -notend`,
		insertText: "notend",
	},
	{
		label: "-concat",
		kind: CompletionItemKind.Constant,
		documentation: `用于对话，将该对话与上一句连接`,
		detail: `option -concat`,
		insertText: "concat",
	},
	{
		label: "-name",
		kind: CompletionItemKind.Constant,
		documentation: `设置角色名称`,
		detail: `option -name`,
		insertText: "name",
	},
	{
		label: "-transform",
		kind: CompletionItemKind.Constant,
		documentation: `设置一些变换和滤镜效果`,
		detail: `option -transform`,
		insertText: "transform",
	},
	{
		label: "-volume",
		kind: CompletionItemKind.Constant,
		documentation: `调整它的音量，默认值 100`,
		detail: `option -volume`,
		insertText: "volume",
	},
	{
		label: "-skipOff",
		kind: CompletionItemKind.Constant,
		documentation: `阻止用户跳过视频`,
		detail: `option -skipOff`,
		insertText: "skipOff",
	},
	{
		label: "-global",
		kind: CompletionItemKind.Constant,
		documentation: `设置长效（全局）变量`,
		detail: `option -global`,
		insertText: "global",
	},
	{
		label: "-fontSize",
		kind: CompletionItemKind.Constant,
		documentation: `文字大小`,
		detail: `option -fontSize`,
		insertText: "fontSize",
	},
	{
		label: "-backgroundColor",
		kind: CompletionItemKind.Constant,
		documentation: `背景颜色`,
		detail: `option -backgroundColor`,
		insertText: "backgroundColor",
	},
	{
		label: "-fontColor",
		kind: CompletionItemKind.Constant,
		documentation: `字体颜色`,
		detail: `option -fontColor`,
		insertText: "fontColor",
	},
	{
		label: "-animation",
		kind: CompletionItemKind.Constant,
		documentation: `过渡动画`,
		detail: `option -animation`,
		insertText: "animation",
	},
	{
		label: "-delayTime",
		kind: CompletionItemKind.Constant,
		documentation: `动画延迟时间`,
		detail: `option -delayTime`,
		insertText: "delayTime",
	},
	{
		label: "-hold",
		kind: CompletionItemKind.Constant,
		documentation: `结束后保持`,
		detail: `option -hold`,
		insertText: "hold",
	},
];

export const keyNames: CompletionItem[] = [
	{
		label: "-when",
		kind: CompletionItemKind.Constant,
		documentation: `条件执行本句
  changeScene:2.txt -when=a>1;a>1时跳转到场景2`,
		detail: `option -when=<condition>`,
		insertText: "when=",
	},
];

export const figureKeys: CompletionItem[] = [
	{
		label: "-left",
		kind: CompletionItemKind.Constant,
		documentation: `立绘设置在左侧`,
		detail: `option -left`,
		insertText: "left",
	},
	{
		label: "-right",
		kind: CompletionItemKind.Constant,
		documentation: `立绘设置在右侧`,
		detail: `option -right`,
		insertText: "right",
	},
	{
		label: "-id",
		kind: CompletionItemKind.Constant,
		documentation: `设置立绘 ID`,
		detail: `option -id=<figureId>`,
		insertText: "id=",
	},
];

export const setAnimationKeys: CompletionItem[] = [
	{
		label: "-target",
		kind: CompletionItemKind.Constant,
		documentation: `设置动画目标 ID`,
		detail: `option -target=<targetId>`,
		insertText: "target=",
	},
	{
		label: "-duration",
		kind: CompletionItemKind.Constant,
		documentation: `设置持续时间`,
		detail: `option -duration=<number>`,
		insertText: "duration=",
	},
];
