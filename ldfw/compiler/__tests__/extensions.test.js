"use strict";

const {
    slugifyExtName,
    mergeExtensions,
    resolveVariant,
    generateExtensionCss,
    generateDocColorsCss,
    generateColoringCss,
    createRenderContext,
    getAlertExtension,
    getBadgeExtension
} = require("../extensions");

function assert(condition, message) {
    if (!condition) throw new Error(message || "Assertion failed");
}

function assertEqual(actual, expected, label) {
    if (actual !== expected) {
        throw new Error(`${label || ""} Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

// --- slugifyExtName ---
assertEqual(slugifyExtName("recycle"), "recycle", "simple slug");
assertEqual(slugifyExtName("my::alert"), "my-alert", "slug with ::");
assertEqual(slugifyExtName("Hello World!"), "hello-world", "slug special chars");

// --- mergeExtensions ---
const merged = mergeExtensions(
    { alerts: { tip: { icon: "ri-lightbulb" } } },
    { alerts: { info: { icon: "ri-info" } }, badges: {} }
);
assert(merged.alerts.tip, "keep base alert");
assert(merged.alerts.info, "add new alert");

// --- mergeExtensions override ---
// base = definições do próprio usuário, addition = biblioteca incluída.
// O uso real (index.js: mergeExtensions(ast.extensions, libAst.extensions))
// faz o base (usuário) ter precedência sobre a lib incluída.
const merged2 = mergeExtensions(
    { alerts: { foo: { icon: "old" } } },
    { alerts: { foo: { icon: "new" } }, badges: {} }
);
assertEqual(merged2.alerts.foo.icon, "old", "extensions override: base (usuário) wins");

// --- resolveVariant ---
assertEqual(resolveVariant("tip", {}), "tip", "resolve no using");
assertEqual(resolveVariant("-c", { "-c": "recycle" }), "recycle", "resolve alias");
assertEqual(resolveVariant("unknown", { "-c": "recycle" }), "unknown", "resolve unknown");

// --- getAlertExtension ---
const ctx = createRenderContext({
    extensions: {
        alerts: {
            recycle: { icon: "ri-recycle-line", color: "#6366f1", background: "rgba(99, 102, 241, 0.08)" }
        },
        badges: {}
    },
    usings: { "-c": "recycle" }
});

const ext = getAlertExtension("tip", ctx);
assert(ext.builtin, "built-in alert");
assertEqual(ext.name, "tip", "built-in alert name");

const ext2 = getAlertExtension("recycle", ctx);
assert(!ext2.builtin, "custom alert not builtin");
assertEqual(ext2.name, "recycle", "custom alert name");

const ext3 = getAlertExtension({ kind: "custom", params: ["Title", "#ff0", "rgba(255,255,0,0.1)"] }, ctx);
assertEqual(ext3.kind, "custom", "custom:: alert");
assertEqual(ext3.params[0], "Title", "custom params");

// --- getAlertExtension alias ---
const ctx2 = createRenderContext({
    extensions: {
        alerts: {
            recycle: { icon: "ri-recycle-line", color: "#6366f1" }
        },
        badges: {}
    },
    usings: { "-r": "recycle" }
});
const ext4 = getAlertExtension("-r", ctx2);
assertEqual(ext4.name, "recycle", "alias resolution");

// --- getBadgeExtension ---
const ctx3 = createRenderContext({
    extensions: { alerts: {}, badges: { lua: { color: "#e8a838", background: "rgba(232, 168, 56, 0.1)" } } },
    usings: {}
});

const badge1 = getBadgeExtension("string", ctx3);
assert(badge1.builtin, "built-in badge");

const badge2 = getBadgeExtension("lua", ctx3);
assert(!badge2.builtin, "custom badge");
assertEqual(badge2.name, "lua", "custom badge name");

const badge3 = getBadgeExtension({ kind: "custom", params: ["text", "#f00", "bg"] }, ctx3);
assertEqual(badge3.kind, "custom", "custom badge kind");

// --- getBadgeExtension null ---
const badgeNull = getBadgeExtension("nonexistent", ctx3);
assert(badgeNull === null, "unknown badge returns null");

// --- generateExtensionCss ---
const css = generateExtensionCss({
    alerts: {
        recycle: { icon: "ri-recycle-line", color: "#6366f1", background: "rgba(99, 102, 241, 0.08)", border: "#6366f1" }
    },
    badges: {
        lua: { color: "#e8a838", background: "rgba(232, 168, 56, 0.1)" }
    }
});
assert(css.includes("alert-ext-recycle"), "alert CSS class");
assert(css.includes("type-badge-ext-lua"), "badge CSS class");
assert(css.includes("#6366f1"), "color in CSS");
assert(css.includes("#e8a838"), "badge color in CSS");

// --- generateExtensionCss empty ---
assertEqual(generateExtensionCss({ alerts: {}, badges: {} }), "", "empty extensions = no CSS");

// --- mergeExtensions null handling ---
const mergedNull = mergeExtensions(null, { alerts: { a: {} }, badges: {} });
assert(mergedNull.alerts.a, "merge from null base");

// --- generateDocColorsCss ---
const dcCss = generateDocColorsCss({
    light: { primary: "#123456", background: "#ffffff", unknownKey: "#000000" },
    dark: { primary: "#abcdef" }
});
assert(dcCss.includes('[data-theme="light"]'), "DocColors light selector");
assert(dcCss.includes('[data-theme="dark"]'), "DocColors dark selector");
assert(dcCss.includes("--primary: #123456"), "DocColors maps primary");
assert(dcCss.includes("--bg-main: #ffffff"), "DocColors maps background -> --bg-main");
assert(!dcCss.includes("unknownKey"), "DocColors ignores unknown keys");

// --- generateDocColorsCss sanitization (anti CSS-injection) ---
const dcEvil = generateDocColorsCss({ light: { primary: "#fff; } body { display:none" }, dark: {} });
assert(!dcEvil.includes("body {"), "DocColors sanitizes injection attempt");

// --- generateDocColorsCss empty/null ---
assertEqual(generateDocColorsCss(null), "", "DocColors null -> empty CSS");
assertEqual(generateDocColorsCss({ light: {}, dark: {} }), "", "DocColors empty maps -> empty CSS");

// --- mergeExtensions docColors: base (user) wins ---
const mDocs = mergeExtensions(
    { alerts: {}, badges: {}, docColors: { light: { primary: "#USER" }, dark: {} } },
    { alerts: {}, badges: {}, docColors: { light: { primary: "#LIB" }, dark: {} } }
);
assertEqual(mDocs.docColors.light.primary, "#USER", "docColors: base (user) wins over lib");

// --- mergeExtensions docColors: lib applies when base has none ---
const mDocs2 = mergeExtensions(
    { alerts: {}, badges: {}, docColors: null },
    { alerts: {}, badges: {}, docColors: { light: { primary: "#LIB" }, dark: {} } }
);
assertEqual(mDocs2.docColors.light.primary, "#LIB", "docColors: lib applies when base null");

// --- generateColoringCss ---
const colCss = generateColoringCss({
    light: { card: { background: "#ffffff", border: "#e5e7eb" }, tabs: { active: "#2563eb" }, p: { color: "#333" }, unknownElem: { x: "#000" } },
    dark: { card: { background: "#15151f" }, badge: { background: "rgba(0,0,0,.1)", color: "#fff" } }
});
assert(colCss.includes('[data-theme="light"] .card'), "Coloring light card selector");
assert(colCss.includes('[data-theme="dark"] .card'), "Coloring dark card selector");
assert(colCss.includes("background-color: #ffffff"), "Coloring maps card.background -> background-color");
assert(colCss.includes('[data-theme="light"] .tab-btn.active'), "Coloring maps tabs.active -> .tab-btn.active");
assert(colCss.includes("border-bottom-color: #2563eb"), "Coloring tabs.active also sets border-bottom-color");
assert(colCss.includes('[data-theme="light"] .content-viewport p'), "Coloring maps p -> .content-viewport p");
assert(!colCss.includes("unknownElem"), "Coloring ignores unknown element");
assert(!/!important/.test(colCss), "Coloring CSS has NO !important (inline must win)");

// --- generateColoringCss sanitization + null ---
const colEvil = generateColoringCss({ light: { card: { background: "#fff; } body{display:none" } }, dark: {} });
assert(!colEvil.includes("body{"), "Coloring sanitizes injection");
assertEqual(generateColoringCss(null), "", "Coloring null -> empty CSS");

// --- mergeExtensions coloring: base (user) wins ---
const mCol = mergeExtensions(
    { alerts: {}, badges: {}, docColors: null, coloring: { light: { card: { background: "#USER" } }, dark: {} } },
    { alerts: {}, badges: {}, docColors: null, coloring: { light: { card: { background: "#LIB" } }, dark: {} } }
);
assertEqual(mCol.coloring.light.card.background, "#USER", "coloring: base (user) wins over lib");

console.log("✔ All extensions tests passed!");
