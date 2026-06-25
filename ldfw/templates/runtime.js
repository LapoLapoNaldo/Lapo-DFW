document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    setupTheme();
    setupRouting();
    setupNavigation();
    setupGlobalSearch();
    setupKeyboardShortcuts();
    setupOnThisPage();
    setupSectionSwitch();
}

function setupTheme() {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

function setupRouting() {
    window.addEventListener("hashchange", handleRouting);

    if (!window.location.hash) {
        window.location.hash = `#${PROJECT.defaultRoute || "home"}`;
    } else {
        handleRouting();
    }
}

function handleRouting() {
    const rawHash = window.location.hash || `#${PROJECT.defaultRoute || "home"}`;
    const route = rawHash.replace("#", "");
    const pageKey = PAGES[route] ? route : null;

    if (pageKey) {
        const page = PAGES[pageKey];
        renderPage(pageKey, page);
    } else if (route && route !== (PROJECT.defaultRoute || "home")) {
        // Route doesn't exist — try default or show 404
        const defaultRoute = PROJECT.defaultRoute || "home";
        const defaultPage = PAGES[defaultRoute];
        if (defaultPage) {
            renderPage(defaultRoute, defaultPage);
        } else {
            renderPage(route, null);
        }
    } else {
        const defaultRoute = PROJECT.defaultRoute || "home";
        renderPage(defaultRoute, PAGES[defaultRoute] || null);
    }
}

function renderPage(pageKey, page) {
    const viewport = document.getElementById("contentViewport");
    if (!viewport) return;

    if (!page) {
        viewport.innerHTML = `<div class="hero-section"><h1 class="page-title">Página não encontrada</h1><p class="page-description">A página <strong>${escapeHtml(pageKey)}</strong> não existe.</p></div>`;
        updateBreadcrumbs("Erro", "404");
        return;
    }

    // Reset scroll position without animation
    window.scrollTo(0, 0);

    viewport.style.opacity = 0;
    viewport.style.transform = "translateY(8px)";

    // Atualiza o conteúdo no próximo frame, sem o atraso fixo de 150ms.
    requestAnimationFrame(() => {
        viewport.innerHTML = page.content;
        updateBreadcrumbs(page.category, page.breadcrumb);
        updateActiveNavLinks(pageKey);

        if (typeof Prism !== "undefined") {
            try { Prism.highlightAll(); } catch (_) {}
        }

        setupCodeCopyButtons();
        setupTabs();

        if (page.faq) {
            setupFaqAccordion();
        }

        if (PROJECT.pageContent) {
            buildOnThisPage();
        }

        // Fade-in no frame seguinte para a transição CSS animar a partir de opacity:0.
        requestAnimationFrame(() => {
            viewport.style.opacity = 1;
            viewport.style.transform = "translateY(0)";
        });
    });
}

function updateBreadcrumbs(category, activeItem) {
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item">${escapeHtml(category)}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">${escapeHtml(activeItem)}</span>
    `;
    document.title = `${PROJECT.title} | ${activeItem}`;
}

function updateActiveNavLinks(pageKey) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        if (link.getAttribute("data-route") === pageKey) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function setupNavigation() {
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    }

    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    }

    menuToggleBtn.addEventListener("click", openSidebar);
    closeSidebarBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

function setupGlobalSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    // O texto puro de cada página é pré-computado na compilação (campo `search`),
    // então não rodamos regex de stripHtml no carregamento nem duplicamos o HTML.
    const searchDatabase = Object.entries(PAGES).map(([key, val]) => ({
        key,
        title: val.title,
        category: val.category,
        breadcrumb: val.breadcrumb,
        content: val.search || ""
    }));

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query === "") {
            searchResults.classList.remove("active");
            searchResults.innerHTML = "";
            return;
        }

        const matches = searchDatabase.filter((item) => {
            return item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query);
        });

        renderSearchResults(matches, query);
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove("active");
        }
    });

    document.addEventListener("keydown", (e) => {
        // Only activate search shortcut when not already typing in an input
        const tag = document.activeElement?.tagName || "";
        const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable;
        if (e.key === "/" && !isInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

function renderSearchResults(matches, query) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-result-empty">Nenhum resultado encontrado para "${escapeHtml(query)}"</div>`;
        searchResults.classList.add("active");
        return;
    }

    matches.slice(0, 5).forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "search-result-item";

        const idx = item.content.toLowerCase().indexOf(query);
        let snippet = "";
        if (idx !== -1) {
            const start = Math.max(0, idx - 20);
            const end = Math.min(item.content.length, idx + query.length + 30);
            snippet = (start > 0 ? "..." : "") + item.content.substring(start, end).trim() + "...";
        } else {
            snippet = item.content.substring(0, 50).trim() + "...";
        }

        itemElement.innerHTML = `
            <span class="search-result-category">${escapeHtml(item.category)} / ${escapeHtml(item.breadcrumb)}</span>
            <span class="search-result-title">${escapeHtml(item.title)}</span>
            <span class="search-result-snippet">${escapeHtml(snippet)}</span>
        `;

        itemElement.addEventListener("click", () => {
            window.location.hash = `#${item.key}`;
            searchResults.classList.remove("active");
            document.getElementById("searchInput").value = "";
        });

        searchResults.appendChild(itemElement);
    });

    searchResults.classList.add("active");
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function setupCodeCopyButtons() {
    document.querySelectorAll(".copy-code-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const container = btn.closest(".code-block-container");
            const codeEl = container.querySelector("pre code");
            const rawText = codeEl.textContent;

            navigator.clipboard.writeText(rawText).then(() => {
                btn.innerHTML = `<i class="ri-check-line" style="color: var(--success)"></i> Copiado!`;
                setTimeout(() => {
                    btn.innerHTML = `<i class="ri-file-copy-line"></i> Copiar`;
                }, 2000);
            }).catch((err) => {
                console.error("Falha ao copiar código: ", err);
            });
        });
    });
}

function setupKeyboardShortcuts() {
    const searchInput = document.getElementById("searchInput");

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && document.activeElement === searchInput) {
            searchInput.value = "";
            searchInput.blur();
            document.getElementById("searchResults").classList.remove("active");
        }
    });
}

function setupTabs() {
    document.querySelectorAll(".tabs-container").forEach(container => {
        const buttons = container.querySelectorAll(".tab-btn");
        const contents = container.querySelectorAll(".tab-content");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const tabIndex = btn.getAttribute("data-tab");
                buttons.forEach(b => b.classList.remove("active"));
                contents.forEach(c => c.classList.remove("active"));
                btn.classList.add("active");
                container.querySelector(`.tab-content[data-tab="${tabIndex}"]`).classList.add("active");
            });
        });
    });
}

function setupFaqAccordion() {
    document.querySelectorAll(".faq-question").forEach((q) => {
        q.addEventListener("click", () => {
            const item = q.closest(".faq-item");
            const isActive = item.classList.contains("active");
            document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("active"));
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}

// ============================================================
// On This Page (PageContent extension)
// ============================================================

let otpHeadingEls = [];
let otpScrollScheduled = false;

// Altura do header sticky + folga, para ancorar o heading no ponto exato.
function otpHeaderOffset() {
    const header = document.querySelector(".top-header");
    return (header ? header.offsetHeight : 70) + 12;
}

function slugifyHeading(text) {
    return String(text)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
}

// Monta o índice "On This Page" a partir dos h1/h2/h3 da página atual.
function buildOnThisPage() {
    const panel = document.getElementById("onThisPage");
    const list = document.getElementById("otpList");
    if (!panel || !list) return;

    const viewport = document.getElementById("contentViewport");
    const headings = viewport ? Array.from(viewport.querySelectorAll("h1, h2, h3")) : [];

    otpHeadingEls = [];

    if (headings.length === 0) {
        list.innerHTML = "";
        panel.classList.remove("active");
        return;
    }

    const used = new Set();
    let currentH2 = ""; // grupo atual = id do h2 mais recente
    const itemsHtml = headings.map((el) => {
        const base = el.id || slugifyHeading(el.textContent);
        let id = base;
        let n = 2;
        while (used.has(id)) { id = base + "-" + n; n += 1; }
        used.add(id);
        el.id = id;

        const level = el.tagName.toLowerCase(); // h1 | h2 | h3
        let group;
        if (level === "h2") { currentH2 = id; group = id; }
        else if (level === "h3") { group = currentH2; }
        else { group = ""; currentH2 = ""; } // h1 reinicia o grupo

        otpHeadingEls.push({ el, id, level, group });

        return `<li class="otp-item otp-${level}" data-group="${group}"><a class="otp-link" href="#" data-target="${id}">${escapeHtml(el.textContent)}</a></li>`;
    }).join("");

    list.innerHTML = itemsHtml;
    panel.classList.add("active");

    // Scroll suave sem mexer no hash (que é usado pelo roteador da SPA).
    list.querySelectorAll(".otp-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.getElementById(link.getAttribute("data-target"));
            if (!target) return;
            // Posiciona o heading exatamente logo abaixo do header sticky.
            const top = target.getBoundingClientRect().top + window.scrollY - otpHeaderOffset();
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        });
    });

    highlightActiveHeading();
}

// Destaca, no índice, a seção atualmente visível (scrollspy).
function highlightActiveHeading() {
    const list = document.getElementById("otpList");
    if (!list || otpHeadingEls.length === 0) return;

    const offset = otpHeaderOffset() + 8; // header sticky + pequena folga
    let active = otpHeadingEls[0];
    for (const item of otpHeadingEls) {
        if (item.el.getBoundingClientRect().top <= offset) {
            active = item;
        } else {
            break;
        }
    }

    // Seção (h2) ativa: h2 -> ele mesmo; h3 -> seu grupo; h1 -> nenhuma.
    const activeGroup = active.level === "h1" ? "" : active.group;

    list.querySelectorAll(".otp-item").forEach((li) => {
        const link = li.querySelector(".otp-link");
        link.classList.toggle("active", link.getAttribute("data-target") === active.id);

        // h3 só aparece quando estamos na seção (h2) a que ele pertence.
        if (li.classList.contains("otp-h3")) {
            const visible = activeGroup !== "" && li.getAttribute("data-group") === activeGroup;
            li.classList.toggle("otp-collapsed", !visible);
        }
    });
}

// Registra (uma única vez) o listener de scroll com throttle via rAF.
function setupOnThisPage() {
    if (!PROJECT.pageContent) return;
    window.addEventListener("scroll", () => {
        if (otpScrollScheduled) return;
        otpScrollScheduled = true;
        requestAnimationFrame(() => {
            otpScrollScheduled = false;
            highlightActiveHeading();
        });
    }, { passive: true });
}


// ============================================================
// Section Switch (Switch extension)
// ============================================================

// Cada seção com `data-switch-variants` ganha um controle que troca a variante
// ativa, filtrando quais páginas (li[data-variant]) aparecem no nav. Páginas sem
// variante (untagged) ficam sempre visíveis.
function setupSectionSwitch() {
    if (!PROJECT.switchEnabled) return;

    document.querySelectorAll(".nav-section[data-switch-variants]").forEach((section) => {
        const variants = (section.getAttribute("data-switch-variants") || "")
            .split(",").map((v) => v.trim()).filter(Boolean);
        if (variants.length === 0) return;

        let current = section.getAttribute("data-switch-default") || variants[0];
        const btn = section.querySelector(".section-switch");
        const label = section.querySelector(".section-switch-label");

        function apply() {
            if (label) label.textContent = current;
            section.querySelectorAll("li[data-variant]").forEach((li) => {
                li.classList.toggle("switch-hidden", li.getAttribute("data-variant") !== current);
            });
        }

        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idx = variants.indexOf(current);
                current = variants[(idx + 1) % variants.length];
                apply();
            });
        }

        apply();
    });
}
