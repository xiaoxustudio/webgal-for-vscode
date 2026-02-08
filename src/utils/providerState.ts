export interface StateMap {
	key: string; // 键名
	description: string; // 描述
	value?: StateMap | Record<string, StateMap> | string; // 值
}

const definedMap: Record<string, StateMap> = {
	IFreeFigure: {
		key: "IFreeFigure",
		description: "",
		value: {
			basePosition: {
				key: "basePosition",
				description: '"left" | "center" | "right"',
				value: {
					key: "enum",
					description: '"left" | "center" | "right"'
				}
			},
			name: {
				key: "name",
				description: "名称",
				value: {
					key: "string",
					description: ""
				}
			},
			key: {
				key: "key",
				description: "键",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	IFigureAssociatedAnimation: {
		key: "IFigureAssociatedAnimation",
		description: "",
		value: {
			mouthAnimation: {
				key: "mouthAnimation",
				description: "嘴部动画文件",
				value: {
					key: "IMouthAnimationFile",
					description: "",
					value: {
						open: {
							key: "open",
							description: "张嘴动画文件",
							value: {
								key: "string",
								description: ""
							}
						},
						close: {
							key: "close",
							description: "闭嘴动画文件",
							value: {
								key: "string",
								description: ""
							}
						},
						halfOpen: {
							key: "halfOpen",
							description: "半张嘴动画文件",
							value: {
								key: "string",
								description: ""
							}
						}
					}
				}
			},
			blinkAnimation: {
				key: "blinkAnimation",
				description: "眨眼动画文件",
				value: {
					key: "IEyesAnimationFile",
					description: "",
					value: {
						open: {
							key: "open",
							description: "睁眼动画文件",
							value: {
								key: "string",
								description: ""
							}
						},
						close: {
							key: "close",
							description: "闭眼动画文件",
							value: {
								key: "string",
								description: ""
							}
						}
					}
				}
			},
			targetId: {
				key: "targetId",
				description: "目标ID",
				value: {
					key: "string",
					description: ""
				}
			},
			animationFlag: {
				key: "animationFlag",
				description: "动画标记",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	IMouthAnimationFile: {
		key: "IMouthAnimationFile",
		description: "",
		value: {
			open: {
				key: "open",
				description: "张嘴动画文件",
				value: {
					key: "string",
					description: ""
				}
			},
			close: {
				key: "close",
				description: "闭嘴动画文件",
				value: {
					key: "string",
					description: ""
				}
			},
			halfOpen: {
				key: "halfOpen",
				description: "半张嘴动画文件",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	IEyesAnimationFile: {
		key: "IEyesAnimationFile",
		description: "",
		value: {
			open: {
				key: "open",
				description: "睁眼动画文件",
				value: {
					key: "string",
					description: ""
				}
			},
			close: {
				key: "close",
				description: "闭眼动画文件",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	IGameVar: {
		key: "IGameVar",
		description: "游戏内变量",
		value: {
			indexSignature: {
				key: "[propName: string]",
				description: "",
				value: {
					key: "union",
					description: "string | boolean | number"
				}
			}
		}
	},
	ISetGameVar: {
		key: "ISetGameVar",
		description: "",
		value: {
			key: {
				key: "key",
				description: "变量名",
				value: {
					key: "string",
					description: ""
				}
			},
			value: {
				key: "value",
				description: "变量值",
				value: {
					key: "union",
					description: "string | boolean | number"
				}
			}
		}
	},
	IChooseItem: {
		key: "IChooseItem",
		description: "单个选项",
		value: {
			key: {
				key: "key",
				description: "选项名称",
				value: {
					key: "string",
					description: ""
				}
			},
			targetScene: {
				key: "targetScene",
				description: "选项target",
				value: {
					key: "string",
					description: ""
				}
			},
			isSubScene: {
				key: "isSubScene",
				description: "是否是子场景调用",
				value: {
					key: "boolean",
					description: ""
				}
			}
		}
	},
	ITransform: {
		key: "ITransform",
		description: "",
		value: {
			alpha: {
				key: "alpha",
				description: "透明度",
				value: {
					key: "number",
					description: ""
				}
			},
			scale: {
				key: "scale",
				description: "",
				value: {
					x: {
						key: "x",
						description: "X轴缩放",
						value: {
							key: "number",
							description: ""
						}
					},
					y: {
						key: "y",
						description: "Y轴缩放",
						value: {
							key: "number",
							description: ""
						}
					}
				}
			},
			pivot: {
				key: "pivot",
				description: "",
				value: {
					x: {
						key: "x",
						description: "X轴锚点",
						value: {
							key: "number",
							description: ""
						}
					},
					y: {
						key: "y",
						description: "Y轴锚点",
						value: {
							key: "number",
							description: ""
						}
					}
				}
			},
			position: {
				key: "position",
				description: "",
				value: {
					x: {
						key: "x",
						description: "X轴坐标",
						value: {
							key: "number",
							description: ""
						}
					},
					y: {
						key: "y",
						description: "Y轴坐标",
						value: {
							key: "number",
							description: ""
						}
					}
				}
			},
			rotation: {
				key: "rotation",
				description: "旋转角度",
				value: {
					key: "number",
					description: ""
				}
			},
			blur: {
				key: "blur",
				description: "模糊程度",
				value: {
					key: "number",
					description: ""
				}
			}
		}
	},
	IEffect: {
		key: "IEffect",
		description: "基本效果接口",
		value: {
			target: {
				key: "target",
				description: "作用目标",
				value: {
					key: "string",
					description: ""
				}
			},
			transform: {
				key: "transform",
				description: "变换",
				value: {
					key: "ITransform",
					description: ""
				}
			}
		}
	},
	IRunPerform: {
		key: "IRunPerform",
		description: "启动演出接口",
		value: {
			id: {
				key: "id",
				description: "演出ID",
				value: {
					key: "string",
					description: ""
				}
			},
			isHoldOn: {
				key: "isHoldOn",
				description: "演出类型",
				value: {
					key: "boolean",
					description: ""
				}
			},
			script: {
				key: "script",
				description: "演出脚本",
				value: {
					key: "any",
					description: ""
				}
			}
		}
	},
	stage: {
		key: "IStageState",
		description: "",
		value: {
			oldBgName: {
				key: "oldBgName",
				description: "旧背景的文件路径",
				value: {
					key: "string",
					description: ""
				}
			},
			bgName: {
				key: "bgName",
				description: "背景文件地址（相对或绝对）",
				value: {
					key: "string",
					description: ""
				}
			},
			figName: {
				key: "figName",
				description: "立绘_中 文件地址（相对或绝对）",
				value: {
					key: "string",
					description: ""
				}
			},
			figNameLeft: {
				key: "figNameLeft",
				description: "立绘_左 文件地址（相对或绝对）",
				value: {
					key: "string",
					description: ""
				}
			},
			figNameRight: {
				key: "figNameRight",
				description: "立绘_右 文件地址（相对或绝对）",
				value: {
					key: "string",
					description: ""
				}
			},
			freeFigure: {
				key: "freeFigure",
				description: "自由立绘",
				value: {
					key: "Array",
					description: "Array<IFreeFigure>"
				}
			},
			figureAssociatedAnimation: {
				key: "figureAssociatedAnimation",
				description: "立绘关联动画列表",
				value: {
					key: "Array",
					description: "Array<IFigureAssociatedAnimation>"
				}
			},
			showText: {
				key: "showText",
				description: "文字",
				value: {
					key: "string",
					description: ""
				}
			},
			showTextSize: {
				key: "showTextSize",
				description: "文字大小",
				value: {
					key: "number",
					description: ""
				}
			},
			showName: {
				key: "showName",
				description: "人物名",
				value: {
					key: "string",
					description: ""
				}
			},
			command: {
				key: "command",
				description: "语句指令",
				value: {
					key: "string",
					description: ""
				}
			},
			choose: {
				key: "choose",
				description: "选项列表",
				value: {
					key: "Array",
					description: "Array<IChooseItem>"
				}
			},
			vocal: {
				key: "vocal",
				description: "语音 文件地址（相对或绝对）",
				value: {
					key: "string",
					description: ""
				}
			},
			vocalVolume: {
				key: "vocalVolume",
				description: "语音 音量调整（0 - 100）",
				value: {
					key: "number",
					description: ""
				}
			},
			bgm: {
				key: "bgm",
				description: "背景音乐",
				value: {
					src: {
						key: "src",
						description: "背景音乐 文件地址（相对或绝对）",
						value: {
							key: "string",
							description: ""
						}
					},
					enter: {
						key: "enter",
						description: "背景音乐 淡入或淡出的毫秒数",
						value: {
							key: "number",
							description: ""
						}
					},
					volume: {
						key: "volume",
						description: "背景音乐 音量调整（0 - 100）",
						value: {
							key: "number",
							description: ""
						}
					}
				}
			},
			uiSe: {
				key: "uiSe",
				description: "用户界面音效 文件地址（相对或绝对）",
				value: {
					key: "string",
					description: ""
				}
			},
			miniAvatar: {
				key: "miniAvatar",
				description: "小头像 文件地址（相对或绝对）",
				value: {
					key: "string",
					description: ""
				}
			},
			GameVar: {
				key: "GameVar",
				description: "游戏内变量",
				value: {
					key: "IGameVar",
					description: ""
				}
			},
			effects: {
				key: "effects",
				description: "应用的变换",
				value: {
					key: "Array",
					description: "Array<IEffect>"
				}
			},
			bgTransform: {
				key: "bgTransform",
				description: "背景变换参数",
				value: {
					key: "string",
					description: ""
				}
			},
			bgFilter: {
				key: "bgFilter",
				description: "背景滤镜参数",
				value: {
					key: "string",
					description: ""
				}
			},
			PerformList: {
				key: "PerformList",
				description: "要启动的演出列表",
				value: {
					key: "Array",
					description: "Array<IRunPerform>"
				}
			},
			currentDialogKey: {
				key: "currentDialogKey",
				description: "当前对话的key",
				value: {
					key: "string",
					description: ""
				}
			},
			live2dMotion: {
				key: "live2dMotion",
				description: "Live2D动作列表",
				value: {
					key: "Array",
					description: "{ target: string; motion: string }[]"
				}
			},
			currentConcatDialogPrev: {
				key: "currentConcatDialogPrev",
				description: "当前演出的延迟，用于做对话插演出！",
				value: {
					key: "string",
					description: ""
				}
			},
			enableFilm: {
				key: "enableFilm",
				description: "测试：电影叙事",
				value: {
					key: "string",
					description: ""
				}
			},
			isDisableTextbox: {
				key: "isDisableTextbox",
				description: "是否禁用文本框",
				value: {
					key: "boolean",
					description: ""
				}
			}
		}
	}
};

// 获取属性 xxxx.xxxx.xxx
export const getState = (propertiesArray: string[]) => {
	if (!propertiesArray || propertiesArray.length === 0) return undefined;

	let prev: Record<string, StateMap> = definedMap;

	for (const curr of propertiesArray) {
		if (prev && prev[curr]) {
			const result = prev[curr];
			if (
				result &&
				typeof result === "object" &&
				"value" in result &&
				typeof result.value === "object"
			) {
				if (
					"description" in result.value &&
					(result.value as any).description === ""
				) {
					return result;
				}

				prev = result.value as Record<string, StateMap>;
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}

	return prev;
};
