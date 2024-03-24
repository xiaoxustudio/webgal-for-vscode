/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-24 22:50:55
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */

const images: string[] = [".png", ".webp", ".jpg"];

const audios: string[] = [".mp3", ".ogg", ".wav"];

const animation: string[] = [".json"];

const figures: string[] = [".json", ".webp", ".png"];

const textures: string[] = [".png", ".webp"];

const videos: string[] = [".mp4"];

export const resources = {
	images, // 图片
	audios, // 音频
	animation, // 动画
	figures, // 立绘
	textures, // 纹理
	videos, // 视频
};

export const resources_map: { [key: string]: string[] } = {
	animation: resources.animation,
	background: resources.images,
	bgm: resources.audios,
	figure: resources.figures,
	tex: resources.textures,
	video: resources.videos,
	vocal: resources.audios,
};

enum resources_location {
	animation,
	background,
	bgm,
	figure,
	tex,
	video,
	vocal,
	scene,
}

// 指令资源映射
export const ResType_Map: { [key: string]: resources_location } = {
	bgm: resources_location.bgm,
	unlockBgm: resources_location.bgm,
	changeBg: resources_location.background,
	unlockCg: resources_location.background,
	playEffect: resources_location.vocal,
	playVideo: resources_location.video,
	changeFigure: resources_location.figure,
	callScene: resources_location.scene,
	changeScene: resources_location.scene,
	choose: resources_location.scene,
};
// 指令反资源映射
export const ResLocation_Map: Map<resources_location, string> = new Map<
	resources_location,
	string
>([
	[resources_location.animation, "animation"],
	[resources_location.background, "background"],
	[resources_location.figure, "figure"],
	[resources_location.tex, "tex"],
	[resources_location.video, "video"],
	[resources_location.vocal, "vocal"],
	[resources_location.scene, "scene"],
	[resources_location.bgm, "bgm"],
]);
export function get_res_dir(type: resources_location) {
	return ResLocation_Map.get(type);
}
