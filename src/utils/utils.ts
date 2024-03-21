/*
 * @Author: xuranXYS
 * @LastEditTime: 2024-03-21 08:53:10
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
export const selector = { scheme: "file", language: "webgal" };
export function rgba01To255(rgba: string): string {
	const matches = rgba.match(/rgba?\((.+?)\)/);
	if (!matches) {
		return rgba;
	}
	const values = matches[1].split(",").map(parseFloat);
	if (values.length !== 4) {
		return rgba;
	}
	const rgba255 = `rgba(${values
		.map((value) => value <= 1 ? Math.round(value * 255) : value)
		.join(",")})`;
	return rgba255;
}
export function rgba255To01(rgba: string): string {
	const matches = rgba.match(/rgba?\((.+?)\)/);
	if (!matches) {
		return rgba;
	}
	const values = matches[1].split(",").map(parseFloat);
	if (values.length !== 4) {
		return rgba;
	}
	const rgba01 = `rgba(${values.map((value) => value / 255).join(",")})`;
	return rgba01;
}
export function isRgba255(rgba: string): boolean {
	const matches = rgba.match(/rgba?\((.+?)\)/);
	if (!matches) {
		return false;
	}
	const values = matches[1].split(",").map(parseFloat);
	return values.every((value) => value >= 1);
}
