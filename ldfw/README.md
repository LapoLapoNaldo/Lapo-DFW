# LDFW — Lapo's Documentation Framework

Compila arquivos `.ldfw` para sites de documentação estáticos com visual premium. Zero dependências runtime.

## Instalação

```bash
cd ldfw
npm install
npm link
```

## Uso

```bash
ldfw build main.ldfw -o ./dist
npx serve ./dist -l 8080
```

## Sintaxe

```ldfw
#> StartFW
include #> Standard;

Project: {
    title: "Meu Projeto";
    version: "v1.0.0";
}

Docs: {
    layout #> stnd;

    section "Introdução" {
        page Home {
            route: "home";

            hero {
                badge: "Novo";
                title: "Meu Projeto";
                desc: "Descrição curta.";
                btn primary "Começar" -> getting-started;
            }

            h2 "Código";
            code lua {
print("Hello LDFW")
            }

            h2 "Tabs";
            tabs {
                tab "Lua" {
                    code lua {
print("Hello")
                    }
                }
                tab "Python" {
                    code python {
print("Hello")
                    }
                }
            }

            h2 "Alerta Custom";
            alert custom::("Título", "#ff6b6b", "rgba(255,107,107,0.08)", "ri-star-line") {
                "Alerta com cores inline.";
            }

            h2 "Tabela com Badge";
            table config {
                row "title" custom::("string","#3b82f6","rgba(59,130,246,0.1)") "\"valor\"" "Descrição";
            }
        }
    }
}
```

## Componentes

| Componente | Sintaxe |
|---|---|
| Hero | `hero { badge, title, desc, btn }` |
| Grid + Cards | `grid 2 { card "Título" icon "ri-..." { "texto" } }` |
| Card avulso | `card "Título" icon "ri-..." { "texto" }` |
| Code block | `code lua { ... }` |
| Alert (preset) | `alert tip\|info\|warning\|danger\|important "Título" { "texto" }` |
| Alert (custom) | `alert custom::("Título","#cor","bg","ri-icon","emoji") { "texto" }` |
| Alert (shorthand) | `alert ("Título","#cor","bg","ri-icon") { "texto" }` (com `using Extensions.alert`) |
| Table config | `table config { row "param" tipo "default" "desc"; }` |
| Table genérica | `table { header "A" "B"; row "a" "b"; }` |
| Badge custom | `custom::("texto","#cor","bg")` |
| Badge shorthand | `("texto","#cor","bg")` (com `using Extensions.badge`) |
| Tabs | `tabs { tab "Nome" { ... } }` |
| FAQ | `faq { q "pergunta" { "resposta" } }` |
| Listas | `ul { "item" }` / `ol { "item" }` |
| Headings | `h1`, `h2`, `h3` |
| Parágrafo | `p "texto"` |

## Extensions

```ldfw
include #> Extensions;
using Extensions.alert;
using Extensions.badge;

alert ("Título", "#10b981", "rgba(16,185,129,0.08)", "ri-check-line") {
    "Shorthand sem custom::()."
}

table config {
    row "name" ("string", "#3b82f6", "rgba(59,130,246,0.1)")  "\"nome\""  "Descrição.";
}
```

## VSCode Extension

Em `vscode/` — fornece syntax highlighting, autocomplete e diagnóstico de erros.

```bash
# Cursor
ln -sf $(pwd)/vscode ~/.cursor/extensions/ldfw-language-support

# VSCode
ln -sf $(pwd)/vscode ~/.vscode/extensions/ldfw-language-support
```

## Estrutura

```
ldfw/
├── bin/ldfw.js          # CLI entry
├── compiler/            # parser.js, codegen.js, components.js, extensions.js
├── templates/           # runtime.js + style.css
├── std/                 # Standard.ldfw, Extensions.ldfw
├── vscode/              # Extensão VSCode/Cursor
├── examples/            # Projetos de exemplo
├── Makefile             # build/serve/test shortcuts
└── package.json
```
