"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const mimes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
};

function serveFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not found");
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": mimes[ext] || "application/octet-stream" });
        res.end(data);
    });
}

function injectReloadScript(html, port) {
    const script = `<script>
(function(){
  var es = new EventSource("http://localhost:${port}/__ldfw_reload");
  es.addEventListener("reload", function(){ location.reload(); });
})();
<\/script>`;
    return html.replace("</body>", script + "</body>");
}

function startDevServer(outputDir, port, onReload) {
    const clients = new Set();

    function notifyClients() {
        for (const res of clients) {
            try {
                res.write("event: reload\ndata: {}\n\n");
                res.end();
            } catch (_) {}
        }
        clients.clear();
    }

    const server = http.createServer((req, res) => {
        if (req.url === "/__ldfw_reload") {
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
            });
            res.write("data: connected\n\n");
            clients.add(res);
            req.on("close", () => {
                clients.delete(res);
            });
            req.on("error", () => {
                clients.delete(res);
            });
            return;
        }

        // Decodifica a URL e remove a query string antes de resolver o caminho.
        let urlPath;
        try {
            urlPath = decodeURIComponent(req.url.split("?")[0]);
        } catch (_) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Bad Request");
            return;
        }

        const requestedPath = urlPath === "/" ? "index.html" : urlPath;
        const filePath = path.join(outputDir, requestedPath);

        // Security: previne path traversal. O caminho relativo entre outputDir e
        // o arquivo pedido não pode "subir" (`..`) nem ser absoluto — isso bloqueia
        // tanto `../` quanto diretórios irmãos com prefixo comum (/tmp/out vs /tmp/out2).
        const relative = path.relative(outputDir, filePath);
        if (relative.startsWith("..") || path.isAbsolute(relative)) {
            res.writeHead(403, { "Content-Type": "text/plain" });
            res.end("Forbidden");
            return;
        }

        if (path.extname(filePath) === ".html") {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("Not found");
                    return;
                }
                const injected = injectReloadScript(data, port);
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(injected);
            });
            return;
        }

        serveFile(res, filePath);
    });

    // Handle port-in-use errors gracefully
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`  ✖ Porta ${port} já está em uso. Use -p para escolher outra.`);
        } else {
            console.error(`  ✖ Erro ao iniciar servidor: ${err.message}`);
        }
        process.exit(1);
    });

    server.listen(port, () => {
        console.log(`  Servidor: http://localhost:${port}`);
    });

    return notifyClients;
}

function dev(inputPath, outputDir, options) {
    const port = options.port || 8080;
    const build = require("./index").build;

    let building = false;

    function doBuild() {
        if (building) return null;
        building = true;
        try {
            const result = build(inputPath, outputDir);
            return result;
        } catch (e) {
            console.error("  ✖", e.message);
            return null;
        } finally {
            building = false;
        }
    }

    console.log("LDFW Dev Server");
    console.log("  Entrada:", inputPath);
    console.log("  Saída:  ", outputDir);
    console.log("");

    const result = doBuild();
    if (result) {
        console.log(`  ✔ Build: ${result.pages} páginas`);
    }

    const notify = startDevServer(outputDir, port);

    const srcFile = path.resolve(inputPath);
    let timeout = null;
    let lastMtime = 0;

    try {
        lastMtime = fs.statSync(srcFile).mtimeMs;
    } catch (_) {}

    fs.watch(srcFile, (eventType) => {
        if (eventType !== "change") return;

        // Debounce: wait 300ms after last change to avoid duplicate triggers
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            let currentMtime;
            try {
                currentMtime = fs.statSync(srcFile).mtimeMs;
            } catch (_) { return; }
            if (currentMtime === lastMtime) return;
            lastMtime = currentMtime;

            console.log("  ↻ Alteração detectada, recompilando...");
            const r = doBuild();
            if (r) {
                console.log(`  ✔ Recompilado: ${r.pages} páginas`);
                notify();
            }
        }, 300);
    });

    console.log("");
    console.log("  Aguardando alterações... (Ctrl+C para parar)");
}

module.exports = { dev };
