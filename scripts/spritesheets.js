// Loads a sprite sheet from a folder of individual PNGs in raw/.
//
// Each sheet is one texture (e.g. "roomJack") whose frames are the PNGs in its
// folder, named after the file without ".png". The frame list comes from
// scripts/spritemanifest.js, generated from raw/ (see tools/sprite-manifest.js).
//
// To change a sprite, edit its PNG (any size) and refresh. To add one, drop the
// PNG into the folder; the dev server and the build pick it up automatically.

function loadSpriteSheet(scene, key, folder) {
    // Textures outlive a scene restart (replay), and sprites may already be using
    // this one, so keep it rather than rebuilding it
    if (scene.textures.exists(key)) return;
    const frames = SPRITE_MANIFEST[folder];
    if (!frames || frames.length === 0) {
        console.error("loadSpriteSheet: no PNGs listed for " + folder + " (" + key + ")");
        return;
    }
    const imageKeys = frames.map((name) => "__sprite_" + key + "/" + name);
    let remaining = frames.length;
    frames.forEach((name, i) => {
        scene.load.once("filecomplete-image-" + imageKeys[i], () => {
            remaining--;
            if (remaining === 0) assembleSpriteSheet(scene, key, frames, imageKeys);
        });
        scene.load.image(imageKeys[i], folder + "/" + name + ".png");
    });
}

// One texture with one source image per frame, each frame covering its whole image
function assembleSpriteSheet(scene, key, frames, imageKeys) {
    const images = imageKeys.map((k) => scene.textures.get(k).getSourceImage());
    const texture = scene.textures.create(key, images);
    frames.forEach((name, i) => texture.add(name, i, 0, 0, images[i].width, images[i].height));
    imageKeys.forEach((k) => scene.textures.remove(k));
}
