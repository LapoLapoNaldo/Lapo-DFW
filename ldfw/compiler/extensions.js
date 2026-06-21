"use strict";

const BUILTIN_ALERTS = new Set(["tip", "info", "warning", "danger", "important"]);
const BUILTIN_BADGES = new Set(["string", "number", "boolean", "function", "table", "void"]);

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
        badges: { ...(addition?.badges || {}) }
    };

    if (base?.alerts) {
        Object.assign(merged.alerts, base.alerts);
    }
    if (base?.badges) {
        Object.assign(merged.badges, base.badges);
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
    if (!value) return fallback || "";
    return value;
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

function createRenderContext(ast) {
    return {
        extensions: ast.extensions || { alerts: {}, badges: {} },
        usings: ast.usings || {}
    };
}

module.exports = {
    BUILTIN_ALERTS,
    BUILTIN_BADGES,
    slugifyExtName,
    mergeExtensions,
    resolveVariant,
    getAlertExtension,
    getBadgeExtension,
    generateExtensionCss,
    createRenderContext
};
