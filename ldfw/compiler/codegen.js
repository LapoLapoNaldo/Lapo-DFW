"use strict";

const fs = require("fs");
const path = require("path");
const { renderPageContent } = require("./components");
const { createRenderContext, generateExtensionCss } = require("./extensions");

function escapeJsString(value) {
    return JSON.stringify(value);
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
                faq: page.blocks.some((block) => block.type === "faq")
            };
        }
    }

    return pages;
}

function renderNav(ast) {
    return ast.docs.sections.map((section) => {
        const links = section.pages.map((page, index) => {
            const route = page.meta.route;
            const active = index === 0 && section === ast.docs.sections[0] ? " active" : "";
            return `                        <li><a href="#${route}" class="nav-link${active}" data-route="${route}"><i class="${page.meta.icon}"></i> ${page.meta.nav}</a></li>`;
        }).join("\n");

        return `                <div class="nav-section">
                    <h3 class="nav-section-title">${section.name}</h3>
                    <ul class="nav-list">
${links}
                    </ul>
                </div>`;
    }).join("\n\n");
}

function renderIndexHtml(ast) {
    const project = ast.project;
    const firstPage = ast.docs.sections[0]?.pages[0];
    const firstCategory = firstPage?.meta.category || ast.docs.sections[0]?.name || "Docs";
    const firstBreadcrumb = firstPage?.meta.breadcrumb || firstPage?.meta.nav || "Início";
    const nav = renderNav(ast);

    return `<!DOCTYPE html>
<html lang="${project.lang || "pt-BR"}" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} | Documentação</title>
    <meta name="description" content="${project.description || `Documentação oficial de ${project.title}.`}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" id="prism-theme-dark">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <a href="#${firstPage?.meta.route || "home"}" class="logo-area">
                    <div class="logo-icon">
                        <i class="ri-hexagon-fill"></i>
                    </div>
                    <div class="logo-text">
                        <span class="logo-title">${project.title}</span>
                        <span class="logo-subtitle">${project.subtitle || "Documentation"}</span>
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
                    <span>Versão ${project.version || "v1.0.0"}</span>
                    ${project.status ? `<span class="status-badge online"><span class="pulse-dot"></span>${project.status}</span>` : ""}
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
                        <span class="breadcrumb-item">${firstCategory}</span>
                        <span class="breadcrumb-separator">/</span>
                        <span class="breadcrumb-item active">${firstBreadcrumb}</span>
                    </div>
                </div>
                <div class="top-header-right">
                    ${project.github ? `<a href="${project.github}" target="_blank" class="github-link" title="Ver Repositório no GitHub">
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

            <main class="content-viewport" id="contentViewport"></main>
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
        content: \`${page.content.replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\`
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
    defaultRoute: ${escapeJsString(defaultRoute)}
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
    const extensionCss = generateExtensionCss(ast.extensions);
    const finalStyle = `${baseStyle}${extensionCss}`;

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
