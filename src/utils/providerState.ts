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

const definedMapUserData: Record<string, StateMap> = {
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
					description:
						"string | boolean | number | Array<string | boolean | number>"
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
				description: "缩放",
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
			position: {
				key: "position",
				description: "位置",
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
			},
			brightness: {
				key: "brightness",
				description: "亮度",
				value: {
					key: "number",
					description: ""
				}
			},
			contrast: {
				key: "contrast",
				description: "对比度",
				value: {
					key: "number",
					description: ""
				}
			},
			saturation: {
				key: "saturation",
				description: "饱和度",
				value: {
					key: "number",
					description: ""
				}
			},
			gamma: {
				key: "gamma",
				description: "伽马值",
				value: {
					key: "number",
					description: ""
				}
			},
			colorRed: {
				key: "colorRed",
				description: "红色通道",
				value: {
					key: "number",
					description: ""
				}
			},
			colorGreen: {
				key: "colorGreen",
				description: "绿色通道",
				value: {
					key: "number",
					description: ""
				}
			},
			colorBlue: {
				key: "colorBlue",
				description: "蓝色通道",
				value: {
					key: "number",
					description: ""
				}
			},
			bevel: {
				key: "bevel",
				description: "斜角",
				value: {
					key: "number",
					description: ""
				}
			},
			bevelThickness: {
				key: "bevelThickness",
				description: "斜角厚度",
				value: {
					key: "number",
					description: ""
				}
			},
			bevelRotation: {
				key: "bevelRotation",
				description: "斜角旋转",
				value: {
					key: "number",
					description: ""
				}
			},
			bevelSoftness: {
				key: "bevelSoftness",
				description: "斜角柔和度",
				value: {
					key: "number",
					description: ""
				}
			},
			bevelRed: {
				key: "bevelRed",
				description: "斜角红色通道",
				value: {
					key: "number",
					description: ""
				}
			},
			bevelGreen: {
				key: "bevelGreen",
				description: "斜角绿色通道",
				value: {
					key: "number",
					description: ""
				}
			},
			bevelBlue: {
				key: "bevelBlue",
				description: "斜角蓝色通道",
				value: {
					key: "number",
					description: ""
				}
			},
			bloom: {
				key: "bloom",
				description: "泛光",
				value: {
					key: "number",
					description: ""
				}
			},
			bloomBrightness: {
				key: "bloomBrightness",
				description: "泛光亮度",
				value: {
					key: "number",
					description: ""
				}
			},
			bloomBlur: {
				key: "bloomBlur",
				description: "泛光模糊",
				value: {
					key: "number",
					description: ""
				}
			},
			bloomThreshold: {
				key: "bloomThreshold",
				description: "泛光阈值",
				value: {
					key: "number",
					description: ""
				}
			},
			shockwaveFilter: {
				key: "shockwaveFilter",
				description: "冲击波滤镜",
				value: {
					key: "number",
					description: ""
				}
			},
			radiusAlphaFilter: {
				key: "radiusAlphaFilter",
				description: "半径透明度滤镜",
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
	IStageAnimationSetting: {
		key: "IStageAnimationSetting",
		description: "",
		value: {
			target: {
				key: "target",
				description: "目标对象",
				value: {
					key: "string",
					description: ""
				}
			},
			enterAnimationName: {
				key: "enterAnimationName",
				description: "进入动画名称",
				value: {
					key: "string",
					description: ""
				}
			},
			exitAnimationName: {
				key: "exitAnimationName",
				description: "退出动画名称",
				value: {
					key: "string",
					description: ""
				}
			},
			enterDuration: {
				key: "enterDuration",
				description: "进入持续时间",
				value: {
					key: "number",
					description: ""
				}
			},
			exitDuration: {
				key: "exitDuration",
				description: "退出持续时间",
				value: {
					key: "number",
					description: ""
				}
			}
		}
	},
	arg: {
		key: "arg",
		description: "单个参数接口",
		value: {
			key: {
				key: "key",
				description: "参数键",
				value: {
					key: "string",
					description: ""
				}
			},
			value: {
				key: "value",
				description: "参数值",
				value: {
					key: "union",
					description: "string | boolean | number"
				}
			}
		}
	},
	IAsset: {
		key: "IAsset",
		description: "资源接口",
		value: {
			name: {
				key: "name",
				description: "资源名称",
				value: {
					key: "string",
					description: ""
				}
			},
			type: {
				key: "type",
				description: "资源类型",
				value: {
					key: "fileType",
					description: ""
				}
			},
			url: {
				key: "url",
				description: "资源url",
				value: {
					key: "string",
					description: ""
				}
			},
			lineNumber: {
				key: "lineNumber",
				description: "触发资源语句的行号",
				value: {
					key: "number",
					description: ""
				}
			}
		}
	},
	ISentence: {
		key: "ISentence",
		description: "单条语句接口",
		value: {
			command: {
				key: "command",
				description: "语句类型",
				value: {
					key: "commandType",
					description: ""
				}
			},
			commandRaw: {
				key: "commandRaw",
				description: "命令的原始内容，方便调试",
				value: {
					key: "string",
					description: ""
				}
			},
			content: {
				key: "content",
				description: "语句内容",
				value: {
					key: "string",
					description: ""
				}
			},
			args: {
				key: "args",
				description: "参数列表",
				value: {
					key: "Array",
					description: "Array<arg>"
				}
			},
			sentenceAssets: {
				key: "sentenceAssets",
				description: "语句携带的资源列表",
				value: {
					key: "Array",
					description: "Array<IAsset>"
				}
			},
			subScene: {
				key: "subScene",
				description: "语句包含子场景列表",
				value: {
					key: "Array",
					description: "Array<string>"
				}
			},
			inlineComment: {
				key: "inlineComment",
				description: "行内注释",
				value: {
					key: "string",
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
					key: "ISentence",
					description: ""
				}
			}
		}
	},
	ILive2DMotion: {
		key: "ILive2DMotion",
		description: "",
		value: {
			target: {
				key: "target",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			},
			motion: {
				key: "motion",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			},
			overrideBounds: {
				key: "overrideBounds",
				description: "",
				value: {
					key: "Array",
					description: "[number, number, number, number]"
				}
			}
		}
	},
	ILive2DExpression: {
		key: "ILive2DExpression",
		description: "",
		value: {
			target: {
				key: "target",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			},
			expression: {
				key: "expression",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	BlinkParam: {
		key: "BlinkParam",
		description: "眨眼参数，毫秒",
		value: {
			blinkInterval: {
				key: "blinkInterval",
				description: "眨眼间隔",
				value: {
					key: "number",
					description: ""
				}
			},
			blinkIntervalRandom: {
				key: "blinkIntervalRandom",
				description: "眨眼间隔随机范围",
				value: {
					key: "number",
					description: ""
				}
			},
			closingDuration: {
				key: "closingDuration",
				description: "闭眼",
				value: {
					key: "number",
					description: ""
				}
			},
			closedDuration: {
				key: "closedDuration",
				description: "保持闭眼",
				value: {
					key: "number",
					description: ""
				}
			},
			openingDuration: {
				key: "openingDuration",
				description: "睁眼",
				value: {
					key: "number",
					description: ""
				}
			}
		}
	},
	FocusParam: {
		key: "FocusParam",
		description: "",
		value: {
			x: {
				key: "x",
				description: "焦点X位置",
				value: {
					key: "number",
					description: ""
				}
			},
			y: {
				key: "y",
				description: "焦点Y位置",
				value: {
					key: "number",
					description: ""
				}
			},
			instant: {
				key: "instant",
				description: "是否瞬间切换焦点",
				value: {
					key: "boolean",
					description: ""
				}
			}
		}
	},
	ILive2DBlink: {
		key: "ILive2DBlink",
		description: "",
		value: {
			target: {
				key: "target",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			},
			blink: {
				key: "blink",
				description: "",
				value: {
					key: "BlinkParam",
					description: ""
				}
			}
		}
	},
	ILive2DFocus: {
		key: "ILive2DFocus",
		description: "",
		value: {
			target: {
				key: "target",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			},
			focus: {
				key: "focus",
				description: "",
				value: {
					key: "FocusParam",
					description: ""
				}
			}
		}
	},
	IFigureMetadata: {
		key: "IFigureMetadata",
		description: "",
		value: {
			zIndex: {
				key: "zIndex",
				description: "",
				value: {
					key: "number",
					description: ""
				}
			},
			blendMode: {
				key: "blendMode",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	figureMetaData: {
		key: "figureMetaData",
		description: "",
		value: {
			indexSignature: {
				key: "[key: string]",
				description: "",
				value: {
					key: "IFigureMetadata",
					description: ""
				}
			}
		}
	},
	IOptionData: {
		key: "IOptionData",
		description: "用户设置数据接口",
		value: {
			volumeMain: {
				key: "volumeMain",
				description: "主音量",
				value: {
					key: "number",
					description: ""
				}
			},
			textSpeed: {
				key: "textSpeed",
				description: "文字速度",
				value: {
					key: "number",
					description: ""
				}
			},
			autoSpeed: {
				key: "autoSpeed",
				description: "自动播放速度",
				value: {
					key: "number",
					description: ""
				}
			},
			textSize: {
				key: "textSize",
				description: "",
				value: {
					key: "textSize",
					description: ""
				}
			},
			vocalVolume: {
				key: "vocalVolume",
				description: "语音音量",
				value: {
					key: "number",
					description: ""
				}
			},
			bgmVolume: {
				key: "bgmVolume",
				description: "背景音乐音量",
				value: {
					key: "number",
					description: ""
				}
			},
			seVolume: {
				key: "seVolume",
				description: "音效音量",
				value: {
					key: "number",
					description: ""
				}
			},
			uiSeVolume: {
				key: "uiSeVolume",
				description: "用户界面音效音量",
				value: {
					key: "number",
					description: ""
				}
			},
			slPage: {
				key: "slPage",
				description: "存读档界面所在页面",
				value: {
					key: "number",
					description: ""
				}
			},
			textboxFont: {
				key: "textboxFont",
				description: "",
				value: {
					key: "number",
					description: ""
				}
			},
			textboxOpacity: {
				key: "textboxOpacity",
				description: "",
				value: {
					key: "number",
					description: ""
				}
			},
			language: {
				key: "language",
				description: "",
				value: {
					key: "language",
					description: ""
				}
			},
			voiceInterruption: {
				key: "voiceInterruption",
				description: "是否中断语音",
				value: {
					key: "voiceOption",
					description: ""
				}
			},
			fullScreen: {
				key: "fullScreen",
				description: "",
				value: {
					key: "fullScreenOption",
					description: ""
				}
			}
		}
	},
	ISceneEntry: {
		key: "ISceneEntry",
		description: "",
		value: {
			sceneName: {
				key: "sceneName",
				description: "场景名称",
				value: {
					key: "string",
					description: ""
				}
			},
			sceneUrl: {
				key: "sceneUrl",
				description: "场景url",
				value: {
					key: "string",
					description: ""
				}
			},
			continueLine: {
				key: "continueLine",
				description: "继续原场景的行号",
				value: {
					key: "number",
					description: ""
				}
			}
		}
	},
	ISaveScene: {
		key: "ISaveScene",
		description: "场景存档接口",
		value: {
			currentSentenceId: {
				key: "currentSentenceId",
				description: "当前语句ID",
				value: {
					key: "number",
					description: ""
				}
			},
			sceneStack: {
				key: "sceneStack",
				description: "场景栈",
				value: {
					key: "Array",
					description: "Array<ISceneEntry>"
				}
			},
			sceneName: {
				key: "sceneName",
				description: "场景名称",
				value: {
					key: "string",
					description: ""
				}
			},
			sceneUrl: {
				key: "sceneUrl",
				description: "场景url",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	stage: {
		key: "IStageState",
		description: "游戏舞台数据接口",
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
			playVocal: {
				key: "playVocal",
				description: "真实播放语音",
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
			animationSettings: {
				key: "animationSettings",
				description: "动画设置列表",
				value: {
					key: "Array",
					description: "Array<IStageAnimationSetting>"
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
					description: "Array<ILive2DMotion>"
				}
			},
			live2dExpression: {
				key: "live2dExpression",
				description: "Live2D表情列表",
				value: {
					key: "Array",
					description: "Array<ILive2DExpression>"
				}
			},
			live2dBlink: {
				key: "live2dBlink",
				description: "Live2D眨眼参数列表",
				value: {
					key: "Array",
					description: "Array<ILive2DBlink>"
				}
			},
			live2dFocus: {
				key: "live2dFocus",
				description: "Live2D焦点参数列表",
				value: {
					key: "Array",
					description: "Array<ILive2DFocus>"
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
			},
			replacedUIlable: {
				key: "replacedUIlable",
				description: "替换的UI标签",
				value: {
					key: "Record",
					description: "Record<string, string>"
				}
			},
			figureMetaData: {
				key: "figureMetaData",
				description: "立绘元数据",
				value: {
					key: "figureMetaData",
					description: ""
				}
			}
		}
	},
	IBacklogItem: {
		key: "IBacklogItem",
		description: "",
		value: {
			currentStageState: {
				key: "currentStageState",
				description: "",
				value: {
					key: "IStageState",
					description: ""
				}
			},
			saveScene: {
				key: "saveScene",
				description: "",
				value: {
					key: "ISaveScene",
					description: ""
				}
			}
		}
	},
	ISaveData: {
		key: "ISaveData",
		description: "存档文件接口",
		value: {
			nowStageState: {
				key: "nowStageState",
				description: "",
				value: {
					key: "IStageState",
					description: ""
				}
			},
			backlog: {
				key: "backlog",
				description: "舞台数据",
				value: {
					key: "Array",
					description: "Array<IBacklogItem>"
				}
			},
			index: {
				key: "index",
				description: "存档的序号",
				value: {
					key: "number",
					description: ""
				}
			},
			saveTime: {
				key: "saveTime",
				description: "保存时间",
				value: {
					key: "string",
					description: ""
				}
			},
			sceneData: {
				key: "sceneData",
				description: "场景数据",
				value: {
					key: "ISaveScene",
					description: ""
				}
			},
			previewImage: {
				key: "previewImage",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	IAppreciationAsset: {
		key: "IAppreciationAsset",
		description: "",
		value: {
			name: {
				key: "name",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			},
			url: {
				key: "url",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			},
			series: {
				key: "series",
				description: "",
				value: {
					key: "string",
					description: ""
				}
			}
		}
	},
	IAppreciation: {
		key: "IAppreciation",
		description: "",
		value: {
			bgm: {
				key: "bgm",
				description: "",
				value: {
					key: "Array",
					description: "Array<IAppreciationAsset>"
				}
			},
			cg: {
				key: "cg",
				description: "",
				value: {
					key: "Array",
					description: "Array<IAppreciationAsset>"
				}
			}
		}
	},
	ISetUserDataPayload: {
		key: "ISetUserDataPayload",
		description: "",
		value: {
			key: {
				key: "key",
				description: "",
				value: {
					key: "keyof IUserData",
					description: ""
				}
			},
			value: {
				key: "value",
				description: "",
				value: {
					key: "any",
					description: ""
				}
			}
		}
	},
	ISetOptionDataPayload: {
		key: "ISetOptionDataPayload",
		description: "",
		value: {
			key: {
				key: "key",
				description: "",
				value: {
					key: "keyof IOptionData",
					description: ""
				}
			},
			value: {
				key: "value",
				description: "",
				value: {
					key: "any",
					description: ""
				}
			}
		}
	},
	userData: {
		key: "IUserData",
		description: "用户数据接口",
		value: {
			scriptManagedGlobalVar: {
				key: "scriptManagedGlobalVar",
				description: "",
				value: {
					key: "Array",
					description: "Array<string>"
				}
			},
			globalGameVar: {
				key: "globalGameVar",
				description: "不跟随存档的全局变量",
				value: {
					key: "IGameVar",
					description: ""
				}
			},
			optionData: {
				key: "optionData",
				description: "用户设置选项数据",
				value: {
					key: "IOptionData",
					description: ""
				}
			},
			appreciationData: {
				key: "appreciationData",
				description: "",
				value: {
					key: "IAppreciation",
					description: ""
				}
			},
			gameConfigInit: {
				key: "gameConfigInit",
				description: "",
				value: {
					key: "IGameVar",
					description: ""
				}
			}
		}
	},
	commandType: {
		key: "commandType",
		description: "指令类型",
		value: {
			key: "enum",
			description:
				"say | changeBg | changeFigure | bgm | video | pixi | pixiInit | intro | miniAvatar | changeScene | choose | end | setComplexAnimation | setFilter | label | jumpLabel | chooseLabel | setVar | if | callScene | showVars | unlockCg | unlockBgm | filmMode | setTextbox | setAnimation | playEffect | setTempAnimation | comment | setTransform | setTransition | getUserInput | applyStyle | wait | callSteam"
		}
	},
	fileType: {
		key: "fileType",
		description: "内置资源类型的枚举",
		value: {
			key: "enum",
			description:
				"background | bgm | figure | scene | tex | vocal | video"
		}
	},
	playSpeed: {
		key: "playSpeed",
		description: "播放速度的枚举类型",
		value: {
			key: "enum",
			description: "slow | normal | fast"
		}
	},
	textSize: {
		key: "textSize",
		description: "文字大小枚举",
		value: {
			key: "enum",
			description: "small | medium | large"
		}
	},
	voiceOption: {
		key: "voiceOption",
		description: "语音选项枚举",
		value: {
			key: "enum",
			description: "yes | no"
		}
	},
	fullScreenOption: {
		key: "fullScreenOption",
		description: "全屏选项枚举",
		value: {
			key: "enum",
			description: "on | off"
		}
	},
	language: {
		key: "language",
		description: "语言枚举",
		value: {
			key: "enum",
			description: "zhCn | en | jp | fr | de | zhTw"
		}
	}
};

// 获取属性 xxxx.xxxx.xxx
export const getState = (type: "user" | "stage", propertiesArray: string[]) => {
	if (!propertiesArray || propertiesArray.length === 0) return undefined;

	let prev: Record<string, StateMap> =
		type === "user" ? definedMapUserData : definedMap;

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
					// value是类型
					return result;
				}
				if (!("key" in result.value)) {
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
