// Development server: serves the game with caching disabled, and accepts
// screenshots from the debug tools' capture mode (scripts/debug.js).
//
//   node tools/devserver.js [port] [snapshotDir]
//
// Defaults: port 8125, snapshots in tools/snapshots/current.
// Open http://localhost:8125/index.html?debug&room=2 to test.
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = parseInt(process.argv[2], 10) || 8125;
const snapshotDir = path.resolve(process.argv[3] || path.join(__dirname, "snapshots", "current"));

const TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
    ".mp3": "audio/mpeg",
    ".css": "text/css"
};

function send(res, code, body, type) {
    res.writeHead(code, { "Content-Type": type || "text/plain", "Cache-Control": "no-store" });
    res.end(body);
}

// Body is either a PNG data URL (saved as NAME.png) or JSON (saved as NAME.json,
// the capture's state fingerprint)
function saveSnapshot(req, res, name) {
    // Names come from the page: keep them to a safe filename
    if (!/^[A-Za-z0-9_.-]+$/.test(name)) return send(res, 400, "bad name");
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        fs.mkdirSync(snapshotDir, { recursive: true });
        const m = /^data:image\/png;base64,(.*)$/.exec(body);
        if (m) {
            fs.writeFileSync(path.join(snapshotDir, name + ".png"), Buffer.from(m[1], "base64"));
        } else {
            try {
                JSON.parse(body);
            } catch (e) {
                return send(res, 400, "expected a PNG data URL or JSON");
            }
            fs.writeFileSync(path.join(snapshotDir, name + ".json"), body);
        }
        console.log("snapshot " + name);
        send(res, 200, "ok");
    });
}

http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "POST" && url.pathname.startsWith("/__snapshot/")) {
        return saveSnapshot(req, res, decodeURIComponent(url.pathname.slice("/__snapshot/".length)));
    }
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "method not allowed");

    const filePath = path.resolve(root, "." + decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname));
    if (!filePath.startsWith(root + path.sep)) return send(res, 403, "forbidden");
    fs.readFile(filePath, (err, data) => {
        if (err) return send(res, 404, "not found");
        send(res, 200, req.method === "HEAD" ? undefined : data, TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream");
    });
}).listen(port, () => {
    console.log(`Serving ${root} at http://localhost:${port}/  (snapshots -> ${snapshotDir})`);
});
