import { readFileSync } from "fs";
import path from "path";

const definedMap: Record<string, StateMap> = JSON.parse(
	readFileSync(path.join(__dirname, "../..", "stateMap.json")).toString()
);

export interface StateMap {
	key: string; // 键名
	description: string; // 描述
	type?: {
		key: string; // 类型
		description: string; // 描述
	}; // 类型
	value?: StateMap | Record<string, StateMap> | string; // 值
}

// 获取属性 xxxx.xxxx.xxx
export const getState = (
	propertiesArray: string[],
	prev: Record<string, StateMap> = definedMap
) => {
	if (!propertiesArray || propertiesArray.length === 0) return undefined;

	for (const curr of propertiesArray) {
		const result = prev[curr];
		if (prev && result) {
			if (typeof result.value === "object") {
				prev = result.value as Record<string, StateMap>;
			} else {
				// 是否是嵌套
				if (!("key" in result)) {
					prev = result as Record<string, StateMap>;
					continue;
				}
				return result;
			}
		} else {
			// 就没有这个属性
			return undefined;
		}
	}

	return prev;
};
