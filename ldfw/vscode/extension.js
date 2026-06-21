const vscode = require("vscode");
const path = require("path");

function activate(context) {
    const parserPath = path.join(context.extensionPath, "..", "compiler", "parser");
    let parser;

    try {
        parser = require(parserPath);
    } catch (e) {
        vscode.window.showErrorMessage(
            "LDFW: não foi possível carregar o parser. " + e.message
        );
        return;
    }

    const diagnosticCollection =
        vscode.languages.createDiagnosticCollection("ldfw");

    function validateDocument(document) {
        if (document.languageId !== "ldfw") return;

        diagnosticCollection.delete(document.uri);
        const diagnostics = [];

        try {
            parser.parse(document.getText());
        } catch (err) {
            const msg = err.message || String(err);
            const lineMatch = msg.match(/linha (\d+)/i);
            let line = 0;
            if (lineMatch) {
                line = Math.max(0, parseInt(lineMatch[1], 10) - 1);
            }

            const range = new vscode.Range(line, 0, line, 65535);
            const diagnostic = new vscode.Diagnostic(
                range,
                msg,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.source = "ldfw";
            diagnostics.push(diagnostic);
        }

        diagnosticCollection.set(document.uri, diagnostics);
    }

    const openSub = vscode.workspace.onDidOpenTextDocument(validateDocument);
    const changeSub = vscode.workspace.onDidChangeTextDocument((e) =>
        validateDocument(e.document)
    );
    const saveSub = vscode.workspace.onDidSaveTextDocument(validateDocument);

    vscode.workspace.textDocuments.forEach(validateDocument);

    context.subscriptions.push(
        diagnosticCollection,
        openSub,
        changeSub,
        saveSub
    );

    // --- Completion Provider ---
    const provider = vscode.languages.registerCompletionItemProvider(
        "ldfw",
        {
            provideCompletionItems(document, position) {
                const completions = [];

                function kw(label, detail) {
                    const item = new vscode.CompletionItem(
                        label,
                        vscode.CompletionItemKind.Keyword
                    );
                    item.detail = detail;
                    return item;
                }

                function snippet(label, detail, snip) {
                    const item = new vscode.CompletionItem(
                        label,
                        vscode.CompletionItemKind.Snippet
                    );
                    item.detail = detail;
                    item.insertText = new vscode.SnippetString(snip);
                    return item;
                }

                // --- Language keywords ---
                completions.push(kw("include", "Include standard library"));
                completions.push(kw("using", "using Extensions.alert / Extensions.badge"));
                completions.push(kw("Extensions", "Custom alert/badge presets block"));
                completions.push(kw("Project", "Project metadata block"));
                completions.push(kw("Docs", "Documentation block"));
                completions.push(kw("section", "Add a section"));
                completions.push(kw("page", "Add a page"));
                completions.push(kw("layout", "Set layout"));

                // --- Component blocks ---
                completions.push(kw("hero", "Hero banner"));
                completions.push(kw("grid", "Card grid"));
                completions.push(kw("card", "Card inside grid"));
                completions.push(kw("alert", "Alert box"));
                completions.push(kw("code", "Code block"));
                completions.push(kw("faq", "FAQ accordion"));
                completions.push(kw("table", "Table"));
                completions.push(kw("ul", "Unordered list"));
                completions.push(kw("ol", "Ordered list"));
                completions.push(kw("tabs", "Tabbed component"));
                completions.push(kw("tab", "Tab inside tabs"));

                // --- Headings & text ---
                completions.push(kw("h1", "Heading 1"));
                completions.push(kw("h2", "Heading 2"));
                completions.push(kw("h3", "Heading 3"));
                completions.push(kw("p", "Paragraph"));

                // --- Hero properties ---
                completions.push(kw("badge", "Hero badge (text or custom::())"));
                completions.push(kw("title", "Title"));
                completions.push(kw("desc", "Description"));
                completions.push(kw("btn", "Hero button"));

                // --- Button variants ---
                completions.push(kw("primary", "Primary button"));
                completions.push(kw("outline", "Outline button"));
                completions.push(kw("external", "External link"));

                // --- Page meta ---
                completions.push(kw("route", "Page route"));
                completions.push(kw("icon", "Remix icon class"));
                completions.push(kw("nav", "Navigation label"));
                completions.push(kw("breadcrumb", "Breadcrumb text"));

                // --- Project meta ---
                completions.push(kw("version", "Project version"));
                completions.push(kw("status", "Project status"));
                completions.push(kw("github", "GitHub URL"));
                completions.push(kw("subtitle", "Project subtitle"));
                completions.push(kw("description", "Meta description"));
                completions.push(kw("lang", "Language"));

                // --- Extensions shorthands ---
                completions.push(kw("custom", "Inline custom params: custom::()"));

                // --- Snippets ---
                completions.push(
                    snippet(
                        "include Standard",
                        "Include Standard library",
                        "include #> Standard;"
                    )
                );

                completions.push(
                    snippet(
                        "include Extensions",
                        "Include Extensions library",
                        "include #> Extensions;"
                    )
                );

                completions.push(
                    snippet(
                        "using Extensions.alert",
                        "Enable alert inline shorthand (no custom:: needed)",
                        "using Extensions.alert;"
                    )
                );

                completions.push(
                    snippet(
                        "using Extensions.badge",
                        "Enable badge inline shorthand (no custom:: needed)",
                        "using Extensions.badge;"
                    )
                );

                completions.push(
                    snippet(
                        "StartFW",
                        "LDFW file header",
                        "#> StartFW"
                    )
                );

                completions.push(
                    snippet(
                        "Extensions: {}",
                        "Custom alert/badge presets block",
                        "Extensions: {\n\talert ${1:nome} {\n\t\ticon: \"${2:ri-star-line}\";\n\t\tcolor: \"${3:#6366f1}\";\n\t\tbackground: \"${4:rgba(99, 102, 241, 0.08)}\";\n\t\tborder: \"${5:#6366f1}\";\n\t}\n\tbadge ${6:nome} {\n\t\tcolor: \"${7:#e8a838}\";\n\t\tbackground: \"${8:rgba(232, 168, 56, 0.1)}\";\n\t}\n}"
                    )
                );

                completions.push(
                    snippet(
                        "Project: {}",
                        "Project metadata block",
                        "Project: {\n\t${1:title}: \"${2:Name}\";\n\t${3:version}: \"${4:v1.0.0}\";\n\t${5:status}: \"${6:Estável}\";\n}"
                    )
                );

                completions.push(
                    snippet(
                        "Docs: {}",
                        "Documentation block",
                        "Docs: {\n\tlayout #> stnd;\n\n\tsection \"${1:Seção}\" {\n\t\tpage ${2:Pagina} {\n\t\t\troute: \"${3:pagina}\";\n\t\t\ticon: \"ri-file-text-line\";\n\t\t\tnav: \"${2:Pagina}\";\n\t\t\tbreadcrumb: \"${2:Pagina}\";\n$0\n\t\t}\n\t}\n}"
                    )
                );

                completions.push(
                    snippet(
                        "section {}",
                        "Add a section",
                        'section "${1:Nome}" {\n\t${0}\n}'
                    )
                );

                completions.push(
                    snippet(
                        "page {}",
                        "Add a page to section",
                        'page ${1:Nome} {\n\troute: "${2:rota}";\n\ticon: "${3:ri-file-text-line}";\n\tnav: "${1:Nome}";\n\tbreadcrumb: "${1:Nome}";\n$0\n}'
                    )
                );

                completions.push(
                    snippet(
                        "hero {}",
                        "Hero section",
                        "hero {\n\tbadge: custom::(\"${1:Badge}\", \"${2:#6366f1}\", \"${3:rgba(99,102,241,0.1)}\");\n\ttitle: \"${4:Título}\";\n\tdesc: \"${5:Descrição}\";\n\tbtn ${6|primary,outline|} \"${7:Começar}\" -> ${8:pagina};\n}"
                    )
                );

                completions.push(
                    snippet(
                        "hero badge: custom::()",
                        "Hero badge with custom inline colors",
                        'badge: custom::("${1:Texto}", "${2:#7850ff}", "${3:rgba(120,80,255,0.15)}");'
                    )
                );

                completions.push(
                    snippet(
                        "alert custom::()",
                        "Alert with inline custom colors (no preset needed)",
                        'alert custom::("${1:Título}", "${2:#ff6b6b}", "${3:rgba(255,107,107,0.08)}", "${4:ri-star-line}", "${5:📝}") {\n\t"${6:Texto}";\n}'
                    )
                );

                completions.push(
                    snippet(
                        "alert shorthand ()",
                        "Alert shorthand (requires using Extensions.alert)",
                        'alert ("${1:Título}", "${2:#10b981}", "${3:rgba(16,185,129,0.08)}", "${4:ri-check-line}") {\n\t"${5:Texto}";\n}'
                    )
                );

                completions.push(
                    snippet(
                        "alert {}",
                        "Alert box (preset)",
                        'alert ${1|tip,warning,danger,info,important|} "${2:Título}" {\n\t"${3:Texto}";\n}'
                    )
                );

                completions.push(
                    snippet(
                        "grid {}",
                        "Card grid",
                        "grid ${1:2} {\n\tcard \"${2:Título}\" icon \"${3:ri-icon-line}\" {\n\t\t\"${4:Texto}\";\n\t}\n\tcard \"${5:Título}\" icon \"${6:ri-icon-line}\" {\n\t\t\"${7:Texto}\";\n\t}\n}"
                    )
                );

                completions.push(
                    snippet(
                        "card {}",
                        "Card inside grid",
                        'card "${1:Título}" icon "${2:ri-layout-grid-line}" {\n\t"${3:Texto}";\n}'
                    )
                );

                completions.push(
                    snippet(
                        "code {}",
                        "Code block",
                        'code ${1:lua} {\n${2:-- code}\n}'
                    )
                );

                completions.push(
                    snippet(
                        "faq {}",
                        "FAQ block",
                        "faq {\n\tq \"${1:Pergunta}\" {\n\t\t\"${2:Resposta}\";\n\t}\n\tq \"${3:Pergunta}\" {\n\t\t\"${4:Resposta}\";\n\t}\n}"
                    )
                );

                completions.push(
                    snippet(
                        "ul {}",
                        "Unordered list",
                        "ul {\n\t\"${1:item}\";\n\t\"${2:item}\";\n}"
                    )
                );

                completions.push(
                    snippet(
                        "ol {}",
                        "Ordered list",
                        "ol {\n\t\"${1:item}\";\n\t\"${2:item}\";\n}"
                    )
                );

                completions.push(
                    snippet(
                        "table config {}",
                        "Config table with custom badges",
                        "table config {\n\trow \"${1:param}\" custom::(\"${2:string}\", \"${3:#3b82f6}\", \"${4:rgba(59,130,246,0.1)}\")  \"${5:default}\"  \"${6:Descrição}\";\n}"
                    )
                );

                completions.push(
                    snippet(
                        "table config shorthand",
                        "Config table with badge shorthand (requires using Extensions.badge)",
                        "table config {\n\trow \"${1:param}\" (\"${2:string}\", \"${3:#3b82f6}\", \"${4:rgba(59,130,246,0.1)}\")  \"${5:default}\"  \"${6:Descrição}\";\n}"
                    )
                );

                completions.push(
                    snippet(
                        "table {}",
                        "Generic table",
                        "table {\n\theader \"${1:Col1}\" \"${2:Col2}\" \"${3:Col3}\";\n\trow \"${4:valor}\" custom::(\"${5:tipo}\", \"${6:#a855f7}\", \"${7:rgba(168,85,247,0.1)}\") \"${8:desc}\";\n}"
                    )
                );

                completions.push(
                    snippet(
                        "custom::()",
                        "Inline custom params: (label, color, bg, icon, emoji)",
                        'custom::("${1:texto}", "${2:#7850ff}", "${3:rgba(120,80,255,0.1)}"${4})'
                    )
                );

                completions.push(
                    snippet(
                        "tabs {}",
                        "Tabbed component",
                        'tabs {\n\ttab "${1:Lua}" icon "${2:ri-code-line}" {\n\t\t"${3:Conteúdo}";\n\t}\n\ttab "${4:Python}" icon "${5:ri-code-line}" {\n\t\t"${6:Conteúdo}";\n\t}\n}'
                    )
                );

                completions.push(
                    snippet(
                        "tab {}",
                        "Tab inside tabs block",
                        'tab "${1:Nome}" {\n\t"${2:Conteúdo}";\n}'
                    )
                );

                return completions;
            },
        },
        ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );

    context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = { activate, deactivate };
