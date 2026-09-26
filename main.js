function testMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

let isMobile = testMobile();

// Canvas size. Note gameVars.width (layout width used by the game code) is 1220, not 1210.
let pixelWidth = 1210;
let pixelHeight = 920;

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "phaser-app",
        width: pixelWidth,
        height: pixelHeight
    },
    antialias: true,
    transparent: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let globalScene;

// Persistent game state
let gameVars = {
    baseSway: 0.025,
    gameStarted: false,
    gameConstructed: false,
    mousedown: false,
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
    horrorPoint: false,
    darkPoint: false,
    isFrozen: false,
    walkSlow: false,
    initialExtraDark: 0,
    masterAudio: 1
};

// Scares/sounds that should only ever happen once, keyed by name
let oneTimeScares = {};

// Short-lived objects and state (loading screen, one-off effects)
let gameObjectsTemp = {};
let gameVarsTemp = {
    darkFlickerCountdown: 1000,
    loadAmt: 0.001
};

// Long-lived game objects
let gameObjects = {
    buttonList: [],
    draggedObj: null,
    loadingWelcomes: [],
    noteList: []
};

// Functions called every frame with the frame-time multiplier (see update())
let updateFuncList = [];

let game;

setTimeout(() => {
    game = new Phaser.Game(config);
}, 20);

function preload() {
    let gameDiv = document.getElementById("preload-notice");
    gameDiv.innerHTML = "";
    handleBorders();
    gameObjects.exhibCntr = makeSwayContainer(this);
    gameObjects.portraitCntr = this.add.container(0, 0);
    gameObjects.btnCntr = this.add.container(0, 0);
    gameObjects.hueCntr = this.add.container(0, 0);
    gameObjects.mainDarkCntr = this.add.container(0, 0);
    gameObjects.topBtnCntr = this.add.container(0, 0);
    gameObjects.loadingCntr = makeSwayContainer(this);
    gameObjects.loadingCntr.shakeAccX = 0;
    gameObjects.loadingCntr.shakeAccY = 0;
    for (let key in PRELOAD_IMAGES) {
        this.load.image(key, PRELOAD_IMAGES[key]);
    }
}

// Container that drifts with the mouse and sways (see handleViewShift)
function makeSwayContainer(scene) {
    let cntr = scene.add.container(0, 0);
    cntr.goalOffsetX = 0;
    cntr.goalOffsetY = 0;
    cntr.offsetX = 0;
    cntr.offsetY = 0;
    cntr.offsetAccX = 0;
    cntr.offsetAccY = 0;
    cntr.swayX = 0;
    cntr.swayY = 0;
    cntr.swayAccX = 0;
    cntr.swayAccY = 0;
    cntr.swayAmt = 0;
    return cntr;
}

function create() {
    onPreloadComplete(this);
}

function addLoadingText(scene, x, y, text, fontSize, color = "#ffffff") {
    let t = scene.add.text(x, y, text, {
        fontFamily: THEME.font,
        fontSize: fontSize,
        color: color,
        align: "center"
    });
    t.setOrigin(0.5, 0.5);
    t.setDepth(1);
    return t;
}

function onPreloadComplete(scene) {
    setupHand(scene);
    globalScene = scene;
    gameObjectsTemp.loadingBg = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, "blackPixel");
    gameObjectsTemp.loadingBg.scaleX = 1000;
    gameObjectsTemp.loadingBg.scaleY = 1000;
    gameObjects.loadingCntr.add(gameObjectsTemp.loadingBg);
    gameObjectsTemp.loadingText = addLoadingText(scene, gameVars.halfWidth, gameVars.halfHeight + 155, THEME.loadingText, 38);
    gameObjectsTemp.loadingBarBacking = scene.add.image(gameVars.halfWidth, gameVars.height - 260, "whitePixel");
    gameObjectsTemp.loadingBarBacking.alpha = 0.25;
    gameObjectsTemp.loadingBarBacking.scaleY = 4;
    gameObjectsTemp.loadingBarBacking.scaleX = 200;
    gameObjectsTemp.loadingBarBacking.setDepth(1);
    gameObjectsTemp.loadingBar = scene.add.image(gameVars.halfWidth, gameVars.height - 260, "whitePixel");
    gameObjectsTemp.loadingBar.scaleY = 4;
    gameObjectsTemp.loadingBar.setDepth(1);
    gameObjectsTemp.warningText = addLoadingText(scene, gameVars.halfWidth, gameVars.height - 188, THEME.warningText, 22);
    gameObjectsTemp.exhibitText = addLoadingText(scene, gameVars.halfWidth, 140, THEME.title, 36, "#777777");
    gameObjectsTemp.popup = scene.add.image(gameVars.halfWidth, gameVars.halfHeight + 1, "popup");
    gameObjectsTemp.funbox = scene.add.image(gameVars.halfWidth, gameVars.halfHeight - 25, "funbox");
    gameObjectsTemp.funlid = scene.add.image(gameVars.halfWidth + 95, gameVars.halfHeight - 90, "funlid");
    gameObjectsTemp.headphones = scene.add.image(gameVars.halfWidth, gameVars.height - 135, "headphones");
    gameObjectsTemp.headphoneText = addLoadingText(scene, gameVars.halfWidth, gameVars.height - 85, THEME.headphoneText, 22);
    scene.load.on("progress", function(amt) {
        gameVarsTemp.loadAmt = amt;
    });
    scene.load.on("loaderror", function(file) {
        console.error("Failed to load " + file.type + " '" + file.key + "' from " + file.src);
    });
    scene.load.on("complete", () => {
        onLoadComplete(scene);
    });
    for (let key in ATLASES) {
        scene.load.multiatlas(key, ATLASES[key]);
    }
    for (let key in IMAGES) {
        scene.load.image(key, IMAGES[key]);
    }
    for (let key in AUDIO) {
        scene.load.audio(key, AUDIO[key]);
    }
    scene.load.start();
}

function onLoadComplete(scene) {
    if (!SITE_LOCK.allowed.some(site => document.location.href.includes(site))) {
        // Stops execution of rest of game
        let gameDiv = document.getElementById("preload-notice");
        let invalidSite = document.location.href.substring(0, 25);
        gameDiv.innerHTML = invalidSite + "...\n" + SITE_LOCK.message;
        return;
    }
    gameObjectsTemp.popup.alpha = 1;
    gameObjectsTemp.popup.rotation = 0.01;
    scene.tweens.add({
        targets: gameObjectsTemp.popup,
        y: gameVars.halfHeight + 25,
        ease: "Cubic.easeOut",
        duration: 150,
        onComplete: () => {
            gameObjectsTemp.popup.destroy();
        }
    });
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.loadingText, gameObjectsTemp.funlid, gameObjectsTemp.funbox ],
        tweens: [ {
            delay: 100,
            alpha: 0,
            duration: 150
        } ],
        onComplete() {
            gameObjectsTemp.loadingText.destroy();
            gameObjectsTemp.funlid.destroy();
            gameObjectsTemp.funbox.destroy();
        }
    });
    gameObjectsTemp.brightLight = scene.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "loadingSS", "bright_light");
    gameObjectsTemp.brightLight.scaleX = 1;
    gameObjectsTemp.brightLight.scaleY = 1;
    gameObjectsTemp.brightLight.alpha = 0;
    gameObjects.loadingCntr.add(gameObjectsTemp.brightLight);
    gameObjectsTemp.loadingWelcome = makeWelcomeImage("loading_welcome");
    gameObjects.loadingCntr.add(gameObjectsTemp.loadingWelcome);
    gameObjectsTemp.loadingWelcome.rotation = 0;
    gameObjectsTemp.loadingWelcome.alpha = 0;
    gameObjectsTemp.loadingWelcome.scaleX = 0.8;
    gameObjectsTemp.loadingWelcome.scaleY = 0.8;
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.loadingWelcome ],
        tweens: [ {
            alpha: 0.01,
            duration: 1,
            onComplete() {
                gameObjects.startGameButton = new Button(scene, gameObjects.loadingCntr, () => {
                    startGame(scene);
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
            duration: 400
        } ]
    });
}

function onLoadAnimComplete(scene) {
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.loadingBar, gameObjectsTemp.loadingBarBacking ],
        tweens: [ {
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
                gameObjectsTemp.loadingBar.destroy();
                gameObjectsTemp.loadingBarBacking.destroy();
            }
        } ]
    });
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.headphones, gameObjectsTemp.headphoneText, gameObjectsTemp.warningText, gameObjectsTemp.exhibitText ],
        tweens: [ {
            alpha: 0.5,
            duration: 250
        } ]
    });
}

function startGame(scene) {
    gameObjects.loadingMusic = scene.sound.add("loadingMusic");
    gameObjects.loadingMusic.play();
    gameObjects.startGameButton.destroy();
    gameVars.gameStarted = true;
    gameObjects.scene = scene;
    setupGame(scene);
    gameObjectsTemp.blackTeeth = scene.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "menu", "teethBlack");
    gameObjectsTemp.blackTeeth.scaleX = 1.6;
    gameObjectsTemp.blackTeeth.scaleY = 1.6;
    gameObjectsTemp.blackTeethAnim = scene.tweens.timeline({
        targets: [ gameObjectsTemp.blackTeeth ],
        tweens: [ {
            scaleX: 1.45,
            scaleY: 1.45,
            ease: "Quad.easeIn",
            duration: 3000
        } ]
    });
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.headphones, gameObjectsTemp.headphoneText, gameObjectsTemp.warningText, gameObjectsTemp.exhibitText ],
        tweens: [ {
            alpha: 0,
            duration: 260,
            onComplete() {
                gameObjectsTemp.headphones.destroy();
                gameObjectsTemp.headphoneText.destroy();
                gameObjectsTemp.warningText.destroy();
                gameObjectsTemp.exhibitText.destroy();
            }
        } ]
    });
    // swallows clicks during the intro animation
    gameObjects.clickBlocker = new Button(scene, gameObjects.loadingCntr, () => {}, {
        ref: "transparent_pixel",
        atlas: "loadingSS",
        x: gameVars.halfWidth,
        y: gameVars.halfHeight,
        scaleX: 2000,
        scaleY: 2000
    });
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.brightLight ],
        tweens: [ {
            alpha: 1.2,
            scaleX: 3,
            scaleY: 3,
            duration: 2500,
            ease: "Quad.easeOut"
        } ]
    });
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.loadingWelcome ],
        tweens: [ {
            rotation: 0.01,
            scaleX: 1.14,
            scaleY: 1.14,
            duration: 2500,
            ease: "Quad.easeIn"
        } ]
    });
    gameObjectsTemp.circleLoading = [];
    scene.tweens.timeline({
        targets: [ gameObjectsTemp.loadingWelcome ],
        tweens: [ {
            alpha: 0.999,
            duration: 800
        }, {
            alpha: 0,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x1", true);
                addToUpdateFuncList(updateWelcomeFollower);
            }
        }, {
            alpha: 0.001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x2", true);
            }
        }, {
            alpha: 0.001,
            duration: 400,
            onStart() {
                let b = scene.add.image(gameVars.halfWidth, gameVars.halfHeight - 50 - 105, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b);
                gameObjects.loadingCntr.add(b);
                scene.tweens.add({
                    targets: b,
                    y: gameVars.halfHeight - 50 - 165,
                    duration: 1500
                });
                makeWelcomeImage("loading_welcome_x3", true);
            }
        }, {
            alpha: 0.001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x4", true);
            }
        }, {
            alpha: 0.001,
            duration: 350,
            onStart() {
                let b = scene.add.image(gameVars.halfWidth + 155, gameVars.halfHeight - 50 + 70, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b);
                gameObjects.loadingCntr.add(b);
                scene.tweens.add({
                    targets: b,
                    x: gameVars.halfWidth + 250,
                    y: gameVars.halfHeight - 50 + 110,
                    duration: 1300
                });
                makeWelcomeImage("loading_welcome_x5", true);
            }
        }, {
            alpha: 0.001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x6", true);
            }
        }, {
            alpha: 0.001,
            duration: 300,
            onStart() {
                let b = scene.add.image(gameVars.halfWidth - 190, gameVars.halfHeight - 50 - 75, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b);
                gameObjects.loadingCntr.add(b);
                scene.tweens.add({
                    targets: b,
                    x: gameVars.halfWidth - 250,
                    y: gameVars.halfHeight - 50 - 100,
                    duration: 1000
                });
                makeWelcomeImage("loading_welcome_x7", true);
            }
        }, {
            alpha: 0.001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x8", true);
            }
        }, {
            alpha: 0.001,
            duration: 200,
            onStart() {
                let b = scene.add.image(gameVars.halfWidth, gameVars.halfHeight - 50 + 135, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b);
                gameObjects.loadingCntr.add(b);
                scene.tweens.add({
                    targets: b,
                    y: gameVars.halfHeight - 50 + 185,
                    duration: 700
                });
                makeWelcomeImage("loading_welcome_x9", true);
            }
        }, {
            alpha: 0.001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x10", true);
            }
        }, {
            alpha: 0.001,
            duration: 150,
            onStart() {
                let b = scene.add.image(gameVars.halfWidth + 250, gameVars.halfHeight - 50 - 100, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b);
                gameObjects.loadingCntr.add(b);
                makeWelcomeImage("loading_welcome_x11", true);
            }
        }, {
            alpha: 0.001,
            duration: 10,
            onStart() {
                makeWelcomeImage("loading_welcome_x12", true);
            }
        }, {
            alpha: 0.001,
            duration: 500,
            onStart() {
                let b = scene.add.image(gameVars.halfWidth - 250, gameVars.halfHeight - 50 + 110, "loadingSS", "circle");
                gameObjectsTemp.circleLoading.push(b);
                gameObjects.loadingCntr.add(b);
                makeWelcomeImage("loading_welcome_x13", true);
            },
            onComplete() {
                let background = document.getElementById("background");
                background.style.opacity = "1";
                let leftborder = document.getElementById("leftborder");
                leftborder.style.opacity = "1";
                let rightborder = document.getElementById("rightborder");
                rightborder.style.opacity = "1";
                removeFromUpdateFuncList(updateWelcomeFollower);
                gameObjects.loadingMusic.stop();
                gameVars.gameConstructed = true;
                for (let b in gameObjects.loadingWelcomes) {
                    gameObjects.loadingWelcomes[b].destroy();
                }
                for (let a = 0; a < gameObjectsTemp.circleLoading.length; a++) {
                    gameObjectsTemp.circleLoading[a].destroy();
                }
                gameObjectsTemp.brightLight.destroy();
                gameObjects.clickBlocker.destroy();
                gameObjectsTemp.loadingBg.destroy();
                gameObjectsTemp.blackTeeth.destroy();
                gameObjectsTemp.blackTeethAnim.destroy();
                setTimeout(() => {
                    gameObjects.sounds.gladiator0.play({
                        loop: true
                    });
                    gameObjects.sounds.gladiator0.volume = 0.6;
                    tweenVolume("gladiator0", 0.7);
                }, 0);
                setTimeout(() => {
                    addToUpdateFuncList(flipEntryLights);
                }, 350);
                setTimeout(() => {
                    if (!gameVarsTemp.hasMoved) {
                        ftueMoveButton();
                    }
                }, 4000);
            }
        } ]
    });
}

function updateWelcomeFollower() {
    gameObjectsTemp.loadingWelcomeFollower.scaleX = 2 * gameObjectsTemp.loadingWelcome.scaleX;
    gameObjectsTemp.loadingWelcomeFollower.scaleY = 2 * gameObjectsTemp.loadingWelcome.scaleY;
    let c = 0.86 * gameObjectsTemp.loadingWelcome.scaleX * (1 + 0.12 * gameObjectsTemp.loadingWelcome.scaleX), d = 0.86 * gameObjectsTemp.loadingWelcome.scaleY * (1 + 0.12 * gameObjectsTemp.loadingWelcome.scaleY);
    for (let a = 0; a < gameObjectsTemp.circleLoading.length; a++) {
        let b = gameObjectsTemp.circleLoading[a];
        b.scaleX = c * (1 + 0.45 * Math.random());
        b.scaleY = d * (1 + 0.45 * Math.random());
    }
}

function handleBorders() {
    let leftBorder = document.getElementById("leftborder");
    let rightBorder = document.getElementById("rightborder");
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
        rightBorder.style.display = "none";
        leftBorder.style.display = "none";
    } else {
        rightBorder.style.display = "block";
        leftBorder.style.display = "block";
    }
    //block
    let widthAmt = 40 * gameScale;
    leftBorder.style.width = widthAmt + "px";
    rightBorder.style.width = widthAmt + "px";
    let shiftAmt = pixelWidth * gameScale * 0.5 + widthAmt - 2;
    leftBorder.style.left = "calc(50% - " + shiftAmt + "px)";
    rightBorder.style.right = "calc(50% - " + shiftAmt + "px)";
}

function initializeSounds(scene) {
    gameObjects.sounds = {};
    for (let key in AUDIO) {
        gameObjects.sounds[key] = scene.sound.add(key);
    }
}

// Looks up a sound, warning (instead of crashing) when it was never loaded
function getSound(key) {
    let sound = gameObjects.sounds && gameObjects.sounds[key];
    if (!sound) {
        console.warn("Unknown sound: " + key);
    }
    return sound;
}

// playSound("tear", 6) plays a random one of tear1..tear6
function playSound(name, variations, volume = 1) {
    let key = variations !== undefined ? name + (Math.floor(Math.random() * variations) + 1) : name;
    let sound = getSound(key);
    if (!sound) {
        return;
    }
    sound.volume = volume * gameVars.masterAudio;
    sound.play();
    return sound;
}

function tweenVolume(key, volume, duration = 1500) {
    let sound = getSound(key);
    if (!sound) {
        return;
    }
    globalScene.tweens.timeline({
        targets: [ sound ],
        tweens: [ {
            volume: volume * gameVars.masterAudio,
            duration: duration
        } ]
    });
    return sound;
}

function playSoundOnce(key, delay, volume = 1) {
    if (oneTimeScares[key]) {
        return;
    }
    oneTimeScares[key] = true;
    let play = () => {
        let sound = getSound(key);
        if (!sound) {
            return;
        }
        sound.volume = volume * gameVars.masterAudio;
        sound.play();
    };
    if (delay) {
        setTimeout(play, delay);
    } else {
        play();
    }
}

function setupHand(scene) {
    gameObjects.baseTouchLayer = scene.make.image({
        x: 0,
        y: 0,
        key: "whitePixel",
        add: true,
        scale: {
            x: 2000,
            y: 1000
        },
        alpha: 0.01
    });
    gameObjects.baseTouchLayer.setInteractive();
    gameObjects.baseTouchLayer.on("pointerdown", onPointerDown, scene);
    gameObjects.baseTouchLayer.on("pointermove", onPointerMove, scene);
    gameObjects.baseTouchLayer.on("pointerup", onPointerUp, scene);
    gameObjects.hand = new Hand(scene);
}

function setupGame(scene) {
    initializeSounds(scene);
    gameObjects.generalDarkness = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, "darkBluePixel");
    gameObjects.generalDarkness.scaleX = 1000;
    gameObjects.generalDarkness.scaleY = 1000;
    gameObjects.generalDarkness.setBlendMode(Phaser.BlendModes.MULTIPLY);
    gameObjects.generalDarkness.alpha = 0;
    gameObjects.generalDim = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, "generalDim");
    gameObjects.generalDim.alpha = 0.75;
    gameObjects.hueCntr.add(gameObjects.generalDim);
    gameObjects.exhibit = new Exhibit(scene, gameObjects.exhibCntr, gameObjects.portraitCntr, gameObjects.btnCntr);
    gameObjects.flashDim = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, "blackPixel");
    gameObjects.flashDim.scaleX = 1000;
    gameObjects.flashDim.scaleY = 1000;
    gameObjects.flashDim.alpha = 0;
    gameObjects.flashDim.brightVal = 0;
    gameObjects.flashDim.blackOut = false;
    gameObjects.flashDim.recovering = false;
    gameObjects.mainDarkCntr.add(gameObjects.flashDim);
    gameObjects.candleBright = scene.make.sprite({
        x: gameVars.halfWidth,
        y: gameVars.halfHeight,
        key: "candleBright",
        add: true
    });
    gameObjects.candleBright.alpha = 0;
    gameObjects.candleBright.scaleX = 2.75;
    gameObjects.candleBright.scaleY = 2.75;
    gameObjects.candleBright.setBlendMode(Phaser.BlendModes.MULTIPLY);
    gameObjects.mainDarkCntr.add(gameObjects.candleBright);
    gameObjects.candleDark = scene.make.sprite({
        x: gameVars.halfWidth,
        y: gameVars.halfHeight,
        key: "candleDark",
        add: true
    });
    gameObjects.candleDark.alpha = 0;
    gameObjects.candleDark.accX = 0;
    gameObjects.candleDark.accY = 0;
    gameObjects.candleDark.swayX = 0;
    gameObjects.candleDark.swayY = 0;
    gameObjects.candleDark.swayAccX = 0;
    gameObjects.candleDark.swayAccY = 0;
    gameObjects.candleDark.scaleSpdX = 0;
    gameObjects.candleDark.scaleSpdY = 0;
    gameObjects.candleDark.setBlendMode(Phaser.BlendModes.MULTIPLY);
    gameObjects.mainDarkCntr.add(gameObjects.candleDark);
    gameObjects.generalRedness = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, "redlight");
    gameObjects.generalRedness.alpha = 0;
    gameObjects.hueCntr.add(gameObjects.generalRedness);
    this.setupMoveButtons(scene);
    this.setupGameplayButtons(scene);
    initGuideIndicators(scene);
    this.initExhibit(scene);
    this.setupInstructionsStand(scene);
    initFlashScreens();
    initStaticScreens();
    initOneTimeListeners();
    gameObjects.infoText = scene.make.text({
        x: gameVars.halfWidth,
        y: gameVars.halfHeight + 220,
        text: " ",
        origin: {
            x: 0.5,
            y: 0.5
        },
        style: {
            font: "bold 46px " + THEME.font,
            align: "center",
            fill: "white"
        }
    });
    gameObjects.infoText.setOrigin(0.5, 0.5);
    gameObjects.infoText.setShadow(0, 0, undefined, 6, true, true);
    gameObjects.infoText.setStroke("#000000", 6);
    gameObjects.infoText.alpha = 0;
}

function update(w, s) {
    let a = Math.min(5, s / 16.666666);
    if (gameVarsTemp.skipUpdateFrame) {
        gameVarsTemp.skipUpdateFrame = false;
        return;
    }
    for (let f = 0; f < updateFuncList.length; f++) {
        updateFuncList[f](a);
    }
    gameVars.mouseaccx = gameVars.mouseposx - gameVars.prevMouseposx;
    gameVars.mouseaccy = gameVars.mouseposy - gameVars.prevMouseposy;
    gameVars.prevMouseposx = gameVars.mouseposx;
    gameVars.prevMouseposy = gameVars.mouseposy;
    gameObjects.hand.update(a);
    let j = gameObjects.hand.getPosX() - gameObjects.exhibCntr.goalOffsetX, k = gameObjects.hand.getPosY() - gameObjects.exhibCntr.goalOffsetY, b = null;
    for (let g = gameObjects.buttonList.length - 1; g >= 0; g--) {
        let e = gameObjects.buttonList[g];
        if (e && e.checkCoordOver(j, k)) {
            e.onHover();
            b = e;
            break;
        }
    }
    if (this.lastHovered && this.lastHovered !== b && "disable" !== this.lastHovered.getState()) {
        this.lastHovered.onHoverOut();
    }
    if (this.lastHovered && !b) {
        gameObjects.hand.setPointing(false);
    } else if (!this.lastHovered && b) {
        gameObjects.hand.setPointing(true);
    }
    this.lastHovered = b;
    if (!gameVars.gameConstructed) {
        handleViewShift();
        handleViewShiftLoading();
        let t = 0, l = (t = gameVarsTemp.loadAmt < 0.8 ? 0.6 * gameVarsTemp.loadAmt : gameVarsTemp.loadAmt < 0.999 ? 0.6 * gameVarsTemp.loadAmt + (gameVarsTemp.loadAmt - 0.8) * 1.98 : gameVarsTemp.loadAmt) * gameObjectsTemp.loadingBarBacking.scaleX - gameObjectsTemp.loadingBar.scaleX;
        if (1 === gameVarsTemp.loadAmt) {
            l += 12;
        }
        gameObjectsTemp.loadingBar.scaleX = Math.min(gameObjectsTemp.loadingBarBacking.scaleX, gameObjectsTemp.loadingBar.scaleX + 0.05 * l);
        gameObjectsTemp.funlid.rotation = gameObjectsTemp.loadingBar.scaleX * gameObjectsTemp.loadingBar.scaleX * 0.00007;
        if (gameObjectsTemp.loadingBar.scaleX >= gameObjectsTemp.loadingBarBacking.scaleX && !gameVarsTemp.loadAnimComplete) {
            gameVarsTemp.loadAnimComplete = true;
            onLoadAnimComplete(this);
        }
        if (gameObjectsTemp.loadingWelcome && gameVars.gameStarted) {
            let m = gameObjectsTemp.loadingWelcome.rotation * (1 + gameObjectsTemp.loadingWelcome.rotation) * 4000;
            gameObjects.loadingCntr.shakeAccX = -0.4 * gameObjects.loadingCntr.swayX + (Math.random() - 0.5) * m;
            gameObjects.loadingCntr.shakeAccY = -0.4 * gameObjects.loadingCntr.swayY + (Math.random() - 0.5) * m;
            gameObjects.loadingCntr.swayX += gameObjects.loadingCntr.shakeAccX;
            gameObjects.loadingCntr.swayY += gameObjects.loadingCntr.shakeAccY;
        }
        if (gameObjectsTemp.popup.rotation == 0) {
            gameObjectsTemp.popup.y = gameVars.halfHeight + 22 - gameObjectsTemp.loadingBar.scaleX * gameObjectsTemp.loadingBar.scaleX * 0.006;
        }
        return;
    }
    handleViewShift();
    if (gameVars.darkPoint) {
        let c = gameObjects.candleDark.x - j + gameObjects.exhibCntr.swayX, d = gameObjects.candleDark.y - k + gameObjects.exhibCntr.swayY;
        if (10 > Math.sqrt(c * c + d * d)) {
            c *= 0.5;
            d *= 0.5;
        }
        let h = Math.sqrt(gameVars.mouseaccx * gameVars.mouseaccx + gameVars.mouseaccy * gameVars.mouseaccy), n = 1 - 0.02 * a;
        gameObjects.candleDark.swayAccX = gameObjects.candleDark.swayAccX * n + (Math.random() - 0.5) * (0.015 + 0.004 * h);
        gameObjects.candleDark.swayAccY = gameObjects.candleDark.swayAccY * n + (Math.random() - 0.5) * (0.015 + 0.004 * h);
        let u = 0.1 / a, o = a * a * 0.005, p = 1.2 - Math.min(0.1, u);
        gameObjects.candleDark.swayX += 0.016 * c - gameObjects.candleDark.swayX * p + gameObjects.candleDark.swayAccX;
        gameObjects.candleDark.swayY += 0.013 * d - gameObjects.candleDark.swayY * p + gameObjects.candleDark.swayAccY;
        gameObjects.candleDark.accX += -(0.11 * gameObjects.candleDark.accX) + gameObjects.candleDark.swayX;
        gameObjects.candleDark.accY += -(0.11 * gameObjects.candleDark.accY) + gameObjects.candleDark.swayY;
        gameObjects.candleDark.x -= gameObjects.candleDark.accX * a + o * c;
        gameObjects.candleDark.y -= gameObjects.candleDark.accY * a + o * d;
        gameObjects.candleBright.x = gameObjects.candleDark.x;
        gameObjects.candleBright.y = gameObjects.candleDark.y;
        gameObjects.candleDark.scaleSpdX = 0.985 * gameObjects.candleDark.scaleSpdX + 0.08 * h;
        gameObjects.candleDark.scaleSpdY = gameObjects.candleDark.scaleSpdX;
        let q = 4 + 0.08 * Math.random() - Math.min(1.4, 0.05 * Math.abs(gameObjects.candleDark.scaleSpdX)), r = 4 + 0.08 * Math.random() - Math.min(1.4, 0.05 * Math.abs(gameObjects.candleDark.scaleSpdY));
        if (gameObjects.flashDim.blackOut) {
            if (Math.random() > 0.97) {
                gameObjects.flashDim.alpha = 1 - 0.5 * Math.random();
            } else {
                gameObjects.flashDim.alpha = 1;
            }
            gameObjects.flashDim.brightVal += 0.006;
            if (gameObjects.flashDim.brightVal > 0.4) {
                gameObjects.flashDim.blackOut = false;
                gameObjects.flashDim.recovering = true;
                q = 2;
                r = 2;
                gameObjects.flashDim.alpha = 0;
            }
        } else {
            gameVars.darkPoint;
        }
        gameObjects.candleDark.scaleX = q + gameVars.initialExtraDark;
        gameObjects.candleDark.scaleY = r + gameVars.initialExtraDark;
        if (gameVars.initialExtraDark > 0.01) {
            gameVars.initialExtraDark *= 0.94;
            gameObjects.candleBright.scaleX = 2.75 + 0.25 * gameVars.initialExtraDark;
            gameObjects.candleBright.scaleY = 2.75 + 0.25 * gameVars.initialExtraDark;
        }
    }
    globalScene.cameras.main.x *= 0.6;
    globalScene.cameras.main.y *= 0.6;
    if (gameVars.horrorPoint) {
        gameObjects.generalRedness.alpha = Math.max(0, 0.998 * gameObjects.generalRedness.alpha - 0.0001 * a);
    }
    updateMusicBox(a);
    if (gameVarsTemp.startDarkFlicker && (gameVarsTemp.darkFlickerCountdown -= a, 
    gameVarsTemp.darkFlickerCountdown <= 0)) {
        gameVarsTemp.darkFlickerCountdown = 1000 + 4000 * Math.random();
        let v = 0.01 + 0.1 * Math.random();
        gameObjects.generalDarkness.alpha += v;
        let i = 12 * Math.random() + 5;
        setTimeout(() => {
            gameObjects.generalDarkness.alpha -= v;
            if (0.6 > Math.random()) {
                setTimeout(() => {
                    let a = 15 * Math.random();
                    a = Math.floor(a * a);
                    let b = 0.03 + 0.06 * Math.random();
                    gameObjects.generalDarkness.alpha += b;
                    setTimeout(() => {
                        gameObjects.generalDarkness.alpha -= b;
                    }, a);
                }, 800 + 1200 * Math.random());
            }
        }, i = Math.floor(i * i));
    }
}

function handleViewShift() {
    if (gameVars.isFrozen) {
        return;
    }
    gameObjects.exhibCntr.swayAmt = Math.max(gameVars.baseSway, gameObjects.exhibCntr.swayAmt - 0.001);
    gameObjects.exhibCntr.swayAccX += (Math.random() - 0.5) * gameObjects.exhibCntr.swayAmt;
    gameObjects.exhibCntr.swayAccY += (Math.random() - 0.5) * gameObjects.exhibCntr.swayAmt;
    gameObjects.exhibCntr.swayAccX *= 0.975;
    gameObjects.exhibCntr.swayAccY *= 0.975;
    gameObjects.exhibCntr.swayX += gameObjects.exhibCntr.swayAccX;
    gameObjects.exhibCntr.swayY += gameObjects.exhibCntr.swayAccY;
    gameObjects.exhibCntr.swayX *= 0.995;
    gameObjects.exhibCntr.swayY *= 0.995;
    let a = gameObjects.exhibCntr.goalOffsetX - gameObjects.exhibCntr.offsetX, b = gameObjects.exhibCntr.goalOffsetY - gameObjects.exhibCntr.offsetY;
    gameObjects.exhibCntr.offsetAccX += 0.0012 * a - 0.02 * gameObjects.exhibCntr.offsetAccX;
    gameObjects.exhibCntr.offsetAccY += 0.0012 * b - 0.02 * gameObjects.exhibCntr.offsetAccY;
    gameObjects.exhibCntr.offsetX = 0.9 * gameObjects.exhibCntr.offsetX + gameObjects.exhibCntr.offsetAccX;
    gameObjects.exhibCntr.offsetY = 0.9 * gameObjects.exhibCntr.offsetY + gameObjects.exhibCntr.offsetAccY;
    gameObjects.exhibCntr.x = gameObjects.exhibCntr.swayX + gameObjects.exhibCntr.offsetX;
    gameObjects.exhibCntr.y = gameObjects.exhibCntr.swayY + gameObjects.exhibCntr.offsetY + 4;
    gameObjects.portraitCntr.x = gameObjects.exhibCntr.x;
    gameObjects.portraitCntr.y = gameObjects.exhibCntr.y;
    gameObjects.btnCntr.x = gameObjects.exhibCntr.x;
    gameObjects.btnCntr.y = gameObjects.exhibCntr.y;
    gameObjects.mainDarkCntr.x = gameObjects.exhibCntr.x;
    gameObjects.mainDarkCntr.y = gameObjects.exhibCntr.y;
    gameObjects.hueCntr.x = -5 * gameObjects.exhibCntr.x;
    gameObjects.hueCntr.y = -5 * gameObjects.exhibCntr.y;
}

function handleViewShiftLoading() {
    if (!gameObjects.loadingCntr || gameVars.isFrozen) {
        return;
    }
    gameObjects.exhibCntr.swayAmt = Math.max(gameVars.baseSway, gameObjects.exhibCntr.swayAmt - 0.001);
    gameObjects.loadingCntr.swayAccX += (Math.random() - 0.5) * gameObjects.loadingCntr.swayAmt;
    gameObjects.loadingCntr.swayAccY += (Math.random() - 0.5) * gameObjects.loadingCntr.swayAmt;
    gameObjects.loadingCntr.swayAccX *= 0.975;
    gameObjects.loadingCntr.swayAccY *= 0.975;
    gameObjects.loadingCntr.swayX += gameObjects.loadingCntr.swayAccX;
    gameObjects.loadingCntr.swayY += gameObjects.loadingCntr.swayAccY;
    gameObjects.loadingCntr.swayX *= 0.995;
    gameObjects.loadingCntr.swayY *= 0.995;
    let a = gameObjects.loadingCntr.goalOffsetX - gameObjects.loadingCntr.offsetX, b = gameObjects.loadingCntr.goalOffsetY - gameObjects.loadingCntr.offsetY;
    gameObjects.loadingCntr.offsetAccX += 0.0012 * a - 0.02 * gameObjects.loadingCntr.offsetAccX;
    gameObjects.loadingCntr.offsetAccY += 0.0012 * b - 0.02 * gameObjects.loadingCntr.offsetAccY;
    gameObjects.loadingCntr.offsetX = 0.9 * gameObjects.loadingCntr.offsetX + gameObjects.loadingCntr.offsetAccX;
    gameObjects.loadingCntr.offsetY = 0.9 * gameObjects.loadingCntr.offsetY + gameObjects.loadingCntr.offsetAccY;
    gameObjects.loadingCntr.x = gameObjects.loadingCntr.swayX + gameObjects.loadingCntr.offsetX;
    gameObjects.loadingCntr.y = gameObjects.loadingCntr.swayY + gameObjects.loadingCntr.offsetY;
}

function mouseToHand(d, e) {
    let c = 10;
    gameVars.halfWidth;
    gameVars.halfHeight;
    let f = gameVars.halfWidth / (gameVars.halfWidth - c), g = gameVars.halfHeight / (gameVars.halfHeight - c), a = gameVars.halfWidth + f * (d - gameVars.halfWidth), b = gameVars.halfHeight + g * (e - gameVars.halfHeight);
    a = Math.min(Math.max(0, a), gameVars.width - 1);
    b = Math.min(Math.max(0, b), gameVars.height - 1);
    return {
        x: a,
        y: b
    };
}

function disableMoveButtons() {
    gameObjects.moveLeftBtn.setState("disable");
    gameObjects.moveRightBtn.setState("disable");
}

function showMoveRightFlash() {
    let flashDur = 1150;
    let scaleMult = 1;
    if (gameVars.shownFirstFlash) {
        flashDur = 900;
        scaleMult = 0.65;
        gameObjects.moveRightFlash.alpha = 0.9;
    } else {
        gameObjects.moveRightFlash.alpha = 1;
    }
    gameObjects.moveRightFlash.scaleX = 1;
    gameObjects.moveRightFlash.scaleY = 1;
    gameVars.shownFirstFlash = true;
    globalScene.tweens.add({
        delay: 0,
        targets: gameObjects.moveRightFlash,
        alpha: 0,
        ease: "Quad.easeOut",
        duration: flashDur
    });
    globalScene.tweens.add({
        delay: 0,
        targets: gameObjects.moveRightFlash,
        scaleX: 2.6 * scaleMult,
        scaleY: 3.7 * scaleMult,
        ease: "Quart.easeOut",
        duration: flashDur
    });
}

function enableMoveButtons(showFlash = false) {
    if (0 !== gameObjects.exhibit.getCurrentScene()) {
        gameObjects.moveLeftBtn.setState("normal");
    }
    gameObjects.moveRightBtn.setState("normal");
    if (showFlash) {
        showMoveRightFlash();
    }
}

function disableMoveRightButton() {
    gameObjects.moveRightBtn.setState("disable");
}

function disableMoveLeftButton() {
    gameObjects.moveLeftBtn.setState("disable");
}

function enableMoveLeftButton() {
    if (0 !== gameObjects.exhibit.getCurrentScene()) {
        gameObjects.moveLeftBtn.setState("normal");
    }
}

function enableMoveRightButton() {
    gameObjects.moveRightBtn.setState("normal");
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
    });
    gameObjects.moveLeftBtnHighlight = globalScene.add.image(gameObjects.moveLeftBtn.getPosX(), gameObjects.moveLeftBtn.getPosY(), "buttons", "move_btn_glow");
    gameObjects.moveLeftBtnHighlight.scaleX = -1;
    gameObjects.moveLeftBtnHighlight.alpha = 0;
    gameObjects.moveRightBtn = new Button(a, gameObjects.topBtnCntr, gameObjects.exhibit.moveRight.bind(gameObjects.exhibit), {
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
    });
    gameObjects.moveRightBtnHighlight = globalScene.add.image(gameObjects.moveRightBtn.getPosX(), gameObjects.moveRightBtn.getPosY(), "buttons", "move_btn_glow");
    gameObjects.moveRightBtnHighlight.alpha = 0;
    gameObjects.moveRightBtnHighlight.state = "brightening";
    gameObjects.moveRightFlash = globalScene.add.image(gameObjects.moveRightBtn.getPosX(), gameObjects.moveRightBtn.getPosY() + 55, "buttons", "move_btn_normal");
    gameObjects.moveRightFlash.setOrigin(0.38, 0.59);
    gameObjects.moveRightFlash.alpha = 0;
}

function tempFreeze(a = 1000) {
    gameVars.isFrozen = true;
    setTimeout(() => {
        gameVars.isFrozen = false;
    }, a);
}

function initOneTimeListeners() {
    let a;
    a = messageBus.subscribe("startDarkSequence", b => {
        a.unsubscribe();
        gameObjects.entrance.entryLights1.alpha = 0;
        gameObjects.entrance.entryLights2.alpha = 0;
        removeFromUpdateFuncList(flipEntryLights);
        gameObjects.entrance.welcomeBtn.setState("disable");
    });
    let b;
    b = messageBus.subscribe("startHorrorSequence", e => {
        b.unsubscribe();
        addToUpdateFuncList(flipEntryLights);
        gameObjects.entrance.welcomeBtn.setState("normal");
        gameObjects.entrance.welcomeBtn.setNormalRef("welcomeTextDisable");
        gameObjects.entrance.welcomeBtn.setHoverRef("welcomeTextDisable");
        gameObjects.entrance.welcomeBtn.setPressRef("welcomeTextDisable");
        gameObjects.museumStand.bringToTop();
        gameObjects.standArrow = globalScene.add.image(gameObjects.museumStand.getPosX(), gameObjects.museumStand.getPosY(), "buttons", "stand_arrow");
        gameObjects.standArrow.setOrigin(0.5, 1);
        gameObjects.gameCtnr1.add(gameObjects.standArrow);
        gameObjects.museumStand.tweenScale({
            rotation: -0.01,
            duration: 150,
            ease: "Cubic.easeOut",
            onComplete() {
                gameObjects.museumStand.tweenScale({
                    rotation: 0,
                    yoyo: true,
                    ease: "Sine.easeInOut",
                    duration: 650
                });
            }
        });
        setupRoomFlower1(globalScene, 8, gameObjects.gameCtnr8);
        setupRoomFlower2(globalScene, 9, gameObjects.gameCtnr9);
        setupRoomFlower3(globalScene, 10, gameObjects.gameCtnr10);
        setupRoomFlower4(globalScene, 11, gameObjects.gameCtnr11);
        setupRoomFlower5(globalScene, 12, gameObjects.gameCtnr12);
        gameObjects.sounds.gladiatorx.play({
            loop: true
        });
        gameObjects.sounds.gladiatorx.volume = 0.01;
        globalScene.tweens.add({
            targets: gameObjects.sounds.gladiatorx,
            volume: 0.7,
            duration: 5000
        });
        setTimeout(() => {
            tweenVolume("gladiatorx", 0.9);
        }, 5000);
        let c = gameObjects.clownWelcomePic.x, d = gameObjects.clownWelcomePic.y, a = gameObjects.clownWelcomePic.scaleX;
        gameObjects.clownWelcomePic.destroy();
        gameObjects.clownWelcomePic = globalScene.add.image(c, d, "menu", "framesEnter5");
        gameObjects.clownWelcomePic.scaleX = a;
        gameObjects.clownWelcomePic.scaleY = a;
        gameObjects.clownWelcomePic.cantChange = true;
        gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic);
    });
}

function showAltReality(a, c = 1) {
    if (!a || 0 === a.length) {
        return;
    }
    let d = a.shift(), b = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, d);
    b.depth = 1;
    b.scaleX = c;
    b.scaleY = c;
    setTimeout(() => {
        b.destroy();
        showAltReality(a, c);
    }, 1 === a.length ? 70 : 40);
}

window.addEventListener("resize", function(a, b) {
    handleBorders();
}, false);

window.addEventListener("keydown", ev => {
    if ([ "ArrowDown", "ArrowUp", " " ].includes(ev.key)) {
        ev.preventDefault();
    }
});

window.addEventListener("wheel", ev => ev.preventDefault(), {
    passive: false
});
