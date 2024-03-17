import * as vscode from "vscode";
import { isRgba255, rgba255To01, rgba01To255 } from "./utils";

export default class XColorProvider implements vscode.DocumentColorProvider {
	provideDocumentColors(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.ColorInformation[]> {
		const colorRegex = /#[0-9a-fA-F]{3,6}/g;
		const colors: vscode.ColorInformation[] = [];
		const hexToRgba = (hex: string) => {
			const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
			const matches = hex.match(hexRegex);
			if (!matches) {
				return [0, 0, 0, 0];
			}
			const red = parseInt(matches[1], 16);
			const green = parseInt(matches[2], 16);
			const blue = parseInt(matches[3], 16);
			const alpha = matches[4] ? parseInt(matches[4], 16) / 255 : 255;
			return [red, green, blue, alpha];
		};
		let match;
		while ((match = colorRegex.exec(document.getText())) !== null) {
			const startPos = document.positionAt(match.index);
			const endPos = document.positionAt(match.index + match[0].length);
			const range = new vscode.Range(startPos, endPos);
			const __s = hexToRgba(match[0])?.map((val) => val / 255);
			const color = new vscode.ColorInformation(
				range,
				new vscode.Color(__s[0], __s[1], __s[2], __s[3])
			);
			colors.push(color);
		}
		const colorRegex_1 =
			/rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+(?:\.[\d.]+)?)?\)/g;
		while ((match = colorRegex_1.exec(document.getText())) !== null) {
			const startPos = document.positionAt(match.index);
			const endPos = document.positionAt(match.index + match[0].length);
			const range = new vscode.Range(startPos, endPos);
			const _content = isRgba255(match[0]) ? rgba255To01(match[0]) : match[0];
			const _s = _content
				.substring(_content.indexOf("(") + 1, _content.indexOf(")"))
				.split(",");
			const color = new vscode.ColorInformation(
				range,
				new vscode.Color(
					parseFloat(_s[0]),
					parseFloat(_s[1]),
					parseFloat(_s[2]),
					parseFloat(_s[3]) || 1
				)
			);
			colors.push(color);
		}
		return colors;
	}
	provideColorPresentations(
		color: vscode.Color,
		context: { document: vscode.TextDocument; range: vscode.Range },
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.ColorPresentation[]> {
		let label = "";
		const { red, green, blue, alpha } = color;
		if (color.red === 255 && color.green === 0 && color.blue === 0) {
			label = "Red";
		} else if (color.red === 0 && color.green === 0 && color.blue === 255) {
			label = "Blue";
		} else if (color.red === 0 && color.green === 255 && color.blue === 0) {
			label = "Green";
		} else {
			if (isRgba255(`rgba(${red},${green},${blue},${alpha})`)) {
				label = `rgba(${red},${green},${blue},${alpha})`;
			} else {
				label = rgba01To255(`rgba(${red},${green},${blue},${alpha})`);
			}
		}
		return [
			{
				label: label,
				textEdit: new vscode.TextEdit(
					context.range,
					rgba01To255(`rgba(${red},${green},${blue},${alpha})`)
				),
				additionalTextEdits: undefined,
			},
		];
	}
}
