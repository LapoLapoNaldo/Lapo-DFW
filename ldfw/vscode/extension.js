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

    // Validate already-open .ldfw files
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
                completions.push(kw("ul", "Unordered list"));
                completions.push(kw("ol", "Ordered list"));

                // --- Headings & text ---
                completions.push(kw("h1", "Heading 1"));
                completions.push(kw("h2", "Heading 2"));
                completions.push(kw("h3", "Heading 3"));
                completions.push(kw("p", "Paragraph"));

                // --- Hero properties ---
                completions.push(kw("badge", "Hero badge"));
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

                // --- Snippets (expanded templates) ---
                completions.push(
                    snippet(
                        "include",
                        "Include Standard library",
                        'include #> Standard;'
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
                        "hero {\n\tbadge: \"${1:Novo}\";\n\ttitle: \"${2:Título}\";\n\tdesc: \"${3:Descrição}\";\n\tbtn ${4|primary,outline|} \"${5:Começar}\" -> ${6:pagina};\n}"
                    )
                );

                completions.push(
                    snippet(
                        "grid {}",
                        "Card grid",
                        "grid ${1:2} {\n\tcard \"${2:Título}\" icon \"${3:ri-icon-line}\" {\n\t\t\"${4:Texto}\";\n\t}\n}"
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
                        "alert {}",
                        "Alert box",
                        'alert ${1|tip,warning,danger,info|} "${2:Título}" {\n\t"${3:Texto}";\n}'
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
                        "faq {\n\tq \"${1:Pergunta}\" {\n\t\t\"${2:Resposta}\";\n\t}\n}"
                    )
                );

                completions.push(
                    snippet(
                        "ul {}",
                        "Unordered list",
                        "ul {\n\t\"${1:item}\";\n}"
                    )
                );

                completions.push(
                    snippet(
                        "ol {}",
                        "Ordered list",
                        "ol {\n\t\"${1:item}\";\n}"
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
