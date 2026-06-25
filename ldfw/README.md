# LDFW — Lapo's Documentation Framework

Compila arquivos `.ldfw` para sites de documentação estáticos com visual premium. Zero dependências runtime.

## Instalação

```bash
cd ldfw
npm install
npm link      # CLI global: ldfw
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
include #> Extensions;
using Extensions.Coloring;

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
            alert ("Título", "#ff6b6b", "rgba(255,107,107,0.08)", "ri-star-line") {
                "Alerta com cores inline.";
            }

            h2 "Tabela com Badge";
            table config {
                row "title" ("string","#3b82f6","rgba(59,130,246,0.1)")
                    "\"valor\"" "Descrição";
            }
        }
    }
}
```

## Componentes

| Componente | Sintaxe |
|---|---|
| Hero | `hero { badge, title, desc, btn }` |
| Grid | `grid 2 { card "Título" icon "ri-..." { "texto" } }` |
| Card avulso | `card "Título" icon "ri-..." { "texto" }` |
| Code | `code linguagem { ... }` |
| Alert (preset) | `alert tip\|info\|warning\|danger\|important "Título" { "texto" }` |
| Alert (cores) | `alert ("Título","#cor","bg","ri-icon","emoji") { "texto" }` (com `using Extensions.Coloring`) |
| Table config | `table config { row "param" tipo "default" "desc"; }` |
| Table genérica | `table { header "A" "B"; row "a" "b"; }` |
| Badge (cores) | `("texto","#cor","bg")` (com `using Extensions.Coloring`) |
| Tabs | `tabs { tab "Nome" { ... } }` |
| FAQ | `faq { q "pergunta" { "resposta" } }` |
| Listas | `ul { "item" }` / `ol { "item" }` |
| Títulos | `h1`, `h2`, `h3` |
| Parágrafo | `p "texto"` |

## Extensions

Customização visual (cores) — ative com `using Extensions.Coloring`:

```ldfw
include #> Extensions;
using Extensions.Coloring;

alert ("Título", "#10b981", "rgba(16,185,129,0.08)", "ri-check-line") {
    "Cor inline com (...)."
}

table config {
    row "name" ("string", "#3b82f6", "rgba(59,130,246,0.1)")
        "\"nome\"" "Descrição.";
}
```

## LDFW SDK (Extensão VS Code / Cursor)

A extensão foi movida para `../ldfw-sdk/` (fora desta pasta) — será a base de uma SDK completa. Veja o README da raiz para a instalação.

## Estrutura

```
ldfw/
├── bin/ldfw.js          # CLI entry
├── compiler/            # Parser, codegen, components, extensions
├── templates/           # runtime.js + style.css
├── std/                 # Standard.ldfw, Extensions.ldfw
├── Makefile             # build / serve / test
└── package.json

../ldfw-sdk/             # Extensão VS Code / Cursor (futura SDK)
```

## Commands

```bash
make build INPUT=main.ldfw OUTPUT=dist    # compilar
make serve                                # compilar docs + servir
make test                                 # validar compilação
make clean                                # limpar dist/ e /tmp
make install                              # npm link global
```

## Licença

MIT
