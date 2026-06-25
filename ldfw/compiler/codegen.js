"use strict";

const fs = require("fs");
const path = require("path");
const { renderPageContent, escapeHtml } = require("./components");
const { createRenderContext, generateExtensionCss, generateDocColorsCss, generateColoringCss } = require("./extensions");

function escapeJsString(value) {
    return JSON.stringify(value);
}

// Extrai texto puro do HTML renderizado para indexar a busca no momento da
// compilação — evita rodar regex de stripHtml no carregamento do site.
function stripHtmlForSearch(html) {
    return String(html)
        .replace(/<[^>]*>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function buildPagesObject(ast) {
    const pages = {};
    const context = createRenderContext(ast);

    for (const section of ast.docs.sections) {
        for (const page of section.pages) {
            const route = page.meta.route;
            const content = renderPageContent(page.blocks, context);

            pages[route] = {
                category: page.meta.category || section.name,
                title: page.meta.title || page.meta.nav || page.name,
                breadcrumb: page.meta.breadcrumb || page.meta.nav || page.name,
                content,
                searchText: stripHtmlForSearch(content),
                faq: page.blocks.some((block) => block.type === "faq")
            };
        }
    }

    return pages;
}

function renderNav(ast) {
    const switchOn = !!ast.extensionsEnabled?.Switch;

    return ast.docs.sections.map((section) => {
        // Variantes da seção (distintas, em ordem de aparição). Default = a primeira.
        const variants = [];
        for (const page of section.pages) {
            if (page.variant && !variants.includes(page.variant)) variants.push(page.variant);
        }
        const switchable = switchOn && variants.length > 0;
        const defaultVariant = variants[0] || "";

        const links = section.pages.map((page) => {
            const route = escapeHtml(page.meta.route);
            const icon = escapeHtml(page.meta.icon);
            const navText = escapeHtml(page.meta.nav);
            const variantAttr = (switchable && page.variant) ? ` data-variant="${escapeHtml(page.variant)}"` : "";
            return `                        <li${variantAttr}><a href="#${route}" class="nav-link" data-route="${route}"><i class="${icon}"></i> ${navText}</a></li>`;
        }).join("\n");

        const sectionAttrs = switchable
            ? ` data-switch-variants="${escapeHtml(variants.join(","))}" data-switch-default="${escapeHtml(defaultVariant)}"`
            : "";

        const switchControl = switchable
            ? `
                        <button class="section-switch" type="button" title="Trocar variante" aria-label="Trocar variante">
                            <i class="ri-arrow-left-right-line"></i>
                            <span class="section-switch-label">${escapeHtml(defaultVariant)}</span>
                        </button>`
            : "";

        return `                <div class="nav-section"${sectionAttrs}>
                    <h3 class="nav-section-title">
                        <span class="nav-section-name">${escapeHtml(section.name)}</span>${switchControl}
                    </h3>
                    <ul class="nav-list">
${links}
                    </ul>
                </div>`;
    }).join("\n\n");
}

function h(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function attr(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderIndexHtml(ast) {
    const project = ast.project;
    const firstPage = ast.docs.sections[0]?.pages[0];
    const firstCategory = firstPage?.meta.category || ast.docs.sections[0]?.name || "Docs";
    const firstBreadcrumb = firstPage?.meta.breadcrumb || firstPage?.meta.nav || "Início";
    const nav = renderNav(ast);
    const pTitle = h(project.title || "Documentation");
    const pSubtitle = h(project.subtitle || "Documentation");
    const pVersion = h(project.version || "v1.0.0");
    const pLang = attr(project.lang || "pt-BR");
    const pDescription = attr(project.description || `Documentação oficial de ${project.title}.`);
    const pGithub = project.github ? attr(project.github) : "";
    const pStatus = project.status ? h(project.status) : "";
    const pFavicon = project.favicon ? attr(project.favicon) : "";
    const pLogo = project.logo ? attr(project.logo) : "";
    const logoIconClass = pLogo ? "logo-icon has-logo-img" : "logo-icon";
    const logoInner = pLogo
        ? `<img class="logo-img" src="${pLogo}" alt="${pTitle}">`
        : `<i class="ri-hexagon-fill"></i>`;
    const firstRoute = attr(firstPage?.meta.route || "home");

    // Área de conteúdo: quando o PageContent (On This Page) está ativo, o viewport
    // divide a linha com um aside lateral; caso contrário, mantém o layout padrão.
    const contentArea = ast.docs.pageContent
        ? `<div class="content-row">
                <main class="content-viewport" id="contentViewport"></main>
                <aside class="on-this-page" id="onThisPage" aria-label="On This Page">
                    <div class="otp-title">On This Page</div>
                    <ul class="otp-list" id="otpList"></ul>
                </aside>
            </div>`
        : `<main class="content-viewport" id="contentViewport"></main>`;

    // NOTA (CDN): as fontes (Google Fonts), o Remixicon e o Prism.js são carregados
    // via CDN externa, SEM Subresource Integrity (SRI). Implicações:
    //  - O site precisa de internet no primeiro carregamento (ícones, fontes e
    //    syntax highlighting não funcionam offline).
    //  - Sem SRI, não há verificação de integridade do recurso da CDN.
    // Para uso offline/air-gapped ou com SRI, faça self-host desses assets e troque
    // as URLs abaixo por caminhos locais. Veja a seção "Dependência de CDN" no README.
    return `<!DOCTYPE html>
<html lang="${pLang}" data-theme="light">
<head>
    <!-- Recursos externos via CDN (sem SRI). Para offline/air-gapped, faça self-host. -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pTitle} | Documentação</title>
    <meta name="description" content="${pDescription}">
    ${pFavicon ? `<link rel="icon" href="${pFavicon}">` : ""}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Outfit:wght@400;500;600;700;800&amp;family=Fira+Code:wght@400;500&amp;display=swap" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" id="prism-theme-dark">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <a href="#${firstRoute}" class="logo-area">
                    <div class="${logoIconClass}">
                        ${logoInner}
                    </div>
                    <div class="logo-text">
                        <span class="logo-title">${pTitle}</span>
                        <span class="logo-subtitle">${pSubtitle}</span>
                    </div>
                </a>
                <button class="close-sidebar-btn" id="closeSidebarBtn">
                    <i class="ri-close-line"></i>
                </button>
            </div>

            <div class="search-container">
                <div class="search-input-wrapper">
                    <i class="ri-search-line search-icon"></i>
                    <input type="text" id="searchInput" placeholder="Pesquisar documentação..." autocomplete="off">
                    <span class="search-shortcut">/</span>
                </div>
                <div class="search-results" id="searchResults"></div>
            </div>

            <nav class="sidebar-nav">
${nav}
            </nav>

            <div class="sidebar-footer">
                <div class="footer-meta">
                    <span>Versão ${pVersion}</span>
                    ${pStatus ? `<span class="status-badge online"><span class="pulse-dot"></span>${pStatus}</span>` : ""}
                </div>
            </div>
        </aside>

        <div class="main-layout">
            <header class="top-header">
                <div class="top-header-left">
                    <button class="menu-toggle-btn" id="menuToggleBtn">
                        <i class="ri-menu-line"></i>
                    </button>
                    <div class="breadcrumb" id="breadcrumb">
                        <span class="breadcrumb-item">${h(firstCategory)}</span>
                        <span class="breadcrumb-separator">/</span>
                        <span class="breadcrumb-item active">${h(firstBreadcrumb)}</span>
                    </div>
                </div>
                <div class="top-header-right">
                    ${pGithub ? `<a href="${pGithub}" target="_blank" class="github-link" title="Ver Repositório no GitHub">
                        <i class="ri-github-fill"></i>
                        <span class="github-text">GitHub</span>
                    </a>` : ""}
                    <div class="theme-toggle-wrapper">
                        <button class="theme-toggle-btn" id="themeToggleBtn" title="Alternar Tema (Dark/Light)">
                            <i class="ri-sun-line light-icon"></i>
                            <i class="ri-moon-line dark-icon"></i>
                        </button>
                    </div>
                </div>
            </header>

            ${contentArea}
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-lua.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
`;
}

function serializePagesForJs(pages) {
    const entries = Object.entries(pages).map(([route, page]) => {
        return `    ${escapeJsString(route)}: {
        category: ${escapeJsString(page.category)},
        title: ${escapeJsString(page.title)},
        breadcrumb: ${escapeJsString(page.breadcrumb)},
        faq: ${page.faq ? "true" : "false"},
        search: ${escapeJsString(page.searchText || "")},
        content: ${escapeJsString(page.content)}
    }`;
    });

    return `{\n${entries.join(",\n")}\n}`;
}

function renderAppJsClean(ast, pages) {
    const project = ast.project;
    const runtimePath = path.join(__dirname, "..", "templates", "runtime.js");
    const runtime = fs.readFileSync(runtimePath, "utf8");
    const defaultRoute = Object.keys(pages)[0] || "home";

    return `const PROJECT = {
    title: ${escapeJsString(project.title || "Documentation")},
    subtitle: ${escapeJsString(project.subtitle || "")},
    defaultRoute: ${escapeJsString(defaultRoute)},
    pageContent: ${ast.docs.pageContent ? "true" : "false"},
    switchEnabled: ${ast.extensionsEnabled.Switch ? "true" : "false"}
};

const PAGES = ${serializePagesForJs(pages)};

${runtime}
`;
}

function generateSite(ast, outputDir, templatesDir) {
    const pages = buildPagesObject(ast);
    const indexHtml = renderIndexHtml(ast);
    const appJs = renderAppJsClean(ast, pages);
    const stylePath = path.join(templatesDir, "style.css");
    const baseStyle = fs.readFileSync(stylePath, "utf8");
    // Toda a customização visual da Extensions (presets, DocColors e Coloring) só é
    // aplicada com `using Extensions.Coloring;`. Sem isso, o site usa o visual padrão.
    let visualCss = "";
    if (ast.extensionsEnabled?.Coloring) {
        visualCss =
            generateExtensionCss(ast.extensions) +
            generateDocColorsCss(ast.extensions.docColors) +
            generateColoringCss(ast.extensions.coloring);
    }
    const finalStyle = `${baseStyle}${visualCss}`;

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), indexHtml, "utf8");
    fs.writeFileSync(path.join(outputDir, "app.js"), appJs, "utf8");
    fs.writeFileSync(path.join(outputDir, "style.css"), finalStyle, "utf8");

    return {
        pages: Object.keys(pages).length,
        outputDir
    };
}

module.exports = {
    buildPagesObject,
    generateSite,
    renderIndexHtml
};
