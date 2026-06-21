"use strict";

const fs = require("fs");
const path = require("path");
const { parse } = require("./parser");
const { generateSite } = require("./codegen");

function resolveInput(inputPath) {
    const absolute = path.resolve(inputPath);
    if (!fs.existsSync(absolute)) {
        throw new Error(`Arquivo não encontrado: ${absolute}`);
    }
    return absolute;
}

function build(inputPath, outputPath) {
    const source = fs.readFileSync(resolveInput(inputPath), "utf8");
    const ast = parse(source);

    if (ast.directive && ast.directive !== "StartFW") {
        throw new Error(`Diretiva inválida: #>${ast.directive}. Use #> StartFW`);
    }

    const templatesDir = path.join(__dirname, "..", "templates");
    const result = generateSite(ast, path.resolve(outputPath), templatesDir);

    return {
        ...result,
        project: ast.project.title || "Documentation"
    };
}

module.exports = { build, parse };
