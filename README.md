# Lapo DFW

**Lapo's Documentation Framework** — compila arquivos `.ldfw` em sites de documentação premium.

```
#> StartFW
include #> Standard;

Project: {
    title: "Meu Projeto";
}

Docs: {
    layout #> stnd;

    section "Começando" {
        page Home {
            route: "home";
            hero { title: "Bem-vindo"; }
        }
    }
}
```

## Rápido

```bash
cd ldfw
npm link
ldfw build ../main.ldfw -o ../dist
```

Veja `ldfw/README.md` pra documentação completa.
