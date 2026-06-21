<div align="center">
  <h1>⚡ LDFW</h1>
  <p><strong>Lapo's Documentation Framework</strong></p>
  <p>Compile arquivos <code>.ldfw</code> em sites de documentação premium. Zero dependências runtime.</p>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT">
    <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node >=18">
    <img src="https://img.shields.io/badge/status-est%C3%A1vel-green" alt="Estável">
  </p>
</div>

---

## 🚀 Sobre

LDFW é um compilador que transforma arquivos `.ldfw` em sites completos de documentação. Tudo estático — zero dependências runtime, apenas HTML + CSS + JS puro.

Feito para documentar projetos Roblox, bibliotecas, APIs, frameworks — qualquer coisa que precise de documentação bonita sem complicação.

---

## ✨ Funcionalidades

- **Sem runtime** — site 100% estático
- **Syntax highlighting** via Prism.js (Lua, Python, JS, Bash, etc.)
- **Tema dark/light** nativo com transição suave
- **Busca global** em todas as páginas
- **Navegação lateral** com seções e páginas
- **Responsivo** — desktop, tablet e mobile
- **Componentes prontos:** Hero, Grid, Cards, Code, Alertas, Tabelas, FAQ, Tabs, Listas
- **Extensions:** Badges e Alertas com cores inline via `custom::()`
- **Indentação validada** — erro de indentação é pego na compilação
- **VSCode/Cursor extension** — syntax highlighting, autocomplete, diagnóstico

---

## 📦 Instalação

```bash
git clone https://github.com/LapoLapoNaldo/Lapo-DFW.git
cd Lapo-DFW/ldfw
npm install
npm link

# Criar projeto
ldfw build meu-projeto.ldfw -o ./dist

# Servir
npx serve ./dist -l 8080
```

---

## 📝 Exemplo

```ldfw
#> StartFW
include #> Standard;

Project: {
    title: "Minha Lib";
    subtitle: "Documentação";
    version: "v2.0.0";
}

Docs: {
    layout #> stnd;

    section "Introdução" {
        page Home {
            route: "home";
            icon: "ri-home-4-line";

            hero {
                badge: "v2.0";
                title: "Minha Lib";
                desc: "Documentação oficial.";
                btn primary "Começar" -> guia-rapido;
            }

            h2 "Instalação";

            tabs {
                tab "Lua" {
                    code lua {
local lib = loadstring(game:HttpGet("url"))()
lib:Init({ Title = "App" })
                    }
                }
                tab "JS" {
                    code javascript {
const lib = require("minha-lib");
lib.init({ title: "App" });
                    }
                }
            }

            h2 "Parâmetros";

            table config {
                row "title" custom::("string","#3b82f6","rgba(59,130,246,0.1)")
                    "\"App\"" "Título da janela";
                row "debug" custom::("boolean","#10b981","rgba(16,185,129,0.1)")
                    "false" "Ativar logs";
            }

            alert tip "Dica" {
                "Use custom::() para badges e alertas com cores personalizadas."
            }
        }
    }
}
```

---

## 🧩 Componentes

| Componente | Sintaxe |
|---|---|
| **Hero** | `hero { badge, title, desc, btn }` |
| **Grid** | `grid 2 { card "Título" icon "ri-..." { "texto" } }` |
| **Card avulso** | `card "Título" icon "ri-..." { "texto" }` |
| **Code** | `code linguagem { ... }` |
| **Alert (preset)** | `alert tip \| info \| warning \| danger "Título" { "texto" }` |
| **Alert (custom)** | `alert custom::("Título","#cor","bg","ícone","emoji") { "texto" }` |
| **Alert (shorthand)** | `alert ("Título","#cor","bg","ícone") { "texto" }` |
| **Table config** | `table config { row "param" tipo "default" "desc"; }` |
| **Table genérica** | `table { header "A" "B"; row "a" "b"; }` |
| **Badge custom** | `custom::("texto","#cor","bg")` |
| **Badge shorthand** | `("texto","#cor","bg")` |
| **Tabs** | `tabs { tab "Nome" { ... } }` |
| **FAQ** | `faq { q "pergunta" { "resposta" } }` |
| **Listas** | `ul { "item"; }` / `ol { "item"; }` |
| **Títulos** | `h1`, `h2`, `h3` |
| **Parágrafo** | `p "texto"` |

---

## 🎨 Extensions

Customize alertas e badges com cores inline sem criar presets:

```ldfw
include #> Extensions;
using Extensions.alert;
using Extensions.badge;

alert ("Sucesso!", "#10b981", "rgba(16,185,129,0.08)", "ri-check-line") {
    "Shorthand — não precisa de custom::()."
}

table config {
    row "name" ("string", "#3b82f6", "rgba(59,130,246,0.1)")
        "\"nome\"" "Badge shorthand.";
}
```

---

## 🖥️ Extensão VSCode / Cursor

Syntax highlighting, autocomplete e diagnóstico em tempo real.

```bash
# Cursor
ln -sf $(pwd)/ldfw/vscode ~/.cursor/extensions/ldfw-language-support

# VSCode
ln -sf $(pwd)/ldfw/vscode ~/.vscode/extensions/ldfw-language-support
```

Ou abra `ldfw/vscode/` e pressione `F5`.

---

## 📁 Estrutura

```
Lapo-DFW/
├── ldfw/                    # Compilador
│   ├── bin/ldfw.js          # CLI
│   ├── compiler/            # Parser, codegen, components, extensions
│   ├── templates/           # runtime.js + style.css
│   ├── std/                 # Standard.ldfw, Extensions.ldfw
│   ├── vscode/              # Extensão VSCode/Cursor
│   └── examples/            # Projetos exemplo
├── main.ldfw                # Demo principal
└── README.md
```

---

## 🛠️ Comandos

```bash
ldfw build entrada.ldfw -o ./dist     # compilar
ldfw dev entrada.ldfw -o ./dist -p 8080  # live reload
```

Via `make` dentro de `ldfw/`:

```bash
make build INPUT=main.ldfw OUTPUT=dist
make serve
make test
```

---

## 📄 Licença

MIT © Lapo