function testMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

let isMobile = testMobile();

var currentResize;
if (window.GameSDK && typeof window.GameSDK.init === 'function') window.GameSDK.init();

let pixelWidth = 1210;
let pixelHeight = 920;
let config = {
    type: Phaser.AUTO,
    scale: {
        // No parent: there is no #phaser-app element, so Phaser was silently
        // falling back to document.body anyway. The canvas is centred by the
        // `canvas { position: absolute; ... }` rule in index.html.
        mode: Phaser.Scale.FIT,
        width: 1210,
        height: 920
    },
    antialias: !0,
    transparent: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
},
    globalScene,
    gameVars = {
        baseSway: .025,
        gameStarted: !1,
        gameConstructed: !1,
        mousedown: !1,
        mouseposx: 0,
        mouseposy: 0,
        prevMouseposx: 0,
        prevMouseposy: 0,
        mouseaccx: 0,
        mouseaccy: 0,
        lastmousedown: {
            x: 0,
            y: 0
        },
        width: 1220,
        halfWidth: 610,
        height: 920,
        halfHeight: 460,
        horrorPoint: !1,
        darkPoint: !1,
        isFrozen: !1,
        lastLoadingWelcomeRef: null,
        walkSlow: !1,
        initialExtraDark: 0,
        masterAudio: 1,
        soundMult: 1,
        smallWindow: !1
    },
    oneTimeScares = {},
    gameObjectsTemp = {},
    gameVarsTemp = {
        darkFlickerCountdown: 1e3,
        loadAmt: 0.001
    },
    gameObjects = {
        buttonList: [],
        draggedObj: null,
        loadingWelcomes: [],
        noteList: [],
        starPressSequence: []
    },
    updateFuncList = [],
    phaserGame, selfMe;

let game;
setTimeout(() => { game = new Phaser.Game(config) }, 20)

let earlyAudio = [
    ["loadingMusic", "audio/loadingmusic.mp3"],
    ["click1", "audio/click1.mp3"],
    ["click2", "audio/click2.mp3"],
    ["click3", "audio/click3.mp3"],
    ["click4", "audio/click4.mp3"],
    ["airpump", "audio/airpump.mp3"],
    ["keyfound", "audio/keyfound.mp3"],
    ["keyget", "audio/keyget.mp3"],
    ["fan1", "audio/fan1.mp3"],
    ["fan2", "audio/fan2.mp3"],
    ["gladiator0", "audio/gladiator0.mp3"],
    ["gladiator1", "audio/gladiator1.mp3"],
    ["gladiator2", "audio/gladiator2.mp3"],
    ["gladiatorx", "audio/gladiatorx.mp3"],
    ["pumpamb", "audio/pumpamb.mp3"]
];
let deferredAudio = [
    ["a7", "audio/notes/a7.mp3"],
    ["b7", "audio/notes/b7.mp3"],
    ["c7", "audio/notes/c7.mp3"],
    ["c7b", "audio/notes/c7b.mp3"],
    ["d7", "audio/notes/d7.mp3"],
    ["e7", "audio/notes/e7.mp3"],
    ["e7b", "audio/notes/e7b.mp3"],
    ["f7", "audio/notes/f7.mp3"],
    ["f7b", "audio/notes/f7b.mp3"],
    ["g6", "audio/notes/g6.mp3"],
    ["g6s", "audio/notes/g6s.mp3"],
    ["g7", "audio/notes/g7.mp3"],
    ["c8", "audio/notes/c8.mp3"],
    ["clownlaugh1", "audio/clownlaugh1.mp3"],
    ["clownlaugh2", "audio/clownlaugh2.mp3"],
    ["clownlaughfinal", "audio/clownlaughfinal.mp3"],
    ["clownhorn", "audio/clown_horn.mp3"],
    ["creepysfx", "audio/creepysfx.mp3"],
    ["void", "audio/void.mp3"],
    ["flickeron", "audio/flickeron.mp3"],
    ["muffle1", "audio/muffle1.mp3"],
    ["muffle2", "audio/muffle2.mp3"],
    ["muffle3", "audio/muffle3.mp3"],
    ["muffle4", "audio/muffle4.mp3"],
    ["muffle5", "audio/muffle5.mp3"],
    ["muffle6", "audio/muffle6.mp3"],
    ["muffle7", "audio/muffle7.mp3"],
    ["muffle8", "audio/muffle8.mp3"],
    ["sing1", "audio/sing1.mp3"],
    ["rubber1", "audio/rubber1.mp3"],
    ["rubber2", "audio/rubber2.mp3"],
    ["rubber3", "audio/rubber3.mp3"],
    ["rubber4", "audio/rubber4.mp3"],
    ["rubber5", "audio/rubber5.mp3"],
    ["rubber6", "audio/rubber6.mp3"],
    ["rubber7", "audio/rubber7.mp3"],
    ["rubber8", "audio/rubber8.mp3"],
    ["tear1", "audio/tear1.mp3"],
    ["tear2", "audio/tear2.mp3"],
    ["tear3", "audio/tear3.mp3"],
    ["tear4", "audio/tear4.mp3"],
    ["tear5", "audio/tear5.mp3"],
    ["tear6", "audio/tear6.mp3"],
    ["glassbreak", "audio/glassbreak.mp3"],
    ["horrortrack1", "audio/horrortrack1.mp3"],
    ["groundthud2", "audio/groundthud2.mp3"],
    ["emerge1", "audio/emerge1.mp3"],
    ["emerge2", "audio/emerge2.mp3"],
    ["squeak1", "audio/squeak1.mp3"],
    ["squeak2", "audio/squeak2.mp3"],
    ["squeak3", "audio/squeak3.mp3"],
    ["doorslam", "audio/doorslam.mp3"],
    ["dooropen", "audio/dooropen.mp3"],
    ["dooropen2", "audio/dooropen2.mp3"],
    ["squeakopen", "audio/squeakopen.mp3"],
    ["lidslam", "audio/lidslam.mp3"],
    ["metalgrind1", "audio/metalgrind1.mp3"],
    ["metalgrind2", "audio/metalgrind2.mp3"],
    ["metalgrind3", "audio/metalgrind3.mp3"],
    ["metalgrind4", "audio/metalgrind4.mp3"],
    ["metalsqueak1", "audio/metalsqueak1.mp3"],
    ["metalsqueak2", "audio/metalsqueak2.mp3"],
    ["keygetred", "audio/keygetred.mp3"],
    ["deepbell1", "audio/deepbell1.mp3"],
    ["deepbell2", "audio/deepbell2.mp3"],
    ["deepbell3", "audio/deepbell3.mp3"],
    ["deepbell4", "audio/deepbell4.mp3"],
    ["deepbell5", "audio/deepbell5.mp3"],
    ["nyaha", "audio/nyaha.mp3"],
    ["splurt", "audio/splurt.mp3"],
    ["watergurgle", "audio/watergurgle.mp3"],
    ["stopmusic", "audio/stopmusic.mp3"],
    ["shout1", "audio/shout1.mp3"],
    ["shout2", "audio/shout2.mp3"],
    ["shout3", "audio/shout3.mp3"],
    ["shout4", "audio/shout4.mp3"],
    ["shout5", "audio/shout5.mp3"]
];
let deferredAtlases = [
    ["roomClown2", "sprites/clown/clown2.json"],
    ["flashScreens", "sprites/flashscreens/flashscreens.json"],
    ["staticScreens", "sprites/staticscreens/staticscreens.json"],
    ["staticLite", "sprites/staticscreens/staticlite.json"],
    ["misc", "sprites/misc/misc.json"]
];
let deferredImages = [
    ["theEnd", "sprites/altreality/the_end.webp"],
    ["stretch1", "sprites/altreality/stretch1.jpg"],
    ["stretch2", "sprites/altreality/stretch2.jpg"],
    ["stretch3", "sprites/altreality/stretch3.jpg"],
    ["stretch4", "sprites/altreality/stretch4.jpg"],
    ["stretch5", "sprites/altreality/stretch5.jpg"],
    ["stretch6", "sprites/altreality/stretch6.jpg"],
    ["floaty1", "sprites/altreality/floaty1.jpg"],
    ["floaty2", "sprites/altreality/floaty2.jpg"],
    ["floaty3", "sprites/altreality/floaty3.jpg"],
    ["floaty4", "sprites/altreality/floaty4.jpg"],
    ["balloon1", "sprites/altreality/balloon1.jpg"],
    ["balloon2", "sprites/altreality/balloon2.jpg"],
    ["balloon3", "sprites/altreality/balloon3.jpg"],
    ["balloon4", "sprites/altreality/balloon4.jpg"],
    ["balloon5", "sprites/altreality/balloon5.jpg"],
    ["candleDark", "sprites/candleDark.png"],
    ["redlight", "sprites/redlight.png"]
];
let deferredAudioLoaded = !1;

const MAX_ASSET_RETRIES = 3;

let assetRetry = {
    installed: false,
    counts: {},      // request key -> attempts already made
    failedReqs: {},  // request key -> descriptor, so the retry button can re-queue
    pending: 0,      // retries scheduled but not yet back through the loader
    onPermanentFailure: null
};

// Phaser reports the individual file that failed, which for a multiatlas is a
// sub-file: either the manifest json, or a texture page under an internal
// "MA<n>_<path>" key. Re-adding that sub-file would not rebuild the atlas, so
// walk the multiFile back-pointer to the request the game actually made.
function getAssetRequest(file) {
    let owner = file.multiFile || file,
        url = owner.url;
    if (url === undefined && owner.files && owner.files.length) {
        url = owner.files[0].url;
    }
    return {
        key: owner.key,
        type: owner.type,
        url: url === undefined ? file.url : url
    };
}

function requeueAsset(scene, req) {
    switch (req.type) {
        case "multiatlas":
            scene.load.multiatlas(req.key, req.url);
            return true;
        case "audio":
            scene.load.audio(req.key, req.url);
            return true;
        case "image":
            scene.load.image(req.key, req.url);
            return true;
        case "json":
            scene.load.json(req.key, req.url);
            return true;
    }
    console.warn(`[AssetLoader] no retry rule for type "${req.type}" (${req.key})`);
    return false;
}

function markAssetPermanentlyFailed(req) {
    console.error(`[AssetLoader] permanently failed "${req.key}" (${req.url}) after ${MAX_ASSET_RETRIES} retries`);
    assetRetry.failedReqs[req.key] = req;
    if (assetRetry.onPermanentFailure) {
        assetRetry.onPermanentFailure(req);
    }
}

function assetRetryScheduleRequeue(scene, req, delay) {
    setTimeout(() => {
        // load.start() is ignored while a batch is in flight, which would leave the
        // re-added file sitting in the queue forever. Wait for the loader to idle.
        if (scene.load.isLoading()) {
            assetRetryScheduleRequeue(scene, req, 250);
            return;
        }
        assetRetry.pending--;
        if (requeueAsset(scene, req)) {
            scene.load.start();
        } else {
            markAssetPermanentlyFailed(req);
        }
    }, delay);
}

function setupLoaderRetryHandlers(scene, onPermanentFailure) {
    if (onPermanentFailure) {
        assetRetry.onPermanentFailure = onPermanentFailure;
    }
    // The loader's emitter lives on the scene and outlives each batch. Installing
    // twice (preload + the deferred batch) would run both handlers per failure:
    // double-counting attempts and queueing every failed file twice.
    if (assetRetry.installed) {
        return;
    }
    assetRetry.installed = true;
    // "loaderror" is the real event name - there is no "filefailed" in Phaser.
    scene.load.on("loaderror", (file) => {
        let req = getAssetRequest(file),
            attempts = (assetRetry.counts[req.key] || 0) + 1;
        assetRetry.counts[req.key] = attempts;

        if (attempts <= MAX_ASSET_RETRIES) {
            console.warn(`[AssetLoader] retrying "${req.key}" (${req.url}) - attempt ${attempts}/${MAX_ASSET_RETRIES}`);
            // Counted from the moment of failure so that a "complete" landing
            // during the backoff is never mistaken for a successful load.
            assetRetry.pending++;
            assetRetryScheduleRequeue(scene, req, Math.min(1000 * attempts, 3000));
        } else {
            markAssetPermanentlyFailed(req);
        }
    });
}

function assetLoadHasFailures() {
    for (let key in assetRetry.failedReqs) {
        return true;
    }
    return false;
}

// A destroyed Phaser GameObject is still a live reference, so a truthiness check
// is not enough - setText() on one throws inside the texture update.
function setLoadingTextSafe(text) {
    let t = gameObjectsTemp.loadingText;
    if (t && t.scene) {
        t.setText(text);
    }
}

function hideLoadingFailureUI() {
    if (gameObjectsTemp.loadingFailureText) {
        gameObjectsTemp.loadingFailureText.destroy();
        gameObjectsTemp.loadingFailureText = null;
    }
    if (gameObjectsTemp.retryBtn) {
        gameObjectsTemp.retryBtn.destroy();
        gameObjectsTemp.retryBtn = null;
    }
}

function showLoadingFailureUI(scene) {
    if (gameObjectsTemp.loadingFailureText) return;
    setLoadingTextSafe("LOADING INTERRUPTED");
    gameObjectsTemp.loadingFailureText = scene.add.text(gameVars.halfWidth, gameVars.height - 210, "Network connection issue. Tap below to retry:", {
        fontFamily: "Times New Roman",
        fontSize: 20,
        color: "#ff9999",
        align: "center"
    }).setOrigin(0.5).setDepth(10);

    gameObjectsTemp.retryBtn = scene.add.text(gameVars.halfWidth, gameVars.height - 160, "[ TAP TO RETRY LOADING ]", {
        fontFamily: "Times New Roman",
        fontSize: 26,
        color: "#ffffff",
        align: "center"
    }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

    gameObjects.loadingCntr.add(gameObjectsTemp.loadingFailureText);
    gameObjects.loadingCntr.add(gameObjectsTemp.retryBtn);

    gameObjectsTemp.retryBtn.on("pointerdown", () => {
        hideLoadingFailureUI();
        setLoadingTextSafe("RETRYING LOAD...");
        // Re-queue the recorded failures. Clearing the bookkeeping and calling
        // start() on its own runs the loader on an empty queue, which completes
        // instantly and boots the game with the assets still missing.
        let reqs = [];
        for (let key in assetRetry.failedReqs) reqs.push(assetRetry.failedReqs[key]);
        assetRetry.counts = {};
        assetRetry.failedReqs = {};

        let queued = 0;
        for (let i = 0; i < reqs.length; i++) {
            if (requeueAsset(scene, reqs[i])) queued++;
        }
        if (queued === 0) {
            // Nothing could be re-issued; keep the failure on screen rather than
            // letting an empty batch report success.
            for (let i = 0; i < reqs.length; i++) assetRetry.failedReqs[reqs[i].key] = reqs[i];
            showLoadingFailureUI(scene);
            return;
        }
        scene.load.start();
    });
}

let bootLoadHandled = false;

function onLoaderBatchComplete(a) {
    // Each retry runs the loader again, so "complete" fires several times. Only
    // the pass with nothing outstanding decides whether boot succeeded.
    if (assetRetry.pending > 0) {
        return;
    }
    if (assetLoadHasFailures()) {
        if (!gameVars.gameStarted) showLoadingFailureUI(a);
        return;
    }
    if (bootLoadHandled) {
        return;
    }
    bootLoadHandled = true;
    hideLoadingFailureUI();
    onLoadComplete(a);
}

function preload() {
    let gameDiv = document.getElementById('preload-notice');
    if (gameDiv) gameDiv.innerHTML = "";
    handleBorders();
    if (window.GameSDK && typeof window.GameSDK.loadingStart === 'function') window.GameSDK.loadingStart();
    game.canvas, phaserGame = this, selfMe = this, gameObjects.exhibCntr = this.add.container(0, 0), gameObjects.exhibCntr.goalOffsetX = 0, gameObjects.exhibCntr.goalOffsetY = 0, gameObjects.exhibCntr.offsetX = 0, gameObjects.exhibCntr.offsetY = 0, gameObjects.exhibCntr.offsetAccX = 0, gameObjects.exhibCntr.offsetAccY = 0, gameObjects.exhibCntr.swayX = 0, gameObjects.exhibCntr.swayY = 0, gameObjects.exhibCntr.swayAccX = 0, gameObjects.exhibCntr.swayAccY = 0, gameObjects.exhibCntr.swayAmt = 0, gameObjects.shadowCntr = this.add.container(0, 0), gameObjects.portraitCntr = this.add.container(0, 0), gameObjects.btnCntr = this.add.container(0, 0), gameObjects.hueCntr = this.add.container(0, 0), gameObjects.darkCtnr = this.add.container(0, 0), gameObjects.mainDarkCntr = this.add.container(0, 0), gameObjects.topBtnCntr = this.add.container(0, 0), gameObjects.loadingCntr = this.add.container(0, 0), gameObjects.loadingCntr.goalOffsetX = 0, gameObjects.loadingCntr.goalOffsetY = 0, gameObjects.loadingCntr.offsetX = 0, gameObjects.loadingCntr.offsetY = 0, gameObjects.loadingCntr.offsetAccX = 0, gameObjects.loadingCntr.offsetAccY = 0, gameObjects.loadingCntr.shakeAccX = 0, gameObjects.loadingCntr.shakeAccY = 0, gameObjects.loadingCntr.swayX = 0, gameObjects.loadingCntr.swayY = 0, gameObjects.loadingCntr.swayAccX = 0, gameObjects.loadingCntr.swayAccY = 0, gameObjects.loadingCntr.swayAmt = 0, this.load.image("whitePixel", "sprites/white_pixel.png"), this.load.image("blackPixel", "sprites/black_pixel.png"), this.load.image("darkBluePixel", "sprites/dark_blue_pixel.png"), this.load.image("hand", "sprites/mouse.png"), this.load.image("handPoint", "sprites/mouse_point.png"),
        this.load.image("funbox", "sprites/funbox.png"), this.load.image("funlid", "sprites/funlid.png"), this.load.image("popup", "sprites/popup.png"),
        this.load.image("headphones", "sprites/headphones.png")
}

// YouTube requires firstFrameReady only once a real loading/splash screen has
// been drawn — not on a blank preload frame. Wait for POST_RENDER after the
// LOADING UI exists (see onPreloadComplete).
let firstFrameSignalled = false;

function signalFirstFrameWhenRendered(scene) {
    if (firstFrameSignalled) return;
    if (!window.GameSDK || typeof window.GameSDK.firstFrameReady !== 'function') return;
    if (!scene.game || !scene.game.events) return;
    scene.game.events.once(Phaser.Core.Events.POST_RENDER, () => {
        if (firstFrameSignalled) return;
        firstFrameSignalled = true;
        window.GameSDK.firstFrameReady();
    });
}

function create() {
    // setupHostAudioReconciliation() runs before the scene boots, so its first
    // reconcile can only set the flag - phaserGame.sound does not exist yet. Push
    // the host's state into Phaser now that it does, or a host that starts muted
    // would still be audible through the direct .play() calls that bypass
    // playSound(). The old 1s poll was papering over this.
    applyHostAudioState();
    onPreloadComplete(this)
}

function onPreloadComplete(a) {
    setupHand(a), globalScene = a, gameObjectsTemp.loadingBg = a.add.image(gameVars.halfWidth, gameVars.halfHeight, "blackPixel"), gameObjectsTemp.loadingBg.scaleX = 1e3, gameObjectsTemp.loadingBg.scaleY = 1e3, gameObjects.loadingCntr.add(gameObjectsTemp.loadingBg), gameObjectsTemp.loadingText = a.add.text(gameVars.halfWidth, gameVars.halfHeight + 155, "LOADING", {
        fontFamily: "Times New Roman",
        fontSize: 38,
        color: "#ffffff",
        align: "center"
    }), gameObjectsTemp.loadingText.setOrigin(.5, .5), gameObjectsTemp.loadingText.setDepth(1), gameObjectsTemp.loadingBarBacking = a.add.image(gameVars.halfWidth, gameVars.height - 260, "whitePixel"), gameObjectsTemp.loadingBarBacking.alpha = .25, gameObjectsTemp.loadingBarBacking.scaleY = 4, gameObjectsTemp.loadingBarBacking.scaleX = 200, gameObjectsTemp.loadingBarBacking.setDepth(1), gameObjectsTemp.loadingBar = a.add.image(gameVars.halfWidth, gameVars.height - 260, "whitePixel"), gameObjectsTemp.loadingBar.scaleY = 4, gameObjectsTemp.loadingBar.setDepth(1), gameObjectsTemp.warningText = a.add.text(gameVars.halfWidth, gameVars.height - 188, "Warning: Contains spooky and intense scenes", {
        fontFamily: "Times New Roman",
        fontSize: 22,
        color: "#ffffff",
        align: "center"
    }), gameObjectsTemp.exhibitText = a.add.text(gameVars.halfWidth, 140, "EXHIBIT OF SORROWS", {
        fontFamily: "Times New Roman",
        fontSize: 36,
        color: "#777777",
        align: "center"
    }), gameObjectsTemp.exhibitText.setOrigin(.5, .5), gameObjectsTemp.exhibitText.setDepth(1), gameObjectsTemp.warningText.setOrigin(.5, .5), gameObjectsTemp.warningText.setDepth(1),
        gameObjectsTemp.popup = a.add.image(gameVars.halfWidth, gameVars.halfHeight + 1, "popup"),
        gameObjectsTemp.funbox = a.add.image(gameVars.halfWidth, gameVars.halfHeight - 25, "funbox"),
        gameObjectsTemp.funlid = a.add.image(gameVars.halfWidth + 95, gameVars.halfHeight - 90, "funlid"),
        gameObjectsTemp.headphones = a.add.image(gameVars.halfWidth, gameVars.height - 135, "headphones"), gameObjectsTemp.headphoneText = a.add.text(gameVars.halfWidth, gameVars.height - 85, "For best experience, play with headphones", {
            fontFamily: "Times New Roman",
            fontSize: 22,
            color: "#ffffff",
            align: "center"
        }), gameObjectsTemp.headphoneText.setOrigin(.5, .5), gameObjectsTemp.headphoneText.setDepth(1),

        // Loading UI is on screen now — signal first frame after it actually paints.
        signalFirstFrameWhenRendered(a),

        setupLoaderRetryHandlers(a, () => {
            if (!gameVars.gameStarted) {
                showLoadingFailureUI(a);
            }
        }),

        a.load.on("progress", function (a) {
            gameVarsTemp.loadAmt = a
        }), a.load.on("complete", () => {
            onLoaderBatchComplete(a)
        }), a.load.image("handPointBlood", "sprites/mouse_point_blood.png"), a.load.multiatlas("menu", "sprites/menu/menu.json"), a.load.multiatlas("loadingSS", "sprites/loading/loadingSS.json"), a.load.multiatlas("bgs", "sprites/backgrounds/backgrounds.json"), a.load.multiatlas("roomPump", "sprites/roompump/roompump.json"), a.load.multiatlas("roomFaucet", "sprites/roomfaucet/roomfaucet.json"), a.load.multiatlas("roomHandy", "sprites/roomhandy/roomhandy.json"), a.load.multiatlas("roomStretch", "sprites/roomstretch/roomstretch.json"), a.load.multiatlas("roomJack", "sprites/roomjack/roomjack.json"),
        a.load.multiatlas("roomClown", "sprites/clown/clown.json"),
        a.load.multiatlas("buttons", "sprites/buttons/buttons.json"), (function () { for (let ae = 0; ae < earlyAudio.length; ae++) a.load.audio(earlyAudio[ae][0], earlyAudio[ae][1]) })(),
        a.load.image("candleBright", "sprites/candleBright.png"), a.load.image("shinelight", "sprites/shinelight.png"), a.load.image("generalDim", "sprites/generalDim.png"), a.load.start()
}

let gameLoadedOnce = false;
function onLoadComplete(a) {
    if (deferredAudioLoaded) {
        return;
    }
    const currentHref = document.location.href;
    const isValidDomain = currentHref.includes('itch') ||
        currentHref.includes('localhost') ||
        currentHref.includes('127.0.0.1') ||
        currentHref.includes('youtube') ||
        currentHref.includes('google') ||
        (window.GameSDK && typeof window.GameSDK.getEnvironment === 'function' && window.GameSDK.getEnvironment() === 'youtube');
    if (!isValidDomain) {
        // Stops execution of rest of game
        let gameDiv = document.getElementById('preload-notice');
        let invalidSite = currentHref.substring(0, 25);
        if (gameDiv) gameDiv.innerHTML = invalidSite + "...\nis an invalid site.\n\n" + "Try the game on itch.io!";
        return;
    }

    gameObjectsTemp.popup.alpha = 1;
    gameObjectsTemp.popup.rotation = 0.01;
    a.tweens.add({
        targets: gameObjectsTemp.popup,
        y: gameVars.halfHeight + 25,
        ease: "Cubic.easeOut",
        duration: 150,
        onComplete: () => {
            gameObjectsTemp.popup.destroy();
        }
    })

    a.tweens.chain({
        targets: [gameObjectsTemp.loadingText, gameObjectsTemp.funlid, gameObjectsTemp.funbox],
        tweens: [{
            delay: 100,
            alpha: 0,
            duration: 150
        }],
        onComplete() {
            gameObjectsTemp.loadingText.destroy();
            gameObjectsTemp.funlid.destroy();
            gameObjectsTemp.funbox.destroy();
        }
    }), gameObjectsTemp.brightLight = a.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "loadingSS", "bright_light"), gameObjectsTemp.brightLight.scaleX = 1, gameObjectsTemp.brightLight.scaleY = 1, gameObjectsTemp.brightLight.alpha = 0, gameObjects.loadingCntr.add(gameObjectsTemp.brightLight), gameObjectsTemp.loadingWelcome = makeWelcomeImage("loading_welcome"), gameObjects.loadingCntr.add(gameObjectsTemp.loadingWelcome), gameObjectsTemp.loadingWelcome.rotation = 0, gameObjectsTemp.loadingWelcome.alpha = 0, gameObjectsTemp.loadingWelcome.scaleX = .8, gameObjectsTemp.loadingWelcome.scaleY = .8, a.tweens.chain({
        targets: [gameObjectsTemp.loadingWelcome],
        tweens: [{
            alpha: .01,
            duration: 1,
            onComplete() {
                gameObjects.startGameButton = new Button(a, gameObjects.loadingCntr, () => {
                    startGame(a)
                }, {
                    ref: "transparent_pixel",
                    atlas: "loadingSS",
                    x: gameVars.halfWidth,
                    y: gameVars.halfHeight - 60,
                    scaleX: 240,
                    scaleY: 160
                });
            }
        }, {
            alpha: 1,
            duration: 400,
            onComplete() {
                // gameReady only once the start menu is visible and interactive —
                // not while the asset-loading screen is still the only thing shown.
                if (!gameLoadedOnce) {
                    gameLoadedOnce = true;
                    if (window.GameSDK && typeof window.GameSDK.loadingStop === 'function') {
                        window.GameSDK.loadingStop();
                    }
                }
            }
        }]
    })
}

function loadDeferredAudio(a) {
    if (deferredAudioLoaded) {
        return;
    }
    deferredAudioLoaded = true;
    setupLoaderRetryHandlers(a);
    for (let d = 0; d < deferredAudio.length; d++) a.load.audio(deferredAudio[d][0], deferredAudio[d][1]);
    for (let t = 0; t < deferredAtlases.length; t++) a.load.multiatlas(deferredAtlases[t][0], deferredAtlases[t][1]);
    for (let i = 0; i < deferredImages.length; i++) a.load.image(deferredImages[i][0], deferredImages[i][1]);
    let onDeferredComplete = () => {
        // A retry re-runs the loader; wait for the pass that follows it, or the
        // assets being retried would be written off as failed here.
        if (assetRetry.pending > 0) {
            a.load.once("complete", onDeferredComplete);
            return;
        }
        for (let t = 0; t < deferredAtlases.length; t++) {
            let key = deferredAtlases[t][0];
            if (!a.textures.exists(key)) {
                console.warn("loadDeferredAudio: atlas failed to load: " + key);
            }
        }
        for (let i = 0; i < deferredImages.length; i++) {
            let key = deferredImages[i][0];
            if (!a.textures.exists(key)) {
                console.warn("loadDeferredAudio: image failed to load: " + key);
            }
        }
        for (let d = 0; d < deferredAudio.length; d++) {
            let key = deferredAudio[d][0];
            if (a.cache.audio.exists(key)) {
                gameObjects.sounds[key] = a.sound.add(key);
            } else {
                console.warn("loadDeferredAudio: audio failed to load: " + key);
            }
        }
        // These were built during setupGame, before the atlases above existed, so
        // they picked up the __MISSING texture. Rebind them now that the real
        // frames are in the texture manager.
        if (a.textures.exists("flashScreens")) {
            initFlashScreens();
        }
        if (a.textures.exists("staticScreens")) {
            initStaticScreens();
        }
        if (a.textures.exists("roomClown2")) {
            refreshCrawlClown();
        }
        if (a.textures.exists("candleDark") && gameObjects.candleDark) {
            gameObjects.candleDark.setTexture("candleDark");
        }
        if (a.textures.exists("redlight") && gameObjects.generalRedness) {
            gameObjects.generalRedness.setTexture("redlight");
        }
        if (a.textures.exists("misc")) {
            if (gameObjects.guideArrow) gameObjects.guideArrow.setTexture("misc", "arrow");
            if (gameObjects.guideArrowFat) gameObjects.guideArrowFat.setTexture("misc", "arrowFat");
            if (gameObjects.musicBoxNote) gameObjects.musicBoxNote.setTexture("misc", "note");
            if (gameObjects.musicBoxNote2) gameObjects.musicBoxNote2.setTexture("misc", "note");
        }
    };
    a.load.once("complete", onDeferredComplete);
    a.load.start()
}

function onLoadAnimComplete(a) {
    a.tweens.chain({
        targets: [gameObjectsTemp.loadingBar, gameObjectsTemp.loadingBarBacking],
        tweens: [{
            offset: 0,
            scaleY: 0,
            ease: "Cubic.easeOut",
            duration: 600
        }, {
            offset: 0,
            alpha: 0,
            scaleX: 800,
            duration: 600,
            onComplete() {
                gameObjectsTemp.loadingBar.destroy(), gameObjectsTemp.loadingBarBacking.destroy()
            }
        }]
    }), a.tweens.chain({
        targets: [gameObjectsTemp.headphones, gameObjectsTemp.headphoneText, gameObjectsTemp.warningText, gameObjectsTemp.exhibitText],
        tweens: [{
            alpha: .5,
            duration: 250
        }]
    })
}

function startGame(a) {
    gameVars.gameplayBegan = false;
    if (window.GameSDK && typeof window.GameSDK.gameplayStart === 'function') window.GameSDK.gameplayStart();
    gameObjects.loadingMusic = a.sound.add("loadingMusic"), gameObjects.loadingMusic.play(), gameObjects.startGameButton.destroy(), gameVars.gameStarted = !0, gameObjects.scene = a, setupGame(a), gameObjectsTemp.blackTeeth = a.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "menu", "teethBlack"), gameObjectsTemp.blackTeeth.scaleX = 1.6, gameObjectsTemp.blackTeeth.scaleY = 1.6, gameObjectsTemp.blackTeethAnim = a.tweens.chain({
        targets: [gameObjectsTemp.blackTeeth],
        tweens: [{
            scaleX: 1.45,
            scaleY: 1.45,
            ease: "Quad.easeIn",
            duration: 3e3
        }]
    }), a.tweens.chain({
        targets: [gameObjectsTemp.headphones, gameObjectsTemp.headphoneText, gameObjectsTemp.warningText, gameObjectsTemp.exhibitText],
        tweens: [{
            alpha: 0,
            duration: 260,
            onComplete() {
                gameObjectsTemp.headphones.destroy(), gameObjectsTemp.headphoneText.destroy(), gameObjectsTemp.warningText.destroy(), gameObjectsTemp.exhibitText.destroy()
            }
        }]
    }), gameObjects.clickBlocker = new Button(a, gameObjects.loadingCntr, () => {
        console.log("beginning game")
    }, {
        ref: "transparent_pixel",
        atlas: "loadingSS",
        x: gameVars.halfWidth,
        y: gameVars.halfHeight,
        scaleX: 2e3,
        scaleY: 2e3
    }), a.tweens.chain({
        targets: [gameObjectsTemp.brightLight],
        tweens: [{
            alpha: 1.2,
            scaleX: 3,
            scaleY: 3,
            duration: 2500,
            ease: "Quad.easeOut"
        }]
    }), a.tweens.chain({
        targets: [gameObjectsTemp.loadingWelcome],
        tweens: [{
            rotation: .01,
            scaleX: 1.14,
            scaleY: 1.14,
            duration: 2500,
            ease: "Quad.easeIn"
        }]
    }), gameObjectsTemp.circleLoading = [], a.tweens.chain({
        targets: [gameObjectsTemp.loadingWelcome],
        tweens: [{
            alpha: .999,
            duration: 800
        }, {
            alpha: 0,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x1", !0), addToUpdateFuncList(updateWelcomeFollower)
            }
        }, {
            alpha: .001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x2", !0)
            }
        }, {
            alpha: .001,
            duration: 400,
            onStart() {
                let b = a.add.image(gameVars.halfWidth, gameVars.halfHeight - 50 - 105, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b), gameObjects.loadingCntr.add(b), a.tweens.add({
                    targets: b,
                    y: gameVars.halfHeight - 50 - 165,
                    duration: 1500
                }), makeWelcomeImage("loading_welcome_x3", !0)
            }
        }, {
            alpha: .001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x4", !0)
            }
        }, {
            alpha: .001,
            duration: 350,
            onStart() {
                let b = a.add.image(gameVars.halfWidth + 155, gameVars.halfHeight - 50 + 70, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b), gameObjects.loadingCntr.add(b), a.tweens.add({
                    targets: b,
                    x: gameVars.halfWidth + 250,
                    y: gameVars.halfHeight - 50 + 110,
                    duration: 1300
                }), makeWelcomeImage("loading_welcome_x5", !0)
            }
        }, {
            alpha: .001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x6", !0)
            }
        }, {
            alpha: .001,
            duration: 300,
            onStart() {
                let b = a.add.image(gameVars.halfWidth - 190, gameVars.halfHeight - 50 - 75, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b), gameObjects.loadingCntr.add(b), a.tweens.add({
                    targets: b,
                    x: gameVars.halfWidth - 250,
                    y: gameVars.halfHeight - 50 - 100,
                    duration: 1e3
                }), makeWelcomeImage("loading_welcome_x7", !0)
            }
        }, {
            alpha: .001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x8", !0)
            }
        }, {
            alpha: .001,
            duration: 200,
            onStart() {
                let b = a.add.image(gameVars.halfWidth, gameVars.halfHeight - 50 + 135, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b), gameObjects.loadingCntr.add(b), a.tweens.add({
                    targets: b,
                    y: gameVars.halfHeight - 50 + 185,
                    duration: 700
                }), makeWelcomeImage("loading_welcome_x9", !0)
            }
        }, {
            alpha: .001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x10", !0)
            }
        }, {
            alpha: .001,
            duration: 150,
            onStart() {
                let b = a.add.image(gameVars.halfWidth + 250, gameVars.halfHeight - 50 - 100, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b), gameObjects.loadingCntr.add(b), makeWelcomeImage("loading_welcome_x11", !0)
            }
        }, {
            alpha: .001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x12", !0)
            }
        }, {
            alpha: .001,
            duration: 500,
            onStart() {
                let b = a.add.image(gameVars.halfWidth - 250, gameVars.halfHeight - 50 + 110, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b), gameObjects.loadingCntr.add(b), makeWelcomeImage("loading_welcome_x13", !0)
            },
            onComplete() {
                beginGameplay(a);
            }
        }]
    })
}

function beginGameplay(a) {
    if (gameVars.gameplayBegan) {
        return;
    }
    gameVars.gameplayBegan = true;
    loadDeferredAudio(a);
    let background = document.getElementById('background');
    background.style.opacity = '1';
    let leftborder = document.getElementById('leftborder');
    leftborder.style.opacity = '1';
    let rightborder = document.getElementById('rightborder');
    rightborder.style.opacity = '1';

    gameObjects.topBtnCntr.setScrollFactor(0);
    gameObjects.topBtnCntr.setDepth(1000);

    // Hints Button (Left of Mute Button, Top Right)
    gameObjects.hintButton = new Button(a, gameObjects.topBtnCntr, () => {
        if (typeof showHint === "function") {
            showHint();
        } else if (window.messageBus) {
            messageBus.publish("hintClick");
        }
    }, {
        atlas: "buttons",
        ref: "hint_normal",
        x: gameVars.width - 140,
        y: 51,
        alpha: 0.7
    }, {
        atlas: "buttons",
        ref: "hint_hover",
        alpha: 1
    }, {
        atlas: "buttons",
        ref: "hint_hover",
        alpha: 0.65
    });
    gameObjects.hintButton.setScrollFactor(0);
    gameObjects.hintButton.setDepth(1000);

    // Hint count badge (circle icon + "1" text at bottom right of hint button)
    gameObjects.hintCountCircle = a.add.image(gameVars.width - 140 + 26, 51 + 26, "buttons", "circle");
    gameObjects.hintCountCircle.setScrollFactor(0);
    gameObjects.hintCountCircle.setDepth(1002);
    gameObjects.topBtnCntr.add(gameObjects.hintCountCircle);

    gameObjects.hintCountText = a.add.text(gameVars.width - 140 + 26, 51 + 26, "1", {
        fontFamily: "Arial",
        fontSize: "14px",
        fontStyle: "bold",
        color: "#ffffff",
        align: "center"
    });
    gameObjects.hintCountText.setOrigin(0.5, 0.5);
    gameObjects.hintCountText.setScrollFactor(0);
    gameObjects.hintCountText.setDepth(1003);
    gameObjects.topBtnCntr.add(gameObjects.hintCountText);

    // Sound Mute Button (Top Right)
    gameObjects.muteButton = new Button(a, gameObjects.topBtnCntr, () => {
        gameVars.manualMuted = !gameVars.manualMuted;

        if (gameVars.manualMuted) {
            gameObjects.muteButton.setNormalRef("sfx_muted_normal");
            gameObjects.muteButton.setHoverRef("sfx_muted_hover");
            gameObjects.muteButton.setPressRef("sfx_muted_hover");
        } else {
            gameObjects.muteButton.setNormalRef("sfx_normal");
            gameObjects.muteButton.setHoverRef("sfx_hover");
            gameObjects.muteButton.setPressRef("sfx_hover");
        }

        // Phaser's global mute silences everything in one place - including the
        // ambient loops started with a direct .play(), which playSound() never
        // sees. Nothing here touches individual sound volumes: zeroing them on
        // mute meant only the four tracks someone remembered to hardcode came
        // back on unmute, and it overwrote whatever mix the current room had
        // faded to. Leaving them alone means the mix is simply still correct
        // when the sound comes back, and in-flight fades keep running silently
        // rather than being frozen part-way.
        applyHostAudioState();
    }, {
        atlas: "buttons",
        ref: gameVars.manualMuted ? "sfx_muted_normal" : "sfx_normal",
        x: gameVars.width - 58,
        y: 51,
        alpha: 0.7
    }, {
        atlas: "buttons",
        ref: gameVars.manualMuted ? "sfx_muted_hover" : "sfx_hover",
        alpha: 1
    }, {
        atlas: "buttons",
        ref: gameVars.manualMuted ? "sfx_muted_hover" : "sfx_hover",
        alpha: 0.65
    });
    gameObjects.muteButton.setScrollFactor(0);
    gameObjects.muteButton.setDepth(1000);

    for (let b in removeFromUpdateFuncList(updateWelcomeFollower), gameObjects.loadingMusic.stop(), gameVars.gameConstructed = !0, gameObjects.loadingWelcomes) gameObjects.loadingWelcomes[b].destroy();
    for (let a = 0; a < gameObjectsTemp.circleLoading.length; a++) gameObjectsTemp.circleLoading[a].destroy();
    gameObjectsTemp.brightLight.destroy(), gameObjects.clickBlocker.destroy(), gameObjectsTemp.loadingBg.destroy(), gameObjectsTemp.blackTeeth.destroy(), gameObjectsTemp.blackTeethAnim.destroy(), gameDelay(() => {
        gameObjects.sounds.gladiator0.play({
            loop: !0
        }), gameObjects.sounds.gladiator0.volume = .6, tweenVolume("gladiator0", .7, 50)
    }, 0), gameDelay(() => {
        addToUpdateFuncList(flipEntryLights)
    }, 350), gameDelay(() => {
        gameVarsTemp.hasMoved || ftueMoveButton()
    }, 4e3)
}

function updateWelcomeFollower() {
    gameObjectsTemp.loadingWelcomeFollower.scaleX = 2 * gameObjectsTemp.loadingWelcome.scaleX, gameObjectsTemp.loadingWelcomeFollower.scaleY = 2 * gameObjectsTemp.loadingWelcome.scaleY;
    let c = .86 * gameObjectsTemp.loadingWelcome.scaleX * (1 + .12 * gameObjectsTemp.loadingWelcome.scaleX),
        d = .86 * gameObjectsTemp.loadingWelcome.scaleY * (1 + .12 * gameObjectsTemp.loadingWelcome.scaleY);
    for (let a = 0; a < gameObjectsTemp.circleLoading.length; a++) {
        let b = gameObjectsTemp.circleLoading[a];
        b.scaleX = c * (1 + .45 * Math.random()), b.scaleY = d * (1 + .45 * Math.random())
    }
}

function handleBorders() {
    let leftBorder = document.getElementById('leftborder');
    let rightBorder = document.getElementById('rightborder');
    if (!leftBorder || !rightBorder) {
        return;
    }
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = pixelWidth / pixelHeight;
    var gameScale = 1;
    let isNarrow = false;
    if (windowRatio < gameRatio) {
        gameScale = windowWidth / pixelWidth;
        isNarrow = true;
    } else {
        gameScale = windowHeight / pixelHeight;

    }
    if (isNarrow) {
        rightBorder.style.display = 'none';
        leftBorder.style.display = 'none';
    } else {
        rightBorder.style.display = 'block';
        leftBorder.style.display = 'block';
    }
    //block


    let widthAmt = 40 * gameScale;
    leftBorder.style.width = widthAmt + 'px';
    rightBorder.style.width = widthAmt + 'px';
    let shiftAmt = pixelWidth * gameScale * 0.5 + widthAmt - 2;
    leftBorder.style.left = 'calc(50% - ' + shiftAmt + 'px)'
    rightBorder.style.right = 'calc(50% - ' + shiftAmt + 'px)'
}

function initializeSounds(a) {
    // Deferred sounds get registered later, in loadDeferredAudio's complete
    // callback. Keep whatever is already registered rather than resetting to {}:
    // a second pass through here after the deferred batch has landed would drop
    // all 51 deferred sounds while leaving them in the cache, which is silent and
    // leaves every horror-sequence sound permanently missing.
    if (!gameObjects.sounds) {
        gameObjects.sounds = {};
    }
    for (let d = 0; d < earlyAudio.length; d++) {
        let key = earlyAudio[d][0];
        if (key === "loadingMusic") {
            continue;
        }
        if (!gameObjects.sounds[key]) {
            gameObjects.sounds[key] = a.sound.add(key);
        }
    }
}

let hostAudioEnabled = true;

function isHostAudioEnabled() {
    if (!window.GameSDK || typeof window.GameSDK.isAudioEnabled !== 'function') return true;
    try {
        return window.GameSDK.isAudioEnabled() !== false;
    } catch (e) {
        return true;
    }
}

// True while a platform ad is on screen. Kept separate from hostAudioEnabled so
// the two can't clobber each other - an ad can end while the host still has
// audio disabled, and the host can re-enable audio mid-ad.
let adAudioSuspended = false;

function applyHostAudioState(forced) {
    const enabled = typeof forced === 'boolean' ? forced : isHostAudioEnabled();
    hostAudioEnabled = enabled;

    // Three independent reasons to be silent, folded into one decision so they
    // cannot overwrite each other:
    //   - the host disabled audio (YouTube)
    //   - an ad is on screen (a YouTube interstitial overlays the game rather
    //     than replacing it, so the game must fall silent even though the host
    //     still reports audio as enabled)
    //   - the player pressed the in-game mute button
    // This is the ONLY place that writes Phaser's global mute.
    const audible = enabled && !adAudioSuspended && !gameVars.manualMuted;

    if (typeof phaserGame !== 'undefined' && phaserGame && phaserGame.sound) {
        // Keep Phaser's own flag in step (it emits GLOBAL_MUTE off this setter)...
        phaserGame.sound.mute = !audible;

        // ...but do not trust it to actually take effect. Phaser mutes with
        // masterMuteNode.gain.setValueAtTime(v, 0) - always at the fixed
        // timestamp 0 - so every toggle appends another event at the same past
        // time. After enough toggling Chrome stops applying new ones and the
        // game is stranded silent (or audible) for the rest of the session,
        // with sound.mute still reporting the value we asked for. Clearing the
        // timeline and asserting the gain directly makes it deterministic.
        // Guarded: the HTML5 Audio fallback has no masterMuteNode.
        let muteNode = phaserGame.sound.masterMuteNode;
        if (muteNode && muteNode.gain) {
            try { muteNode.gain.cancelScheduledValues(0); } catch (e) { }
            muteNode.gain.value = audible ? 1 : 0;
        }

        if (audible && phaserGame.sound.context && phaserGame.sound.context.state === 'suspended') {
            phaserGame.sound.context.resume().catch(() => { });
        }
    }
}

// Called by the SDK bridge around every ad. Mutes the whole game rather than the
// handful of music tracks an individual call site happens to know about - the
// ambient loops (watergurgle, pumpamb, fan1/fan2) are started with direct
// .play() calls and were audible under the ad.
function setAdAudioSuspended(suspended) {
    adAudioSuspended = !!suspended;
    applyHostAudioState();
}

function setupHostAudioReconciliation() {
    if (window.GameSDK && typeof window.GameSDK.onAudioEnabledChange === 'function') {
        window.GameSDK.onAudioEnabledChange((enabled) => applyHostAudioState(enabled !== false));
    }
    if (window.GameSDK && typeof window.GameSDK.onPause === 'function') {
        window.GameSDK.onPause(() => {
            applyHostAudioState(false);
            if (typeof phaserGame !== 'undefined' && phaserGame && phaserGame.scene) {
                phaserGame.scene.pause('default');
            }
        });
    }
    if (window.GameSDK && typeof window.GameSDK.onResume === 'function') {
        window.GameSDK.onResume(() => {
            applyHostAudioState();
            if (typeof phaserGame !== 'undefined' && phaserGame && phaserGame.scene) {
                phaserGame.scene.resume('default');
            }
        });
    }
    // Do not use Page Visibility — YouTube Playables requires pause/resume and
    // audio only via ytgame.system.onPause / onResume / onAudioEnabledChange.
    applyHostAudioState();
}

function playSound(d, a, e = 1) {
    if (!hostAudioEnabled) return null;
    let b = "";
    void 0 !== a && (b = Math.floor(Math.random() * a) + 1);
    let c = d + b;
    if (!gameObjects.sounds[c]) {
        console.warn("playSound: sound not registered: " + c);
        return null;
    }
    gameObjects.sounds[c].play();
    // Always the true volume. Muting is handled once, globally, by
    // applyHostAudioState - writing 0 here would strand this sound silent after
    // the player unmutes, because nothing re-sets a looping sound's volume.
    gameObjects.sounds[c].volume = e * gameVars.masterAudio * gameVars.soundMult;
    return gameObjects.sounds[c];
}

function tweenVolume(a, b, c = 1500) {
    if (!gameObjects.sounds[a]) {
        console.warn("tweenVolume: sound not registered: " + a);
        return null;
    }
    if (globalScene && globalScene.tweens) {
        globalScene.tweens.killTweensOf(gameObjects.sounds[a]);
    }
    // Fades always run to their true target; the global mute decides whether any
    // of it is audible. Tweening to 0 while muted left the mix wrong on unmute.
    let targetVol = b * gameVars.masterAudio * gameVars.soundMult;
    if (c <= 0) {
        gameObjects.sounds[a].volume = targetVol;
    } else {
        globalScene.tweens.chain({
            targets: [gameObjects.sounds[a]],
            tweens: [{
                volume: targetVol,
                duration: c
            }]
        });
    }
    return gameObjects.sounds[a];
}

function playSoundOnce(a, b, c = 1) {
    if (!hostAudioEnabled) return null;
    if (!gameObjects.sounds[a]) {
        console.warn("playSoundOnce: sound not registered: " + a);
        return null;
    }
    let targetVol = c * gameVars.masterAudio * gameVars.soundMult;
    oneTimeScares[a] || (oneTimeScares[a] = !0, b ? gameDelay(() => {
        if (!hostAudioEnabled) return;
        gameObjects.sounds[a].volume = targetVol, gameObjects.sounds[a].play()
    }, b) : (gameObjects.sounds[a].volume = targetVol, gameObjects.sounds[a].play()))
}

function setupHand(a) {
    gameObjects.baseTouchLayer = a.make.image({
        x: 0,
        y: 0,
        key: "whitePixel",
        add: !0,
        scale: {
            x: 2e3,
            y: 1e3
        },
        alpha: .01
    }), gameObjects.baseTouchLayer.setInteractive(), gameObjects.baseTouchLayer.on("pointerdown", onPointerDown, a), gameObjects.baseTouchLayer.on("pointermove", onPointerMove, a), gameObjects.baseTouchLayer.on("pointerup", onPointerUp, a), gameObjects.hand = new Hand(a)
}

function setupGame(a) {
    initializeSounds(a), gameObjects.generalDarkness = a.add.image(gameVars.halfWidth, gameVars.halfHeight, "darkBluePixel"), gameObjects.generalDarkness.scaleX = 1e3, gameObjects.generalDarkness.scaleY = 1e3, gameObjects.generalDarkness.setBlendMode(Phaser.BlendModes.MULTIPLY), gameObjects.generalDarkness.alpha = 0, gameObjects.generalDim = a.add.image(gameVars.halfWidth, gameVars.halfHeight, "generalDim"), gameObjects.generalDim.alpha = .75, gameObjects.hueCntr.add(gameObjects.generalDim), gameObjects.exhibit = new Exhibit(a, gameObjects.exhibCntr, gameObjects.shadowCntr, gameObjects.portraitCntr, gameObjects.btnCntr, gameObjects.darkCtnr), gameObjects.flashDim = a.add.image(gameVars.halfWidth, gameVars.halfHeight, "blackPixel"), gameObjects.flashDim.scaleX = 1e3, gameObjects.flashDim.scaleY = 1e3, gameObjects.flashDim.alpha = 0, gameObjects.flashDim.brightVal = 0, gameObjects.flashDim.blackOut = !1, gameObjects.flashDim.recovering = !1, gameObjects.mainDarkCntr.add(gameObjects.flashDim), gameObjects.candleBright = a.make.sprite({
        x: gameVars.halfWidth,
        y: gameVars.halfHeight,
        key: "candleBright",
        add: !0
    }), gameObjects.candleBright.alpha = 0, gameObjects.candleBright.scaleX = 2.75, gameObjects.candleBright.scaleY = 2.75, gameObjects.candleBright.setBlendMode(Phaser.BlendModes.MULTIPLY), gameObjects.mainDarkCntr.add(gameObjects.candleBright), gameObjects.candleDark = a.make.sprite({
        x: gameVars.halfWidth,
        y: gameVars.halfHeight,
        key: "candleDark",
        add: !0
    }), gameObjects.candleDark.alpha = 0, gameObjects.candleDark.accX = 0, gameObjects.candleDark.accY = 0, gameObjects.candleDark.swayX = 0, gameObjects.candleDark.swayY = 0, gameObjects.candleDark.swayAccX = 0, gameObjects.candleDark.swayAccY = 0, gameObjects.candleDark.scaleSpdX = 0, gameObjects.candleDark.scaleSpdY = 0, gameObjects.candleDark.setBlendMode(Phaser.BlendModes.MULTIPLY), gameObjects.mainDarkCntr.add(gameObjects.candleDark), gameObjects.generalRedness = a.add.image(gameVars.halfWidth, gameVars.halfHeight, "redlight"), gameObjects.generalRedness.alpha = 0, gameObjects.hueCntr.add(gameObjects.generalRedness), this.setupMoveButtons(a), this.setupGameplayButtons(a), initGuideIndicators(a), this.initExhibit(a), this.setupInstructionsStand(a), initFlashScreens(), initStaticScreens(), initOneTimeListeners(), gameObjects.infoText = a.make.text({
        x: gameVars.halfWidth,
        y: gameVars.halfHeight + 220,
        text: " ",
        origin: {
            x: .5,
            y: .5
        },
        style: {
            font: "bold 46px Times New Roman",
            align: "center",
            fill: "white"
        }
    }), gameObjects.infoText.setOrigin(.5, .5), gameObjects.infoText.setShadow(0, 0, void 0, 6, !0, !0), gameObjects.infoText.setStroke("#000000", 6), gameObjects.infoText.alpha = 0
}

function update(w, s) {
    let a = Math.min(5, s / 16.666666);
    if (gameVarsTemp.skipUpdateFrame) {
        gameVarsTemp.skipUpdateFrame = !1;
        return
    }
    for (let f = 0; f < updateFuncList.length; f++) updateFuncList[f](a);
    gameVars.mouseaccx = gameVars.mouseposx - gameVars.prevMouseposx, gameVars.mouseaccy = gameVars.mouseposy - gameVars.prevMouseposy, gameVars.prevMouseposx = gameVars.mouseposx, gameVars.prevMouseposy = gameVars.mouseposy, gameObjects.hand.update(a);
    let j = gameObjects.hand.getPosX() - gameObjects.exhibCntr.goalOffsetX,
        k = gameObjects.hand.getPosY() - gameObjects.exhibCntr.goalOffsetY,
        b = null;
    for (let g = gameObjects.buttonList.length - 1; g >= 0; g--) {
        let e = gameObjects.buttonList[g];
        if (e && e.checkCoordOver(j, k)) {
            e.onHover(), b = e;
            break
        }
    }
    if (this.lastHovered && this.lastHovered !== b && "disable" !== this.lastHovered.getState() && this.lastHovered.onHoverOut(), this.lastHovered && !b ? gameObjects.hand.setPointing(!1) : !this.lastHovered && b && gameObjects.hand.setPointing(!0), this.lastHovered = b, !gameVars.gameConstructed) {
        handleViewShift(), handleViewShiftLoading();
        let t = 0,
            l = (t = gameVarsTemp.loadAmt < .8 ? .6 * gameVarsTemp.loadAmt : gameVarsTemp.loadAmt < .999 ? .6 * gameVarsTemp.loadAmt + (gameVarsTemp.loadAmt - .8) * 1.98 : gameVarsTemp.loadAmt) * gameObjectsTemp.loadingBarBacking.scaleX - gameObjectsTemp.loadingBar.scaleX;
        if (1 === gameVarsTemp.loadAmt && (l += 12), gameObjectsTemp.loadingBar.scaleX = Math.min(gameObjectsTemp.loadingBarBacking.scaleX, gameObjectsTemp.loadingBar.scaleX + .05 * l), gameObjectsTemp.funlid.rotation = gameObjectsTemp.loadingBar.scaleX * gameObjectsTemp.loadingBar.scaleX * 0.00007, gameObjectsTemp.loadingBar.scaleX >= gameObjectsTemp.loadingBarBacking.scaleX && !gameVarsTemp.loadAnimComplete && (gameVarsTemp.loadAnimComplete = !0, onLoadAnimComplete(this)), gameObjectsTemp.loadingWelcome && gameVars.gameStarted) {
            let m = gameObjectsTemp.loadingWelcome.rotation * (1 + gameObjectsTemp.loadingWelcome.rotation) * 4e3;
            gameObjects.loadingCntr.shakeAccX = -0.4 * gameObjects.loadingCntr.swayX + (Math.random() - .5) * m, gameObjects.loadingCntr.shakeAccY = -0.4 * gameObjects.loadingCntr.swayY + (Math.random() - .5) * m, gameObjects.loadingCntr.swayX += gameObjects.loadingCntr.shakeAccX, gameObjects.loadingCntr.swayY += gameObjects.loadingCntr.shakeAccY
        }
        if (gameObjectsTemp.popup.rotation == 0) {
            gameObjectsTemp.popup.y = gameVars.halfHeight + 22 - (gameObjectsTemp.loadingBar.scaleX * gameObjectsTemp.loadingBar.scaleX * 0.006)
        }
        return
    }
    if (handleViewShift(), gameVars.darkPoint) {
        let c = gameObjects.candleDark.x - j + gameObjects.exhibCntr.swayX,
            d = gameObjects.candleDark.y - k + gameObjects.exhibCntr.swayY;
        10 > Math.sqrt(c * c + d * d) && (c *= .5, d *= .5);
        let h = Math.sqrt(gameVars.mouseaccx * gameVars.mouseaccx + gameVars.mouseaccy * gameVars.mouseaccy),
            n = 1 - .02 * a;
        gameObjects.candleDark.swayAccX = gameObjects.candleDark.swayAccX * n + (Math.random() - .5) * (.015 + .004 * h), gameObjects.candleDark.swayAccY = gameObjects.candleDark.swayAccY * n + (Math.random() - .5) * (.015 + .004 * h);
        let u = .1 / a,
            o = a * a * .005,
            p = 1.2 - Math.min(.1, u);
        gameObjects.candleDark.swayX += .016 * c - gameObjects.candleDark.swayX * p + gameObjects.candleDark.swayAccX, gameObjects.candleDark.swayY += .013 * d - gameObjects.candleDark.swayY * p + gameObjects.candleDark.swayAccY, gameObjects.candleDark.accX += -(.11 * gameObjects.candleDark.accX) + gameObjects.candleDark.swayX, gameObjects.candleDark.accY += -(.11 * gameObjects.candleDark.accY) + gameObjects.candleDark.swayY, gameObjects.candleDark.x -= gameObjects.candleDark.accX * a + o * c, gameObjects.candleDark.y -= gameObjects.candleDark.accY * a + o * d, gameObjects.candleBright.x = gameObjects.candleDark.x, gameObjects.candleBright.y = gameObjects.candleDark.y, gameObjects.candleDark.scaleSpdX = .985 * gameObjects.candleDark.scaleSpdX + .08 * h, gameObjects.candleDark.scaleSpdY = gameObjects.candleDark.scaleSpdX;
        let q = 4 + .08 * Math.random() - Math.min(1.4, .05 * Math.abs(gameObjects.candleDark.scaleSpdX)),
            r = 4 + .08 * Math.random() - Math.min(1.4, .05 * Math.abs(gameObjects.candleDark.scaleSpdY));
        gameObjects.flashDim.blackOut ? (Math.random() > .97 ? gameObjects.flashDim.alpha = 1 - .5 * Math.random() : gameObjects.flashDim.alpha = 1, gameObjects.flashDim.brightVal += .006, gameObjects.flashDim.brightVal > .4 && (gameObjects.flashDim.blackOut = !1, gameObjects.flashDim.recovering = !0, q = 2, r = 2, gameObjects.flashDim.alpha = 0)) : gameVars.darkPoint, gameObjects.candleDark.scaleX = q + gameVars.initialExtraDark, gameObjects.candleDark.scaleY = r + gameVars.initialExtraDark, gameVars.initialExtraDark > .01 && (gameVars.initialExtraDark *= .94, gameObjects.candleBright.scaleX = 2.75 + .25 * gameVars.initialExtraDark, gameObjects.candleBright.scaleY = 2.75 + .25 * gameVars.initialExtraDark)
    }
    if (globalScene.cameras.main.x *= .6, globalScene.cameras.main.y *= .6, gameVars.horrorPoint && (gameObjects.generalRedness.alpha = Math.max(0, .998 * gameObjects.generalRedness.alpha - 1e-4 * a)), updateMusicBox(a), gameVarsTemp.startDarkFlicker && (gameVarsTemp.darkFlickerCountdown -= a, gameVarsTemp.darkFlickerCountdown <= 0)) {
        gameVarsTemp.darkFlickerCountdown = 1e3 + 4e3 * Math.random();
        let v = .01 + .1 * Math.random();
        gameObjects.generalDarkness.alpha += v;
        let i = 12 * Math.random() + 5;
        gameDelay(() => {
            gameObjects.generalDarkness.alpha -= v, .6 > Math.random() && gameDelay(() => {
                let a = 15 * Math.random();
                a = Math.floor(a * a);
                let b = .03 + .06 * Math.random();
                gameObjects.generalDarkness.alpha += b, gameDelay(() => {
                    gameObjects.generalDarkness.alpha -= b
                }, a)
            }, 800 + 1200 * Math.random())
        }, i = Math.floor(i * i))
    }
}

function handleViewShift() {
    if (gameVars.isFrozen) return;
    gameObjects.exhibCntr.swayAmt = Math.max(gameVars.baseSway, gameObjects.exhibCntr.swayAmt - .001), gameObjects.exhibCntr.swayAccX += (Math.random() - .5) * gameObjects.exhibCntr.swayAmt, gameObjects.exhibCntr.swayAccY += (Math.random() - .5) * gameObjects.exhibCntr.swayAmt, gameObjects.exhibCntr.swayAccX *= .975, gameObjects.exhibCntr.swayAccY *= .975, gameObjects.exhibCntr.swayX += gameObjects.exhibCntr.swayAccX, gameObjects.exhibCntr.swayY += gameObjects.exhibCntr.swayAccY, gameObjects.exhibCntr.swayX *= .995, gameObjects.exhibCntr.swayY *= .995;
    let a = gameObjects.exhibCntr.goalOffsetX - gameObjects.exhibCntr.offsetX,
        b = gameObjects.exhibCntr.goalOffsetY - gameObjects.exhibCntr.offsetY;
    gameObjects.exhibCntr.offsetAccX += .0012 * a - .02 * gameObjects.exhibCntr.offsetAccX, gameObjects.exhibCntr.offsetAccY += .0012 * b - .02 * gameObjects.exhibCntr.offsetAccY, gameObjects.exhibCntr.offsetX = .9 * gameObjects.exhibCntr.offsetX + gameObjects.exhibCntr.offsetAccX, gameObjects.exhibCntr.offsetY = .9 * gameObjects.exhibCntr.offsetY + gameObjects.exhibCntr.offsetAccY, gameObjects.exhibCntr.x = gameObjects.exhibCntr.swayX + gameObjects.exhibCntr.offsetX, gameObjects.exhibCntr.y = gameObjects.exhibCntr.swayY + gameObjects.exhibCntr.offsetY + 4, gameObjects.shadowCntr.x = 1.01 * gameObjects.exhibCntr.x, gameObjects.shadowCntr.y = 1.01 * gameObjects.exhibCntr.y, gameObjects.portraitCntr.x = gameObjects.exhibCntr.x, gameObjects.portraitCntr.y = gameObjects.exhibCntr.y, gameObjects.btnCntr.x = gameObjects.exhibCntr.x, gameObjects.btnCntr.y = gameObjects.exhibCntr.y, gameObjects.mainDarkCntr.x = gameObjects.exhibCntr.x, gameObjects.mainDarkCntr.y = gameObjects.exhibCntr.y, gameObjects.darkCtnr.x = gameObjects.exhibCntr.x, gameObjects.darkCtnr.y = gameObjects.exhibCntr.y, gameObjects.hueCntr.x = -5 * gameObjects.exhibCntr.x, gameObjects.hueCntr.y = -5 * gameObjects.exhibCntr.y
}

function handleViewShiftLoading() {
    if (!gameObjects.loadingCntr || gameVars.isFrozen) return;
    gameObjects.exhibCntr.swayAmt = Math.max(gameVars.baseSway, gameObjects.exhibCntr.swayAmt - .001), gameObjects.loadingCntr.swayAccX += (Math.random() - .5) * gameObjects.loadingCntr.swayAmt, gameObjects.loadingCntr.swayAccY += (Math.random() - .5) * gameObjects.loadingCntr.swayAmt, gameObjects.loadingCntr.swayAccX *= .975, gameObjects.loadingCntr.swayAccY *= .975, gameObjects.loadingCntr.swayX += gameObjects.loadingCntr.swayAccX, gameObjects.loadingCntr.swayY += gameObjects.loadingCntr.swayAccY, gameObjects.loadingCntr.swayX *= .995, gameObjects.loadingCntr.swayY *= .995;
    let a = gameObjects.loadingCntr.goalOffsetX - gameObjects.loadingCntr.offsetX,
        b = gameObjects.loadingCntr.goalOffsetY - gameObjects.loadingCntr.offsetY;
    gameObjects.loadingCntr.offsetAccX += .0012 * a - .02 * gameObjects.loadingCntr.offsetAccX, gameObjects.loadingCntr.offsetAccY += .0012 * b - .02 * gameObjects.loadingCntr.offsetAccY, gameObjects.loadingCntr.offsetX = .9 * gameObjects.loadingCntr.offsetX + gameObjects.loadingCntr.offsetAccX, gameObjects.loadingCntr.offsetY = .9 * gameObjects.loadingCntr.offsetY + gameObjects.loadingCntr.offsetAccY, gameObjects.loadingCntr.x = gameObjects.loadingCntr.swayX + gameObjects.loadingCntr.offsetX, gameObjects.loadingCntr.y = gameObjects.loadingCntr.swayY + gameObjects.loadingCntr.offsetY
}

function mouseToHand(d, e) {
    let c = 10;
    gameVars.halfWidth, gameVars.halfHeight;
    let f = gameVars.halfWidth / (gameVars.halfWidth - c),
        g = gameVars.halfHeight / (gameVars.halfHeight - c),
        a = gameVars.halfWidth + f * (d - gameVars.halfWidth),
        b = gameVars.halfHeight + g * (e - gameVars.halfHeight);
    return a = Math.min(Math.max(0, a), gameVars.width - 1), b = Math.min(Math.max(0, b), gameVars.height - 1), {
        x: a,
        y: b
    }
}

function disableMoveButtons() {
    gameObjects.moveLeftBtn.setState("disable"), gameObjects.moveRightBtn.setState("disable")
}

function showMoveRightFlash() {
    let flashDur = 1150;
    let scaleMult = 1;
    if (gameVars.shownFirstFlash) {
        flashDur = 900;
        scaleMult = 0.65;
        gameObjects.moveRightFlash.alpha = 0.9;
    } else {
        gameObjects.moveRightFlash.alpha = 1.08;
    }
    gameObjects.moveRightFlash.scaleX = 1;
    gameObjects.moveRightFlash.scaleY = 1;
    gameVars.shownFirstFlash = true;

    globalScene.tweens.add({
        delay: 0,
        targets: gameObjects.moveRightFlash,
        alpha: 0,
        ease: 'Quad.easeOut',
        duration: flashDur
    });

    globalScene.tweens.add({
        delay: 0,
        targets: gameObjects.moveRightFlash,
        scaleX: 2.6 * scaleMult,
        scaleY: 3.7 * scaleMult,
        ease: 'Quart.easeOut',
        duration: flashDur
    });
}

function enableMoveButtons(showFlash = false) {
    0 !== gameObjects.exhibit.getCurrentScene() && gameObjects.moveLeftBtn.setState("normal");
    gameObjects.moveRightBtn.setState("normal");

    if (showFlash) {
        showMoveRightFlash();
    }
}

function disableMoveRightButton() {
    gameObjects.moveRightBtn.setState("disable")
}

function disableMoveLeftButton() {
    gameObjects.moveLeftBtn.setState("disable")
}

function enableMoveLeftButton() {
    0 !== gameObjects.exhibit.getCurrentScene() && gameObjects.moveLeftBtn.setState("normal")
}

function enableMoveRightButton() {
    gameObjects.moveRightBtn.setState("normal")
}

function setupMoveButtons(a) {
    gameObjects.moveLeftBtn = new Button(a, gameObjects.topBtnCntr, gameObjects.exhibit.moveLeft.bind(gameObjects.exhibit), {
        atlas: "buttons",
        ref: "move_btn_normal",
        x: 15,
        y: gameVars.halfHeight,
        scaleX: -1
    }, {
        atlas: "buttons",
        ref: "move_btn_over"
    }, {
        atlas: "buttons",
        ref: "move_btn_press"
    }, {
        atlas: "buttons",
        ref: "move_btn_disable"
    }), gameObjects.moveLeftBtnHighlight = globalScene.add.image(gameObjects.moveLeftBtn.getPosX(), gameObjects.moveLeftBtn.getPosY(), "buttons", "move_btn_glow"), gameObjects.moveLeftBtnHighlight.scaleX = -1, gameObjects.moveLeftBtnHighlight.alpha = 0, gameObjects.moveRightBtn = new Button(a, gameObjects.topBtnCntr, gameObjects.exhibit.moveRight.bind(gameObjects.exhibit), {
        atlas: "buttons",
        ref: "move_btn_normal",
        x: gameVars.width - 22,
        y: gameVars.halfHeight
    }, {
        atlas: "buttons",
        ref: "move_btn_over"
    }, {
        atlas: "buttons",
        ref: "move_btn_press"
    }, {
        atlas: "buttons",
        ref: "move_btn_disable"
    }), gameObjects.moveRightBtnHighlight = globalScene.add.image(gameObjects.moveRightBtn.getPosX(), gameObjects.moveRightBtn.getPosY(), "buttons", "move_btn_glow"), gameObjects.moveRightBtnHighlight.alpha = 0, gameObjects.moveRightBtnHighlight.state = "brightening";

    gameObjects.moveLeftBtn.setScrollFactor(0);
    gameObjects.moveRightBtn.setScrollFactor(0);

    gameObjects.moveRightFlash = globalScene.add.image(gameObjects.moveRightBtn.getPosX(), gameObjects.moveRightBtn.getPosY() + 55, "buttons", "move_btn_normal");
    gameObjects.moveRightFlash.setOrigin(0.38, 0.59);
    gameObjects.moveRightFlash.alpha = 0;
}

function tempFreeze(a = 1e3) {
    gameVars.isFrozen = !0, gameDelay(() => {
        gameVars.isFrozen = !1
    }, a)
}

function initOneTimeListeners() {
    let a;
    a = messageBus.subscribe("startDarkSequence", b => {
        a.unsubscribe(), gameObjects.entrance.entryLights1.alpha = 0, gameObjects.entrance.entryLights2.alpha = 0, removeFromUpdateFuncList(flipEntryLights), gameObjects.entrance.welcomeBtn.setState("disable")
    });
    let b;
    b = messageBus.subscribe("startHorrorSequence", e => {
        b.unsubscribe(), addToUpdateFuncList(flipEntryLights), gameObjects.entrance.welcomeBtn.setState("normal"), gameObjects.entrance.welcomeBtn.setNormalRef("welcomeTextDisable"), gameObjects.entrance.welcomeBtn.setHoverRef("welcomeTextDisable"), gameObjects.entrance.welcomeBtn.setPressRef("welcomeTextDisable"), gameObjects.museumStand.bringToTop(), gameObjects.standArrow = globalScene.add.image(gameObjects.museumStand.getPosX(), gameObjects.museumStand.getPosY(), "buttons", "stand_arrow"), gameObjects.standArrow.setOrigin(.5, 1), gameObjects.gameCtnr1.add(gameObjects.standArrow), gameObjects.museumStand.tweenScale({
            rotation: -0.01,
            duration: 150,
            ease: "Cubic.easeOut",
            onComplete() {
                gameObjects.museumStand.tweenScale({
                    rotation: 0,
                    yoyo: !0,
                    ease: "Sine.easeInOut",
                    duration: 650
                })
            }
        }), setupRoomFlower1(globalScene, 8, gameObjects.gameCtnr8), setupRoomFlower2(globalScene, 9, gameObjects.gameCtnr9), setupRoomFlower3(globalScene, 10, gameObjects.gameCtnr10), setupRoomFlower4(globalScene, 11, gameObjects.gameCtnr11), setupRoomFlower5(globalScene, 12, gameObjects.gameCtnr12), gameObjects.sounds.gladiatorx.play({
            loop: !0
        }), gameObjects.sounds.gladiatorx.volume = .01, globalScene.tweens.add({
            targets: gameObjects.sounds.gladiatorx,
            volume: .7,
            duration: 5e3
        }), gameDelay(() => {
            tweenVolume("gladiatorx", .9)
        }, 5e3);
        let c = gameObjects.clownWelcomePic.x,
            d = gameObjects.clownWelcomePic.y,
            a = gameObjects.clownWelcomePic.scaleX;
        gameObjects.clownWelcomePic.destroy(), gameObjects.clownWelcomePic = globalScene.add.image(c, d, "menu", "framesEnter5"), gameObjects.clownWelcomePic.scaleX = a, gameObjects.clownWelcomePic.scaleY = a, gameObjects.clownWelcomePic.cantChange = !0, gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic)
    })
}

function adStarted() {
    gameVars.masterAudio = 0, gameVars.isFrozen = !0;
    let c = ["gladiator1", "gladiator2", "gladiatorx"];
    for (let a = 0; a < c.length; a++) {
        let b = c[a];
        gameObjects.sounds[b].oldVolume = gameObjects.sounds[b].volume || 1, gameObjects.sounds[b].volume = 0
    }
}

function restoreAdMutedSounds() {
    gameVars.masterAudio = 1, gameVars.isFrozen = !1;
    let c = ["gladiator1", "gladiator2", "gladiatorx"];
    for (let a = 0; a < c.length; a++) {
        let b = gameObjects.sounds[c[a]];
        b && (b.volume = b.oldVolume ? b.oldVolume : 1)
    }
}

function adFinished() {
    restoreAdMutedSounds()
}

function adError() {
    restoreAdMutedSounds()
}

function showAltReality(a, c = 1) {
    if (!a || 0 === a.length) return;
    let d = a.shift(),
        b = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, d);
    b.depth = 1, b.scaleX = c, b.scaleY = c, gameDelay(() => {
        b.destroy(), showAltReality(a, c)
    }, 1 === a.length ? 70 : 40)
}
window.addEventListener("resize", function (a, b) {
    handleBorders();
}, !1)
window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
});
window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
window.addEventListener('pointerdown', () => {
    if (globalScene && globalScene.sound && globalScene.sound.context && globalScene.sound.context.state === 'suspended') {
        globalScene.sound.context.resume().catch(() => { });
    }
});

// Runs last, after every `let` in this file has been initialised. It touches
// hostAudioEnabled and phaserGame, and reading a `let` binding before its
// declaration has been evaluated throws - including through `typeof`, which only
// guards *undeclared* names. Called from the top of the file it aborted the whole
// script, leaving the game half-constructed.
setupHostAudioReconciliation();