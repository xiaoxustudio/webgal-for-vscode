/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-05-04 03:00:51
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */

import { WebGALKeywords } from "./provider";

enum ResourceType {
	animation = "animation",
	background = "background",
	bgm = "bgm",
	figure = "figure",
	scene = "scene",
	tex = "tex",
	video = "video",
	vocal = "vocal"
}

export const resourceExtsMap = {
	animation: ["json"],
	background: ["png", "jpg", "jpeg", "webp", "mp4", "webm", "mkv"],
	bgm: ["mp3", "ogg", "wav"],
	figure: ["png", "jpg", "jpeg", "webp", "json"],
	scene: ["txt"],
	tex: ["png", "webp"],
	video: ["mp4", "webm", "mkv"],
	vocal: ["mp3", "ogg", "wav"]
};

export const resourcesMap = {
	[WebGALKeywords.changeBg.label!]: ResourceType.background,
	[WebGALKeywords.changeFigure.label!]: ResourceType.figure,
	[WebGALKeywords.bgm.label!]: ResourceType.bgm,
	[WebGALKeywords.playVideo.label!]: ResourceType.video,
	[WebGALKeywords.miniAvatar.label!]: ResourceType.figure,
	[WebGALKeywords.unlockCg.label!]: ResourceType.background,
	[WebGALKeywords.unlockBgm.label!]: ResourceType.bgm,
	[WebGALKeywords.playEffect.label!]: ResourceType.vocal,
	[WebGALKeywords.playEffect.label!]: ResourceType.vocal,
	[WebGALKeywords.changeScene.label!]: ResourceType.scene,
	[WebGALKeywords.callScene.label!]: ResourceType.scene,
	[WebGALKeywords.choose.label!]: ResourceType.scene
};

/* 根据指令返回资源目录名称 */
export function getTypeDirectory(command: string, fileName: string) {
	const ext = fileName.split(".").pop()!;
	/* 精确匹配 */
	for (const type in resourcesMap) {
		const current = resourcesMap[type];
		if (command == type && resourceExtsMap[current].includes(ext)) {
			return current;
		}
	}
	/* 模糊匹配 */
	for (const type in resourcesMap) {
		const current = resourcesMap[type];
		if (resourceExtsMap[current].includes(ext)) {
			return current;
		}
	}
	return "scene";
}
