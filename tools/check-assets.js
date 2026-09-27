// Checks that every asset the game refers to actually exists, so a typo or a
// renamed file fails the build instead of failing for players.
//
//   node tools/check-assets.js
//
// Checks:
//  - every path in scripts/config.js exists, with exact letter case (Windows
//    ignores case, most web servers don't)
//  - every sprite sheet folder exists and has PNGs; raw/ folders no sheet uses
//  - sprite frames, image keys and sound keys written as plain strings in the
//    code exist. Names built at runtime ("click" + n) can't be checked and are
//    skipped.
// build.js runs this and stops on errors.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");

function loadGlobals() {
    const ctx = {};
    const src = ["scripts/config.js", "scripts/spritemanifest.js"]
        .map((f) => fs.readFileSync(path.join(root, f), "utf8"))
        .join("\n");
    vm.runInNewContext(src + `
        this.cfg = { PRELOAD_IMAGES, IMAGES, DEFERRED_IMAGES, AUDIO, DEFERRED_AUDIO,
                     SPRITE_SHEETS, DEFERRED_SPRITE_SHEETS, SPRITE_MANIFEST };`, ctx);
    return ctx.cfg;
}

// fs.existsSync is case-insensitive on Windows; walk the path comparing names exactly
function existsExactCase(rel) {
    let dir = root;
    for (const part of rel.split("/")) {
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return false;
        if (!fs.readdirSync(dir).includes(part)) return false;
        dir = path.join(dir, part);
    }
    return true;
}

// Game code the check scans. config/manifest are data; debug.js is dev-only.
function codeFiles() {
    const files = ["main.js", "helpermain.js"];
    for (const f of fs.readdirSync(path.join(root, "scripts"))) {
        if (f.endsWith(".js") && !["config.js", "spritemanifest.js", "debug.js"].includes(f)) files.push("scripts/" + f);
    }
    return files;
}

function lineOf(src, index) {
    return src.slice(0, index).split("\n").length;
}

function check() {
    const cfg = loadGlobals();
    const errors = [];
    const warnings = [];

    // ---- files named in config.js ----
    const imageKeys = new Set();
    for (const group of ["PRELOAD_IMAGES", "IMAGES", "DEFERRED_IMAGES"]) {
        for (const [key, p] of Object.entries(cfg[group])) {
            imageKeys.add(key);
            if (!existsExactCase(p)) errors.push(`config.js ${group}.${key}: file not found (check spelling and letter case): ${p}`);
        }
    }
    const soundKeys = new Set();
    for (const group of ["AUDIO", "DEFERRED_AUDIO"]) {
        for (const [key, p] of Object.entries(cfg[group])) {
            soundKeys.add(key);
            if (!existsExactCase(p)) errors.push(`config.js ${group}.${key}: file not found (check spelling and letter case): ${p}`);
        }
    }

    // ---- sprite sheet folders ----
    const sheets = Object.assign({}, cfg.SPRITE_SHEETS, cfg.DEFERRED_SPRITE_SHEETS);
    const sheetFrames = {};
    const usedFolders = new Set();
    for (const [key, folder] of Object.entries(sheets)) {
        usedFolders.add(folder);
        if (!existsExactCase(folder)) {
            errors.push(`config.js sprite sheet ${key}: folder not found: ${folder}`);
            continue;
        }
        const frames = fs.readdirSync(path.join(root, folder)).filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4));
        if (frames.length === 0) errors.push(`sprite sheet ${key}: no PNGs in ${folder}`);
        sheetFrames[key] = new Set(frames);
        const listed = cfg.SPRITE_MANIFEST[folder] || [];
        if (listed.join("|") !== frames.slice().sort().join("|")) {
            warnings.push(`scripts/spritemanifest.js is out of date for ${folder} (run node tools/sprite-manifest.js)`);
        }
    }
    for (const d of fs.readdirSync(path.join(root, "raw"), { withFileTypes: true })) {
        if (d.isDirectory() && d.name !== "standalone" && !usedFolders.has("raw/" + d.name)) {
            warnings.push(`raw/${d.name}/ is not used by any sprite sheet in config.js`);
        }
    }
    const anyFrame = (name) => Object.values(sheetFrames).some((s) => s.has(name));

    // ---- names used in code ----
    for (const file of codeFiles()) {
        const src = fs.readFileSync(path.join(root, file), "utf8");
        const at = (i) => `${file}:${lineOf(src, i)}`;

        // "sheetKey", "frame" as consecutive arguments, e.g. add.image(x, y, "roomJack", "doll")
        for (const m of src.matchAll(/["']([A-Za-z0-9_]+)["']\s*,\s*["']([^"'\n]+)["']\s*[,)]/g)) {
            const [, key, frame] = m;
            if (sheetFrames[key] && !sheetFrames[key].has(frame)) {
                errors.push(`${at(m.index)}: sprite sheet "${key}" has no frame "${frame}" (no ${sheets[key]}/${frame}.png)`);
            }
        }
        // Button configs: { atlas: "sheet", ref: "frame" }, in either order
        for (const m of src.matchAll(/\{[^{}]*\}/g)) {
            const body = m[0];
            const atlas = /["']?atlas["']?\s*:\s*["']([^"']+)["']/.exec(body);
            const ref = /["']?ref["']?\s*:\s*["']([^"']+)["']/.exec(body);
            if (atlas && ref && sheetFrames[atlas[1]] && !sheetFrames[atlas[1]].has(ref[1])) {
                errors.push(`${at(m.index)}: sprite sheet "${atlas[1]}" has no frame "${ref[1]}"`);
            } else if (atlas && !sheetFrames[atlas[1]] && !imageKeys.has(atlas[1])) {
                errors.push(`${at(m.index)}: unknown sprite sheet "${atlas[1]}"`);
            } else if (!atlas && ref && !anyFrame(ref[1]) && !imageKeys.has(ref[1])) {
                errors.push(`${at(m.index)}: no sprite sheet frame or image named "${ref[1]}"`);
            }
        }
        // Frame swaps on buttons and sprites
        for (const m of src.matchAll(/\.(setNormalRef|setHoverRef|setPressRef|setDisableRef|setAllRef|setFrame)\(\s*["']([^"']+)["']\s*\)/g)) {
            if (!anyFrame(m[2])) errors.push(`${at(m.index)}: ${m[1]}("${m[2]}"): no sprite sheet has a frame "${m[2]}"`);
        }
        // Single-image keys: add.image(x, y, "key") with no frame. When the argument
        // before it is a string too, this is the frame of a sheet (checked above).
        for (const m of src.matchAll(/\.(?:add|make)\.(?:image|sprite)\(([^()]*?),\s*["']([A-Za-z0-9_]+)["']\s*\)/g)) {
            if (/["']\s*$/.test(m[1])) continue;
            const key = m[2];
            if (!imageKeys.has(key) && !sheetFrames[key]) errors.push(`${at(m.index)}: unknown image "${key}"`);
        }
        // Sounds
        for (const m of src.matchAll(/\b(playSound|playSoundOnce|tweenVolume)\(\s*["']([A-Za-z0-9_]+)["']\s*(?:,\s*(\d+)\s*)?[,)]/g)) {
            const [, fn, key, count] = m;
            // playSound("click", 4) plays one of click1..click4
            const keys = fn === "playSound" && count ? Array.from({ length: +count }, (_, i) => key + (i + 1)) : [key];
            for (const k of keys) {
                if (!soundKeys.has(k)) errors.push(`${at(m.index)}: ${fn}: no sound "${k}" in config.js AUDIO/DEFERRED_AUDIO`);
            }
        }
        for (const m of src.matchAll(/gameObjects\.sounds(?:\.([A-Za-z_][A-Za-z0-9_]*)|\[\s*["']([A-Za-z0-9_]+)["']\s*\])/g)) {
            const key = m[1] || m[2];
            if (key && !soundKeys.has(key)) errors.push(`${at(m.index)}: gameObjects.sounds.${key}: no such sound in config.js`);
        }
    }
    return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

module.exports = { check };

if (require.main === module) {
    const { errors, warnings } = check();
    for (const w of warnings) console.log("warning: " + w);
    for (const e of errors) console.log("ERROR:   " + e);
    console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
    process.exit(errors.length ? 1 : 0);
}
