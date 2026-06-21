.PHONY: build build-example build-docs serve clean test test-bad install uninstall reinstall

BUILD  ?= build
OUTPUT ?= dist
EXAMPLE= examples/lapo-hub/main.ldfw

build: $(BUILD)

# --- Compilar projeto .ldfw -------------------------------
# Uso: make build INPUT=main.ldfw OUTPUT=dist
$(BUILD):
	@node bin/ldfw.js build $(INPUT) -o $(OUTPUT)

build-example:
	@node bin/ldfw.js build $(EXAMPLE) -o $(OUTPUT)
	@echo "✔ Exemplo compilado para $(OUTPUT)/"

build-docs:
	@node bin/ldfw.js build $(EXAMPLE) -o ../docs
	@echo "✔ Docs compilado para ../docs/"

# --- Servidor local ---------------------------------------
serve: build-docs
	@echo "→ Servindo em http://localhost:8080"
	@npx -y serve ../docs -l 8080 --no-clipboard

dev:
	@node bin/ldfw.js dev $(INPUT) -o $(OUTPUT) -p 8080

dev-example:
	@node bin/ldfw.js dev $(EXAMPLE) -o $(OUTPUT) -p 8080

dev-docs:
	@node bin/ldfw.js dev $(EXAMPLE) -o ../docs -p 8080

# --- Testes -----------------------------------------------
test: test-good test-bad

test-good:
	@echo "--- Compilando exemplo ---"
	node bin/ldfw.js build $(EXAMPLE) -o /tmp/ldfw-test-example
	@echo "✔ OK — exemplo compila sem erros"

test-bad:
	@echo "--- Criando .ldfw com indentação errada ---"
	@echo '#> StartFW' > /tmp/ldfw-bad.ldfw
	@echo 'include #> Standard;' >> /tmp/ldfw-bad.ldfw
	@echo '' >> /tmp/ldfw-bad.ldfw
	@echo 'Project: {' >> /tmp/ldfw-bad.ldfw
	@echo '    title: "X";' >> /tmp/ldfw-bad.ldfw
	@echo '}' >> /tmp/ldfw-bad.ldfw
	@echo '' >> /tmp/ldfw-bad.ldfw
	@echo 'Docs: {' >> /tmp/ldfw-bad.ldfw
	@echo '    section "X" {' >> /tmp/ldfw-bad.ldfw
	@echo '        page P {' >> /tmp/ldfw-bad.ldfw
	@echo '        hero {' >> /tmp/ldfw-bad.ldfw
	@echo '                badge: "erro";' >> /tmp/ldfw-bad.ldfw
	@echo '            }' >> /tmp/ldfw-bad.ldfw
	@echo '        }' >> /tmp/ldfw-bad.ldfw
	@echo '    }' >> /tmp/ldfw-bad.ldfw
	@echo '}' >> /tmp/ldfw-bad.ldfw
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
	@echo "Uso:"
	@echo "  make build       INPUT=arq.ldfw OUTPUT=dir   compilar .ldfw"
	@echo "  make build-example                             compilar exemplo"
	@echo "  make build-docs                                compilar docs/ oficial"
	@echo "  make serve                                     compilar docs/ + servir local"
	@echo "  make dev         INPUT=arq.ldfw OUTPUT=dir     live reload (recompila + serve)"
	@echo "  make dev-example                               live reload do exemplo"
	@echo "  make dev-docs                                  live reload da documentação"
	@echo "  make test                                      validar compilação"
	@echo "  make clean                                     limpar dist/ e /tmp"
	@echo "  make install                                   npm link (CLI global)"
	@echo "  make uninstall                                 npm unlink"
