# LDFW — Lapo's Documentation Framework

Framework para gerar sites de documentação com visual premium a partir de arquivos `.ldfw`.

## Instalação

```bash
cd ldfw
npm link
```

## Uso

```bash
ldfw build examples/lapo-hub/main.ldfw -o dist
```

Abra `dist/index.html` no navegador (ou sirva com qualquer static server).

## Exemplo `.ldfw`

```ldfw
#> StartFW
include #> Standard;

Project: {
    title: "Meu Projeto";
    subtitle: "Docs";
    version: "v1.0.0";
    status: "Estável";
    github: "https://github.com/user/repo";
}

Docs: {
    layout #> stnd;

    section "Começando" {
        page Inicial {
            route: "home";
            icon: "ri-home-4-line";
            nav: "Início";
            breadcrumb: "Início";

            hero {
                badge: "Novo";
                title: "Meu Projeto";
                desc: "Descrição curta do projeto.";
                btn primary "Começar" -> getting-started;
            }

            h2 "Features";
            grid 2 {
                card "Rápido" icon "ri-flashlight-line" {
                    "Descrição do recurso.";
                }
            }

            code lua {
print("Hello LDFW")
            }

            alert tip "Dica" {
                "Texto com **negrito** suportado.";
            }
        }
    }
}
```

## Componentes MVP

| Componente | Sintaxe |
|---|---|
| Hero | `hero { badge, title, desc, btn }` |
| Grid + Cards | `grid 2 { card "Título" icon "ri-..." { "texto" } }` |
| Code block | `code lua { ... }` |
| Alert | `alert tip\|warning\|danger\|info "Título" { "texto" }` |
| Títulos | `h1`, `h2`, `h3` |
| Parágrafo | `p "texto"` |
| Listas | `ul { "item"; }` / `ol { "item"; }` |
| FAQ | `faq { q "pergunta" { "resposta" } }` |

## Estrutura

```
ldfw/
├── bin/ldfw.js          # CLI
├── compiler/            # Parser + codegen
├── templates/           # runtime.js + style.css base
├── std/Standard.ldfw    # Layout padrão
└── examples/            # Projetos de exemplo
```

## Próximos passos (extensions)

- Simulador interativo
- Tabelas API
- Temas customizados
- Hot reload (`ldfw dev`)
