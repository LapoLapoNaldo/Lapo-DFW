# LDFW — Lapo's Documentation Framework

Compile `.ldfw` files into premium static documentation sites with zero runtime dependencies.

```ldfw
#> StartFW
include #> Standard;

Project: {
    title: "Meu Projeto";
    subtitle: "Docs";
}

Docs: {
    layout #> stnd;

    section "Começando" {
        page Home {
            route: "home";
            icon: "ri-home-4-line";

            hero {
                badge: "v1.0";
                title: "Meu Projeto";
                desc: "Documentação gerada com LDFW.";
                btn primary "Começar" -> getting-started;
            }

            h2 "Recursos";
            grid 2 {
                card "Rápido" icon "ri-flashlight-line" {
                    "Compila em milissegundos.";
                }
                card "Premium" icon "ri-vip-crown-line" {
                    "Visual moderno e responsivo.";
                }
            }

            tabs {
                tab "Lua" {
                    code lua {
print("Hello LDFW")
                    }
                }
                tab "JavaScript" {
                    code javascript {
console.log("Hello LDFW")
                    }
                }
            }
        }
    }
}
```

## Features

- **No runtime deps** — output é HTML/CSS/JS puro
- **Syntax highlighting** via Prism.js
- **Tema dark/light** nativo
- **Componentes:** Hero, Grid, Cards, Code, Alert, Table, FAQ, Listas, Tabs
- **Extensions:** Badges e Alertas com `custom::()` inline
- **Busca global** no site gerado
- **Navegação lateral** com abas/seções
- **Responsivo** — funciona em desktop e mobile
- **VSCode extension** — syntax highlighting + autocomplete + diagnóstico

## Quick Start

```bash
# Instalar CLI
git clone https://github.com/LapoLapoNaldo/Lapos-DWS-Framework
cd Lapos-DWS-Framework/ldfw
npm install
npm link

# Compilar projeto
ldfw build exemplo.ldfw -o ./dist

# Servir local
npx serve ./dist -l 8080
```

## Estrutura

```
Lapos-DWS-Framework/
├── ldfw/                    # Compilador + templates
│   ├── bin/ldfw.js          # CLI
│   ├── compiler/            # Parser, codegen, components
│   ├── templates/           # HTML, CSS, JS base
│   ├── std/                 # Bibliotecas padrão
│   ├── vscode/              # Extensão VSCode
│   └── examples/            # Projetos exemplo
├── main.ldfw                # Demo principal
└── dist/                    # Demo compilada
```

## Componentes

| Componente | Sintaxe |
|---|---|
| Hero | `hero { badge, title, desc, btn }` |
| Grid + Cards | `grid 2 { card "Título" icon "ri-..." { "texto" } }` |
| Code block | `code lua { ... }` |
| Alert (preset) | `alert tip\|info\|warning\|danger "Título" { "texto" }` |
| Alert (custom) | `alert custom::("Título", "#cor", "rgba(...)", "ri-icon") { "texto" }` |
| Table config | `table config { row "param" custom::("type","#cor","bg") "default" "desc"; }` |
| Table genérica | `table { header "A" "B"; row "a" custom::("type","#cor","bg") "b"; }` |
| Tabs | `tabs { tab "Nome" { ... } }` |
| FAQ | `faq { q "pergunta" { "resposta" } }` |
| Listas | `ul { "item" }` / `ol { "item" }` |
| Headings | `h1`, `h2`, `h3`, `p` |

## Extensions

Use `custom::()` para cores e ícones inline sem criar presets:

```ldfw
include #> Extensions;
using Extensions.alert;

alert ("Título", "#10b981", "rgba(16,185,129,0.08)", "ri-check-line") {
    "Alerta inline com using Extensions.alert.";
}
```

## VSCode Extension

A extensão está em `ldfw/vscode/`. Para instalar localmente:

1. Abra `ldfw/vscode/` no VSCode
2. `F5` — abre uma nova janela com a extensão carregada
3. Ou copie/symlink para `~/.vscode/extensions/` ou `~/.cursor/extensions/`

## Licença

MIT
