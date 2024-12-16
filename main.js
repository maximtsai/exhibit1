var currentResize;
let pixelWidth = 1210;
let pixelHeight = 920;
let config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: "phaser-app",
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
let preloadCompleted = false;
let sdkIsLoaded = false;
let PhaserScene;
async function loadSDK() {
    await window.CrazyGames.SDK.init().then(() => {
        sdkIsLoaded = true;
        beginLoadIfAllReady();
        // initUser();
    });
}
loadSDK();

setTimeout(() => {game = new Phaser.Game(config)}, 20)

function preload() {
    PhaserScene = this;
    let gameDiv = document.getElementById('preload-notice');
    gameDiv.innerHTML = "";
    handleBorders();
    if (sdkIsLoaded) {
        sdkWrapperGameLoadingStart();
    }
    game.canvas, phaserGame = this, selfMe = this, gameObjects.exhibCntr = this.add.container(0, 0), gameObjects.exhibCntr.goalOffsetX = 0, gameObjects.exhibCntr.goalOffsetY = 0, gameObjects.exhibCntr.offsetX = 0, gameObjects.exhibCntr.offsetY = 0, gameObjects.exhibCntr.offsetAccX = 0, gameObjects.exhibCntr.offsetAccY = 0, gameObjects.exhibCntr.swayX = 0, gameObjects.exhibCntr.swayY = 0, gameObjects.exhibCntr.swayAccX = 0, gameObjects.exhibCntr.swayAccY = 0, gameObjects.exhibCntr.swayAmt = 0, gameObjects.shadowCntr = this.add.container(0, 0), gameObjects.portraitCntr = this.add.container(0, 0), gameObjects.btnCntr = this.add.container(0, 0), gameObjects.hueCntr = this.add.container(0, 0), gameObjects.darkCtnr = this.add.container(0, 0), gameObjects.mainDarkCntr = this.add.container(0, 0), gameObjects.topBtnCntr = this.add.container(0, 0), gameObjects.loadingCntr = this.add.container(0, 0), gameObjects.loadingCntr.goalOffsetX = 0, gameObjects.loadingCntr.goalOffsetY = 0, gameObjects.loadingCntr.offsetX = 0, gameObjects.loadingCntr.offsetY = 0, gameObjects.loadingCntr.offsetAccX = 0, gameObjects.loadingCntr.offsetAccY = 0, gameObjects.loadingCntr.shakeAccX = 0, gameObjects.loadingCntr.shakeAccY = 0, gameObjects.loadingCntr.swayX = 0, gameObjects.loadingCntr.swayY = 0, gameObjects.loadingCntr.swayAccX = 0, gameObjects.loadingCntr.swayAccY = 0, gameObjects.loadingCntr.swayAmt = 0, this.load.image("whitePixel", "sprites/white_pixel.png"), this.load.image("blackPixel", "sprites/black_pixel.png"), this.load.image("darkBluePixel", "sprites/dark_blue_pixel.png"), this.load.image("hand", "sprites/mouse.png"), this.load.image("handPoint", "sprites/mouse_point.png"), 
    this.load.image("funbox", "sprites/funbox.png"), this.load.image("funlid", "sprites/funlid.png"), this.load.image("popup", "sprites/popup.png"), 
    this.load.image("headphones", "sprites/headphones.png")
}

function create() {
    onPreloadComplete(PhaserScene)
}

function onPreloadComplete(a) {
    preloadCompleted = true;
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
    }), gameObjectsTemp.headphoneText.setOrigin(.5, .5), gameObjectsTemp.headphoneText.setDepth(1), a.load.on("progress", function(a) {
        gameVarsTemp.loadAmt = a
    }), a.load.on("complete", () => {
        onLoadComplete(a)
    }), 

    beginLoadIfAllReady();
    // setTimeout(() => {
    //     if (!sdkIsLoaded) {
    //         // TODO: Test and make sure game still runs even if SDK isn't loaded up
    //         useSDK = false;
    //         sdkIsLoaded = true;
    //         beginLoadIfAllReady();
    //     }
    // }, 10000)

}

function beginLoadIfAllReady() {
    if (preloadCompleted && sdkIsLoaded) {
        let a = PhaserScene;
        sdkWrapperGameLoadingStart();
        sdkWrapperResizeBanners();
        setTimeout(() => {
            sdkWrapperRequestResponsiveBanner("banner-container-top");
            gameVars.showingBannerTop = true;
        }, 50);
        a.load.image("handPointBlood", "sprites/mouse_point_blood.png"), a.load.multiatlas("menu", "sprites/menu/menu.json"), a.load.multiatlas("loadingSS", "sprites/loading/loadingSS.json"), a.load.multiatlas("bgs", "sprites/backgrounds/backgrounds.json"), a.load.multiatlas("roomPump", "sprites/roompump/roompump.json"), a.load.multiatlas("roomFaucet", "sprites/roomfaucet/roomfaucet.json"), a.load.multiatlas("roomHandy", "sprites/roomhandy/roomhandy.json"), a.load.multiatlas("roomStretch", "sprites/roomstretch/roomstretch.json"), a.load.multiatlas("roomJack", "sprites/roomjack/roomjack.json"), a.load.multiatlas("roomClown", "sprites/clown/clown.json"), a.load.multiatlas("flashScreens", "sprites/flashscreens/flashscreens.json"), a.load.multiatlas("staticScreens", "sprites/staticscreens/staticscreens.json"), a.load.multiatlas("staticLite", "sprites/staticscreens/staticlite.json"), a.load.multiatlas("buttons", "sprites/buttons/buttons.json"), a.load.multiatlas("misc", "sprites/misc/misc.json"), 
        a.load.audio("loadingMusic", "audio/loadingmusic.mp3"), a.load.audio("click1", "audio/click1.mp3"), a.load.audio("click2", "audio/click2.mp3"), a.load.audio("click3", "audio/click3.mp3"), a.load.audio("click4", "audio/click4.mp3"), a.load.audio("airpump", "audio/airpump.mp3"), a.load.audio("doorslam", "audio/doorslam.mp3"), a.load.audio("dooropen", "audio/dooropen.mp3"), a.load.audio("dooropen2", "audio/dooropen2.mp3"), a.load.audio("squeakopen", "audio/squeakopen.mp3"), a.load.audio("lidslam", "audio/lidslam.mp3"), a.load.audio("creepysfx", "audio/creepysfx.mp3"), a.load.audio("void", "audio/void.mp3"), a.load.audio("metalgrind1", "audio/metalgrind1.mp3"), a.load.audio("metalgrind2", "audio/metalgrind2.mp3"), a.load.audio("metalgrind3", "audio/metalgrind3.mp3"), a.load.audio("metalgrind4", "audio/metalgrind4.mp3"), a.load.audio("metalsqueak1", "audio/metalsqueak1.mp3"), a.load.audio("metalsqueak2", "audio/metalsqueak2.mp3"), a.load.audio("keyfound", "audio/keyfound.mp3"), 
        a.load.audio("keyget", "audio/keyget.mp3"), a.load.audio("keygetred", "audio/keygetred.mp3"), a.load.audio("deepbell1", "audio/deepbell1.mp3"), a.load.audio("deepbell2", "audio/deepbell2.mp3"), a.load.audio("deepbell3", "audio/deepbell3.mp3"), a.load.audio("deepbell4", "audio/deepbell4.mp3"), a.load.audio("deepbell5", "audio/deepbell5.mp3"), a.load.audio("fan1", "audio/fan1.mp3"), a.load.audio("fan2", "audio/fan2.mp3"), a.load.audio("nyaha", "audio/nyaha.mp3"), a.load.audio("muffle1", "audio/muffle1.mp3"), a.load.audio("muffle2", "audio/muffle2.mp3"), a.load.audio("muffle3", "audio/muffle3.mp3"), a.load.audio("muffle4", "audio/muffle4.mp3"), a.load.audio("muffle5", "audio/muffle5.mp3"), a.load.audio("muffle6", "audio/muffle6.mp3"), a.load.audio("muffle7", "audio/muffle7.mp3"), a.load.audio("muffle8", "audio/muffle8.mp3"), a.load.audio("splurt", "audio/splurt.mp3"), a.load.audio("watergurgle", "audio/watergurgle.mp3"), a.load.audio("a7", "audio/notes/a7.mp3"), a.load.audio("b7", "audio/notes/b7.mp3"), 
        a.load.audio("c7", "audio/notes/c7.mp3"), a.load.audio("c7b", "audio/notes/c7b.mp3"), a.load.audio("d7", "audio/notes/d7.mp3"), a.load.audio("e7", "audio/notes/e7.mp3"), a.load.audio("e7b", "audio/notes/e7b.mp3"), a.load.audio("f7", "audio/notes/f7.mp3"), a.load.audio("f7b", "audio/notes/f7b.mp3"), a.load.audio("g6", "audio/notes/g6.mp3"), a.load.audio("g6s", "audio/notes/g6s.mp3"), a.load.audio("g7", "audio/notes/g7.mp3"), a.load.audio("c8", "audio/notes/c8.mp3"), a.load.audio("rubber1", "audio/rubber1.mp3"), a.load.audio("rubber2", "audio/rubber2.mp3"), a.load.audio("rubber3", "audio/rubber3.mp3"), a.load.audio("rubber4", "audio/rubber4.mp3"), a.load.audio("rubber5", "audio/rubber5.mp3"), a.load.audio("rubber6", "audio/rubber6.mp3"), a.load.audio("rubber7", "audio/rubber7.mp3"), a.load.audio("rubber8", "audio/rubber8.mp3"), a.load.audio("tear1", "audio/tear1.mp3"), a.load.audio("tear2", "audio/tear2.mp3"), a.load.audio("tear3", "audio/tear3.mp3"), a.load.audio("tear4", "audio/tear4.mp3"), 
        a.load.audio("tear5", "audio/tear5.mp3"), a.load.audio("tear6", "audio/tear6.mp3"), a.load.audio("sing1", "audio/sing1.mp3"), a.load.audio("glassbreak", "audio/glassbreak.mp3"), a.load.audio("flickeron", "audio/flickeron.mp3"), a.load.audio("horrortrack1", "audio/horrortrack1.mp3"), a.load.audio("groundthud2", "audio/groundthud2.mp3"), a.load.audio("emerge1", "audio/emerge1.mp3"), a.load.audio("emerge2", "audio/emerge2.mp3"), a.load.audio("squeak1", "audio/squeak1.mp3"), a.load.audio("squeak2", "audio/squeak2.mp3"), a.load.audio("squeak3", "audio/squeak3.mp3"), a.load.audio("stopmusic", "audio/stopmusic.mp3"), a.load.audio("gladiator0", "audio/gladiator0.mp3"), a.load.audio("gladiator1", "audio/gladiator1.mp3"), a.load.audio("gladiator2", "audio/gladiator2.mp3"), a.load.audio("gladiatorx", "audio/gladiatorx.mp3"), a.load.audio("pumpamb", "audio/pumpamb.mp3"), a.load.audio("shout1", "audio/shout1.mp3"), a.load.audio("shout2", "audio/shout2.mp3"), a.load.audio("shout3", "audio/shout3.mp3"), 
        a.load.audio("shout4", "audio/shout4.mp3"), a.load.audio("shout5", "audio/shout5.mp3"), a.load.audio("clownlaugh1", "audio/clownlaugh1.mp3"), a.load.audio("clownlaugh2", "audio/clownlaugh2.mp3"), a.load.audio("clownlaughfinal", "audio/clownlaughfinal.mp3"), a.load.image("candleBright", "sprites/candleBright.png"), a.load.image("candleDark", "sprites/candleDark.png"), a.load.image("shinelight", "sprites/shinelight.png"), a.load.image("redlight", "sprites/redlight.png"), a.load.image("generalDim", "sprites/generalDim.png"), a.load.image("theEnd", "sprites/altreality/the_end.jpg"), a.load.image("stretch1", "sprites/altreality/stretch1.jpg"), a.load.image("stretch2", "sprites/altreality/stretch2.jpg"), a.load.image("stretch3", "sprites/altreality/stretch3.jpg"), a.load.image("stretch4", "sprites/altreality/stretch4.jpg"), a.load.image("stretch5", "sprites/altreality/stretch5.jpg"), a.load.image("stretch6", "sprites/altreality/stretch6.jpg"), a.load.image("floaty1", "sprites/altreality/floaty1.jpg"), 
        a.load.image("floaty2", "sprites/altreality/floaty2.jpg"), a.load.image("floaty3", "sprites/altreality/floaty3.jpg"), a.load.image("floaty4", "sprites/altreality/floaty4.jpg"), a.load.image("balloon1", "sprites/altreality/balloon1.jpg"), a.load.image("balloon2", "sprites/altreality/balloon2.jpg"), a.load.image("balloon3", "sprites/altreality/balloon3.jpg"), a.load.image("balloon4", "sprites/altreality/balloon4.jpg"), a.load.image("balloon5", "sprites/altreality/balloon5.jpg"), 
        a.load.start()

    }
}

function onLoadComplete(a) {
    if (!document.location.href.includes('crazy') && !document.location.href.includes('juegos')) {
        // Stops execution of rest of game
        let gameDiv = document.getElementById('preload-notice');
        let invalidSite = document.location.href.substring(0, 25);
        gameDiv.innerHTML = invalidSite + "...\nis an invalid site.\n\n" + "Try the game on itch.io!";
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

    sdkWrapperGameLoadingStop(), a.tweens.timeline({
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
    }), gameObjectsTemp.brightLight = a.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "loadingSS", "bright_light"), gameObjectsTemp.brightLight.scaleX = 1, gameObjectsTemp.brightLight.scaleY = 1, gameObjectsTemp.brightLight.alpha = 0, gameObjects.loadingCntr.add(gameObjectsTemp.brightLight), gameObjectsTemp.loadingWelcome = makeWelcomeImage("loading_welcome"), gameObjects.loadingCntr.add(gameObjectsTemp.loadingWelcome), gameObjectsTemp.loadingWelcome.rotation = 0, gameObjectsTemp.loadingWelcome.alpha = 0, gameObjectsTemp.loadingWelcome.scaleX = .8, gameObjectsTemp.loadingWelcome.scaleY = .8, a.tweens.timeline({
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
                })
            }
        }, {
            alpha: 1,
            duration: 400
        }]
    })
}

function onLoadAnimComplete(a) {
    a.tweens.timeline({
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
    }), a.tweens.timeline({
        targets: [gameObjectsTemp.headphones, gameObjectsTemp.headphoneText, gameObjectsTemp.warningText, gameObjectsTemp.exhibitText],
        tweens: [{
            alpha: .5,
            duration: 250
        }]
    })
}

function startGame(a) {
    if (sdkWrapperGameplayStart(), sdkWrapperClearAllBanners(), useSDK) {
        let b = document.getElementById("banner-container-top");
        b.style.top = "-999px", gameVars.showingBannerTop = !1
    }
    gameObjects.loadingMusic = a.sound.add("loadingMusic"), gameObjects.loadingMusic.play(), gameObjects.startGameButton.destroy(), gameVars.gameStarted = !0, gameObjects.scene = a, setupGame(a), gameObjectsTemp.blackTeeth = a.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "menu", "teethBlack"), gameObjectsTemp.blackTeeth.scaleX = 1.6, gameObjectsTemp.blackTeeth.scaleY = 1.6, gameObjectsTemp.blackTeethAnim = a.tweens.timeline({
        targets: [gameObjectsTemp.blackTeeth],
        tweens: [{
            scaleX: 1.45,
            scaleY: 1.45,
            ease: "Quad.easeIn",
            duration: 3e3
        }]
    }), a.tweens.timeline({
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
    }), a.tweens.timeline({
        targets: [gameObjectsTemp.brightLight],
        tweens: [{
            alpha: 1.2,
            scaleX: 3,
            scaleY: 3,
            duration: 2500,
            ease: "Quad.easeOut"
        }]
    }), a.tweens.timeline({
        targets: [gameObjectsTemp.loadingWelcome],
        tweens: [{
            rotation: .01,
            scaleX: 1.14,
            scaleY: 1.14,
            duration: 2500,
            ease: "Quad.easeIn"
        }]
    }), gameObjectsTemp.circleLoading = [], a.tweens.timeline({
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
                let background = document.getElementById('background');
                background.style.opacity = '1';
                let leftborder = document.getElementById('leftborder');
                leftborder.style.opacity = '1';
                let rightborder = document.getElementById('rightborder');
                rightborder.style.opacity = '1';
                for (let b in removeFromUpdateFuncList(updateWelcomeFollower), gameObjects.loadingMusic.stop(), gameVars.gameConstructed = !0, gameObjects.loadingWelcomes) gameObjects.loadingWelcomes[b].destroy();
                for (let a = 0; a < gameObjectsTemp.circleLoading.length; a++) gameObjectsTemp.circleLoading[a].destroy();
                gameObjectsTemp.brightLight.destroy(), gameObjects.clickBlocker.destroy(), gameObjectsTemp.loadingBg.destroy(), gameObjectsTemp.blackTeeth.destroy(), gameObjectsTemp.blackTeethAnim.destroy(), setTimeout(() => {
                    gameObjects.sounds.gladiator0.play({
                        loop: !0
                    }), gameObjects.sounds.gladiator0.volume = .6, tweenVolume("gladiator0", .7)
                }, 0), setTimeout(() => {
                    addToUpdateFuncList(flipEntryLights)
                }, 350), setTimeout(() => {
                    gameVarsTemp.hasMoved || ftueMoveButton()
                }, 4e3)
            }
        }]
    })
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
    gameObjects.sounds = {
        a7: a.sound.add("a7"),
        b7: a.sound.add("b7"),
        c7: a.sound.add("c7"),
        c7b: a.sound.add("c7b"),
        d7: a.sound.add("d7"),
        e7: a.sound.add("e7"),
        e7b: a.sound.add("e7b"),
        f7: a.sound.add("f7"),
        f7b: a.sound.add("f7b"),
        g6: a.sound.add("g6"),
        g6s: a.sound.add("g6s"),
        g7: a.sound.add("g7"),
        c8: a.sound.add("c8"),
        click1: a.sound.add("click1"),
        click2: a.sound.add("click2"),
        click3: a.sound.add("click3"),
        click4: a.sound.add("click4"),
        clownlaugh1: a.sound.add("clownlaugh1"),
        clownlaugh2: a.sound.add("clownlaugh2"),
        clownlaughfinal: a.sound.add("clownlaughfinal"),
        airpump: a.sound.add("airpump"),
        doorslam: a.sound.add("doorslam"),
        dooropen: a.sound.add("dooropen"),
        dooropen2: a.sound.add("dooropen2"),
        squeakopen: a.sound.add("squeakopen"),
        lidslam: a.sound.add("lidslam"),
        creepysfx: a.sound.add("creepysfx"),
        void: a.sound.add("void"),
        metalgrind1: a.sound.add("metalgrind1"),
        metalgrind2: a.sound.add("metalgrind2"),
        metalgrind3: a.sound.add("metalgrind3"),
        metalgrind4: a.sound.add("metalgrind4"),
        metalsqueak1: a.sound.add("metalsqueak1"),
        metalsqueak2: a.sound.add("metalsqueak2"),
        keyfound: a.sound.add("keyfound"),
        keyget: a.sound.add("keyget"),
        keygetred: a.sound.add("keygetred"),
        deepbell1: a.sound.add("deepbell1"),
        deepbell2: a.sound.add("deepbell2"),
        deepbell3: a.sound.add("deepbell3"),
        deepbell4: a.sound.add("deepbell4"),
        deepbell5: a.sound.add("deepbell5"),
        fan1: a.sound.add("fan1"),
        fan2: a.sound.add("fan2"),
        nyaha: a.sound.add("nyaha"),
        rubber1: a.sound.add("rubber1"),
        rubber2: a.sound.add("rubber2"),
        rubber3: a.sound.add("rubber3"),
        rubber4: a.sound.add("rubber4"),
        rubber5: a.sound.add("rubber5"),
        rubber6: a.sound.add("rubber6"),
        rubber7: a.sound.add("rubber7"),
        rubber8: a.sound.add("rubber8"),
        tear1: a.sound.add("tear1"),
        tear2: a.sound.add("tear2"),
        tear3: a.sound.add("tear3"),
        tear4: a.sound.add("tear4"),
        tear5: a.sound.add("tear5"),
        tear6: a.sound.add("tear6"),
        muffle1: a.sound.add("muffle1"),
        muffle2: a.sound.add("muffle2"),
        muffle3: a.sound.add("muffle3"),
        muffle4: a.sound.add("muffle4"),
        muffle5: a.sound.add("muffle5"),
        muffle6: a.sound.add("muffle6"),
        muffle7: a.sound.add("muffle7"),
        muffle8: a.sound.add("muffle8"),
        splurt: a.sound.add("splurt"),
        watergurgle: a.sound.add("watergurgle"),
        sing1: a.sound.add("sing1"),
        glassbreak: a.sound.add("glassbreak"),
        flickeron: a.sound.add("flickeron"),
        horrortrack1: a.sound.add("horrortrack1"),
        groundthud2: a.sound.add("groundthud2"),
        emerge1: a.sound.add("emerge1"),
        emerge2: a.sound.add("emerge2"),
        squeak1: a.sound.add("squeak1"),
        squeak2: a.sound.add("squeak2"),
        squeak3: a.sound.add("squeak3"),
        stopmusic: a.sound.add("stopmusic"),
        gladiator0: a.sound.add("gladiator0"),
        gladiator1: a.sound.add("gladiator1"),
        gladiator2: a.sound.add("gladiator2"),
        gladiatorx: a.sound.add("gladiatorx"),
        pumpamb: a.sound.add("pumpamb"),
        shout1: a.sound.add("shout1"),
        shout2: a.sound.add("shout2"),
        shout3: a.sound.add("shout3"),
        shout4: a.sound.add("shout4"),
        shout5: a.sound.add("shout5")
    }
}

function playSound(d, a, e = 1) {
    let b = "";
    void 0 !== a && (b = Math.floor(Math.random() * a) + 1);
    let c = d + b;
    gameObjects.sounds[c].volume = e * gameVars.masterAudio, gameObjects.sounds[c].play();
    return gameObjects.sounds[c];
}

function tweenVolume(a, b, c = 1500) {
    globalScene.tweens.timeline({
        targets: [gameObjects.sounds[a]],
        tweens: [{
            volume: b * gameVars.masterAudio,
            duration: c
        }]
    });
    return gameObjects.sounds[a];
}

function playSoundOnce(a, b, c = 1) {
    oneTimeScares[a] || (oneTimeScares[a] = !0, b ? setTimeout(() => {
        gameObjects.sounds[a].volume = c * gameVars.masterAudio, gameObjects.sounds[a].play()
    }, b) : (gameObjects.sounds[a].volume = c * gameVars.masterAudio, gameObjects.sounds[a].play()))
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
        setTimeout(() => {
            gameObjects.generalDarkness.alpha -= v, .6 > Math.random() && setTimeout(() => {
                let a = 15 * Math.random();
                a = Math.floor(a * a);
                let b = .03 + .06 * Math.random();
                gameObjects.generalDarkness.alpha += b, setTimeout(() => {
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
        gameObjects.moveRightFlash.alpha = 1;
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

    gameObjects.moveRightFlash = globalScene.add.image(gameObjects.moveRightBtn.getPosX(), gameObjects.moveRightBtn.getPosY() + 55, "buttons", "move_btn_normal");
    gameObjects.moveRightFlash.setOrigin(0.38, 0.59);
    gameObjects.moveRightFlash.alpha = 0;
}

function tempFreeze(a = 1e3) {
    gameVars.isFrozen = !0, setTimeout(() => {
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
        }), setTimeout(() => {
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

function adFinished() {
    gameVars.masterAudio = 1, gameVars.isFrozen = !1;
    let b = ["gladiator1", "gladiator2", "gladiatorx"];
    for (let a = 0; a < b.length; a++) b[a], gameObjects.sounds.gladiatorx.volume = gameObjects.sounds.gladiatorx.oldVolume ? gameObjects.sounds.gladiatorx.oldVolume : 1
}

function adError() {
    gameVars.masterAudio = 1, gameVars.isFrozen = !1;
    let b = ["gladiator1", "gladiator2", "gladiatorx"];
    for (let a = 0; a < b.length; a++) b[a], gameObjects.sounds.gladiatorx.volume = gameObjects.sounds.gladiatorx.oldVolume ? gameObjects.sounds.gladiatorx.oldVolume : 1
}

function showAltReality(a, c = 1) {
    if (!a || 0 === a.length) return;
    let d = a.shift(),
        b = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, d);
    b.depth = 1, b.scaleX = c, b.scaleY = c, setTimeout(() => {
        b.destroy(), showAltReality(a, c)
    }, 1 === a.length ? 70 : 40)
}
window.addEventListener("resize", function(a, b) {
    handleBorders();
    currentResize && clearTimeout(currentResize), currentResize = setTimeout(sdkWrapperResizeBanners, 200)
}, !1)
window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
});
window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });