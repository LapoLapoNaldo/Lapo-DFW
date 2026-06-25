"use strict";

function stripComments(source) {
    return source.split("\n").map((line) => {
        let inString = false;
        let escape = false;
        for (let i = 0; i < line.length; i++) {
            if (escape) { escape = false; continue; }
            if (line[i] === "\\") { escape = true; continue; }
            if (line[i] === '"') { inString = !inString; continue; }
            if (line[i] === "'") { inString = !inString; continue; }
            if (!inString && line[i] === "/" && line[i + 1] === "/") {
                return line.slice(0, i);
            }
        }
        return line;
    }).join("\n");
}

function preprocessCodeBlocks(source) {
    const blocks = [];
    let processed = "";
    let i = 0;

    while (i < source.length) {
        const slice = source.slice(i);
        const match = slice.match(/^code\s+([A-Za-z0-9_+#-]+)\s*\{/);

        if (match) {
            const language = match[1];
            let cursor = i + match[0].length;
            let depth = 1;

            while (cursor < source.length && depth > 0) {
                const char = source[cursor];
                if (char === "{") depth += 1;
                if (char === "}") depth -= 1;
                if (depth > 0) cursor += 1;
            }
            if (depth !== 0) {
                throw new Error(`Bloco code (${language}) não foi fechado`);
            }

            const code = source.slice(i + match[0].length, cursor).trim();
            const id = blocks.length;
            blocks.push({ language, code });
            processed += ` __LDFW_CODE_${id}__ `;
            i = cursor + 1;
            continue;
        }

        processed += source[i];
        i += 1;
    }

    return { processed, blocks };
}

function tokenize(source) {
    const tokens = [];
    let i = 0;
    let line = 1;
    let indent = 0;
    let bol = true;

    function addToken(type, value) {
        tokens.push({ type, value, line, indent });
    }

    while (i < source.length) {
        const ch = source[i];

        if (ch === "\n") {
            line += 1;
            indent = 0;
            bol = true;
            i += 1;
            continue;
        }

        if (bol && (ch === " " || ch === "\t")) {
            indent += ch === "\t" ? 4 : 1;
            i += 1;
            continue;
        }

        if (/\s/.test(ch)) {
            i += 1;
            continue;
        }

        bol = false;

        if (ch === "#" && source[i + 1] === ">") {
            let j = i + 2;
            while (j < source.length && /\s/.test(source[j])) j += 1;
            let start = j;
            while (j < source.length && /[A-Za-z0-9_]/.test(source[j])) j += 1;
            addToken("directive", source.slice(start, j));
            i = j;
            continue;
        }

        if (ch === '"' || ch === "'") {
            const quote = ch;
            let j = i + 1;
            let value = "";
            while (j < source.length) {
                if (source[j] === "\\" && j + 1 < source.length) {
                    value += source[j + 1];
                    j += 2;
                    continue;
                }
                if (source[j] === quote) break;
                value += source[j];
                j += 1;
            }
            if (j >= source.length) {
                const snippet = source.slice(Math.max(0, i - 20), i + 20).replace(/\n/g, " ");
                throw new Error(`String não fechada (${quote}) na linha ${line}: "...${snippet}..."`);
            }
            addToken("string", value);
            i = j + 1;
            continue;
        }

        if (/[{}();:,=.]/.test(ch)) {
            addToken(ch);
            i += 1;
            continue;
        }

        if (ch === "-" && source[i + 1] === ">") {
            addToken("arrow");
            i += 2;
            continue;
        }

        if (/[A-Za-z0-9_#-]/.test(ch)) {
            let j = i;
            while (j < source.length && /[A-Za-z0-9_#-]/.test(source[j])) j += 1;
            addToken("ident", source.slice(i, j));
            i = j;
            continue;
        }

        throw new Error(`Token inválido "${ch}" na linha ${line}, posição ${i}`);
    }

    tokens.push({ type: "eof", line, indent });
    return tokens;
}

class Parser {
    constructor(tokens, codeBlocks = []) {
        this.tokens = tokens;
        this.codeBlocks = codeBlocks;
        this.pos = 0;
        this.indentStack = [];
    }

    peek(offset = 0) {
        return this.tokens[this.pos + offset] || { type: "eof" };
    }

    advance() {
        const token = this.peek();
        this.pos += 1;

        if (
            this.indentStack.length > 0 &&
            token.type !== "eof" &&
            token.type !== "}"
        ) {
            const top = this.indentStack[this.indentStack.length - 1];
            // Só valida indentação de tokens em uma linha diferente da chave de
            // abertura — blocos de uma linha (ex: `Project: { title: "X"; }`) são válidos.
            if (token.line !== top.line) {
                const minIndent = top.indent + 4;
                if (token.indent < minIndent) {
                    throw new Error(
                        `Indentação insuficiente na linha ${token.line}: ` +
                        `${token.indent} espaços, mínimo ${minIndent} dentro do bloco`
                    );
                }
            }
        }

        return token;
    }

    expect(type, value) {
        const token = this.advance();
        if (token.type !== type || (value !== undefined && token.value !== value)) {
            const got = token.type === "ident" ? token.value : token.type;
            throw new Error(`Esperado ${value || type}, recebido ${got} (linha ${token.line})`);
        }
        return token;
    }

    match(type, value) {
        const token = this.peek();
        if (token.type !== type) return null;
        if (value !== undefined && token.value !== value) return null;
        this.advance();
        return token;
    }

    blockOpen() {
        this.expect("{");
        const brace = this.peek(-1);
        this.indentStack.push({ indent: brace.indent, line: brace.line });
    }

    blockClose() {
        const brace = this.peek();
        if (brace.type !== "}") {
            throw new Error(`Esperado '}', recebido ${brace.type}`);
        }
        this._validateCloseBrace(brace);
        this.advance();
        return brace;
    }

    blockMatch() {
        const brace = this.peek();
        if (brace.type !== "}") return null;
        this._validateCloseBrace(brace);
        this.advance();
        return brace;
    }

    _validateCloseBrace(brace) {
        if (this.indentStack.length === 0) {
            throw new Error(`'}' inesperado na linha ${brace.line}`);
        }
        const expected = this.indentStack.pop().indent;
        if (brace.indent !== expected) {
            throw new Error(
                `Indentação inválida na linha ${brace.line}: '}' na coluna ${brace.indent}, ` +
                `esperado coluna ${expected}`
            );
        }
    }

    parseFile() {
        const ast = {
            directive: null,
            includes: [],
            usings: {},
            extensionsEnabled: { PageContent: false, Switch: false, Coloring: false },
            extensions: { alerts: {}, badges: {}, docColors: null, coloring: null },
            project: {},
            docs: { layout: "stnd", pageContent: false, sections: [] }
        };

        this.extensionsEnabled = ast.extensionsEnabled;

        if (this.peek().type === "directive") {
            ast.directive = this.advance().value;
        }

        while (this.peek().type === "ident" && this.peek().value === "include") {
            this.advance();
            const includeToken = this.expect("directive");
            ast.includes.push(includeToken.value);
            this.match(";");
        }

        while (this.peek().type === "ident" && this.peek().value === "using") {
            this.parseUsingStatement(ast);
        }

        if (this.match("ident", "Extensions")) {
            this.expect(":");
            ast.extensions = this.parseExtensionsBlock();
        }

        if (this.match("ident", "Project")) {
            this.expect(":");
            ast.project = this.parseObjectBlock();
        }

        if (this.match("ident", "Docs")) {
            this.expect(":");
            ast.docs = this.parseDocsBlock();
        }

        if (this.indentStack.length !== 0) {
            const remaining = this.indentStack.map(i => `bloco aberto na indentação ${i.indent}`).join(", ");
            throw new Error(`Blocos não fechados: ${remaining}`);
        }

        // Garante que todo o conteúdo foi consumido. Tokens sobrando no nível
        // superior (ex: typo fora de um bloco) eram descartados silenciosamente.
        if (this.peek().type !== "eof") {
            const tok = this.peek();
            const got = tok.type === "ident" ? tok.value : tok.type;
            throw new Error(
                `Token inesperado "${got}" na linha ${tok.line}: ` +
                `conteúdo fora de um bloco válido (esperado fim do arquivo).`
            );
        }

        // Validate no duplicate routes across all pages
        const seenRoutes = new Set();
        for (const section of ast.docs.sections) {
            for (const page of section.pages) {
                const route = page.meta.route;
                if (seenRoutes.has(route)) {
                    throw new Error(`Rota duplicada: "${route}" na página "${page.name}" (seção "${section.name}")`);
                }
                seenRoutes.add(route);
            }
        }

        return ast;
    }

    parseUsingStatement(ast) {
        this.expect("ident", "using");
        const first = this.expect("ident").value;

        if (first === "Extensions" && this.match(".")) {
            const feature = this.expect("ident").value;
            const known = ["PageContent", "Switch", "Coloring"];
            if (known.includes(feature)) {
                ast.extensionsEnabled[feature] = true;
            } else {
                throw new Error(`Extensions desconhecida: ${feature}. Use PageContent, Switch ou Coloring`);
            }
            this.match(";");
            return;
        }

        if (this.match("=")) {
            ast.usings[first] = this.parseExtensionRef();
        } else {
            ast.usings[first] = first;
        }

        this.match(";");
    }

    parseExtensionRef() {
        const first = this.expect("ident").value;

        if (this.match(":") && this.match(":")) {
            return `${first}::${this.expect("ident").value}`;
        }

        return first;
    }

    parseCustomParams() {
        this.expect("(");
        const params = [];
        while (this.peek().type !== ")") {
            if (params.length > 0) this.expect(",");
            params.push(this.parseValue());
        }
        this.expect(")");
        return params;
    }

    parseExtensionsBlock() {
        const extensions = { alerts: {}, badges: {}, docColors: null, coloring: null };
        this.blockOpen();

        while (!this.blockMatch()) {
            if (this.match("ident", "DocColors")) {
                extensions.docColors = this.parseDocColorsBlock();
                continue;
            }

            if (this.match("ident", "Coloring")) {
                extensions.coloring = this.parseColoringBlock();
                continue;
            }

            if (this.match("ident", "alert")) {
                extensions.alerts[this.expect("ident").value] = this.parseExtensionConfig();
                continue;
            }

            if (this.match("ident", "badge")) {
                extensions.badges[this.expect("ident").value] = this.parseExtensionConfig();
                continue;
            }

            throw new Error("Campo Extensions inválido: use alert, badge, DocColors ou Coloring");
        }

        return extensions;
    }

    // DocColors { light { primary: "#.."; ... } dark { ... } }
    // Configura (opcionalmente) as cores dos temas light/dark.
    parseDocColorsBlock() {
        this.blockOpen();
        const colors = { light: {}, dark: {} };

        while (!this.blockMatch()) {
            if (this.match("ident", "light")) {
                colors.light = this.parseColorMap();
                continue;
            }
            if (this.match("ident", "dark")) {
                colors.dark = this.parseColorMap();
                continue;
            }
            throw new Error("DocColors inválido: use blocos light { } e dark { }");
        }

        return colors;
    }

    // Coloring { light { <elem> { prop: "cor"; } } dark { ... } }
    // Recolore tipos de elemento por tema. Precedência: inline > Coloring > DocColors > base.
    parseColoringBlock() {
        this.blockOpen();
        const coloring = { light: {}, dark: {} };

        while (!this.blockMatch()) {
            if (this.match("ident", "light")) {
                coloring.light = this.parseColoringTheme();
                continue;
            }
            if (this.match("ident", "dark")) {
                coloring.dark = this.parseColoringTheme();
                continue;
            }
            throw new Error("Coloring inválido: use blocos light { } e dark { }");
        }

        return coloring;
    }

    // Dentro de light/dark: vários `elemento { prop: "cor"; }`.
    parseColoringTheme() {
        this.blockOpen();
        const elements = {};

        while (!this.blockMatch()) {
            const elem = this.expect("ident").value;
            elements[elem] = this.parseColorMap();
        }

        return elements;
    }

    parseColorMap() {
        this.blockOpen();
        const map = {};

        while (!this.blockMatch()) {
            const key = this.expect("ident").value;
            this.expect(":");
            const value = this.parseValue();
            if (typeof value !== "string") {
                throw new Error(`Cor inválida em "${key}": precisa ser uma string (ex: "#6366f1").`);
            }
            map[key] = value;
            this.match(";");
        }

        return map;
    }

    parseExtensionConfig() {
        this.blockOpen();
        const config = {};

        while (!this.blockMatch()) {
            const key = this.expect("ident").value;
            this.expect(":");
            config[key] = this.parseValue();
            this.match(";");
        }

        return config;
    }

    parseObjectBlock() {
        this.blockOpen();
        const obj = {};

        while (!this.blockMatch()) {
            const key = this.expect("ident").value;
            this.expect(":");
            obj[key] = this.parseValue();
            this.match(";");
        }

        return obj;
    }

    parseValue() {
        const token = this.peek();

        if (token.type === "string") {
            this.advance();
            return token.value;
        }

        if (this.extensionsEnabled?.Coloring && token.type === "(") {
            return { kind: "custom", params: this.parseCustomParams() };
        }

        if (token.type === "ident") {
            this.advance();
            return token.value;
        }

        if (token.type === "directive") {
            this.advance();
            return `#>${token.value}`;
        }

        throw new Error(`Valor inválido: ${token.type}`);
    }

    parseDocsBlock() {
        const docs = { layout: "stnd", pageContent: false, sections: [] };
        this.blockOpen();

        while (!this.blockMatch()) {
            if (this.match("ident", "layout")) {
                const layoutToken = this.expect("directive");
                docs.layout = layoutToken.value;
                this.match(";");
                continue;
            }

            // On This Page (PageContent), após o layout: `#> PageContent;`
            // (requer `using Extensions.PageContent;`).
            if (this.peek().type === "directive") {
                this.parsePageContentDirective(docs);
                continue;
            }

            if (this.match("ident", "section")) {
                docs.sections.push(this.parseSection());
                continue;
            }

            throw new Error(`Bloco Docs inválido: ${this.peek().type}`);
        }

        return docs;
    }

    parsePageContentDirective(docs) {
        const dir = this.expect("directive");

        if (dir.value === "PageContent") {
            if (!this.extensionsEnabled?.PageContent) {
                throw new Error(
                    "#> PageContent requer 'using Extensions.PageContent;'."
                );
            }
            docs.pageContent = true;
        } else {
            throw new Error(`Diretiva inesperada no bloco Docs: #>${dir.value}`);
        }

        this.match(";");
    }

    parseSection() {
        const name = this.expect("string").value;
        this.blockOpen();
        const section = { name, pages: [] };

        while (!this.blockMatch()) {
            if (this.match("ident", "page")) {
                section.pages.push(this.parsePage(section.name));
                continue;
            }
            throw new Error(`Bloco section inválido: ${this.peek().type}`);
        }

        return section;
    }

    parsePage(defaultCategory) {
        const name = this.expect("ident").value;

        // Switch: variante opcional após o nome -> `page Nome #> Variante`.
        let variant = null;
        if (this.peek().type === "directive") {
            if (!this.extensionsEnabled?.Switch) {
                throw new Error(
                    `Variante de página requer 'using Extensions.Switch;' (página "${name}").`
                );
            }
            const v = this.advance().value;
            if (!v) {
                throw new Error(`Variante vazia na página "${name}". Use 'page ${name} #> Linux'.`);
            }
            variant = v;
        }

        this.blockOpen();

        const page = {
            name,
            variant,
            meta: {
                category: defaultCategory,
                route: slugify(name),
                icon: "ri-file-text-line",
                nav: name,
                breadcrumb: name,
                title: name
            },
            blocks: []
        };

        while (!this.blockMatch()) {
            if (this.match(";")) continue;

            if (this.peek().type === "ident" && this.peek(1).type === ":") {
                const key = this.advance().value;
                this.advance();
                page.meta[key] = this.parseValue();
                this.match(";");
                continue;
            }

            page.blocks.push(this.parseBlock());
            this.match(";");
        }

        return page;
    }

    parseBlock() {
        const token = this.peek();

        if (token.type === "ident" && ["h1", "h2", "h3", "p"].includes(token.value)) {
            const type = this.advance().value;
            if (this.peek().type === "string") {
                return { type, text: this.advance().value };
            }
            this.blockOpen();
            const lines = this.parseTextLines();
            this.blockClose();
            return { type, text: lines.join("\n") };
        }

        if (token.type === "ident" && token.value === "hero") {
            return this.parseHeroBlock();
        }

        if (token.type === "ident" && token.value === "grid") {
            return this.parseGridBlock();
        }

        if (token.type === "ident" && token.value.startsWith("__LDFW_CODE_")) {
            const id = Number(token.value.replace("__LDFW_CODE_", "").replace("__", ""));
            this.advance();
            return { type: "code", ...this.codeBlocks[id] };
        }

        if (token.type === "ident" && token.value === "alert") {
            return this.parseAlertBlock();
        }

        if (token.type === "ident" && ["ul", "ol"].includes(token.value)) {
            return this.parseListBlock(token.value);
        }

        if (token.type === "ident" && token.value === "faq") {
            return this.parseFaqBlock();
        }

        if (token.type === "ident" && token.value === "card") {
            return this.parseStandaloneCard();
        }

        if (token.type === "ident" && token.value === "table") {
            return this.parseTableBlock();
        }

        if (token.type === "ident" && token.value === "tabs") {
            return this.parseTabsBlock();
        }

        throw new Error(`Bloco de conteúdo desconhecido: ${token.type === "ident" ? token.value : token.type}`);
    }

    parseHeroBlock() {
        this.expect("ident", "hero");
        this.blockOpen();
        const hero = { type: "hero", badge: "", title: "", desc: "", buttons: [] };

        while (!this.blockMatch()) {
            if (this.match("ident", "badge") || this.match("ident", "title") || this.match("ident", "desc")) {
                const key = this.peek(-1).value;
                this.expect(":");
                hero[key] = this.parseValue();
                this.match(";");
                continue;
            }

            if (this.match("ident", "btn")) {
                hero.buttons.push(this.parseHeroButton());
                this.match(";");
                continue;
            }

            throw new Error("Campo hero inválido");
        }

        return hero;
    }

    parseHeroButton() {
        let variant = "primary";
        if (this.peek().type === "ident" && (this.peek().value === "primary" || this.peek().value === "outline")) {
            variant = this.advance().value;
        }

        const label = this.expect("string").value;
        this.expect("arrow");
        const target = this.parseLinkTarget();
        return { variant, label, target };
    }

    parseLinkTarget() {
        if (this.match("ident", "external")) {
            return { kind: "external", href: this.expect("string").value };
        }

        if (this.peek().type === "string") {
            const href = this.advance().value;
            return { kind: "hash", href: href.startsWith("#") ? href : `#${href}` };
        }

        const href = this.expect("ident").value;
        return { kind: "hash", href: href.startsWith("#") ? href : `#${href}` };
    }

    parseGridBlock() {
        this.expect("ident", "grid");
        const colToken = this.peek();
        if (colToken.type !== "ident" || !/^\d+$/.test(colToken.value)) {
            const got = colToken.type === "ident" ? colToken.value : colToken.type;
            throw new Error(
                `grid requer número de colunas, ex: grid 2 { ... } ` +
                `(recebido "${got}" na linha ${colToken.line})`
            );
        }
        this.advance();
        const columns = Number(colToken.value);
        this.blockOpen();
        const cards = [];

        while (!this.blockMatch()) {
            cards.push(this.parseCardBlock());
        }

        return { type: "grid", columns, cards };
    }

    parseCardBlock() {
        this.expect("ident", "card");
        const title = this.expect("string").value;
        let icon = "ri-layout-grid-line";

        if (this.match("ident", "icon")) {
            icon = this.expect("string").value;
        }

        this.blockOpen();
        const lines = this.parseTextLines();
        this.blockClose();
        return { title, icon, text: lines.join("\n") };
    }

    parseStandaloneCard() {
        const card = this.parseCardBlock();
        return { type: "card", ...card };
    }

    parseAlertBlock() {
        this.expect("ident", "alert");
        let variant, title;

        if (this.extensionsEnabled?.Coloring && this.peek().type === "(") {
            variant = { kind: "custom", params: this.parseCustomParams() };
            title = variant.params[0] || "";
        } else {
            variant = this.parseExtensionRef();
            title = this.expect("string").value;
        }

        this.blockOpen();
        const lines = this.parseTextLines();
        this.blockClose();
        return { type: "alert", variant, title, text: lines.join("\n") };
    }

    parseListBlock(listType) {
        this.expect("ident", listType);
        this.blockOpen();
        const items = [];

        while (!this.blockMatch()) {
            items.push(this.expect("string").value);
            this.match(";");
        }

        return { type: listType, items };
    }

    parseFaqBlock() {
        this.expect("ident", "faq");
        this.blockOpen();
        const items = [];

        while (!this.blockMatch()) {
            this.expect("ident", "q");
            const question = this.expect("string").value;
            this.blockOpen();
            const lines = this.parseTextLines();
            this.blockClose();
            items.push({ question, answer: lines.join("\n") });
        }

        return { type: "faq", items };
    }

    parseTextLines() {
        const lines = [];

        while (this.peek().type === "string") {
            lines.push(this.advance().value);
            this.match(";");
        }

        return lines;
    }

    parseTableBlock() {
        this.expect("ident", "table");
        let preset = null;

        if (this.peek().type === "ident" && this.peek().value === "config") {
            preset = "config";
            this.advance();
        }

        this.blockOpen();
        let headers = [];
        const rows = [];

        while (!this.blockMatch()) {
            if (this.match("ident", "header")) {
                while (this.peek().type === "string") {
                    headers.push(this.advance().value);
                }
                this.match(";");
                continue;
            }

            if (this.match("ident", "row")) {
                rows.push(this.parseTableRow(preset));
                this.match(";");
                continue;
            }

            throw new Error("Campo table inválido: use header ou row");
        }

        if (preset === "config") {
            headers = ["Parâmetro", "Tipo", "Padrão", "Descrição"];
        } else if (headers.length === 0) {
            throw new Error("Tabela genérica requer pelo menos um header");
        }

        return { type: "table", preset, headers, rows };
    }

    parseTableRow(preset) {
        if (preset === "config") {
            const param = this.expect("string").value;
            let type;

            if (this.extensionsEnabled?.Coloring && this.peek().type === "(") {
                type = { kind: "custom", params: this.parseCustomParams() };
            } else {
                type = this.expect("ident").value;
            }

            const defaultVal = this.expect("string").value;
            const description = this.expect("string").value;

            return {
                cells: [
                    { kind: "param", value: param },
                    { kind: "badge", value: type },
                    { kind: "code", value: defaultVal },
                    { kind: "text", value: description }
                ]
            };
        }

        const cells = [];

        while (
            this.peek().type === "string" ||
            (this.peek().type === "ident" && this.peek().value === "badge") ||
            (this.extensionsEnabled?.Coloring && this.peek().type === "(")
        ) {
            if (this.peek().type === "string") {
                cells.push({ kind: "text", value: this.advance().value });
                continue;
            }

            if (this.extensionsEnabled?.Coloring && this.peek().type === "(") {
                cells.push({ kind: "badge", value: { kind: "custom", params: this.parseCustomParams() }, label: null });
                continue;
            }

            this.advance();
            this.expect(":");
            const badgeType = this.expect("ident").value;
            let label = badgeType;

            if (this.peek().type === "string") {
                label = this.advance().value;
            } else if (this.peek().type === "ident") {
                label = this.advance().value;
            }

            cells.push({ kind: "badge", value: badgeType, label });
        }

        if (cells.length === 0) {
            throw new Error("Linha de tabela vazia");
        }

        return { cells };
    }

    parseTabsBlock() {
        this.expect("ident", "tabs");
        this.blockOpen();
        const tabs = [];

        while (!this.blockMatch()) {
            this.expect("ident", "tab");
            const name = this.expect("string").value;
            let icon = "";
            if (this.match("ident", "icon")) {
                icon = this.expect("string").value;
            }
            this.blockOpen();
            const blocks = [];
            while (!this.blockMatch()) {
                if (this.match(";")) continue;
                blocks.push(this.parseBlock());
                this.match(";");
            }
            tabs.push({ name, icon, blocks });
        }

        return { type: "tabs", tabs };
    }

}

function slugify(value) {
    if (!value) return "untitled";
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        || "untitled";
}

function parse(source, options = {}) {
    const cleaned = stripComments(source);
    const { processed, blocks } = preprocessCodeBlocks(cleaned);
    const tokens = tokenize(processed);
    const parser = new Parser(tokens, blocks);
    const ast = parser.parseFile();

    if (!options.library && ast.directive && ast.directive !== "StartFW") {
        throw new Error(`Diretiva inválida: #>${ast.directive}. Use #> StartFW`);
    }

    return ast;
}

module.exports = { parse, slugify, tokenize };
