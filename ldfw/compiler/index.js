"use strict";

const fs = require("fs");
const path = require("path");
const { parse } = require("./parser");
const { generateSite } = require("./codegen");
const { mergeExtensions } = require("./extensions");

function resolveInput(inputPath) {
    const absolute = path.resolve(inputPath);
    if (!fs.existsSync(absolute)) {
        throw new Error(`Arquivo não encontrado: ${absolute}`);
    }
    return absolute;
}

function loadStdLibrary(name) {
    const libPath = path.join(__dirname, "..", "std", `${name}.ldfw`);
    if (!fs.existsSync(libPath)) {
        return null;
    }
    return fs.readFileSync(libPath, "utf8");
}

function mergeIncludedLibraries(ast) {
    for (const libName of ast.includes) {
        const libSource = loadStdLibrary(libName);
        if (!libSource) {
            console.warn(
                `⚠ LDFW: biblioteca incluída não encontrada: "${libName}". ` +
                `Verifique se existe std/${libName}.ldfw. Include ignorado.`
            );
            continue;
        }

        const libAst = parse(libSource, { library: true });
        ast.extensions = mergeExtensions(ast.extensions, libAst.extensions);
    }

    return ast;
}

function build(inputPath, outputPath) {
    const source = fs.readFileSync(resolveInput(inputPath), "utf8");
    // parse() já valida a diretiva (#> StartFW) e lança em caso de diretiva inválida.
    let ast = parse(source);

    ast = mergeIncludedLibraries(ast);

    const templatesDir = path.join(__dirname, "..", "templates");
    const result = generateSite(ast, path.resolve(outputPath), templatesDir);

    return {
        ...result,
        project: ast.project.title || "Documentation"
    };
}

module.exports = { build, parse, mergeIncludedLibraries };
