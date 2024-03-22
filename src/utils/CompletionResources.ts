/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-22 10:54:59
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
