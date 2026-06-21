document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    setupTheme();
    setupRouting();
    setupNavigation();
    setupGlobalSearch();
    setupKeyboardShortcuts();
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
    const pageKey = PAGES[route] ? route : (PROJECT.defaultRoute || "home");
    const page = PAGES[pageKey];
    renderPage(pageKey, page);
}

function renderPage(pageKey, page) {
    const viewport = document.getElementById("contentViewport");

    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "";

    viewport.style.opacity = 0;
    viewport.style.transform = "translateY(8px)";

    setTimeout(() => {
        viewport.innerHTML = page.content;
        updateBreadcrumbs(page.category, page.breadcrumb);
        updateActiveNavLinks(pageKey);

        if (typeof Prism !== "undefined") {
            Prism.highlightAll();
        }

        setupCodeCopyButtons();
        setupTabs();

        if (page.faq) {
            setupFaqAccordion();
        }

        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = "";

        viewport.style.opacity = 1;
        viewport.style.transform = "translateY(0)";
    }, 150);
}

function updateBreadcrumbs(category, activeItem) {
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item">${category}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">${activeItem}</span>
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
    const searchDatabase = [];

    for (const [key, val] of Object.entries(PAGES)) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = val.content;
        const text = tempDiv.textContent || tempDiv.innerText || "";

        searchDatabase.push({
            key,
            title: val.title,
            category: val.category,
            content: text,
            breadcrumb: val.breadcrumb
        });
    }

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
        if (e.key === "/" && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

function renderSearchResults(matches, query) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-result-empty">Nenhum resultado encontrado para "${query}"</div>`;
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
            <span class="search-result-category">${item.category} / ${item.breadcrumb}</span>
            <span class="search-result-title">${item.title}</span>
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
