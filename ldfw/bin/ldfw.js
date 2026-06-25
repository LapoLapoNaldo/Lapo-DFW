#!/usr/bin/env node
"use strict";

const path = require("path");
const { build } = require("../compiler/index");

function printHelp() {
    console.log(`
LDFW — Lapo's Documentation Framework

Uso:
  ldfw build <arquivo.ldfw> [-o ./dist] [--verbose]
  ldfw dev   <arquivo.ldfw> [-o ./dist] [-p 8080]

Opções:
  -o <dir>      Diretório de saída (padrão: ./dist)
  -p <porta>    Porta do servidor (padrão: 8080, apenas dev)
  --verbose     Exibir logs detalhados
  -h, --help    Exibir esta ajuda

Exemplo:
  ldfw build main.ldfw -o ./dist
  ldfw dev   main.ldfw -o ./dist -p 8080
`);
}

function parseArgs(argv) {
    const args = argv.slice(2);

    if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
        return { command: "help" };
    }

    const command = args[0];

    if (command !== "build" && command !== "dev") {
        throw new Error(`Comando desconhecido: "${command}". Use build ou dev.`);
    }

    let input = null;
    let output = "dist";
    let port = 8080;
    let verbose = false;

    // Separa flags (-o/--output, -p/--port, -v/--verbose) de argumentos
    // posicionais, independente da ordem. O 1º posicional é o arquivo de entrada,
    // então tanto `ldfw build main.ldfw -o dist` quanto `ldfw build -o dist main.ldfw`
    // funcionam igual.
    for (let i = 1; i < args.length; i++) {
        const arg = args[i];

        if (arg === "-o" || arg === "--output") {
            const value = args[i + 1];
            if (!value || value.startsWith("-")) {
                throw new Error(`Flag ${arg} requer um diretório. Ex: ${arg} ./dist`);
            }
            output = value;
            i += 1;
            continue;
        }

        if (arg === "-p" || arg === "--port") {
            const value = args[i + 1];
            if (!value || value.startsWith("-")) {
                throw new Error(`Flag ${arg} requer uma porta. Ex: ${arg} 8080`);
            }
            port = parseInt(value, 10);
            if (isNaN(port) || port < 1 || port > 65535) {
                throw new Error(`Porta inválida: "${value}". Use 1-65535.`);
            }
            i += 1;
            continue;
        }

        if (arg === "--verbose" || arg === "-v") {
            verbose = true;
            continue;
        }

        if (arg.startsWith("-")) {
            throw new Error(`Opção desconhecida: "${arg}". Use -h para ajuda.`);
        }

        // Argumento posicional → arquivo de entrada (apenas o primeiro é aceito).
        if (input === null) {
            input = arg;
        } else {
            throw new Error(`Argumento inesperado: "${arg}". Apenas um arquivo .ldfw é aceito.`);
        }
    }

    if (!input) {
        throw new Error(`Informe o arquivo .ldfw. Ex: ldfw ${command} main.ldfw`);
    }

    return { command, input, output, port, verbose };
}

function main() {
    try {
        const options = parseArgs(process.argv);

        if (options.command === "help") {
            printHelp();
            return;
        }

        const cwd = process.cwd();
        const inputPath = path.resolve(cwd, options.input);
        const outputPath = path.resolve(cwd, options.output);

        if (!require("fs").existsSync(inputPath)) {
            throw new Error(`Arquivo .ldfw não encontrado: ${inputPath}`);
        }

        if (options.verbose) {
            console.log(`  Input:  ${inputPath}`);
            console.log(`  Output: ${outputPath}`);
        }

        if (options.command === "build") {
            const startTime = Date.now();
            const result = build(inputPath, outputPath);
            const elapsed = Date.now() - startTime;
            console.log(`✔ LDFW build concluído em ${elapsed}ms`);
            console.log(`  Projeto: ${result.project}`);
            console.log(`  Páginas: ${result.pages}`);
            console.log(`  Output:  ${result.outputDir}`);
        }

        if (options.command === "dev") {
            const { dev } = require("../compiler/dev-server");
            dev(inputPath, outputPath, { port: options.port, verbose: options.verbose });
        }
    } catch (error) {
        console.error(`✖ ${error.message}`);
        process.exit(1);
    }
}

main();
