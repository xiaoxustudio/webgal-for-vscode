// @ts-nocheck
import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

enum TypePrefixValue {
	Type = "@T",
	Enum = "@E",
	Union = "@U",
	Nil = "@N"
}

// 定义输出的目标接口
export interface StateMap {
	key: string; // 键名
	description: string; // 描述
	type?: {
		key: string; // 类型
		description: string; // 描述
	}; // 类型
	value?: StateMap | Record<string, StateMap> | string; // 值
}

// 配置：定义文件的路径
const TYPE_DEF_FILE_PATH = path.resolve(__dirname, "index.d.ts");

function main() {
	console.log(`正在读取文件: ${TYPE_DEF_FILE_PATH}`);

	if (!fs.existsSync(TYPE_DEF_FILE_PATH)) {
		console.error("错误: 找不到 index.d.ts 文件");
		process.exit(1);
	}

	const fileContent = fs.readFileSync(TYPE_DEF_FILE_PATH, "utf-8");

	// 创建 TypeScript SourceFile 对象
	const sourceFile = ts.createSourceFile(
		TYPE_DEF_FILE_PATH,
		fileContent,
		ts.ScriptTarget.Latest,
		true // 设置为 true 以便获取节点的注释
	);

	// 1. 收集所有顶层定义（接口、类型别名、枚举），以便处理引用类型
	const definitions = new Map<string, ts.Node>();

	ts.forEachChild(sourceFile, (node) => {
		if (
			ts.isInterfaceDeclaration(node) ||
			ts.isTypeAliasDeclaration(node) ||
			ts.isEnumDeclaration(node)
		) {
			definitions.set(node.name.text, node);
		}
	});

	// 2. 辅助函数：提取节点的注释（支持行尾注释和 JSDoc）
	function getNodeDescription(node: ts.Node): string {
		const fullText = sourceFile.getFullText();

		// 尝试获取行尾注释
		const trailingComments = ts.getTrailingCommentRanges(
			fullText,
			node.end
		);
		if (trailingComments && trailingComments.length > 0) {
			const comment = fullText
				.substring(trailingComments[0].pos, trailingComments[0].end)
				.trim();
			// 移除注释符号
			return comment.replace(/^\/\/|^\/\*|\*\/$/g, "").trim();
		}

		// 尝试获取 JSDoc
		const jsDocTags = ts.getJSDocTags(node);
		if (jsDocTags.length > 0) {
			return jsDocTags
				.map(
					(tag) =>
						tag.tagName.text +
						(tag.comment ? " " + tag.comment : "")
				)
				.join("\n");
		}

		return "";
	}

	// 3. 递归解析属性
	function parseProperty(prop: ts.PropertySignature): StateMap | null {
		if (!prop.name || !prop.type) return null;

		const key = prop.name.getText();
		const description = getNodeDescription(prop);
		const typeNode = prop.type;

		let typeKey = typeNode.getText();
		let value: StateMap | Record<string, StateMap> | string | undefined =
			undefined;

		// 处理类型引用 (例如: command: commandType)
		if (ts.isTypeReferenceNode(typeNode)) {
			const typeName = typeNode.typeName.getText();
			const refNode = definitions.get(typeName);

			if (refNode) {
				if (ts.isInterfaceDeclaration(refNode)) {
					// 递归解析引用的接口
					value = parseInterfaceOrType(refNode);
				} else if (ts.isTypeAliasDeclaration(refNode)) {
					value = TypePrefixValue.Nil;
				} else if (ts.isEnumDeclaration(refNode)) {
					// 枚举通常作为字符串类型处理，或者不展开其成员
					value = typeKey;
				}
			} else {
				// 外部库类型或未找到定义
				value = typeKey;
			}
		}
		// 处理内联对象类型 (例如: bgm: { src: string; ... })
		else if (ts.isTypeLiteralNode(typeNode)) {
			value = parseTypeLiteral(typeNode);
		}
		// 处理数组类型 (例如: assetsList: Array<IAsset>)
		else if (ts.isArrayTypeNode(typeNode)) {
			// 这里我们通常只记录类型字符串，因为数组的值结构与对象属性不同
			// 如果需要深入解析数组元素的类型，需要额外处理 typeNode.elementType
			value = `${TypePrefixValue.Type}:${typeKey}`;
		}
		// 处理联合类型 (例如: string | number)
		else if (ts.isUnionTypeNode(typeNode)) {
			value = `${TypePrefixValue.Union}:${typeKey}`;
		} else {
			// 基本类型
			value = typeKey;
		}

		return {
			key,
			description,
			type: {
				key: typeKey,
				description: description // 可以在这里加上类型的描述
			},
			value
		};
	}

	// 解析内联类型字面量 { ... }
	function parseTypeLiteral(
		node: ts.TypeLiteralNode
	): Record<string, StateMap> {
		const result: Record<string, StateMap> = {};
		node.members.forEach((member) => {
			if (ts.isPropertySignature(member)) {
				const parsed = parseProperty(member);
				if (parsed) result[parsed.key] = parsed;
			}
		});
		return result;
	}

	// 解析接口或类型别名声明
	function parseInterfaceOrType(
		node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration
	): Record<string, StateMap> {
		const result: Record<string, StateMap> = {};

		let members: ts.NodeArray<ts.TypeElement> = [];
		if (ts.isInterfaceDeclaration(node)) {
			members = node.members;
		} else if (
			ts.isTypeAliasDeclaration(node) &&
			ts.isTypeLiteralNode(node.type)
		) {
			members = node.type.members;
		}

		members.forEach((member) => {
			if (ts.isPropertySignature(member)) {
				const parsed = parseProperty(member);
				if (parsed) result[parsed.key] = parsed;
			}
		});

		return result;
	}

	// 4. 构建最终结果
	const finalResult: Record<string, Record<string, StateMap>> = {};

	definitions.forEach((node, name) => {
		// 只处理接口和对象类型的别名
		if (ts.isInterfaceDeclaration(node)) {
			finalResult[name] = parseInterfaceOrType(node);
		} else if (
			ts.isTypeAliasDeclaration(node) &&
			ts.isTypeLiteralNode(node.type)
		) {
			finalResult[name] = parseInterfaceOrType(node);
		}
	});
	finalResult["stage"] = finalResult["IStageState"];
	finalResult["userData"] = finalResult["IUserData"];
	delete finalResult["IStageState"];
	delete finalResult["IUserData"];
	// 5. 输出结果
	fs.writeFileSync(
		path.join(__dirname, "../stateMap.json"),
		JSON.stringify(finalResult, null, 2)
	);
}

main();
