.PHONY: build build-example build-docs serve dev dev-example dev-docs \
        test test-unit test-build test-bad clean install uninstall reinstall help

.DEFAULT_GOAL := help

BUILD  ?= build
OUTPUT ?= dist
# Projeto usado como smoke-test de compilação (make test-build / build-example).
# Aponta para um arquivo existente no repo; sobrescreva com: make test EXAMPLE=seu.ldfw
EXAMPLE ?= document.ldfw

build: $(BUILD)

# --- Compilar projeto .ldfw -------------------------------
# Uso: make build INPUT=main.ldfw OUTPUT=dist
$(BUILD):
	@node bin/ldfw.js build $(INPUT) -o $(OUTPUT)

build-example:
	@node bin/ldfw.js build $(EXAMPLE) -o $(OUTPUT)
	@echo "✔ Exemplo compilado para $(OUTPUT)/"

build-docs:
	@node bin/ldfw.js build document.ldfw -o dist-docs
	@echo "✔ Documentação compilada para dist-docs/"

# --- Servidor local ---------------------------------------
serve: build-docs
	@echo "→ Servindo em http://localhost:8080"
	@npx -y serve dist-docs -l 8080 --no-clipboard

dev:
	@node bin/ldfw.js dev $(INPUT) -o $(OUTPUT) -p 8080

dev-example:
	@node bin/ldfw.js dev $(EXAMPLE) -o $(OUTPUT) -p 8080

dev-docs:
	@node bin/ldfw.js dev document.ldfw -o dist-docs -p 8080

# --- Testes -----------------------------------------------
test: test-unit test-build test-bad

test-unit:
	@echo "--- Testes unitários ---"
	@node compiler/__tests__/run.js

test-build:
	@echo "--- Compilando exemplo ---"
	@node bin/ldfw.js build $(EXAMPLE) -o /tmp/ldfw-test-example
	@echo "✔ OK — exemplo compila sem erros"

test-bad:
	@echo "--- Testando rejeição de má indentação ---"
	@printf '#> StartFW\ninclude #> Standard;\n\nProject: { title: "X"; }\n\nDocs: {\n    layout #> stnd;\n    section "X" {\n        page P {\n        hero {\n                badge: "erro";\n            }\n        }\n    }\n}\n' > /tmp/ldfw-bad.ldfw
	@echo "--- Compilando (deve falhar) ---"
	@if node bin/ldfw.js build /tmp/ldfw-bad.ldfw -o /tmp/ldfw-bad-out 2>&1; then \
		echo "✖ ERRO: má indentação não foi rejeitada!"; \
		exit 1; \
	else \
		echo "✔ OK — má indentação rejeitada corretamente"; \
	fi

# --- Limpeza ----------------------------------------------
clean:
	rm -rf dist
	rm -rf /tmp/ldfw-*

# --- Instalação do CLI ------------------------------------
install:
	@npm link
	@echo "✔ ldfw instalado globalmente (npm link)"

uninstall:
	@npm unlink -g ldfw 2>/dev/null; echo "✔ ldfw removido"

reinstall: uninstall install

# --- Ajuda ------------------------------------------------
help:
	@echo "LDFW — Makefile"
	@echo ""
	@echo "Compilação:"
	@echo "  make build         INPUT=arq.ldfw OUTPUT=dir   compila um .ldfw"
	@echo "  make build-example                             compila o projeto de exemplo (EXAMPLE)"
	@echo "  make build-docs                                compila a documentação oficial -> dist-docs/"
	@echo ""
	@echo "Desenvolvimento (live reload):"
	@echo "  make dev           INPUT=arq.ldfw OUTPUT=dir   recompila + serve com auto-reload"
	@echo "  make dev-example                               live reload do projeto de exemplo"
	@echo "  make dev-docs                                  live reload da documentação"
	@echo "  make serve                                     compila docs + serve em localhost:8080"
	@echo ""
	@echo "Testes:"
	@echo "  make test                                      unit + build + rejeição de indentação"
	@echo "  make test-unit                                 apenas os testes unitários"
	@echo "  make test-build                                apenas o smoke-test de compilação"
	@echo ""
	@echo "CLI / Limpeza:"
	@echo "  make install                                   npm link (registra o comando ldfw)"
	@echo "  make uninstall                                 npm unlink"
	@echo "  make reinstall                                 uninstall + install"
	@echo "  make clean                                     remove dist/ e /tmp/ldfw-*"
	@echo ""
	@echo "Variáveis: INPUT, OUTPUT, EXAMPLE (ex: make test EXAMPLE=meu.ldfw)"
