/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-05-04 03:00:51
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */

const images: string[] = ["png", "webp", "jpg"];

const vocal: string[] = ["ogg", "wav"];

const bgm: string[] = ["mp3"];

const animation: string[] = ["json"];

const figures: string[] = ["json", "webp", "png"];

const textures: string[] = ["png", "webp"];

const videos: string[] = ["mp4"];

export const resources = {
	images, // 图片
	vocal, // 音频
	bgm, // 背景音乐
	animation, // 动画
	figures, // 立绘
	textures, // 纹理
	videos // 视频
};

export const resources_map: Record<string, string[]> = {
	animation: resources.animation,
	background: resources.images,
	bgm: resources.bgm,
	figure: resources.figures,
	tex: resources.textures,
	video: resources.videos,
	vocal: resources.vocal
};

export function getTypeDirectory(fileName: string) {
	const ext = fileName.split(".").pop()!;
	for (const type in resources_map) {
		if (resources_map[type].includes(ext)) {
			return type;
		}
	}
	return "scene";
}
