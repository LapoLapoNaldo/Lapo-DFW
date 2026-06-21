"use strict";

const { getAlertExtension, getBadgeExtension } = require("./extensions");

function escapeCode(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function escapeHtml(text) {
    return escapeCode(text)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function richInline(text) {
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    return html;
}

function inlineMarkdown(text) {
    return richInline(text);
}

function renderParagraph(text) {
    return `<p>${richInline(text).replace(/\n/g, "<br>")}</p>`;
}

const TYPE_BADGES = new Set(["string", "number", "boolean", "function", "table", "void"]);

function renderTypeBadge(type, label, context = null) {
    const extInfo = context ? getBadgeExtension(type, context) : null;

    if (extInfo?.kind === "custom") {
        const p = extInfo.params;
        const text = p[0] || label || type;
        const color = p[1] || "";
        const bg = p[2] || "";
        const style = [
            color ? `color: ${color}` : "",
            bg ? `background-color: ${bg}` : ""
        ].filter(Boolean).join("; ");
        return `<span class="type-badge"${style ? ` style="${escapeHtml(style)}"` : ""}>${escapeHtml(text)}</span>`;
    }

    if (extInfo?.config) {
        const text = label || type;
        return `<span class="type-badge type-badge-ext-${extInfo.slug}">${escapeHtml(text)}</span>`;
    }

    const badgeType = TYPE_BADGES.has(type) ? type : "table";
    const text = label || type;
    return `<span class="type-badge ${escapeHtml(badgeType)}">${escapeHtml(text)}</span>`;
}

function renderTableCell(cell, context = null) {
    switch (cell.kind) {
        case "param":
            return `<td><code>${escapeHtml(cell.value)}</code></td>`;
        case "code":
            if (cell.value === "—" || cell.value === "-") {
                return `<td>—</td>`;
            }
            return `<td><code>${escapeHtml(cell.value)}</code></td>`;
        case "badge":
            const badgeValue = cell.value;
            const badgeLabel = cell.label;
            if (typeof badgeValue === "object") {
                return `<td>${renderTypeBadge(badgeValue, null, context)}</td>`;
            }
            return `<td>${renderTypeBadge(badgeValue, badgeLabel, context)}</td>`;
        case "text":
        default:
            return `<td>${richInline(cell.value)}</td>`;
    }
}

function renderTable(block, context = null) {
    const headerCells = block.headers
        .map((header) => `<th>${escapeHtml(header)}</th>`)
        .join("\n                            ");

    const bodyRows = block.rows.map((row) => {
        const cells = row.cells.map((cell) => renderTableCell(cell, context)).join("\n                            ");
        return `
                        <tr>
                            ${cells}
                        </tr>`;
    }).join("\n");

    return `
            <div class="table-wrapper">
                <table class="api-table">
                    <thead>
                        <tr>
                            ${headerCells}
                        </tr>
                    </thead>
                    <tbody>${bodyRows}
                    </tbody>
                </table>
            </div>`;
}

function renderHero(hero) {
    const buttons = hero.buttons.map((btn) => {
        const cls = btn.variant === "outline" ? "btn btn-outline" : "btn btn-primary";
        const icon = btn.variant === "outline" ? "ri-external-link-line" : "ri-rocket-line";
        const href = btn.target.kind === "external" ? btn.target.href : btn.target.href;
        const target = btn.target.kind === "external" ? ' target="_blank"' : "";
        return `<a href="${escapeHtml(href)}" class="${cls}"${target}><i class="${icon}"></i> ${escapeHtml(btn.label)}</a>`;
    }).join("\n                    ");

    const badgeHtml = renderHeroBadge(hero.badge);

    return `
            <div class="hero-section">
                ${badgeHtml}
                <h1 class="page-title" style="margin-top: 10px;">${escapeHtml(hero.title)}</h1>
                <p class="page-description">${escapeHtml(hero.desc)}</p>
                ${buttons ? `<div class="action-group">${buttons}</div>` : ""}
            </div>`;
}

function renderHeroBadge(badge) {
    if (!badge) return "";

    if (typeof badge === "object" && badge.kind === "custom") {
        const p = badge.params;
        const text = p[0] || "";
        const color = p[1] || "";
        const bg = p[2] || "";
        const style = [
            color ? `color: ${color}` : "",
            bg ? `background-color: ${bg}` : "",
            color ? `border-color: ${color}` : ""
        ].filter(Boolean).join("; ");
        return `<span class="badge badge-primary"${style ? ` style="${escapeHtml(style)}"` : ""}>${escapeHtml(text)}</span>`;
    }

    return `<span class="badge badge-primary">${escapeHtml(badge)}</span>`;
}

function renderCard(card) {
    return `
                <div class="card">
                    <div class="card-title"><i class="${escapeHtml(card.icon)}"></i> ${escapeHtml(card.title)}</div>
                    <p class="card-description">${inlineMarkdown(card.text)}</p>
                </div>`;
}

function renderGrid(block) {
    const cols = block.columns === 2 ? "grid-2" : block.columns === 3 ? "grid-3" : "grid-2";
    const cards = block.cards.map(renderCard).join("\n");
    return `
            <div class="${cols}">
${cards}
            </div>`;
}

function renderCode(block) {
    const lang = escapeHtml(block.language);
    const code = escapeCode(block.code);
    return `
            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">${lang.charAt(0).toUpperCase()}${lang.slice(1)}</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-${lang}"><code>${code}</code></pre>
            </div>`;
}

function renderAlertIcon(config) {
    if (config?.emoji) {
        return `<span class="alert-emoji">${escapeHtml(config.emoji)}</span>`;
    }

    const icon = config?.icon || "ri-information-line";
    return `<i class="${escapeHtml(icon)}"></i>`;
}

function renderAlert(block, context = null) {
    const icons = {
        tip: "ri-lightbulb-line",
        info: "ri-information-line",
        warning: "ri-alert-line",
        danger: "ri-error-warning-line",
        important: "ri-information-line"
    };

    const extInfo = context ? getAlertExtension(block.variant, context) : null;

    if (extInfo?.kind === "custom") {
        const p = extInfo.params;
        const color = p[1] || "";
        const bg = p[2] || "";
        const icon = p[3] || "";
        const emoji = p[4] || "";

        const containerStyle = [
            bg ? `background-color: ${bg}` : "",
            color ? `border-color: ${color}` : ""
        ].filter(Boolean).join("; ");
        const titleStyle = color ? `color: ${color}` : "";

        let iconHtml;
        if (emoji) {
            iconHtml = `<span class="alert-emoji">${escapeHtml(emoji)}</span>`;
        } else if (icon) {
            iconHtml = `<i class="${escapeHtml(icon)}"></i>`;
        } else {
            iconHtml = `<i class="ri-information-line"></i>`;
        }

        return `
            <div class="alert"${containerStyle ? ` style="${escapeHtml(containerStyle)}"` : ""}>
                <div class="alert-icon">${iconHtml}</div>
                <div class="alert-content">
                    <div class="alert-title"${titleStyle ? ` style="${escapeHtml(titleStyle)}"` : ""}>${richInline(block.title)}</div>
                    <p class="alert-text">${richInline(block.text)}</p>
                </div>
            </div>`;
    }

    if (extInfo?.config) {
        return `
            <div class="alert alert-ext-${escapeHtml(extInfo.slug)}">
                <div class="alert-icon">${renderAlertIcon(extInfo.config)}</div>
                <div class="alert-content">
                    <div class="alert-title">${richInline(block.title)}</div>
                    <p class="alert-text">${richInline(block.text)}</p>
                </div>
            </div>`;
    }

    const variant = extInfo?.name || block.variant;

    return `
            <div class="alert ${escapeHtml(variant)}">
                <div class="alert-icon"><i class="${icons[variant] || icons.info}"></i></div>
                <div class="alert-content">
                    <div class="alert-title">${richInline(block.title)}</div>
                    <p class="alert-text">${richInline(block.text)}</p>
                </div>
            </div>`;
}

function renderList(block) {
    const tag = block.type === "ol" ? "ol" : "ul";
    const items = block.items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("\n                ");
    return `
            <${tag} class="list-default">
                ${items}
            </${tag}>`;
}

function renderTabs(block, context = null) {
    const tabHeaders = block.tabs.map((tab, i) => {
        const active = i === 0 ? " active" : "";
        return `<button class="tab-btn${active}" data-tab="${i}">${escapeHtml(tab.name)}</button>`;
    }).join("\n");

    const tabContents = block.tabs.map((tab, i) => {
        const active = i === 0 ? " active" : "";
        const content = tab.blocks.map(b => renderBlock(b, context)).join("\n");
        return `<div class="tab-content${active}" data-tab="${i}">\n${content}\n            </div>`;
    }).join("\n");

    return `
            <div class="tabs-container">
                <div class="tabs-header">
                    ${tabHeaders}
                </div>
                <div class="tabs-body">
                    ${tabContents}
                </div>
            </div>`;
}

function renderFaq(block) {
    const items = block.items.map((item) => `
                <div class="faq-item">
                    <button class="faq-question">
                        <span>${escapeHtml(item.question)}</span>
                        <i class="ri-add-line"></i>
                    </button>
                    <div class="faq-answer">
                        <p>${inlineMarkdown(item.answer)}</p>
                    </div>
                </div>`).join("\n");

    return `
            <div class="faq-list">
${items}
            </div>`;
}

function renderBlock(block, context = null) {
    switch (block.type) {
        case "hero":
            return renderHero(block);
        case "grid":
            return renderGrid(block);
        case "card":
            return `
            <div class="card">
                <div class="card-title"><i class="${escapeHtml(block.icon)}"></i> ${escapeHtml(block.title)}</div>
                <p class="card-description">${inlineMarkdown(block.text)}</p>
            </div>`;
        case "code":
            return renderCode(block);
        case "alert":
            return renderAlert(block, context);
        case "table":
            return renderTable(block, context);
        case "ul":
        case "ol":
            return renderList(block);
        case "faq":
            return renderFaq(block);
        case "tabs":
            return renderTabs(block, context);
        case "h1":
            return `
            <h1 class="page-title">${escapeHtml(block.text)}</h1>`;
        case "h2":
            return `
            <h2>${escapeHtml(block.text)}</h2>`;
        case "h3":
            return `
            <h3>${escapeHtml(block.text)}</h3>`;
        case "p":
            return `
            ${renderParagraph(block.text)}`;
        default:
            throw new Error(`Componente desconhecido: ${block.type}`);
    }
}

function renderPageContent(blocks, context = null) {
    return blocks.map((block) => renderBlock(block, context)).join("\n");
}

module.exports = {
    escapeHtml,
    inlineMarkdown,
    richInline,
    renderBlock,
    renderPageContent
};
