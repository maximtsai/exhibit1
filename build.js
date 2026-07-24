const fs = require('fs');
const path = require('path');
const vm = require('vm');

const srcDir = __dirname;
const distDir = path.join(srcDir, 'dist');

// Local scripts loaded by index.html (in order)
const jsFiles = [
    'sdk-bridge.js',
    'scripts/loadup.js',
    'helpermain.js',
    'main.js'
];

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
            console.warn(`Warning: Could not remove ${fullPath}: ${err.message}`);
        }
    }
}

/**
 * Copy directory or file recursively
 */
function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(src)) {
        console.warn(`Warning: Source path not found: ${src}`);
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
 * Warn if any individual room script in scripts/ is newer than scripts/loadup.js
 */
function checkScriptStaleness() {
    const loadupPath = path.join(srcDir, 'scripts', 'loadup.js');
    if (!fs.existsSync(loadupPath)) return;
    const loadupMtime = fs.statSync(loadupPath).mtimeMs;
    const scriptsDir = path.join(srcDir, 'scripts');
    const entries = fs.readdirSync(scriptsDir);
    const newerFiles = [];
    for (const file of entries) {
        if (file === 'loadup.js' || file === 'combine_m.sh' || !file.endsWith('.js')) continue;
        const filePath = path.join(scriptsDir, file);
        const fileMtime = fs.statSync(filePath).mtimeMs;
        if (fileMtime > loadupMtime) {
            newerFiles.push(file);
        }
    }
    if (newerFiles.length > 0) {
        console.warn(`Warning: The following script files in scripts/ are newer than scripts/loadup.js:`);
        console.warn(`  ${newerFiles.join(', ')}`);
        console.warn(`  Remember to update scripts/loadup.js if you made changes to individual room scripts.`);
    }
}

function build() {
    console.log('Starting Exhibit of Sorrows production build...');

    // 1. Check if individual room scripts are newer than loadup.js
    checkScriptStaleness();

    // 2. Clean and recreate dist
    cleanDir(distDir);

    // 3. Copy static asset directories and libraries
    console.log('Copying static assets...');
    copyRecursiveSync(path.join(srcDir, 'audio'), path.join(distDir, 'audio'));
    copyRecursiveSync(path.join(srcDir, 'sprites'), path.join(distDir, 'sprites'));

    const phaserSrc = path.join(srcDir, 'phaser.min.js');
    if (fs.existsSync(phaserSrc)) {
        console.log('Copying phaser.min.js...');
        fs.copyFileSync(phaserSrc, path.join(distDir, 'phaser.min.js'));
    } else {
        console.warn('Warning: phaser.min.js not found!');
    }

    // 4. Validate script tags in index.html match jsFiles
    const htmlSrc = path.join(srcDir, 'index.html');
    if (!fs.existsSync(htmlSrc)) {
        console.error('Error: index.html not found!');
        process.exit(1);
    }
    let htmlContent = fs.readFileSync(htmlSrc, 'utf8');

    const localScriptRe = /<script\s+src="([^"]+\.js)"[^>]*><\/script>/g;
    const foundScripts = [];
    let sm;
    while ((sm = localScriptRe.exec(htmlContent))) {
        const src = sm[1];
        if (src !== 'phaser.min.js' && !src.startsWith('http://') && !src.startsWith('https://')) {
            foundScripts.push(src);
        }
    }

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

    // 5. Combine JS files into dist/game.js
    console.log('Combining JS files...');
    let combinedJS = '';
    for (const file of jsFiles) {
        const filePath = path.join(srcDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`  - Adding ${file}`);
            const content = fs.readFileSync(filePath, 'utf8');
            combinedJS += `\n// --- START FILE: ${file} ---\n`;
            combinedJS += content;
            combinedJS += '\n';
        } else {
            console.error(`Error: Required script file not found: ${filePath}`);
            process.exit(1);
        }
    }

    // Validate the combined bundle parses before writing it
    try {
        new vm.Script(combinedJS, { filename: 'dist/game.js' });
    } catch (err) {
        console.error(`Error: combined bundle failed to parse: ${err.message}`);
        process.exit(1);
    }

    fs.writeFileSync(path.join(distDir, 'game.js'), combinedJS, 'utf8');
    console.log(`Created JS bundle: dist/game.js (${Buffer.byteLength(combinedJS)} bytes)`);

    // 6. Update index.html for dist/
    console.log('Generating dist/index.html...');
    // Remove local script tags from head that are bundled in game.js
    htmlContent = htmlContent.replace(/\s*<script\s+src="sdk-bridge\.js"[^>]*><\/script>/, '');
    htmlContent = htmlContent.replace(/\s*<script\s+src="scripts\/loadup\.js"[^>]*><\/script>/, '');
    htmlContent = htmlContent.replace(/\s*<script\s+src="helpermain\.js"[^>]*><\/script>/, '');

    // Replace main.js in body with game.js
    htmlContent = htmlContent.replace(
        /<script\s+src="main\.js"[^>]*><\/script>/,
        '<script src="game.js"></script>'
    );

    const htmlDest = path.join(distDir, 'index.html');
    fs.writeFileSync(htmlDest, htmlContent, 'utf8');
    console.log('Updated dist/index.html with unified JS script tag.');

    console.log('Build completed successfully!');
}

build();
