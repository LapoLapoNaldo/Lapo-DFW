"use strict";

const BUILTIN_ALERTS = new Set(["tip", "info", "warning", "danger", "important"]);
const BUILTIN_BADGES = new Set(["string", "number", "boolean", "function", "table", "void"]);

// DocColors: chaves amigáveis -> variáveis CSS de tema (style.css).
// Chaves desconhecidas são ignoradas.
const DOC_COLOR_MAP = {
    primary: "--primary",
    primaryHover: "--primary-hover",
    primaryLight: "--primary-light",
    accent: "--accent",
    accentHover: "--accent-hover",
    accentLight: "--accent-light",
    background: "--bg-main",
    sidebar: "--bg-sidebar",
    header: "--bg-header",
    card: "--bg-card",
    code: "--bg-code",
    hover: "--bg-hover",
    text: "--text-main",
    textSub: "--text-sub",
    textMuted: "--text-muted",
    border: "--border-color"
};

// Coloring: elemento -> propriedade amigável -> [[seletor CSS, propriedade CSS], ...].
// Seletores por classe (especificidade baixa) e CSS anexado após o style.css base
// SEM !important -> o inline (style="") sempre vence.
const COLORING_MAP = {
    p:    { color: [[".content-viewport p", "color"]] },
    link: { color: [[".content-viewport a", "color"]] },
    h1:   { color: [[".content-viewport h1", "color"]] },
    h2:   { color: [[".content-viewport h2", "color"]] },
    h3:   { color: [[".content-viewport h3", "color"]] },
    hero: {
        title:   [[".hero-section .page-title", "color"]],
        desc:    [[".hero-section .page-description", "color"]],
        badge:   [[".hero-section .badge", "color"], [".hero-section .badge", "border-color"]],
        badgeBg: [[".hero-section .badge", "background-color"]]
    },
    card: {
        background: [[".card", "background-color"]],
        border:     [[".card", "border-color"]],
        title:      [[".card .card-title", "color"]],
        text:       [[".card .card-description", "color"]]
    },
    tabs: {
        active:     [[".tab-btn.active", "color"], [".tab-btn.active", "border-bottom-color"]],
        border:     [[".tabs-container", "border-color"], [".tabs-header", "border-color"]],
        hover:      [[".tab-btn:hover", "color"]],
        background:  [[".tabs-body", "background-color"]]
    },
    alert: {
        background: [[".alert", "background-color"]],
        border:     [[".alert", "border-color"]],
        title:      [[".alert .alert-title", "color"]],
        text:       [[".alert .alert-text", "color"]]
    },
    badge: {
        background: [[".type-badge", "background-color"]],
        color:      [[".type-badge", "color"]]
    },
    code: {
        background: [[".code-block-container pre", "background-color"]],
        header:     [[".code-block-header", "background-color"]]
    },
    table: {
        header:     [[".api-table th", "background-color"]],
        headerText: [[".api-table th", "color"]],
        border:     [[".api-table td", "border-color"], [".api-table th", "border-color"]]
    },
    inlineCode: {
        background: [[".content-viewport code", "background-color"]],
        color:      [[".content-viewport code", "color"]]
    },
    faq: {
        question: [[".faq-question", "color"]],
        border:   [[".faq-item", "border-color"]]
    }
};

function slugifyExtName(name) {
    return String(name)
        .replace(/::/g, "-")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
}

function mergeExtensions(base, addition) {
    const merged = {
        alerts: { ...(addition?.alerts || {}) },
        badges: { ...(addition?.badges || {}) },
        docColors: addition?.docColors || null,
        coloring: addition?.coloring || null
    };

    if (base?.alerts) {
        Object.assign(merged.alerts, base.alerts);
    }
    if (base?.badges) {
        Object.assign(merged.badges, base.badges);
    }
    // DocColors/Coloring do usuário (base) têm precedência sobre a lib incluída.
    if (base?.docColors) {
        merged.docColors = base.docColors;
    }
    if (base?.coloring) {
        merged.coloring = base.coloring;
    }

    return merged;
}

function resolveVariant(variant, usings = {}) {
    return usings[variant] || variant;
}

function getAlertExtension(variant, context) {
    if (typeof variant === "object" && variant.kind === "custom") {
        return { kind: "custom", params: variant.params };
    }

    const resolved = resolveVariant(variant, context.usings);
    const ext = context.extensions.alerts[resolved];

    if (ext) {
        return { name: resolved, config: ext, slug: slugifyExtName(resolved) };
    }

    if (BUILTIN_ALERTS.has(resolved)) {
        return { name: resolved, config: null, slug: null, builtin: true };
    }

    return null;
}

function getBadgeExtension(type, context) {
    if (typeof type === "object" && type.kind === "custom") {
        return { kind: "custom", params: type.params };
    }

    const resolved = resolveVariant(type, context.usings);
    const ext = context.extensions.badges[resolved];

    if (ext) {
        return { name: resolved, config: ext, slug: slugifyExtName(resolved) };
    }

    if (BUILTIN_BADGES.has(resolved)) {
        return { name: resolved, config: null, slug: null, builtin: true };
    }

    return null;
}

function cssProp(value, fallback) {
    return (value && value.trim()) ? value.trim() : (fallback || "");
}

function generateExtensionCss(extensions) {
    const rules = [];

    for (const [name, config] of Object.entries(extensions.alerts || {})) {
        const slug = slugifyExtName(name);
        const bg = cssProp(config.background, config.bg);
        const color = cssProp(config.color);
        const border = cssProp(config.border, color);

        rules.push(`
.alert-ext-${slug} {
    background-color: ${bg || "var(--primary-light)"};
    border-color: ${border || "var(--primary)"};
    color: var(--text-main);
}
.alert-ext-${slug} .alert-title { color: ${color || border || "var(--primary)"}; }
.alert-ext-${slug} .alert-icon { color: ${color || border || "var(--primary)"}; }`);
    }

    for (const [name, config] of Object.entries(extensions.badges || {})) {
        const slug = slugifyExtName(name);
        const bg = cssProp(config.background, config.bg);
        const color = cssProp(config.color);

        rules.push(`
.type-badge-ext-${slug} {
    background-color: ${bg || "rgba(99, 102, 241, 0.1)"};
    color: ${color || "var(--primary)"};
}`);
    }

    if (rules.length === 0) return "";

    return `\n/* LDFW Extensions (generated) */${rules.join("\n")}\n`;
}

// Aceita apenas valores de cor seguros (hex, rgb/rgba, hsl/hsla, nomes, var()).
// Bloqueia caracteres que permitiriam sair da declaração CSS (;, {, }, etc.).
function sanitizeColor(value) {
    const v = String(value).trim();
    if (!v) return null;
    if (/^[a-zA-Z0-9#(),.%\s_-]+$/.test(v)) return v;
    return null;
}

function docColorVars(map) {
    const lines = [];
    for (const [key, value] of Object.entries(map || {})) {
        const cssVar = DOC_COLOR_MAP[key];
        if (!cssVar) continue; // ignora chaves desconhecidas
        const safe = sanitizeColor(value);
        if (safe) lines.push(`    ${cssVar}: ${safe};`);
    }
    return lines;
}

// Gera os overrides de tema a partir do DocColors. Aplicado via seletores
// [data-theme="light"]/[data-theme="dark"] (mesma especificidade do :root base,
// mas anexado depois -> vence por ordem de origem).
function generateDocColorsCss(docColors) {
    if (!docColors) return "";

    const blocks = [];
    const light = docColorVars(docColors.light);
    const dark = docColorVars(docColors.dark);

    if (light.length) blocks.push(`[data-theme="light"] {\n${light.join("\n")}\n}`);
    if (dark.length) blocks.push(`[data-theme="dark"] {\n${dark.join("\n")}\n}`);

    if (blocks.length === 0) return "";

    return `\n/* LDFW DocColors (generated) */\n${blocks.join("\n")}\n`;
}

// Gera CSS por elemento a partir do bloco Coloring, escopado por tema:
//   [data-theme="light"] .card { background-color: ...; }
// Sem !important -> o inline (style="") sempre tem prioridade sobre isto.
function generateColoringCss(coloring) {
    if (!coloring) return "";

    const blocks = [];

    for (const theme of ["light", "dark"]) {
        const elements = coloring[theme];
        if (!elements) continue;

        const bySelector = {};
        for (const [elem, props] of Object.entries(elements)) {
            const elemMap = COLORING_MAP[elem];
            if (!elemMap) continue; // elemento desconhecido -> ignora
            for (const [prop, value] of Object.entries(props)) {
                const targets = elemMap[prop];
                if (!targets) continue; // propriedade desconhecida -> ignora
                const safe = sanitizeColor(value);
                if (!safe) continue;
                for (const [sel, cprop] of targets) {
                    const fullSel = `[data-theme="${theme}"] ${sel}`;
                    (bySelector[fullSel] = bySelector[fullSel] || []).push(`${cprop}: ${safe};`);
                }
            }
        }

        for (const [sel, decls] of Object.entries(bySelector)) {
            blocks.push(`${sel} { ${decls.join(" ")} }`);
        }
    }

    if (blocks.length === 0) return "";

    return `\n/* LDFW Coloring (generated) */\n${blocks.join("\n")}\n`;
}

function createRenderContext(ast) {
    return {
        extensions: ast.extensions || { alerts: {}, badges: {} },
        usings: ast.usings || {}
    };
}

module.exports = {
    BUILTIN_ALERTS,
    BUILTIN_BADGES,
    DOC_COLOR_MAP,
    COLORING_MAP,
    slugifyExtName,
    mergeExtensions,
    resolveVariant,
    getAlertExtension,
    getBadgeExtension,
    generateExtensionCss,
    generateDocColorsCss,
    generateColoringCss,
    createRenderContext
};
