"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const mimes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
};

function serveFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
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
    const clients = [];

    function notifyClients() {
        clients.forEach(res => {
            try {
                res.write("event: reload\ndata: {}\n\n");
                res.end();
            } catch (_) {}
        });
        clients.length = 0;
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
            clients.push(res);
            req.on("close", () => {
                const idx = clients.indexOf(res);
                if (idx !== -1) clients.splice(idx, 1);
            });
            return;
        }

        let filePath = path.join(outputDir, req.url === "/" ? "index.html" : req.url);

        if (path.extname(filePath) === ".html") {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("Not found");
                    return;
                }
                const injected = injectReloadScript(data, port);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(injected);
            });
            return;
        }

        serveFile(res, filePath);
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
    let lastContent = fs.readFileSync(srcFile, "utf8");

    fs.watch(srcFile, (eventType) => {
        if (eventType !== "change") return;
        const currentContent = fs.readFileSync(srcFile, "utf8");
        if (currentContent === lastContent) return;
        lastContent = currentContent;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log("  ↻ Alteração detectada, recompilando...");
            const r = doBuild();
            if (r) {
                console.log(`  ✔ Recompilado: ${r.pages} páginas`);
                notify();
            }
        }, 500);
    });

    console.log("");
    console.log("  Aguardando alterações... (Ctrl+C para parar)");
}

module.exports = { dev };
