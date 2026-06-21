#!/usr/bin/env node
"use strict";

const path = require("path");
const { build } = require("../compiler/index");

function printHelp() {
    console.log(`
LDFW — Lapo's Documentation Framework

Uso:
  ldfw build <arquivo.ldfw> [-o ./dist]
  ldfw dev   <arquivo.ldfw> [-o ./dist] [-p 8080]

Exemplo:
  ldfw build examples/lapo-hub/main.ldfw -o dist
  ldfw dev   examples/lapo-hub/main.ldfw -o dist -p 8080
`);
}

function parseArgs(argv) {
    const args = argv.slice(2);

    if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
        return { command: "help" };
    }

    const command = args[0];

    if (command !== "build" && command !== "dev") {
        throw new Error(`Comando desconhecido: ${command}. Use build ou dev.`);
    }

    const input = args[1];
    if (!input) {
        throw new Error(`Informe o arquivo .ldfw. Ex: ldfw ${command} main.ldfw`);
    }

    let output = "dist";
    let port = 8080;

    const outputFlagIndex = args.indexOf("-o");
    if (outputFlagIndex !== -1 && args[outputFlagIndex + 1]) {
        output = args[outputFlagIndex + 1];
    }

    const portFlagIndex = args.indexOf("-p");
    if (portFlagIndex !== -1 && args[portFlagIndex + 1]) {
        port = parseInt(args[portFlagIndex + 1], 10);
    }

    return { command, input, output, port };
}

function main() {
    try {
        const options = parseArgs(process.argv);

        if (options.command === "help") {
            printHelp();
            return;
        }

        const inputPath = path.resolve(process.cwd(), options.input);
        const outputPath = path.resolve(process.cwd(), options.output);

        if (options.command === "build") {
            const result = build(inputPath, outputPath);
            console.log(`✔ LDFW build concluído`);
            console.log(`  Projeto: ${result.project}`);
            console.log(`  Páginas: ${result.pages}`);
            console.log(`  Output:  ${result.outputDir}`);
        }

        if (options.command === "dev") {
            const { dev } = require("../compiler/dev-server");
            dev(inputPath, outputPath, { port: options.port });
        }
    } catch (error) {
        console.error(`✖ ${error.message}`);
        process.exit(1);
    }
}

main();
