// Checks that every spritesheet frame has a matching file in raw/ and that the
// raw file looks the same as the packed frame. Needs ImageMagick (`magick`).
//
//   node tools/check-raw-sprites.js [--all]
//
// Sheets may be lossy WebP, so frames are compared by how different they are
// (PSNR, higher = more similar) rather than exactly. Anything under the threshold
// is listed as CHANGED: the art in raw/ no longer matches what the game shows.
// --all prints every frame, not just problems.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const tmpDir = fs.mkdtempSync(path.join(require("os").tmpdir(), "rawcheck-"));
const PSNR_THRESHOLD = 30; // dB; lossy WebP of identical art scores well above this
const showAll = process.argv.includes("--all");

function pngSize(file) {
    const b = fs.readFileSync(file);
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

// PSNR of raw file vs the frame cut out of the sheet, compared over RGBA on black
function psnr(sheet, frame, rawFile) {
    const f = frame.frame;
    const crop = `${f.w}x${f.h}+${f.x}+${f.y}`;
    const off = frame.trimmed && frame.spriteSourceSize ? frame.spriteSourceSize : { x: 0, y: 0 };
    const size = frame.trimmed ? frame.sourceSize : { w: f.w, h: f.h };
    const sheetPng = path.join(tmpDir, "sheet.png");
    const rawPng = path.join(tmpDir, "raw.png");
    execFileSync("magick", [
        "-size", `${size.w}x${size.h}`, "xc:none", "(", sheet, "-crop", crop, "+repage", ")",
        "-geometry", `+${off.x}+${off.y}`, "-composite", "-background", "black", "-alpha", "remove", sheetPng
    ], { cwd: root });
    execFileSync("magick", [rawFile, "-background", "black", "-alpha", "remove", rawPng], { cwd: root });
    // Prints "<dB> (<normalized>)" on stderr, and exits 1 when the images differ at all
    let out;
    try {
        execFileSync("magick", ["compare", "-metric", "PSNR", sheetPng, rawPng, "null:"], { stdio: ["ignore", "ignore", "pipe"] });
        return Infinity;
    } catch (e) {
        out = String(e.stderr).trim();
    }
    const db = parseFloat(out);
    if (isNaN(db)) throw new Error(`compare failed for ${rawFile}: ${out}`);
    return db;
}

const atlasFiles = [];
(function walk(d) {
    for (const f of fs.readdirSync(path.join(root, d))) {
        const p = path.join(d, f);
        if (fs.statSync(path.join(root, p)).isDirectory()) walk(p);
        else if (p.endsWith(".json")) atlasFiles.push(p);
    }
})("sprites");

let problems = 0;
let total = 0;
for (const atlas of atlasFiles) {
    const json = JSON.parse(fs.readFileSync(path.join(root, atlas), "utf8"));
    if (!json.textures) continue;
    const folder = path.basename(path.dirname(atlas));
    for (const tex of json.textures) {
        for (const frame of tex.frames) {
            total++;
            const name = frame.filename.endsWith(".png") ? frame.filename : frame.filename + ".png";
            const rawFile = path.join("raw", folder, name);
            const label = `${folder}/${name}`;
            if (!fs.existsSync(path.join(root, rawFile))) {
                console.log(`MISSING  ${label}`);
                problems++;
                continue;
            }
            const drawn = frame.trimmed ? frame.sourceSize : { w: frame.frame.w, h: frame.frame.h };
            const s = pngSize(path.join(root, rawFile));
            if (s.w !== drawn.w || s.h !== drawn.h) {
                console.log(`SIZE     ${label}  raw ${s.w}x${s.h}, sheet ${drawn.w}x${drawn.h}`);
                problems++;
                continue;
            }
            const p = psnr(tex.image, frame, rawFile);
            if (p < PSNR_THRESHOLD) {
                console.log(`CHANGED  ${label}  PSNR ${p.toFixed(1)} dB`);
                problems++;
            } else if (showAll) {
                console.log(`ok       ${label}  PSNR ${p === Infinity ? "identical" : p.toFixed(1) + " dB"}`);
            }
        }
    }
}
console.log(`\n${total} frames checked, ${problems} problem(s)`);
process.exit(problems ? 1 : 0);
