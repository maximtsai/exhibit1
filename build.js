const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const srcDir = __dirname;
const distDir = path.join(srcDir, 'dist');

// Every local script loaded by index.html, in execution order. This list is the
// single source of truth: it drives the bundle, the <script> tag removal, and the
// consistency check against index.html. There is no pre-combined intermediate —
// the room scripts are compiled straight from source, so a bundle can never be
// out of date with them.
const jsFiles = [
    'sdk-bridge.js',
    'scripts/messageBus.js',
    'scripts/button.js',
    'scripts/hand.js',
    'scripts/exhibit.js',
    'scripts/pointer.js',
    'scripts/guidearrow.js',
    'scripts/roomentrance.js',
    'scripts/roompump.js',
    'scripts/roomfaucet.js',
    'scripts/roomhandy.js',
    'scripts/roomflower.js',
    'scripts/roomstretch.js',
    'scripts/roomjack.js',
    'scripts/roomclown.js',
    'scripts/roomfinal.js',
    'helpermain.js',
    'main.js'
];

// Assets that exist in the repo but nothing loads. Kept on disk, kept out of dist.
const excludedAssets = [
    'sprites/altreality/Untitled-2.jpg',
    'audio/airpumpdeep.mp3',
    'audio/finaldoorslam.mp3',
    'audio/singbg.mp3'
];
const excludedSet = new Set(excludedAssets.map(p => path.normalize(p)));

function fail(msg) {
    console.error(`Error: ${msg}`);
    process.exit(1);
}

/**
 * Empty and recreate contents of a directory without removing the directory itself
 */
function cleanDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
        return;
    }
    console.log(`Cleaning contents of directory: ${dir}`);
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        try {
            fs.rmSync(fullPath, { recursive: true, force: true });
        } catch (err) {
            // Continuing here would mix stale output into an otherwise fresh
            // build, which is far harder to diagnose than a failed build.
            fail(`could not remove ${fullPath}: ${err.message}\n` +
                 `  Something is holding the file open (dev server? editor?).`);
        }
    }
}

/**
 * Copy directory or file recursively, skipping excluded assets
 */
function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(src)) {
        console.warn(`Warning: Source path not found: ${src}`);
        return;
    }
    const rel = path.normalize(path.relative(srcDir, src));
    if (excludedSet.has(rel)) {
        console.log(`  - Skipping unused asset: ${rel}`);
        return;
    }
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        for (const childItemName of fs.readdirSync(src)) {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        }
    } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
    }
}

/**
 * Read index.html's local <script src="..."> tags in document order
 */
function readLocalScriptTags(htmlContent) {
    const re = /<script\s+src="([^"]+\.js)"[^>]*><\/script>/g;
    const found = [];
    let m;
    while ((m = re.exec(htmlContent))) {
        const src = m[1];
        if (src !== 'phaser.min.js' && !/^https?:\/\//.test(src)) {
            found.push(src);
        }
    }
    return found;
}

/**
 * Minify the bundle. Top-level names are deliberately NOT mangled: the files
 * share globals with each other and with index.html, and Phaser's config holds
 * direct references to preload/create/update.
 */
function minify(srcPath, outPath) {
    try {
        execFileSync('uglifyjs', [srcPath, '-o', outPath, '-c', '-m'], {
            stdio: ['ignore', 'ignore', 'pipe'],
            shell: process.platform === 'win32'
        });
    } catch (err) {
        const stderr = err.stderr ? err.stderr.toString().trim() : err.message;
        fail(`minification failed: ${stderr}\n` +
             `  Install it with: npm i -g uglify-js`);
    }
    if (!fs.existsSync(outPath) || fs.statSync(outPath).size === 0) {
        fail('minification produced no output.');
    }
}

function build() {
    console.log('Starting Exhibit of Sorrows production build...');

    // 1. Clean and recreate dist
    cleanDir(distDir);

    // 2. Copy static asset directories and libraries
    console.log('Copying static assets...');
    copyRecursiveSync(path.join(srcDir, 'audio'), path.join(distDir, 'audio'));
    copyRecursiveSync(path.join(srcDir, 'sprites'), path.join(distDir, 'sprites'));

    const phaserSrc = path.join(srcDir, 'phaser.min.js');
    if (!fs.existsSync(phaserSrc)) {
        fail('phaser.min.js not found!');
    }
    console.log('Copying phaser.min.js...');
    fs.copyFileSync(phaserSrc, path.join(distDir, 'phaser.min.js'));

    // 3. Validate script tags in index.html match jsFiles
    const htmlSrc = path.join(srcDir, 'index.html');
    if (!fs.existsSync(htmlSrc)) {
        fail('index.html not found!');
    }
    let htmlContent = fs.readFileSync(htmlSrc, 'utf8');

    const foundScripts = readLocalScriptTags(htmlContent);
    const missingFromBuild = foundScripts.filter(f => !jsFiles.includes(f));
    const missingFromHtml = jsFiles.filter(f => !foundScripts.includes(f));
    const orderMismatch = missingFromBuild.length === 0 && missingFromHtml.length === 0
        && foundScripts.join(',') !== jsFiles.join(',');

    if (missingFromBuild.length || missingFromHtml.length || orderMismatch) {
        console.error('Error: build.js jsFiles is out of sync with index.html\'s local <script> tags.');
        if (missingFromBuild.length) console.error('  In index.html but missing from jsFiles: ' + missingFromBuild.join(', '));
        if (missingFromHtml.length) console.error('  In jsFiles but missing from index.html: ' + missingFromHtml.join(', '));
        if (orderMismatch) console.error('  Order mismatch — index.html: [' + foundScripts.join(', ') + '] vs jsFiles: [' + jsFiles.join(', ') + ']');
        process.exit(1);
    }

    // 4. Combine JS files
    console.log(`Combining ${jsFiles.length} JS files...`);
    let combinedJS = '';
    for (const file of jsFiles) {
        const filePath = path.join(srcDir, file);
        if (!fs.existsSync(filePath)) {
            fail(`required script file not found: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf8');
        combinedJS += `\n// --- START FILE: ${file} ---\n`;
        combinedJS += content;
        combinedJS += '\n';
    }

    // Validate the combined bundle parses before minifying it
    try {
        new vm.Script(combinedJS, { filename: 'dist/game.js' });
    } catch (err) {
        fail(`combined bundle failed to parse: ${err.message}`);
    }

    const rawPath = path.join(distDir, 'game.raw.js');
    const outPath = path.join(distDir, 'game.js');
    fs.writeFileSync(rawPath, combinedJS, 'utf8');

    // 5. Minify
    console.log('Minifying bundle...');
    minify(rawPath, outPath);

    // Re-check the minified output parses before shipping it
    try {
        new vm.Script(fs.readFileSync(outPath, 'utf8'), { filename: 'dist/game.js' });
    } catch (err) {
        fail(`minified bundle failed to parse: ${err.message}`);
    }
    fs.rmSync(rawPath, { force: true });

    const rawSize = Buffer.byteLength(combinedJS);
    const minSize = fs.statSync(outPath).size;
    const saved = (100 * (1 - minSize / rawSize)).toFixed(1);
    console.log(`Created JS bundle: dist/game.js (${minSize} bytes, ${saved}% smaller than ${rawSize} raw)`);

    // 6. Update index.html for dist/ — drop every bundled tag, then point at game.js.
    //    Driven off jsFiles so adding a script cannot leave a stray tag behind,
    //    which would load that file twice (once standalone, once inside game.js).
    console.log('Generating dist/index.html...');
    for (const file of jsFiles) {
        const escaped = file.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
        const before = htmlContent;
        htmlContent = htmlContent.replace(
            new RegExp('\\s*<script\\s+src="' + escaped + '"[^>]*></script>'),
            ''
        );
        if (htmlContent === before) {
            fail(`could not strip the <script> tag for ${file} from index.html.\n` +
                 `  Leaving it in would execute that file twice in dist/.`);
        }
    }

    // Insert the single bundle where main.js used to be (end of <body>)
    htmlContent = htmlContent.replace(
        /(\s*)<\/body>/,
        '$1    <script src="game.js"></script>$1</body>'
    );

    const leftovers = readLocalScriptTags(htmlContent).filter(s => s !== 'game.js');
    if (leftovers.length) {
        fail(`dist/index.html still references un-bundled scripts: ${leftovers.join(', ')}`);
    }

    fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf8');
    console.log('Updated dist/index.html with unified JS script tag.');

    console.log('Build completed successfully!');
}

build();
