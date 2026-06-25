#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const testsDir = __dirname;

async function runAll() {
    const files = fs.readdirSync(testsDir).filter(f => f.endsWith(".test.js") && f !== "run.js");
    let passed = 0;
    let failed = 0;

    for (const file of files) {
        const filePath = path.join(testsDir, file);
        try {
            console.log(`\n📦 ${file}`);
            require(filePath);
            console.log(`  ✅ ${file} — OK`);
            passed++;
        } catch (err) {
            console.error(`  ❌ ${file} — FAILED`);
            console.error(`     ${err.message}`);
            failed++;
        }
    }

    console.log(`\n═══════════════════════════`);
    console.log(`Total: ${passed + failed} | ✅ ${passed} | ❌ ${failed}`);
    console.log(`═══════════════════════════\n`);

    process.exit(failed > 0 ? 1 : 0);
}

runAll();
