<div align="center">
  <h1>⚡ LDFW</h1>
  <p><strong>Lapo's Documentation Framework</strong></p>
  <p>Compile arquivos <code>.ldfw</code> em sites de documentação estáticos com visual premium.</p>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT">
    <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node >=18">
    <img src="https://img.shields.io/badge/status-est%C3%A1vel-green" alt="Estável">
  </p>
</div>

---

## 🚀 Sobre

LDFW é um compilador que transforma arquivos `.ldfw` (uma linguagem de marcação própria) em sites completos de documentação. Zero dependências runtime — o output é HTML + CSS + JS puro.

**Criado para:** projetos Roblox, bibliotecas, APIs, frameworks — qualquer coisa que precise de documentação bonita sem complexidade.

---

## ✨ Features

- **Sem runtime** — site estático 100% HTML/CSS/JS
- **Syntax highlighting** via Prism.js (Lua, Python, JS, Bash, etc.)
- **Tema dark/light** nativo com transição suave
- **Busca global** em todas as páginas
- **Navegação lateral** com seções e páginas organizadas
- **Responsivo** — desktop, tablet e mobile
- **Componentes prontos:** Hero, Grid, Cards, Code Blocks, Alertas, Tabelas, FAQ, Tabs, Listas
- **Extensions:** Badges e Alertas com cores inline via `custom::()`
- **Indentação validada** — erros de indentação são detectados na compilação
- **VSCode/Cursor extension** — syntax highlighting, autocomplete, diagnóstico

---

## 📦 Quick Start

```bash
# Clone e instale
git clone https://github.com/LapoLapoNaldo/Lapo-DFW.git
cd Lapo-DFW/ldfw
npm install
npm link

# Crie seu projeto
ldfw build meu-projeto.ldfw -o ./dist

# Sirva localmente
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
                desc: "Documentação oficial da biblioteca.";
                btn primary "Começar" -> guia-rapido;
                btn outline "GitHub" -> external "https://github.com/user/repo";
            }

            h2 "Instalação";

            tabs {
                tab "Lua" {
                    code lua {
local lib = loadstring(game:HttpGet("url"))()
lib:Init({ Title = "App" })
                    }
                }
                tab "JavaScript" {
                    code javascript {
const lib = require("minha-lib");
lib.init({ title: "App" });
                    }
                }
            }

            h2 "Parâmetros";

            table config {
                row "title"  custom::("string", "#3b82f6", "rgba(59,130,246,0.1)")
                    "\"App\""  "Título da janela";
                row "theme"  custom::("string", "#3b82f6", "rgba(59,130,246,0.1)")
                    "\"dark\"" "Tema dark ou light";
                row "debug"  custom::("boolean", "#10b981", "rgba(16,185,129,0.1)")
                    "false"    "Ativar logs de depuração";
            }

            alert tip "Dica" {
                "Use `custom::()` para badges e alertas com cores personalizadas sem criar presets.";
            }

            faq {
                q "Precisa de Node?" {
                    "Sim, o compilador roda em Node.js >= 18."
                }
                q "Funciona no mobile?" {
                    "O site gerado é responsivo e funciona em qualquer dispositivo."
                }
            }
        }
    }
}
```

Veja o resultado ao vivo: a própria documentação do LDFW é gerada com ele mesmo.

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

O sistema de Extensions permite customizar alertas e badges com cores inline, sem precisar criar presets:

```ldfw
include #> Extensions;
using Extensions.alert;
using Extensions.badge;

alert ("Sucesso!", "#10b981", "rgba(16,185,129,0.08)", "ri-check-line") {
    "Alerta inline com using Extensions.alert — não precisa de custom::()."
}

table config {
    row "name" ("string", "#3b82f6", "rgba(59,130,246,0.1)")
        "\"nome\"" "Badge shorthand com using Extensions.badge.";
}
```

Também é possível criar presets reutilizáveis no bloco `Extensions:`.

---

## 🖥️ VSCode / Cursor Extension

A extensão oferece syntax highlighting, autocomplete e diagnóstico de erros em tempo real.

```bash
# Cursor
ln -sf $(pwd)/ldfw/vscode ~/.cursor/extensions/ldfw-language-support

# VSCode
ln -sf $(pwd)/ldfw/vscode ~/.vscode/extensions/ldfw-language-support
```

Ou abra `ldfw/vscode/` no VSCode e pressione `F5`.

---

## 📁 Estrutura do Projeto

```
Lapo-DFW/
├── ldfw/                    # Compilador
│   ├── bin/ldfw.js          # CLI
│   ├── compiler/            # Parser, codegen, components, extensions
│   ├── templates/           # runtime.js + style.css
│   ├── std/                 # Standard.ldfw, Extensions.ldfw
│   ├── vscode/              # Extensão VSCode/Cursor
│   └── examples/            # Projetos de exemplo
├── main.ldfw                # Demo principal
├── Makefile                 # Atalhos: build, serve, test
└── README.md
```

---

## 🛠️ Comandos

```bash
ldfw build entrada.ldfw -o ./dist    # Compilar
ldfw dev entrada.ldfw -o ./dist -p 8080  # Live reload
```

Ou via `make` dentro de `ldfw/`:

```bash
make build INPUT=main.ldfw OUTPUT=dist
make serve          # Compila docs + serve
make test           # Valida compilação
```

---

## 📄 Licença

MIT © Lapo
