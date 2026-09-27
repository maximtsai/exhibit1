// Loads a spritesheet either packed (sprites/<folder>/<name>.json + its image pages)
// or, for fast iteration on art, from the individual PNGs in raw/<folder>/.
//
// Raw mode builds a texture with the same key and frame names as the packed
// sheet, so game code can't tell the difference. Frame names still come from the
// sheet's .json, so a brand-new sprite needs an entry there (or a repack) before
// the game can use it; changing an existing sprite, even its size, only needs a
// browser refresh.
//
// Raw mode is on when USE_RAW_SPRITES is true in scripts/config.js, or with
// ?rawsprites in the URL (?norawsprites forces packed sheets). The release build
// does not ship raw/, so turn it off before building.

function useRawSprites() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("rawsprites")) return true;
    if (params.has("norawsprites")) return false;
    return typeof USE_RAW_SPRITES !== "undefined" && USE_RAW_SPRITES;
}

// "sprites/roomjack/roomjack.json" -> "raw/roomjack/"
function rawFolderForAtlas(jsonPath) {
    const parts = jsonPath.split("/");
    return "raw/" + parts[parts.length - 2] + "/";
}

function loadAtlas(scene, key, jsonPath) {
    if (!useRawSprites()) {
        scene.load.multiatlas(key, jsonPath);
        return;
    }
    const jsonKey = "__atlasjson_" + key;
    scene.load.once("filecomplete-json-" + jsonKey, (fileKey, type, data) => {
        const frames = [];
        for (const page of data.textures) {
            for (const frame of page.frames) frames.push(frame.filename);
        }
        const folder = rawFolderForAtlas(jsonPath);
        const imageKeys = frames.map((name) => "__raw_" + key + "/" + name);
        let remaining = frames.length;
        frames.forEach((name, i) => {
            scene.load.once("filecomplete-image-" + imageKeys[i], () => {
                remaining--;
                if (remaining === 0) assembleRawAtlas(scene, key, frames, imageKeys);
            });
            scene.load.image(imageKeys[i], folder + (name.endsWith(".png") ? name : name + ".png"));
        });
    });
    scene.load.json(jsonKey, jsonPath);
}

// One texture, one source image per frame, each frame covering its whole image
function assembleRawAtlas(scene, key, frames, imageKeys) {
    const images = imageKeys.map((k) => scene.textures.get(k).getSourceImage());
    const texture = scene.textures.create(key, images);
    frames.forEach((name, i) => texture.add(name, i, 0, 0, images[i].width, images[i].height));
    imageKeys.forEach((k) => scene.textures.remove(k));
    scene.cache.json.remove("__atlasjson_" + key);
}
