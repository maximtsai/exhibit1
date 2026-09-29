// Compares two folders of debug-capture screenshots with ImageMagick and reports
// which differ. Writes a highlighted diff image for each one that does.
//
//   node tools/compare-snapshots.js [baselineDir] [currentDir] [fuzzPercent]
//
// Defaults: tools/snapshots/baseline vs tools/snapshots/current, fuzz 1%.
// Captures are deterministic, apart from a faint (<= 2/255) shimmer on the pump
// fan whose timing comes from the audio clock; the 1% fuzz ignores that. Pass 0
// for an exact comparison, or more to ignore e.g. art re-encoding.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const baseDir = path.resolve(process.argv[2] || path.join(__dirname, "snapshots", "baseline"));
const curDir = path.resolve(process.argv[3] || path.join(__dirname, "snapshots", "current"));
const fuzz = process.argv[4] || "1";
const diffDir = path.join(curDir, "_diff");

const baseFiles = fs.existsSync(baseDir) ? fs.readdirSync(baseDir).filter((f) => f.endsWith(".png") && !f.startsWith("_")) : [];
const curFiles = new Set(fs.existsSync(curDir) ? fs.readdirSync(curDir).filter((f) => f.endsWith(".png") && !f.startsWith("_")) : []);
if (!baseFiles.length) {
    console.error("No baseline screenshots in " + baseDir);
    process.exit(1);
}

let changed = 0;
let missing = 0;
for (const f of baseFiles) {
    if (!curFiles.has(f)) {
        console.log("MISSING  " + f);
        missing++;
        continue;
    }
    const a = path.join(baseDir, f);
    const b = path.join(curDir, f);
    let pixels;
    try {
        // compare exits with status 1 when the images differ; the metric goes to stderr
        execFileSync("magick", ["compare", "-fuzz", fuzz + "%", "-metric", "AE", a, b, "null:"], { stdio: ["ignore", "ignore", "pipe"] });
        pixels = 0;
    } catch (e) {
        pixels = parseFloat(String(e.stderr));
        if (isNaN(pixels)) {
            console.log("ERROR    " + f + ": " + String(e.stderr).trim());
            changed++;
            continue;
        }
    }
    if (pixels === 0) {
        console.log("same     " + f);
    } else {
        fs.mkdirSync(diffDir, { recursive: true });
        try {
            execFileSync("magick", ["compare", "-fuzz", fuzz + "%", a, b, path.join(diffDir, f)], { stdio: "ignore" });
        } catch (e) { /* compare exits 1 on difference; the image is still written */ }
        console.log("CHANGED  " + f + "  (" + pixels + " pixels)  diff: " + path.join(diffDir, f));
        changed++;
    }
}
for (const f of curFiles) {
    if (!baseFiles.includes(f)) console.log("new      " + f);
}
console.log(`\n${baseFiles.length} compared, ${changed} changed, ${missing} missing`);
process.exit(changed || missing ? 1 : 0);
