/**
 * This script generates React Native components from SVG files in the icons directory.
 */

import path from "path";
import { fileURLToPath } from "url";
import fg from "fast-glob";
import fs from "fs-extra";
import PQueue from "p-queue";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { transform } from "@svgr/core";

const argv = yargs(hideBin(process.argv)).option("style", {
	alias: "s",
	describe:
		"Sets the default style for the components. Choose from 'outlined', 'rounded', 'sharp'. Additionally, 'filled' can be appended to specify the filled alternative of a style as the default, i.e 'roundedfilled'. Components will be named without including this style in the name. Default is 'outlinedfilled'.",
	type: "string",
}).argv;

const ext = "svg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, "..");
const destPath = path.join(root, "src");

const queue = new PQueue({ concurrency: 8 });
const defaultStyle = argv.style ?? "outlinedfilled";

const getIconFiles = () => fg(`icons/**/*.${ext}`);

const createComponentWithDefaultStyle = async (filePath, name) => {
	const normalizedDefaultStyle = defaultStyle.toLowerCase();
	const normalizedName = name.toLowerCase();
	const shouldCreate = normalizedName.includes(normalizedDefaultStyle);

	if (shouldCreate) await toTSX(filePath, name.replace(new RegExp(defaultStyle, "gi"), ""));
};

const toTSX = async (filePath, name = path.basename(filePath, `.${ext}`)) => {
	await createComponentWithDefaultStyle(filePath, name);

	const data = await fs.readFile(filePath, { encoding: "utf-8" });
	const content = await transform(
		data,
		{
			native: true,
			icon: true,
			typescript: true,
			generateIndex: true,
			plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx", "@svgr/plugin-prettier"],
			svgoConfig: {
				plugins: ["removeXMLNS"],
			},
		},
		{ componentName: name }

	);
	const style = path.dirname(filePath).split("/").pop();
	const outPath = path.join(destPath, style, name + ".tsx");

	await fs.outputFile(outPath, content, { encoding: "utf-8" });
};

const generateComponents = async () => {
	const files = await getIconFiles();
	await queue.addAll(files.map(path => () => toTSX(path)));
};

const generateIndex = async () => {
	const files = await fg(`src/**/*.tsx`);
	const styles = files.map(filePath => path.dirname(filePath).split("/").pop()).filter((style, i, arr) => arr.indexOf(style) === i);
	const names = files.map(filePath => path.basename(filePath, ".tsx")).filter((name, i, arr) => arr.indexOf(name) === i);
	const content = names.map((name, i) => `export { default as ${name} } from "./${name}";`).join("\n");

	for (const style of styles) {
		await fs.outputFile(path.join(destPath, style, "index.ts"), content, { encoding: "utf-8" });	
	}
};

const clean = () => fs.emptyDir(destPath);

const run = async () => {
	await clean();
	await generateComponents();
	await generateIndex();
};

run();
