"use strict";

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

function inlineMarkdown(text) {
    return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function renderParagraph(text) {
    return `<p>${inlineMarkdown(text).replace(/\n/g, "<br>")}</p>`;
}

function renderHero(hero) {
    const buttons = hero.buttons.map((btn) => {
        const cls = btn.variant === "outline" ? "btn btn-outline" : "btn btn-primary";
        const icon = btn.variant === "outline" ? "ri-external-link-line" : "ri-rocket-line";
        const href = btn.target.kind === "external" ? btn.target.href : btn.target.href;
        const target = btn.target.kind === "external" ? ' target="_blank"' : "";
        return `<a href="${escapeHtml(href)}" class="${cls}"${target}><i class="${icon}"></i> ${escapeHtml(btn.label)}</a>`;
    }).join("\n                    ");

    return `
            <div class="hero-section">
                ${hero.badge ? `<span class="badge badge-primary">${escapeHtml(hero.badge)}</span>` : ""}
                <h1 class="page-title" style="margin-top: 10px;">${escapeHtml(hero.title)}</h1>
                <p class="page-description">${escapeHtml(hero.desc)}</p>
                ${buttons ? `<div class="action-group">${buttons}</div>` : ""}
            </div>`;
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

function renderAlert(block) {
    const icons = {
        tip: "ri-lightbulb-line",
        warning: "ri-alert-line",
        danger: "ri-error-warning-line",
        info: "ri-information-line"
    };

    return `
            <div class="alert alert-${escapeHtml(block.variant)}">
                <div class="alert-icon"><i class="${icons[block.variant] || icons.info}"></i></div>
                <div class="alert-content">
                    <div class="alert-title">${escapeHtml(block.title)}</div>
                    <p class="alert-text">${inlineMarkdown(block.text)}</p>
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

function renderBlock(block) {
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
            return renderAlert(block);
        case "ul":
        case "ol":
            return renderList(block);
        case "faq":
            return renderFaq(block);
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

function renderPageContent(blocks) {
    return blocks.map(renderBlock).join("\n");
}

module.exports = {
    escapeHtml,
    inlineMarkdown,
    renderBlock,
    renderPageContent
};
