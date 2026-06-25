"use strict";

const { parse, slugify, tokenize } = require("../parser");

// ============================================================
// Parser Tests
// ============================================================

function assert(condition, message) {
    if (!condition) throw new Error(message || "Assertion failed");
}

function assertEqual(actual, expected, label) {
    if (actual !== expected) {
        throw new Error(`${label || ""} Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

// --- slugify ---
assertEqual(slugify("HelloWorld"), "hello-world", "slugify CamelCase");
assertEqual(slugify("Minha Página"), "minha-pagina", "slugify spaces");
assertEqual(slugify("  spaces  "), "spaces", "slugify leading/trailing spaces");
assertEqual(slugify(""), "untitled", "slugify empty");
assertEqual(slugify(null), "untitled", "slugify null");
assertEqual(slugify("coração"), "coracao", "slugify accents");

// --- tokenize ---
const tokens1 = tokenize('hello "world" 123');
assert(tokens1.length > 0, "tokenize basic");
assertEqual(tokens1[0].type, "ident", "tokenize ident");
assertEqual(tokens1[0].value, "hello", "tokenize hello");

// --- parse minimal ---
const minimal = `#> StartFW
include #> Standard;

Project: {
    title: "Test";
}

Docs: {
    layout #> stnd;

    section "Section1" {
        page Page1 {
            route: "page1";
            h2 "Hello";
        }
    }
}`;

const ast = parse(minimal);
assertEqual(ast.directive, "StartFW", "directive");
assert(ast.includes.includes("Standard"), "includes Standard");
assertEqual(ast.project.title, "Test", "project title");
assertEqual(ast.docs.sections.length, 1, "one section");
assertEqual(ast.docs.sections[0].pages.length, 1, "one page");
assertEqual(ast.docs.sections[0].pages[0].meta.route, "page1", "page route");

// --- parse with extensions ---
const withExt = `#> StartFW
include #> Standard;
using Extensions.Coloring;

Project: { title: "Test"; }

Docs: {
    layout #> stnd;

    section "S" {
        page P {
            route: "p";
            alert tip "Alert" {
                "text";
            }
        }
    }
}`;

const ast2 = parse(withExt);
assertEqual(ast2.extensionsEnabled.Coloring, true, "extensions Coloring enabled");

// --- indentation error ---
const badIndent = `#> StartFW
include #> Standard;

Project: {
    title: "Test";
}

Docs: {
    layout #> stnd;

    section "S" {
        page P {
        route: "p";
        }
    }
}`;

let caughtErr = null;
try {
    parse(badIndent);
} catch (e) {
    caughtErr = e;
}
assert(caughtErr !== null, "should fail on bad indentation");
assert(caughtErr.message.includes("Indentação"), "error message mentions indentation");

// --- duplicate routes ---
const dupRoutes = `#> StartFW
include #> Standard;

Project: { title: "T"; }

Docs: {
    layout #> stnd;

    section "A" {
        page P1 { route: "same"; }
    }
    section "B" {
        page P2 { route: "same"; }
    }
}`;

caughtErr = null;
try {
    parse(dupRoutes);
} catch (e) {
    caughtErr = e;
}
assert(caughtErr !== null, "should fail on duplicate routes");
assert(caughtErr.message.includes("duplicada"), "error mentions duplicate");

// --- tabs ---
const tabsSrc = `#> StartFW
include #> Standard;

Project: { title: "T"; }

Docs: {
    layout #> stnd;

    section "S" {
        page P {
            route: "p";
            tabs {
                tab "Tab1" {
                    p "Content 1";
                }
                tab "Tab2" {
                    p "Content 2";
                }
            }
        }
    }
}`;

const ast3 = parse(tabsSrc);
const tabBlock = ast3.docs.sections[0].pages[0].blocks[0];
assertEqual(tabBlock.type, "tabs", "tabs type");
assertEqual(tabBlock.tabs.length, 2, "two tabs");
assertEqual(tabBlock.tabs[0].name, "Tab1", "tab 1 name");

// --- comment handling ---
const commentSrc = `#> StartFW
// This is a comment
include #> Standard;
// Another comment

Project: {
    title: "Test";
    // inline comment
    subtitle: "Sub";
}

Docs: {
    layout #> stnd;

    section "S" {
        page P {
            route: "p";
            p "Hello // not a comment";
        }
    }
}`;

const ast4 = parse(commentSrc);
assertEqual(ast4.project.title, "Test", "comment handling title");
assertEqual(ast4.project.subtitle, "Sub", "comment handling subtitle");

// --- string with quotes inside ---
const quoteSrc = `#> StartFW
include #> Standard;

Project: { title: "Test"; }

Docs: {
    layout #> stnd;

    section "S" {
        page P {
            route: "p";
            p "He said \\"hello\\"";
        }
    }
}`;

const ast5 = parse(quoteSrc);
assertEqual(ast5.docs.sections[0].pages[0].blocks[0].text, 'He said "hello"', "escaped quotes");

// --- code block ---
const codeSrc = `#> StartFW
include #> Standard;

Project: { title: "T"; }

Docs: {
    layout #> stnd;

    section "S" {
        page P {
            route: "p";
            code lua {
                print("Hello")
            }
        }
    }
}`;

const ast6 = parse(codeSrc);
const codeBlock = ast6.docs.sections[0].pages[0].blocks[0];
assertEqual(codeBlock.type, "code", "code block type");
assertEqual(codeBlock.language, "lua", "code language");

// --- empty project ---
const emptyProject = `#> StartFW
include #> Standard;

Project: { }

Docs: {
    layout #> stnd;

    section "S" {
        page P { route: "p"; }
    }
}`;

const ast7 = parse(emptyProject);
assertEqual(Object.keys(ast7.project).length, 0, "empty project");

// --- multiple includes ---
const multiInclude = `#> StartFW
include #> Standard;
include #> Extensions;

Project: { title: "T"; }

Docs: {
    layout #> stnd;

    section "S" {
        page P { route: "p"; }
    }
}`;

const ast8 = parse(multiInclude);
assertEqual(ast8.includes.length, 2, "two includes");

// --- valid parseFile options ---
const librarySrc = `#> Standard
// Library file
`;

const libAst = parse(librarySrc, { library: true });
assertEqual(libAst.directive, "Standard", "library directive");

// --- PageContent: using + #> PageContent ---
const pcSrc = `#> StartFW
include #> Standard;
using Extensions.PageContent;

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    #> PageContent;

    section "S" {
        page P { route: "p"; h2 "A"; }
    }
}`;
const pcAst = parse(pcSrc);
assertEqual(pcAst.extensionsEnabled.PageContent, true, "using Extensions.PageContent enables flag");
assertEqual(pcAst.docs.pageContent, true, "#> PageContent sets docs.pageContent");

// --- PageContent: #> custom::PageContent foi removido (custom:: não existe mais) ---
const pcCustomSrc = `#> StartFW
include #> Standard;

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    #> custom::PageContent;

    section "S" {
        page P { route: "p"; }
    }
}`;
let pcCustomErr = null;
try { parse(pcCustomSrc); } catch (e) { pcCustomErr = e; }
assert(pcCustomErr !== null, "#> custom::PageContent should no longer work (custom:: removed)");

// --- PageContent: #> PageContent without using must fail ---
let pcErr = null;
try {
    parse(`#> StartFW
include #> Standard;

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    #> PageContent;

    section "S" {
        page P { route: "p"; }
    }
}`);
} catch (e) { pcErr = e; }
assert(pcErr !== null, "#> PageContent without using should fail");
assert(pcErr.message.includes("using Extensions.PageContent"), "error mentions required using");

// --- DocColors block ---
const dcSrc = `#> StartFW
include #> Standard;

Extensions: {
    DocColors {
        light { primary: "#111111"; background: "#ffffff"; }
        dark { primary: "#eeeeee"; }
    }
}

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    section "S" { page P { route: "p"; } }
}`;
const dcAst = parse(dcSrc);
assert(dcAst.extensions.docColors, "DocColors parsed");
assertEqual(dcAst.extensions.docColors.light.primary, "#111111", "DocColors light primary");
assertEqual(dcAst.extensions.docColors.dark.primary, "#eeeeee", "DocColors dark primary");

// --- defaults: pageContent false, docColors null ---
assertEqual(ast.docs.pageContent, false, "pageContent defaults to false");
assert(ast.extensions.docColors === null, "docColors defaults to null");
assert(ast.docs.sections[0].pages[0].variant === null, "page variant defaults to null");

// --- Switch: using + page variants ---
const swSrc = `#> StartFW
include #> Standard;
using Extensions.Switch;

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    section "S" {
        page A #> Linux { route: "a-linux"; }
        page A #> Windows { route: "a-win"; }
        page Comum { route: "comum"; }
    }
}`;
const swAst = parse(swSrc);
assertEqual(swAst.extensionsEnabled.Switch, true, "using Extensions.Switch enables flag");
const swPages = swAst.docs.sections[0].pages;
assertEqual(swPages[0].variant, "Linux", "page variant Linux");
assertEqual(swPages[1].variant, "Windows", "page variant Windows");
assertEqual(swPages[2].variant, null, "untagged page variant null");

// --- Switch: page variant without using must fail ---
let swErr = null;
try {
    parse(`#> StartFW
include #> Standard;

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    section "S" {
        page A #> Linux { route: "a"; }
    }
}`);
} catch (e) { swErr = e; }
assert(swErr !== null, "page variant without using Switch should fail");
assert(swErr.message.includes("Switch"), "error mentions Switch");

// --- Coloring: using + bloco light/dark + (...) inline ---
const coloringSrc = `#> StartFW
include #> Standard;
using Extensions.Coloring;

Extensions: {
    Coloring {
        light { card { background: "#ffffff"; } p { color: "#111111"; } }
        dark { card { background: "#15151f"; } }
    }
}

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    section "S" {
        page P {
            route: "p";
            alert ("Custom", "#ef4444", "rgba(239,68,68,0.08)") { "x"; }
        }
    }
}`;
const colAst = parse(coloringSrc);
assertEqual(colAst.extensionsEnabled.Coloring, true, "using Extensions.Coloring enables flag");
assert(colAst.extensions.coloring, "Coloring block parsed");
assertEqual(colAst.extensions.coloring.light.card.background, "#ffffff", "Coloring light card bg");
assertEqual(colAst.extensions.coloring.dark.card.background, "#15151f", "Coloring dark card bg");
const colAlert = colAst.docs.sections[0].pages[0].blocks[0];
assertEqual(colAlert.variant.kind, "custom", "alert (...) -> custom variant");
assertEqual(colAlert.variant.params[1], "#ef4444", "alert (...) color param");

// --- (...) sem Coloring deve falhar ---
let noColErr = null;
try {
    parse(`#> StartFW
include #> Standard;

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    section "S" { page P { route: "p"; alert ("X", "#f00") { "y"; } } }
}`);
} catch (e) { noColErr = e; }
assert(noColErr !== null, "alert (...) without Coloring should fail");

// --- custom:: não existe mais ---
let customErr = null;
try {
    parse(`#> StartFW
include #> Standard;
using Extensions.Coloring;

Project: { title: "T"; }

Docs: {
    layout #> stnd;
    section "S" { page P { route: "p"; alert custom::("X", "#f00") { "y"; } } }
}`);
} catch (e) { customErr = e; }
assert(customErr !== null, "custom:: should no longer parse");

// --- using Extensions.alert removido ---
let oldUsingErr = null;
try {
    parse(`#> StartFW
include #> Standard;
using Extensions.alert;

Project: { title: "T"; }

Docs: { layout #> stnd; section "S" { page P { route: "p"; } } }`);
} catch (e) { oldUsingErr = e; }
assert(oldUsingErr !== null, "using Extensions.alert should be unknown");
assert(oldUsingErr.message.includes("Coloring"), "error suggests Coloring");

// --- default: coloring null ---
assert(ast.extensions.coloring === null, "coloring defaults to null");

console.log("✔ All parser tests passed!");
