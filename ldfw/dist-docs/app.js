const PROJECT = {
    title: "LDFW",
    subtitle: "Lapo's Documentation Framework",
    defaultRoute: "home"
};

const PAGES = {
    "home": {
        category: "Começando",
        title: "O que é LDFW?",
        breadcrumb: "Sobre",
        faq: false,
        content: `
            <div class="hero-section">
                <span class="badge badge-primary">Framework Próprio</span>
                <h1 class="page-title" style="margin-top: 10px;">Lapo&#039;s Documentation Framework</h1>
                <p class="page-description">Uma ferramenta CLI que compila arquivos .ldfw em sites de documentação estáticos com visual premium — dark/light mode, busca, FAQ accordion, copy-code e mais.</p>
                <div class="action-group"><a href="#exemplos" class="btn btn-primary"><i class="ri-rocket-line"></i> Ver Exemplo</a>
                    <a href="https://github.com/LapoLapoNaldo/Lapos-DWS-Framework" class="btn btn-outline" target="_blank"><i class="ri-external-link-line"></i> GitHub</a></div>
            </div>

            <h2>Visão Geral</h2>

            <p>LDFW é um gerador de sites de documentação escrito em Node.js. Você escreve em uma linguagem própria (.ldfw), o compilador transforma em HTML + CSS + JS, e o resultado é um site completo com navegação lateral, busca, tema escuro/claro e vários componentes prontos.</p>

            <h2>O Que Vem Incluso</h2>

            <ul class="list-default">
                <li><strong>Parser</strong> próprio com validação de indentação obrigatória.</li>
                <li><strong>Codegen</strong> que gera HTML semântico, CSS premium e JS SPA.</li>
                <li><strong>Tema dark/light</strong> com transição suave e localStorage.</li>
                <li><strong>Busca global</strong> com snippets do conteúdo.</li>
                <li><strong>Componentes prontos:</strong> hero, cards, alerts, FAQ, code blocks, listas.</li>
                <li><strong>CLI</strong> simples para compilar qualquer .ldfw.</li>
                <li><strong>Extensão VS Code</strong> com syntax highlighting, diagnostics e autocomplete.</li>
            </ul>

            <div class="alert tip">
                <div class="alert-icon"><i class="ri-lightbulb-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Dogfooding</div>
                    <p class="alert-text">Esta documentação foi escrita em .ldfw e compilada com o próprio LDFW. Acredite: funciona.</p>
                </div>
            </div>`
    },
    "instalacao": {
        category: "Começando",
        title: "Instalação e Uso",
        breadcrumb: "Instalação",
        faq: false,
        content: `
            <h1 class="page-title">Instalação e Uso</h1>

            <p>Requisitos: <strong>Node.js &gt;= 18</strong> e npm.</p>

            <h2>Setup</h2>

            <p>Entre na pasta do framework e link o CLI globalmente:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code>cd ldfw
npm link</code></pre>
            </div>

            <p>Agora o comando <code>ldfw</code> está disponível no terminal.</p>

            <h2>Compilar um Projeto</h2>

            <p>Com um arquivo .ldfw pronto, use:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code>ldfw build meu-projeto.ldfw -o ./dist</code></pre>
            </div>

            <p>Abra <code>dist/index.html</code> no navegador. Pronto.</p>

            <h2>Sem npm link</h2>

            <p>Se preferir não instalar globalmente, use o binário diretamente:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code>node ldfw/bin/ldfw.js build entrada.ldfw -o saida</code></pre>
            </div>`
    },
    "primeiros-passos": {
        category: "Começando",
        title: "Primeiros Passos",
        breadcrumb: "Primeiros Passos",
        faq: false,
        content: `
            <h1 class="page-title">Primeiros Passos</h1>

            <p>Vamos criar sua primeira página de documentação.</p>

            <h2>1. Crie o arquivo</h2>

            <p>Crie um arquivo <code>docs.ldfw</code> com o conteúdo mínimo:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>#&gt; StartFW
include #&gt; Standard;

Project: {
    title: "Meu Projeto";
    subtitle: "Documentação";
}

Docs: {
    layout #&gt; stnd;

    section "Introdução" {
        page Home {
            route: "home";
            icon: "ri-home-4-line";
            nav: "Início";
            breadcrumb: "Início";
            title: "Meu Projeto";

            hero {
                badge: "Novo";
                title: "Meu Projeto";
                desc: "Descrição curta do projeto.";
                btn primary "Começar" -&gt; guia-rapido;
            }

            h2 "Bem-vindo";
            p "Esta é minha primeira página gerada com LDFW.";
        }
    }
}</code></pre>
            </div>

            <h2>2. Compile</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code>ldfw build docs.ldfw -o docs</code></pre>
            </div>

            <h2>3. Abra</h2>

            <p>Abra <code>docs/index.html</code> no navegador. Sua documentação está no ar.</p>

            <h2>Próximos Passos</h2>

            <ul class="list-default">
                <li>Adicione mais páginas e seções.</li>
                <li>Explore os componentes: grid, cards, alerts, FAQ.</li>
                <li>Use a indentação correta (4 espaços por nível).</li>
                <li>Ative a extensão VS Code para autocomplete e erros em tempo real.</li>
            </ul>

            <div class="alert info">
                <div class="alert-icon"><i class="ri-information-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Lembrete</div>
                    <p class="alert-text">A indentação é <strong>obrigatória</strong> no LDFW. Conteúdo dentro de blocos deve estar indentado com pelo menos 4 espaços a mais que a abertura. O compilador rejeita arquivos mal indentados.</p>
                </div>
            </div>`
    },
    "estrutura": {
        category: "Linguagem",
        title: "Estrutura do Arquivo .ldfw",
        breadcrumb: "Estrutura",
        faq: false,
        content: `
            <h1 class="page-title">Estrutura do Arquivo .ldfw</h1>

            <p>Todo arquivo .ldfw segue esta estrutura geral:</p>

            <h2>1. Diretiva Inicial</h2>

            <p>O arquivo deve começar com <code>#&gt; StartFW</code>. Esta diretiva indica que o arquivo segue a sintaxe do LDFW.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>#&gt; StartFW</code></pre>
            </div>

            <h2>2. Includes</h2>

            <p>Em seguida, você pode incluir bibliotecas padrão com <code>include</code>:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>include #&gt; Standard;</code></pre>
            </div>

            <p>O include é opcional mas recomendado. A Standard define o layout padrão <code>stnd</code>.</p>

            <h2>3. Bloco Project</h2>

            <p>Define metadados do projeto. Todos os campos são opcionais:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>Project: {
    title: "Nome do Projeto";
    subtitle: "Subtítulo";
    version: "v1.0.0";
    status: "Estável";
    github: "https://github.com/user/repo";
    description: "Meta description para SEO.";
    lang: "pt-BR";
}</code></pre>
            </div>

            <h2>4. Bloco Docs</h2>

            <p>Contém toda a documentação em si. É aqui que as seções e páginas são definidas:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>Docs: {
    layout #&gt; stnd;

    section "Nome da Seção" {
        page NomeDaPagina {
            route: "rota";
            icon: "ri-icon-line";
            nav: "Nome no Menu";
            breadcrumb: "Nome no Breadcrumb";
            title: "Título da Página";
            
        }
    }
}</code></pre>
            </div>`
    },
    "secoes-paginas": {
        category: "Linguagem",
        title: "Seções e Páginas",
        breadcrumb: "Seções e Páginas",
        faq: false,
        content: `
            <h1 class="page-title">Seções e Páginas</h1>

            <p>A documentação é organizada em <strong>seções</strong> que contêm <strong>páginas</strong>.</p>

            <h2>Seções (Section)</h2>

            <p>Seções agrupam páginas relacionadas. Elas aparecem como blocos no menu lateral:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>section "Começando" {
    
}

section "Guias" {
    
}</code></pre>
            </div>

            <p>O nome da seção vira o título do grupo na sidebar.</p>

            <h2>Páginas (Page)</h2>

            <p>Cada página representa uma URL dentro da documentação:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>page NomeInterno {
    route: "url-da-pagina";
    icon: "ri-icon-line";
    nav: "Texto no Menu";
    breadcrumb: "Texto no Breadcrumb";
    title: "Título da Página";
    
}</code></pre>
            </div>

            <h2>Propriedades de Meta</h2>

            <p>Todas as propriedades de meta de uma página:</p>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-link"></i> route</div>
                    <p class="card-description">Define a URL da página (hash). Ex: <code>route: &quot;instalacao&quot;</code> cria <code>#instalacao</code>.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-palette-line"></i> icon</div>
                    <p class="card-description">Ícone RemixIcon exibido no menu lateral. Ex: <code>icon: &quot;ri-home-4-line&quot;</code>.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-menu-line"></i> nav</div>
                    <p class="card-description">Texto exibido no menu de navegação lateral.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-arrow-right-s-line"></i> breadcrumb</div>
                    <p class="card-description">Texto exibido no breadcrumb do topo.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-font-size"></i> title</div>
                    <p class="card-description">Título da página usado no &lt;title&gt; da aba do navegador.</p>
                </div>
            </div>

            <div class="alert tip">
                <div class="alert-icon"><i class="ri-lightbulb-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Rota Automática</div>
                    <p class="alert-text">Se você não definir <code>route</code>, o LDFW gera automaticamente a partir do nome interno da página. Ex: <code>page MinhaPagina</code> vira <code>#minha-pagina</code>.</p>
                </div>
            </div>`
    },
    "indentacao": {
        category: "Linguagem",
        title: "Regras de Indentação",
        breadcrumb: "Indentação",
        faq: false,
        content: `
            <h1 class="page-title">Regras de Indentação</h1>

            <p>Diferente de outras linguagens de template, o LDFW <strong>exige</strong> indentação correta. Isso garante que o código fonte fique organizado e legível.</p>

            <h2>Regra 1: 4 Espaços por Nível</h2>

            <p>Cada nível de aninhamento adiciona <strong>4 espaços</strong>. Use sempre espaços, não tabs.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>Project: {
    title: "OK";    
}

Docs: {
    layout #&gt; stnd; 

    section "X" {   
        page Y {    
            route: "y"; 
            hero {      
                title: "OK"; 
            }
        }
    }
}</code></pre>
            </div>

            <h2>Regra 2: Chaves na Mesma Coluna</h2>

            <p>O <code>}</code> de fechamento deve estar na <strong>mesma coluna</strong> que a linha que abriu o bloco:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>section "Correto" {     
    page OK {           
    }                   
}</code></pre>
            </div>

            <h2>Regra 3: Conteúdo Indentado</h2>

            <p>Todo conteúdo dentro de um bloco deve ter <strong>pelo menos 4 espaços a mais</strong> que a abertura:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>hero {              
    badge: "OK";    
    btn primary "Ver" -&gt; pagina; 
}</code></pre>
            </div>

            <h2>Regra 4: Blocos Vazios</h2>

            <p>Blocos sem conteúdo são permitidos (<code>{ }</code>), mas mantenha a consistência.</p>

            <div class="alert warning">
                <div class="alert-icon"><i class="ri-alert-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Importante</div>
                    <p class="alert-text">O compilador <strong>rejeita</strong> arquivos com indentação incorreta com uma mensagem de erro clara indicando a linha e o esperado. Isso é proposital: força o código a ficar limpo.</p>
                </div>
            </div>

            <h2>Exemplo de Erro</h2>

            <p>Isso NÃO compila:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>hero {
badge: "Erro"; 
}</code></pre>
            </div>

            <p>O compilador mostra: <code>Indentação insuficiente na linha X: 0 espaços, mínimo 4 dentro do bloco</code>.</p>`
    },
    "blocos-texto": {
        category: "Linguagem",
        title: "Títulos, Parágrafos e Formatação",
        breadcrumb: "Blocos de Texto",
        faq: false,
        content: `
            <h1 class="page-title">Títulos, Parágrafos e Formatação</h1>

            <p>O LDFW oferece headings e parágrafos com suporte a formatação inline.</p>

            <h2>Headings</h2>

            <p>Use <code>h1</code>, <code>h2</code> e <code>h3</code> para títulos:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>h1 "Título Principal";
h2 "Subtítulo";
h3 "Seção Menor";</code></pre>
            </div>

            <p>Eles são renderizados como <code>&lt;h1&gt;</code>, <code>&lt;h2&gt;</code> e <code>&lt;h3&gt;</code> com estilos próprios.</p>

            <h2>Parágrafo</h2>

            <p>Use <code>p</code> para parágrafos:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>p "Texto do parágrafo aqui.";</code></pre>
            </div>

            <p>Textos longos podem usar múltiplas strings dentro de chaves:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>p {
    "Primeira linha do parágrafo.";
    "Segunda linha do parágrafo.";
}</code></pre>
            </div>

            <h2>Formatação em Linha</h2>

            <p>Dentro de strings, use <code><strong>texto</strong></code> para <strong>negrito</strong>:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>p "Este é um texto com **negrito** e **mais negrito**.";</code></pre>
            </div>

            <h2>Dica: Strings Longas</h2>

            <p>Para textos longos, prefira usar múltiplas strings em linhas separadas. Fica mais legível e a indentação é validada automaticamente:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>alert tip "Nota" {
    "Este é um texto longo que pode ocupar várias linhas.";
    "Cada linha é uma string separada por ponto e vírgula.";
    "No HTML final, elas são unidas com quebra de linha.";
}</code></pre>
            </div>`
    },
    "componente-hero": {
        category: "Componentes",
        title: "Componente Hero",
        breadcrumb: "Hero",
        faq: false,
        content: `
            <h1 class="page-title">Hero</h1>

            <p>O Hero é o banner principal da página inicial. Combina badge, título, descrição e botões.</p>

            <h2>Sintaxe</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>hero {
    badge: "Novo";
    title: "Título Principal";
    desc: "Descrição curta e impactante.";
    btn primary "Começar" -&gt; pagina-inicial;
    btn outline "GitHub" -&gt; external "https://github.com/...";
}</code></pre>
            </div>

            <h2>Propriedades</h2>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-price-tag-3-line"></i> badge</div>
                    <p class="card-description">Pequeno rótulo colorido acima do título. Opcional.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-font-size-2"></i> title</div>
                    <p class="card-description">Título principal do hero. Opcional.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-file-text-line"></i> desc</div>
                    <p class="card-description">Descrição abaixo do título. Opcional.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-rocket-line"></i> btn</div>
                    <p class="card-description">Botão de ação. Pode ter múltiplos botões. Cada um em uma linha <code>btn ...</code>.</p>
                </div>
            </div>

            <h2>Botões</h2>

            <p>A sintaxe do botão é:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>btn primary|outline "Rótulo" -&gt; destino;</code></pre>
            </div>

            <p>O destino pode ser:</p>

            <ul class="list-default">
                <li><strong>Outra página:</strong> <code>btn primary &quot;Ver Docs&quot; -&gt; instalacao;</code> (usa a route da página)</li>
                <li><strong>Link externo:</strong> <code>btn outline &quot;GitHub&quot; -&gt; external &quot;https://...&quot;;</code></li>
            </ul>

            <h2>Exemplo Completo</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>hero {
    badge: "Framework v1.0";
    title: "Lapo's Documentation Framework";
    desc: "Crie sites de documentação premium compilando .ldfw.";
    btn primary "Documentação" -&gt; estrutura;
    btn outline "Repositório" -&gt; external "https://github.com/...";
}</code></pre>
            </div>`
    },
    "componente-grid": {
        category: "Componentes",
        title: "Grid e Cards",
        breadcrumb: "Grid e Cards",
        faq: false,
        content: `
            <h1 class="page-title">Grid e Cards</h1>

            <p>Use grids para exibir cards lado a lado.</p>

            <h2>Grid</h2>

            <p>O grid define quantas colunas terá. Suporta 2 ou 3 colunas:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>grid 2 {
    card "Título 1" icon "ri-icon-1" {
        "Descrição do card 1.";
    }
    card "Título 2" icon "ri-icon-2" {
        "Descrição do card 2.";
    }
}</code></pre>
            </div>

            <h2>Card</h2>

            <p>Cada card dentro de um grid tem:</p>

            <ul class="list-default">
                <li><strong>Título</strong> (obrigatório) — texto em negrito no topo do card.</li>
                <li><strong>Icon</strong> (opcional) — classe RemixIcon exibida antes do título.</li>
                <li><strong>Conteúdo</strong> (obrigatório) — texto dentro de chaves, com suporte a <strong>negrito</strong>.</li>
            </ul>

            <h2>Card Avulso</h2>

            <p>Cards também podem ser usados fora de grids (ocupam a largura inteira):</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>card "Aviso Importante" icon "ri-alert-line" {
    "Use cards avulsos para destacar informações importantes.";
}</code></pre>
            </div>

            <h2>Exemplo com 3 Colunas</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>grid 3 {
    card "Rápido" icon "ri-flashlight-line" {
        "Compila em milissegundos.";
    }
    card "Premium" icon "ri-vip-crown-line" {
        "Visual moderno e responsivo.";
    }
    card "Simples" icon "ri-code-line" {
        "Sintaxe limpa e indentação validada.";
    }
}</code></pre>
            </div>`
    },
    "componente-tabs": {
        category: "Componentes",
        title: "Componente Tabs",
        breadcrumb: "Tabs",
        faq: false,
        content: `
            <h1 class="page-title">Tabs</h1>

            <p>O componente Tabs organiza conteúdo em abas. Cada <code>tab { }</code> dentro de <code>tabs { }</code> é um painel independente com qualquer componente dentro: texto, código, grid, alertas, etc.</p>

            <h2>Sintaxe</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>tabs {
    tab "Lua" {
        code lua {
print("Hello World")
        }
    }
    tab "Python" {
        code python {
print("Hello World")
        }
    }
    tab "JavaScript" {
        code javascript {
console.log("Hello World")
        }
    }
}</code></pre>
            </div>

            <h2>Exemplo ao Vivo</h2>

            <p>Abaixo, um exemplo funcional com código em diferentes linguagens:</p>

            <div class="tabs-container">
                <div class="tabs-header">
                    <button class="tab-btn active" data-tab="0">Lua</button>
<button class="tab-btn" data-tab="1">Python</button>
<button class="tab-btn" data-tab="2">JavaScript</button>
                </div>
                <div class="tabs-body">
                    <div class="tab-content active" data-tab="0">

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Lua</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-lua"><code>-- Exemplo em Lua
local function greet(name)
    return "Hello, " .. name .. "!"
end
print(greet("LDFW"))</code></pre>
            </div>
            </div>
<div class="tab-content" data-tab="1">

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Python</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-python"><code># Exemplo em Python
def greet(name):
    return f"Hello, {name}!"

print(greet("LDFW"))</code></pre>
            </div>
            </div>
<div class="tab-content" data-tab="2">

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Javascript</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-javascript"><code>function greet(name) {
    return \`Hello, \${name}!\`;
}
console.log(greet("LDFW"));</code></pre>
            </div>
            </div>
                </div>
            </div>

            <h2>Aninhamento</h2>

            <p>Tabs podem conter qualquer componente, incluindo alertas, listas, grids e até outras tabs (nested tabs):</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>tabs {
    tab "Instalação" {
        alert tip "Dica" {
            "Use o comando \`make build\` para compilar."
        }
    }
    tab "Configuração" {
        ul {
            "Defina o layout em Docs.";
            "Adicione seções e páginas.";
        }
    }
}</code></pre>
            </div>

            <h2>Uso com Extensions</h2>

            <p>Tabs funcionam com Extensions normalmente. Basta incluir <code>using Extensions.alert</code> ou <code>using Extensions.badge</code> no início do arquivo:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>tabs {
    tab "Alertas" {
        alert ("Título", "#10b981", "rgba(16,185,129,0.08)", "ri-check-line") {
            "Este alerta usa a sintaxe abreviada do Extensions.";
        }
    }
    tab "Tabela" {
        table config {
            row "parametro" ("string", "#3b82f6", "rgba(59,130,246,0.1)")  "valor"  "Descrição";
        }
    }
}</code></pre>
            </div>`
    },
    "componente-code": {
        category: "Componentes",
        title: "Bloco de Código",
        breadcrumb: "Bloco de Código",
        faq: false,
        content: `
            <h1 class="page-title">Bloco de Código</h1>

            <p>Exiba código com syntax highlighting usando o componente <code>code</code>.</p>

            <h2>Sintaxe</h2>

            <p>Especifique a linguagem após <code>code</code> e o conteúdo dentro de chaves:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>code lua {
print("Hello LDFW!")
local x = 1 + 2
}</code></pre>
            </div>

            <h2>Linguagens Suportadas</h2>

            <p>O highlighting usa Prism.js. Qualquer linguagem suportada pelo Prism funciona. Basta especificar o nome: <code>lua</code>, <code>javascript</code>, <code>python</code>, <code>bash</code>, <code>html</code>, <code>css</code>, etc.</p>

            <h2>Funcionalidades</h2>

            <ul class="list-default">
                <li><strong>Syntax highlighting</strong> automático via Prism.js.</li>
                <li><strong>Botão Copiar</strong> — um clique copia o código para a área de transferência.</li>
                <li><strong>Indentação livre</strong> — o conteúdo dentro de code NÃO segue as regras de indentação do LDFW (é código literal).</li>
            </ul>

            <h2>Exemplo com JavaScript</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Javascript</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-javascript"><code>function greet(name) {
    console.log(\`Hello, \${name}!\`);
}

greet("LDFW");</code></pre>
            </div>

            <div class="alert tip">
                <div class="alert-icon"><i class="ri-lightbulb-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Dica</div>
                    <p class="alert-text">O conteúdo do code block é preservado exatamente como escrito. A indentação dentro dele é livre — as regras do LDFW não se aplicam aí.</p>
                </div>
            </div>`
    },
    "componente-alert": {
        category: "Componentes",
        title: "Alertas",
        breadcrumb: "Alertas",
        faq: false,
        content: `
            <h1 class="page-title">Alertas</h1>

            <p>Alertas são caixas coloridas para destacar informações importantes.</p>

            <h2>Variantes</h2>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-lightbulb-line"></i> tip</div>
                    <p class="card-description">Tom roxo/índigo. Para dicas e sugestões.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-information-line"></i> info</div>
                    <p class="card-description">Tom azul. Para informações gerais.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-alert-line"></i> warning</div>
                    <p class="card-description">Tom amarelo. Para avisos e cuidados.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-error-warning-line"></i> danger</div>
                    <p class="card-description">Tom vermelho. Para erros e perigos.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-information-line"></i> important</div>
                    <p class="card-description">Tom roxo com ícone de info. Para notas técnicas importantes de API.</p>
                </div>
            </div>

            <h2>Sintaxe</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>alert tip "Título do Alerta" {
    "Texto do alerta com suporte a **negrito**.";
}</code></pre>
            </div>

            <h2>Exemplos</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>alert tip "Dica" {
    "Use \`alert tip\` para dicas úteis.";
}

alert info "Informação" {
    "Use \`alert info\` para informações contextuais.";
}

alert warning "Atenção" {
    "Use \`alert warning\` para alertar sobre algo importante.";
}

alert danger "Cuidado" {
    "Use \`alert danger\` para erros ou ações irreversíveis.";
}

alert important "Importante sobre \`:Set\`" {
    "Trocar opções com \`handle:Set({ ... })\` **não** dispara o callback. Atualize a variável manualmente para \`options[1]\`.";
}

alert tip "Múltiplas Linhas" {
    "Alertas também suportam textos longos.";
    "Basta usar múltiplas strings dentro das chaves.";
}</code></pre>
            </div>

            <p>Renderização real dos alertas:</p>

            <div class="alert tip">
                <div class="alert-icon"><i class="ri-lightbulb-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Tip</div>
                    <p class="alert-text">Isso é um alerta do tipo <strong>tip</strong>. Use para dicas.</p>
                </div>
            </div>

            <div class="alert info">
                <div class="alert-icon"><i class="ri-information-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Info</div>
                    <p class="alert-text">Isso é um alerta do tipo <strong>info</strong>. Use para informações.</p>
                </div>
            </div>

            <div class="alert warning">
                <div class="alert-icon"><i class="ri-alert-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Warning</div>
                    <p class="alert-text">Isso é um alerta do tipo <strong>warning</strong>. Use para avisos.</p>
                </div>
            </div>

            <div class="alert danger">
                <div class="alert-icon"><i class="ri-error-warning-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Danger</div>
                    <p class="alert-text">Isso é um alerta do tipo <strong>danger</strong>. Use para perigos.</p>
                </div>
            </div>

            <div class="alert important">
                <div class="alert-icon"><i class="ri-information-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Important</div>
                    <p class="alert-text">Isso é um alerta do tipo <strong>important</strong>. Use para notas técnicas de API com suporte a <code>código</code> inline.</p>
                </div>
            </div>`
    },
    "componente-tabelas": {
        category: "Componentes",
        title: "Tabelas de API",
        breadcrumb: "Tabelas",
        faq: false,
        content: `
            <h1 class="page-title">Tabelas</h1>

            <p>Use tabelas para documentar parâmetros de configuração, métodos e cheat sheets de API.</p>

            <h2>Tabela de Configuração</h2>

            <p>O preset <code>table config</code> gera automaticamente as colunas <strong>Parâmetro | Tipo | Padrão | Descrição</strong>.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>table config {
    row "title"    string  "\"Lapo Hub X\""  "O título do balão de notificação.";
    row "content"  string  "\"\""            "O conteúdo descritivo da mensagem.";
    row "duration" number  "4"               "Tempo de exibição em segundos.";
}</code></pre>
            </div>

            <h2>Argumentos da Configuração</h2>

            <div class="table-wrapper">
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Parâmetro</th>
                            <th>Tipo</th>
                            <th>Padrão</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>title</code></td>
                            <td><span class="type-badge string">string</span></td>
                            <td><code>&quot;Lapo Hub X&quot;</code></td>
                            <td>O título do balão de notificação.</td>
                        </tr>

                        <tr>
                            <td><code>content</code></td>
                            <td><span class="type-badge string">string</span></td>
                            <td><code>&quot;&quot;</code></td>
                            <td>O conteúdo descritivo da mensagem.</td>
                        </tr>

                        <tr>
                            <td><code>duration</code></td>
                            <td><span class="type-badge number">number</span></td>
                            <td><code>4</code></td>
                            <td>Tempo de exibição em segundos.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Tabela Genérica</h2>

            <p>Defina os headers manualmente. Use <code>badge:tipo</code> seguido do rótulo para badges de tipo.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>table {
    header "Função" "Retorno" "O que faz";
    row "\`LapoHub:Notify(config)\`" badge:table self "Balão flutuante. \`config = { title, content, duration }\`.";
}</code></pre>
            </div>

            <h2>Exemplo Genérico</h2>

            <div class="table-wrapper">
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Função</th>
                            <th>Retorno</th>
                            <th>O que faz</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>LapoHub:Notify(config)</code></td>
                            <td><span class="type-badge table">self</span></td>
                            <td>Balão flutuante. <code>config = { title, content, duration }</code>.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Tipos de Badge</h2>

            <p>Tipos reconhecidos: <code>string</code>, <code>number</code>, <code>boolean</code>, <code>function</code>, <code>table</code>, <code>void</code>.</p>

            <div class="alert important">
                <div class="alert-icon"><i class="ri-information-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Inline Markdown</div>
                    <p class="alert-text">Tabelas e alertas suportam <strong>negrito</strong> e <code>código inline</code> nas células de texto e descrições.</p>
                </div>
            </div>`
    },
    "componente-listas": {
        category: "Componentes",
        title: "Listas Ordenadas e Não Ordenadas",
        breadcrumb: "Listas",
        faq: false,
        content: `
            <h1 class="page-title">Listas</h1>

            <p>O LDFW suporta listas ordenadas (<code>ol</code>) e não ordenadas (<code>ul</code>).</p>

            <h2>Lista Não Ordenada (ul)</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>ul {
    "Item 1 com **negrito** suportado.";
    "Item 2 com texto normal.";
    "Item 3 com **destaque**.";
}</code></pre>
            </div>

            <p>Renderiza como:</p>

            <ul class="list-default">
                <li>Item 1 com <strong>negrito</strong> suportado.</li>
                <li>Item 2 com texto normal.</li>
                <li>Item 3 com <strong>destaque</strong>.</li>
            </ul>

            <h2>Lista Ordenada (ol)</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>ol {
    "Primeiro passo.";
    "Segundo passo.";
    "Terceiro passo.";
}</code></pre>
            </div>

            <p>Renderiza como:</p>

            <ol class="list-default">
                <li>Primeiro passo.</li>
                <li>Segundo passo.</li>
                <li>Terceiro passo.</li>
            </ol>

            <h2>Observações</h2>

            <ul class="list-default">
                <li>Cada item é uma string delimitada por ponto e vírgula.</li>
                <li>Suporta <strong>negrito</strong> inline.</li>
                <li>Listas não podem conter sub-listas (por enquanto).</li>
            </ul>`
    },
    "componente-faq": {
        category: "Componentes",
        title: "FAQ (Perguntas Frequentes)",
        breadcrumb: "FAQ",
        faq: true,
        content: `
            <h1 class="page-title">FAQ (Accordion)</h1>

            <p>O componente <code>faq</code> cria um acordeão de perguntas e respostas.</p>

            <h2>Sintaxe</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>faq {
    q "Qual a pergunta?" {
        "Resposta aqui. Com **negrito** se quiser.";
    }
    q "Outra pergunta?" {
        "Outra resposta. Suporta múltiplas linhas.";
        "Segunda linha da resposta.";
    }
}</code></pre>
            </div>

            <h2>Comportamento</h2>

            <ul class="list-default">
                <li>Apenas uma resposta fica aberta por vez (accordion).</li>
                <li>Clique na pergunta para abrir/fechar.</li>
                <li>Animação suave de abertura.</li>
                <li>Ícone de <code>+</code> gira quando ativo.</li>
            </ul>

            <h2>Exemplo Real</h2>

            <div class="faq-list">

                <div class="faq-item">
                    <button class="faq-question">
                        <span>O LDFW funciona sem Node.js?</span>
                        <i class="ri-add-line"></i>
                    </button>
                    <div class="faq-answer">
                        <p>Não. O compilador é escrito em Node.js e requer a runtime instalada.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question">
                        <span>Posso customizar o tema?</span>
                        <i class="ri-add-line"></i>
                    </button>
                    <div class="faq-answer">
                        <p>Sim, editando <code>templates/style.css</code> antes de compilar, ou sobrescrevendo cores via CSS customizado após a compilação.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question">
                        <span>Tem suporte a hot reload?</span>
                        <i class="ri-add-line"></i>
                    </button>
                    <div class="faq-answer">
                        <p>Ainda não, mas está nos planos (comando <code>ldfw dev</code>).</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question">
                        <span>O .ldfw é uma linguagem completa?</span>
                        <i class="ri-add-line"></i>
                    </button>
                    <div class="faq-answer">
                        <p>É uma DSL focada em documentação. Não é Turing-completa — não tem variáveis, loops ou condicionais. É propositalmente simples.</p>
                    </div>
                </div>
            </div>`
    },
    "extensions": {
        category: "Extensions",
        title: "Extensions",
        breadcrumb: "Extensions",
        faq: false,
        content: `
            <h1 class="page-title">Extensions</h1>

            <p>A biblioteca <strong>Extensions</strong> permite customizar cores, ícones e emojis de alertas e badges inline com <code>custom::()</code>. É 100% opcional.</p>

            <h2>Ativando</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>#&gt; StartFW
include #&gt; Standard;
include #&gt; Extensions;</code></pre>
            </div>

            <h2>custom::() — Parâmetros Inline</h2>

            <p>O <code>custom::()</code> é a função principal do Extensions. Ela recebe parâmetros posicionais pra configurar cor, fundo, ícone e emoji:</p>

            <div class="table-wrapper">
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Contexto</th>
                            <th>Parâmetros</th>
                            <th>Exemplo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>alert</code></td>
                            <td><span class="type-badge" style="color: #a855f7">(título, cor, bg, icon, emoji)</span></td>
                            <td>alert custom::(&quot;Título&quot;, &quot;#ff6b6b&quot;, &quot;rgba(...)&quot;, &quot;ri-star-line&quot;) { }</td>
                        </tr>

                        <tr>
                            <td><code>badge</code> (tabela)</td>
                            <td><span class="type-badge" style="color: #3b82f6">(label, cor, bg)</span></td>
                            <td>custom::(&quot;string&quot;, &quot;#3b82f6&quot;, &quot;rgba(...)&quot;)</td>
                        </tr>

                        <tr>
                            <td><code>badge</code> (hero)</td>
                            <td><span class="type-badge" style="color: #f59e0b">(texto, cor, bg)</span></td>
                            <td>badge: custom::(&quot;Guia&quot;, &quot;#f59e0b&quot;, &quot;rgba(...)&quot;);</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Alert com custom::()</h2>

            <p>Use <code>custom::()</code> no lugar do preset pra definir cores inline:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>alert custom::("Custom Alert", "#ff6b6b", "rgba(255, 107, 107, 0.08)", "ri-star-line") {
    "Alerta inline com cor, background e ícone personalizados.";
}

alert custom::("Com Emoji", "#a855f7", "rgba(168, 85, 247, 0.08)", "", "📝") {
    "Alerta inline usando emoji no lugar do ícone.";
}</code></pre>
            </div>

            <p>Parâmetros do <code>alert custom::()</code>:</p>

            <ul class="list-default">
                <li><strong>1º — título:</strong> texto do título do alerta.</li>
                <li><strong>2º — cor:</strong> cor do título e da borda (hex).</li>
                <li><strong>3º — background:</strong> cor de fundo (rgb/rgba/hex).</li>
                <li><strong>4º — ícone:</strong> classe RemixIcon (opcional).</li>
                <li><strong>5º — emoji:</strong> emoji no lugar do ícone (opcional).</li>
            </ul>

            <h2>using Extensions.alert / using Extensions.badge</h2>

            <p>A diretiva <code>using</code> importa o shorthand pra não precisar escrever <code>custom::</code> toda vez:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>using Extensions.alert;
using Extensions.badge;

alert ("Shorthand", "#10b981", "rgba(16, 185, 129, 0.08)", "ri-check-line") {
    "Com \`using Extensions.alert\`, o \`custom::\` fica implícito.";
}</code></pre>
            </div>

            <p>Com <code>using</code>, você usa <code>(...)</code> no lugar de <code>custom::(...)</code>.</p>

            <h2>Badge custom::() em Tabelas</h2>

            <p>O campo de tipo em tabelas aceita <code>custom::()</code> pra customizar a cor do badge:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>table config {
    row "title"    custom::("string", "#3b82f6", "rgba(59, 130, 246, 0.1)")  "\"Meu Projeto\""  "Título exibido no site.";
    row "enabled"  custom::("boolean", "#10b981", "rgba(16, 185, 129, 0.1)") "true"             "Se está ativo.";
}


table config {
    row "count"  ("number", "#f59e0b", "rgba(245, 158, 11, 0.1)") "0"  "Quantidade.";
}</code></pre>
            </div>

            <h2>Hero Badge com custom::()</h2>

            <p>O <code>badge</code> do hero aceita <code>custom::()</code> pra personalizar as cores:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>hero {
    badge: custom::("LDFW", "#7850ff", "rgba(120, 80, 255, 0.15)");
    title: "Meu Projeto";
    desc: "Descrição aqui.";
    btn primary "Começar" -&gt; home;
}</code></pre>
            </div>

            <h2>Presets (Extensions: { })</h2>

            <p>O bloco <code>Extensions:</code> cria presets reutilizáveis:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>Extensions: {
    alert recycle {
        icon: "ri-recycle-line";
        color: "#6366f1";
        background: "rgba(99, 102, 241, 0.08)";
        border: "#6366f1";
    }

    badge lua {
        color: "#e8a838";
        background: "rgba(232, 168, 56, 0.1)";
    }
}</code></pre>
            </div>

            <p>Presets são usados pelo nome:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>alert recycle "Título" {
    "Texto do alerta usando preset.";
}</code></pre>
            </div>

            <h2>Presets Inclusos</h2>

            <p>Ao incluir <code>#&gt; Extensions</code>, estes presets já vêm prontos:</p>

            <div class="table-wrapper">
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Parâmetro</th>
                            <th>Tipo</th>
                            <th>Padrão</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>recycle</code></td>
                            <td><span class="type-badge string">string</span></td>
                            <td><code>\`ri-recycle-line\`</code></td>
                            <td>Anti-duplicação / recarregar scripts.</td>
                        </tr>

                        <tr>
                            <td><code>shield</code></td>
                            <td><span class="type-badge string">string</span></td>
                            <td><code>\`ri-shield-check-line\`</code></td>
                            <td>Segurança e foco liberado.</td>
                        </tr>

                        <tr>
                            <td><code>pulse</code></td>
                            <td><span class="type-badge string">string</span></td>
                            <td><code>\`ri-pulse-line\`</code></td>
                            <td>Avisos de performance / loops.</td>
                        </tr>

                        <tr>
                            <td><code>retro</code></td>
                            <td><span class="type-badge string">string</span></td>
                            <td><code>\`ri-checkbox-circle-line\`</code></td>
                            <td>Compatibilidade / changelog.</td>
                        </tr>

                        <tr>
                            <td><code>devnote</code></td>
                            <td><span class="type-badge string">string</span></td>
                            <td><code>📝 emoji</code></td>
                            <td>Notas com emoji 📝.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>Renderização</h2>

            <div class="alert alert-ext-recycle">
                <div class="alert-icon"><i class="ri-recycle-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Recycle</div>
                    <p class="alert-text">Preset <code>recycle</code> — ícone <code>ri-recycle-line</code>, tom roxo.</p>
                </div>
            </div>

            <div class="alert alert-ext-shield">
                <div class="alert-icon"><i class="ri-shield-check-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Shield</div>
                    <p class="alert-text">Preset <code>shield</code> — ícone <code>ri-shield-check-line</code>.</p>
                </div>
            </div>

            <div class="alert alert-ext-devnote">
                <div class="alert-icon"><span class="alert-emoji">📝</span></div>
                <div class="alert-content">
                    <div class="alert-title">Devnote</div>
                    <p class="alert-text">Preset <code>devnote</code> — emoji 📝 e tom violeta.</p>
                </div>
            </div>

            <h2>Badges Customizados (Presets + Inline)</h2>

            <div class="table-wrapper">
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Parâmetro</th>
                            <th>Tipo</th>
                            <th>Padrão</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>callback</code></td>
                            <td><span class="type-badge function">function</span></td>
                            <td><code>function()end</code></td>
                            <td>Badge built-in (amarelo).</td>
                        </tr>

                        <tr>
                            <td><code>lang</code></td>
                            <td><span class="type-badge type-badge-ext-lua">lua</span></td>
                            <td><code>lua</code></td>
                            <td>Badge via preset <code>lua</code> do Extensions.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>Inline custom::() — independe de preset:</p>

            <div class="table-wrapper">
                <table class="api-table">
                    <thead>
                        <tr>
                            <th>Parâmetro</th>
                            <th>Tipo</th>
                            <th>Padrão</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>timeout</code></td>
                            <td><span class="type-badge" style="color: #f59e0b; background-color: rgba(245, 158, 11, 0.1)">number</span></td>
                            <td><code>4</code></td>
                            <td>Badge inline, cor laranja.</td>
                        </tr>
                    </tbody>
                </table>
            </div>`
    },
    "cli": {
        category: "Ferramentas",
        title: "Linha de Comando",
        breadcrumb: "CLI",
        faq: false,
        content: `
            <h1 class="page-title">CLI — Linha de Comando</h1>

            <p>O LDFW vem com um CLI para compilar arquivos .ldfw.</p>

            <h2>Comandos</h2>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-hammer-line"></i> build</div>
                    <p class="card-description">Compila um arquivo .ldfw em HTML + CSS + JS. Principal e único comando por enquanto.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-question-line"></i> --help</div>
                    <p class="card-description">Exibe a ajuda do CLI com exemplos de uso.</p>
                </div>
            </div>

            <h2>Uso</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code>ldfw build entrada.ldfw -o ./saida</code></pre>
            </div>

            <h2>Flags</h2>

            <ul class="list-default">
                <li><code>-o</code> — Diretório de saída (padrão: <code>dist</code>).</li>
                <li><code>-h</code>, <code>--help</code> — Exibe a ajuda.</li>
            </ul>

            <h2>Exemplos</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code># Compilar com saída padrão (./dist)
ldfw build docs.ldfw

# Compilar com saída customizada
ldfw build docs.ldfw -o ./site

# Ver ajuda
ldfw --help</code></pre>
            </div>

            <h2>Sem Instalação Global</h2>

            <p>Você pode executar diretamente sem npm link:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code>node ldfw/bin/ldfw.js build entrada.ldfw -o saida</code></pre>
            </div>`
    },
    "makefile": {
        category: "Ferramentas",
        title: "Comandos Makefile",
        breadcrumb: "Makefile",
        faq: false,
        content: `
            <h1 class="page-title">Makefile</h1>

            <p>O LDFW inclui um Makefile com comandos úteis para desenvolvimento.</p>

            <h2>Comandos Disponíveis</h2>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-hammer-line"></i> make build</div>
                    <p class="card-description">Compila um .ldfw. Use <code>INPUT=arq.ldfw OUTPUT=dir</code>.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-file-code-line"></i> make build-example</div>
                    <p class="card-description">Compila o exemplo <code>lapo-hub</code> para <code>dist/</code>.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-book-open-line"></i> make build-docs</div>
                    <p class="card-description">Compila a documentação oficial para <code>../docs</code>.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-server-line"></i> make serve</div>
                    <p class="card-description">Compila docs + sobe servidor em localhost:8080.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-check-line"></i> make test</div>
                    <p class="card-description">Valida compilação correta e rejeição de má indentação.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-delete-bin-line"></i> make clean</div>
                    <p class="card-description">Remove <code>dist/</code> e arquivos temporários.</p>
                </div>
            </div>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code># Exemplos
make build-example
make test
make serve</code></pre>
            </div>`
    },
    "vscode": {
        category: "Ferramentas",
        title: "Extensão VS Code",
        breadcrumb: "VS Code",
        faq: false,
        content: `
            <h1 class="page-title">Extensão VS Code para .ldfw</h1>

            <p>O LDFW inclui uma extensão para VS Code (e Cursor) com três funcionalidades principais.</p>

            <h2>Funcionalidades</h2>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-palette-line"></i> Syntax Highlighting</div>
                    <p class="card-description">Destaque de sintaxe para arquivos .ldfw: diretivas, strings, keywords, blocos, comentários, etc.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-error-warning-line"></i> Diagnostics</div>
                    <p class="card-description">Erros do parser aparecem no Problems panel em tempo real. Indentação errada? Mostra na hora.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-lightbulb-line"></i> Autocomplete</div>
                    <p class="card-description">Sugere includes, componentes, propriedades e snippets completos enquanto você digita.</p>
                </div>
            </div>

            <h2>Instalação</h2>

            <p>A extensão fica em <code>ldfw/vscode/</code>. Para ativar:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Bash</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-bash"><code># No Cursor
ln -s "/caminho/para/ldfw/vscode" ~/.cursor/extensions/ldfw-language-support

# No VS Code
ln -s "/caminho/para/ldfw/vscode" ~/.vscode/extensions/ldfw-language-support</code></pre>
            </div>

            <p>Depois reinicie o editor. Qualquer arquivo <code>.ldfw</code> já reconhece automaticamente.</p>

            <h2>O Que Cada Funcionalidade Faz</h2>

            <h3>Syntax Highlighting</h3>

            <p>Define cores diferentes para: diretivas (<code>#&gt; StartFW</code>), strings (<code>&quot;texto&quot;</code>), keywords (<code>include</code>, <code>Project</code>, <code>hero</code>, <code>grid</code>), headings (<code>h1</code>, <code>h2</code>), blocos (<code>{}</code>), setas (<code>-&gt;</code>), comentários (<code>//</code>), e números.</p>

            <h3>Diagnostics</h3>

            <p>Toda vez que você salva ou edita, o parser roda em segundo plano. Se tiver algum erro (indentação, sintaxe, etc.), aparece um sublinhado vermelho na linha e a mensagem no Problems. Erros detectados:</p>

            <ul class="list-default">
                <li>Indentação insuficiente dentro de blocos.</li>
                <li><code>}</code> na coluna errada.</li>
                <li>Strings não fechadas.</li>
                <li>Tokens inválidos.</li>
                <li>Blocos desconhecidos.</li>
            </ul>

            <h3>Autocomplete</h3>

            <p>Ao digitar, o editor sugere:</p>

            <ul class="list-default">
                <li><strong>Palavras-chave</strong>: <code>include</code>, <code>Project</code>, <code>Docs</code>, <code>section</code>, <code>page</code>, etc.</li>
                <li><strong>Componentes</strong>: <code>hero</code>, <code>grid</code>, <code>card</code>, <code>alert</code>, <code>code</code>, <code>faq</code>, <code>ul</code>, <code>ol</code>.</li>
                <li><strong>Propriedades</strong>: <code>route</code>, <code>icon</code>, <code>nav</code>, <code>breadcrumb</code>, <code>badge</code>, <code>title</code>, <code>desc</code>, <code>btn</code>.</li>
                <li><strong>Snippets</strong>: <code>include #&gt; Standard;</code>, <code>Project: { }</code>, <code>Docs: { }</code>, <code>hero { }</code>, etc. com placeholders para preencher.</li>
            </ul>`
    },
    "exemplos": {
        category: "Ferramentas",
        title: "Exemplos Completos",
        breadcrumb: "Exemplos",
        faq: false,
        content: `
            <h1 class="page-title">Exemplos Completos</h1>

            <h2>Estrutura Mínima</h2>

            <p>O menor arquivo .ldfw possível:</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>#&gt; StartFW
include #&gt; Standard;

Project: {
    title: "Mínimo";
}

Docs: {
    layout #&gt; stnd;

    section "Única" {
        page Home {
            route: "home";
            icon: "ri-home-4-line";
            nav: "Home";
            breadcrumb: "Home";

            h1 "Olá";
            p "Esta é a documentação mínima do LDFW.";
        }
    }
}</code></pre>
            </div>

            <h2>Página com Todos os Componentes</h2>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>page Completa {
    route: "completa";
    icon: "ri-star-line";
    nav: "Página Completa";
    breadcrumb: "Completa";
    title: "Todos os Componentes";

    hero {
        badge: "Demonstração";
        title: "Página Completa";
        desc: "Todos os componentes do LDFW em uma página.";
        btn primary "Ver" -&gt; home;
    }

    h2 "Grid de Cards";
    grid 2 {
        card "Card 1" icon "ri-numbers-line" {
            "Primeiro card do grid.";
        }
        card "Card 2" icon "ri-numbers-line" {
            "Segundo card do grid.";
        }
    }

    h2 "Alerta";
    alert info "Informação" {
        "Isso é um alerta de informação.";
    }

    h2 "Código";
    code javascript {
console.log("Hello LDFW!");
    }

    h2 "Lista";
    ul {
        "Item A";
        "Item B";
        "Item C";
    }

    h2 "FAQ";
    faq {
        q "Pergunta 1?" {
            "Resposta 1.";
        }
        q "Pergunta 2?" {
            "Resposta 2.";
        }
    }
}</code></pre>
            </div>`
    },
    "ref-componentes": {
        category: "Referência",
        title: "Referência Rápida de Componentes",
        breadcrumb: "Tabela de Componentes",
        faq: false,
        content: `
            <h1 class="page-title">Referência Rápida</h1>

            <p>Tabela completa de todos os componentes, sua sintaxe e descrição.</p>

            <h2>Componentes de Conteúdo</h2>

            <p><code>hero</code> — Banner principal com badge, título, descrição e botões.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>hero { badge: "badge"; title: "titulo"; desc: "desc"; btn primary "texto" -&gt; alvo; }</code></pre>
            </div>

            <p><code>grid</code> + <code>card</code> — Grid de cards (2 ou 3 colunas).</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>grid 2 { card "Título" icon "ri-icon" { "texto"; } }</code></pre>
            </div>

            <p><code>card</code> — Card avulso (fora de grid, ocupa largura total).</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>card "Título" icon "ri-icon" { "texto"; }</code></pre>
            </div>

            <p><code>code</code> — Bloco de código com syntax highlighting.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>code linguagem { conteudo }</code></pre>
            </div>

            <p><code>alert</code> — Alerta colorido (tip, info, warning, danger, important).</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>alert variante "Título" { "texto"; }</code></pre>
            </div>

            <p><code>table config</code> — Tabela de parâmetros de configuração (Parâmetro, Tipo, Padrão, Descrição).</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>table config { row "param" string "default" "descrição"; }</code></pre>
            </div>

            <p><code>table</code> — Tabela genérica com headers customizados.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>table { header "Col1" "Col2"; row "valor" badge:table self "texto"; }</code></pre>
            </div>

            <p><code>Extensions</code> + <code>using</code> — Alertas/badges customizados (opcional).</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>include #&gt; Extensions;
using -c = recycle;
Extensions: { alert custom { icon: "ri-star-line"; color: "#6366f1"; background: "rgba(99,102,241,0.08)"; border: "#6366f1"; } }
alert -c "Título" { "texto"; }</code></pre>
            </div>

            <p><code>ul</code> / <code>ol</code> — Lista não ordenada / ordenada.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>ul { "item"; "item"; }
ol { "item"; "item"; }</code></pre>
            </div>

            <p><code>faq</code> — Acordeão de perguntas e respostas.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>faq { q "pergunta" { "resposta"; } }</code></pre>
            </div>

            <p><code>h1</code>, <code>h2</code>, <code>h3</code> — Títulos.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>h1 "Título"; h2 "Subtítulo"; h3 "Seção";</code></pre>
            </div>

            <p><code>p</code> — Parágrafo.</p>

            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-language-tag">Ldfw</span>
                    <button class="copy-code-btn"><i class="ri-file-copy-line"></i> Copiar</button>
                </div>
                <pre class="language-ldfw"><code>p "Texto do parágrafo.";</code></pre>
            </div>

            <h2>Propriedades de Meta (Page)</h2>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-link"></i> route</div>
                    <p class="card-description">URL da página (<code>route: &quot;home&quot;</code>).</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-palette-line"></i> icon</div>
                    <p class="card-description">Ícone RemixIcon (<code>icon: &quot;ri-home-line&quot;</code>).</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-menu-line"></i> nav</div>
                    <p class="card-description">Texto no menu lateral.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-arrow-right-s-line"></i> breadcrumb</div>
                    <p class="card-description">Texto no breadcrumb.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-font-size"></i> title</div>
                    <p class="card-description">Título da aba do navegador.</p>
                </div>
            </div>

            <h2>Propriedades de Projeto (Project)</h2>

            <div class="grid-2">

                <div class="card">
                    <div class="card-title"><i class="ri-font-size-2"></i> title</div>
                    <p class="card-description">Nome do projeto. Usado no título do site.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-subscript"></i> subtitle</div>
                    <p class="card-description">Subtítulo exibido no logo da sidebar.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-price-tag-3-line"></i> version</div>
                    <p class="card-description">Versão atual do projeto.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-signal-wifi-line"></i> status</div>
                    <p class="card-description">Status: Estável, Em Desenvolvimento, etc.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-github-fill"></i> github</div>
                    <p class="card-description">URL do repositório GitHub. Adiciona link no header.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-file-text-line"></i> description</div>
                    <p class="card-description">Meta description para SEO.</p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-translate"></i> lang</div>
                    <p class="card-description">Idioma do site (<code>pt-BR</code>, <code>en</code>, etc.).</p>
                </div>
            </div>`
    },
    "dicas": {
        category: "Referência",
        title: "Dicas e Boas Práticas",
        breadcrumb: "Dicas",
        faq: false,
        content: `
            <h1 class="page-title">Dicas e Boas Práticas</h1>

            <h2>Organização de Arquivos</h2>

            <ul class="list-default">
                <li>Mantenha um arquivo .ldfw por projeto.</li>
                <li>Para projetos grandes, considere dividir em múltiplos arquivos (futuro: suporte a <code>include</code> de outros .ldfw).</li>
                <li>Use nomes significativos para páginas e rotas.</li>
            </ul>

            <h2>Escrita de Conteúdo</h2>

            <ul class="list-default">
                <li>Use <code>h2</code> para seções principais dentro da página. Reserve <code>h1</code> para o título principal.</li>
                <li>Prefira textos curtos em cards e alerts. Textos muito longos ficam melhores em parágrafos.</li>
                <li>Use <code><strong>negrito</strong></code> com moderação — apenas para destacar termos importantes.</li>
                <li>Agrupe cards relacionados no mesmo grid. Um grid por grupo de conceito.</li>
            </ul>

            <h2>Indentação</h2>

            <ul class="list-default">
                <li>Configure seu editor para usar 4 espaços (não tabs).</li>
                <li>A extensão VS Code do LDFW mostra erros de indentação em tempo real — use isso a seu favor.</li>
                <li>Mantenha a consistência: se um bloco abriu na coluna 8, feche na coluna 8.</li>
            </ul>

            <h2>Performance</h2>

            <ul class="list-default">
                <li>O site gerado é 100% estático — HTML + CSS + JS puro. Não depende de servidor.</li>
                <li>Os arquivos são pequenos e carregam rápido.</li>
                <li>O Prism.js para highlighting é carregado via CDN. Offline não terá highlighting.</li>
            </ul>

            <h2>Customização</h2>

            <ul class="list-default">
                <li>Edite <code>ldfw/templates/style.css</code> para alterar cores, fontes e estilos globais.</li>
                <li>Edite <code>ldfw/templates/runtime.js</code> para modificar o comportamento da SPA.</li>
                <li>Após compilar, você pode sobrescrever <code>style.css</code> no diretório de saída sem recompilar.</li>
            </ul>

            <div class="alert tip">
                <div class="alert-icon"><i class="ri-lightbulb-line"></i></div>
                <div class="alert-content">
                    <div class="alert-title">Recomendação</div>
                    <p class="alert-text">Se for customizar o template, faça um fork do LDFW ou mantenha suas alterações em um arquivo separado para não perder ao atualizar.</p>
                </div>
            </div>`
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    setupTheme();
    setupRouting();
    setupNavigation();
    setupGlobalSearch();
    setupKeyboardShortcuts();
}

function setupTheme() {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

function setupRouting() {
    window.addEventListener("hashchange", handleRouting);

    if (!window.location.hash) {
        window.location.hash = `#${PROJECT.defaultRoute || "home"}`;
    } else {
        handleRouting();
    }
}

function handleRouting() {
    const rawHash = window.location.hash || `#${PROJECT.defaultRoute || "home"}`;
    const route = rawHash.replace("#", "");
    const pageKey = PAGES[route] ? route : (PROJECT.defaultRoute || "home");
    const page = PAGES[pageKey];
    renderPage(pageKey, page);
}

function renderPage(pageKey, page) {
    const viewport = document.getElementById("contentViewport");

    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "";

    viewport.style.opacity = 0;
    viewport.style.transform = "translateY(8px)";

    setTimeout(() => {
        viewport.innerHTML = page.content;
        updateBreadcrumbs(page.category, page.breadcrumb);
        updateActiveNavLinks(pageKey);

        if (typeof Prism !== "undefined") {
            Prism.highlightAll();
        }

        setupCodeCopyButtons();
        setupTabs();

        if (page.faq) {
            setupFaqAccordion();
        }

        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = "";

        viewport.style.opacity = 1;
        viewport.style.transform = "translateY(0)";
    }, 150);
}

function updateBreadcrumbs(category, activeItem) {
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item">${category}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">${activeItem}</span>
    `;
    document.title = `${PROJECT.title} | ${activeItem}`;
}

function updateActiveNavLinks(pageKey) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        if (link.getAttribute("data-route") === pageKey) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function setupNavigation() {
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    }

    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    }

    menuToggleBtn.addEventListener("click", openSidebar);
    closeSidebarBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

function setupGlobalSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const searchDatabase = [];

    for (const [key, val] of Object.entries(PAGES)) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = val.content;
        const text = tempDiv.textContent || tempDiv.innerText || "";

        searchDatabase.push({
            key,
            title: val.title,
            category: val.category,
            content: text,
            breadcrumb: val.breadcrumb
        });
    }

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query === "") {
            searchResults.classList.remove("active");
            searchResults.innerHTML = "";
            return;
        }

        const matches = searchDatabase.filter((item) => {
            return item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query);
        });

        renderSearchResults(matches, query);
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove("active");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

function renderSearchResults(matches, query) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-result-empty">Nenhum resultado encontrado para "${query}"</div>`;
        searchResults.classList.add("active");
        return;
    }

    matches.slice(0, 5).forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "search-result-item";

        const idx = item.content.toLowerCase().indexOf(query);
        let snippet = "";
        if (idx !== -1) {
            const start = Math.max(0, idx - 20);
            const end = Math.min(item.content.length, idx + query.length + 30);
            snippet = (start > 0 ? "..." : "") + item.content.substring(start, end).trim() + "...";
        } else {
            snippet = item.content.substring(0, 50).trim() + "...";
        }

        itemElement.innerHTML = `
            <span class="search-result-category">${item.category} / ${item.breadcrumb}</span>
            <span class="search-result-title">${item.title}</span>
            <span class="search-result-snippet">${escapeHtml(snippet)}</span>
        `;

        itemElement.addEventListener("click", () => {
            window.location.hash = `#${item.key}`;
            searchResults.classList.remove("active");
            document.getElementById("searchInput").value = "";
        });

        searchResults.appendChild(itemElement);
    });

    searchResults.classList.add("active");
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function setupCodeCopyButtons() {
    document.querySelectorAll(".copy-code-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const container = btn.closest(".code-block-container");
            const codeEl = container.querySelector("pre code");
            const rawText = codeEl.textContent;

            navigator.clipboard.writeText(rawText).then(() => {
                btn.innerHTML = `<i class="ri-check-line" style="color: var(--success)"></i> Copiado!`;
                setTimeout(() => {
                    btn.innerHTML = `<i class="ri-file-copy-line"></i> Copiar`;
                }, 2000);
            }).catch((err) => {
                console.error("Falha ao copiar código: ", err);
            });
        });
    });
}

function setupKeyboardShortcuts() {
    const searchInput = document.getElementById("searchInput");

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && document.activeElement === searchInput) {
            searchInput.value = "";
            searchInput.blur();
            document.getElementById("searchResults").classList.remove("active");
        }
    });
}

function setupTabs() {
    document.querySelectorAll(".tabs-container").forEach(container => {
        const buttons = container.querySelectorAll(".tab-btn");
        const contents = container.querySelectorAll(".tab-content");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const tabIndex = btn.getAttribute("data-tab");
                buttons.forEach(b => b.classList.remove("active"));
                contents.forEach(c => c.classList.remove("active"));
                btn.classList.add("active");
                container.querySelector(`.tab-content[data-tab="${tabIndex}"]`).classList.add("active");
            });
        });
    });
}

function setupFaqAccordion() {
    document.querySelectorAll(".faq-question").forEach((q) => {
        q.addEventListener("click", () => {
            const item = q.closest(".faq-item");
            const isActive = item.classList.contains("active");
            document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("active"));
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}

