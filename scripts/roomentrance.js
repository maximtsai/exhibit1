function setupRoomEntrance(scene, roomIndex, roomContainer) {
    gameObjects.exhibit.setForegroundAtIndex(1, "menu", "welcome", gameVars.halfHeight - 55);
    gameObjects.entrance = {
        lines: []
    };
    gameObjects.entrance.welcomeBtn = new Button(scene, roomContainer, () => {
        if (gameVars.horrorPoint && !gameObjects.entrance.showedHorrorText) {
            gameObjects.entrance.showedHorrorText = true;
            showInfoTextLoop(TEXT.lobby.welcomeGlitch.slice());
        } else if (gameVars.horrorPoint) {
            showInfoTextLoop(TEXT.lobby.welcomeGlitchRepeat.slice());
        } else if (gameVarsTemp.brokeMusicBox) {
            updateInfoText(TEXT.lobby.welcomeAfterBrokenBox);
        } else {
            updateInfoText(TEXT.lobby.welcome);
        }
    }, {
        atlas: "menu",
        ref: "welcomeText",
        x: -6,
        y: gameVars.halfHeight - 80,
        alpha: 1
    }, {
        atlas: "menu",
        ref: "welcomeTextGlow",
        preload: true
    }, {
        atlas: "menu",
        ref: "welcomeTextGlow",
        preload: true
    }, {
        atlas: "menu",
        ref: "welcomeText",
        preload: true
    });
    gameObjects.entrance.entryLights1 = scene.add.image(-3, gameVars.halfHeight - 57, "menu", "entrancelights1");
    gameObjects.entrance.entryLights1.counter = 0;
    gameObjects.entrance.entryLights1.status = "brighten";
    gameObjects.entrance.entryLights2 = scene.add.image(-3, gameVars.halfHeight - 57, "menu", "entrancelights2");
    gameObjects.entrance.entryLights1.alpha = 0;
    gameObjects.entrance.entryLights2.alpha = 0;
    roomContainer.add(gameObjects.entrance.entryLights1);
    roomContainer.add(gameObjects.entrance.entryLights2);
    gameObjects.entrance.creditsMenu = scene.add.image(0, gameVars.halfHeight - 55, "menu", "credits");
    gameObjects.entrance.creditsMenu.alpha = 0;
    roomContainer.add(gameObjects.entrance.creditsMenu);
    let s = scene.add.image(-490, -200, "blackPixel").setOrigin(0.5, 0).setScale(2, 200);
    roomContainer.add(s);
    gameObjects.entrance.lines.push(s);
    let o = scene.add.image(-270, -330, "blackPixel").setOrigin(0.5, 0).setScale(2, 200);
    roomContainer.add(o);
    gameObjects.entrance.lines.push(o);
    let i = scene.add.image(-20, -280, "blackPixel").setOrigin(0.5, 0).setScale(2, 200);
    roomContainer.add(i);
    gameObjects.entrance.lines.push(i);
    let n = scene.add.image(320, -190, "blackPixel").setOrigin(0.5, 0).setScale(2, 200);
    roomContainer.add(n);
    gameObjects.entrance.lines.push(n);
    let r = scene.add.image(500, -310, "blackPixel").setOrigin(0.5, 0).setScale(2, 200);
    let asdfJack = scene.add.image(330, -300, "roomJack", "doll").setRotation(-3.12).setScale(0.8);
    roomContainer.add(asdfJack);
    gameObjects.crawlClown = scene.add.sprite(40, 453, "roomClown2", "frame0000.png").setScale(-2, 2).setVisible(false);
    roomContainer.add(gameObjects.crawlClown);
    scene.anims.create({
        key: "clownCrawl",
        frames: scene.anims.generateFrameNames("roomClown2", {
            prefix: "frame",
            suffix: ".png",
            start: 0,
            end: 7,
            zeroPad: 4
        }),
        frameRate: 15
    });
    setTimeout(() => {
        globalScene.tweens.add({
            targets: asdfJack,
            x: 305,
            y: 65,
            rotation: -2.9,
            duration: 750,
            ease: "Back.easeOut",
            onComplete: () => {
                if (gameObjects.exhibit.currentScene === 1) {
                    let sfx = playSound("nyaha", undefined, 0.05);
                }
                globalScene.tweens.add({
                    targets: asdfJack,
                    x: 303,
                    y: 70,
                    rotation: -2.88,
                    duration: 550,
                    ease: "Cubic.easeInOut",
                    onComplete: () => {
                        globalScene.tweens.add({
                            delay: 800,
                            targets: asdfJack,
                            x: 370,
                            y: -300,
                            rotation: -2.8,
                            duration: 500,
                            ease: "Back.easeIn",
                            onComplete: () => {
                                asdfJack.destroy();
                            }
                        });
                    }
                });
            }
        });
    }, 18000);
    roomContainer.add(r);
    gameObjects.entrance.lines.push(r);
    gameObjectsTemp.starReplace = createStarButton(s, roomContainer, "star1", 1);
    createStarButton(o, roomContainer, "star2", 2);
    createStarButton(i, roomContainer, "star3", 3);
    createStarButton(n, roomContainer, "star2", 4);
    createStarButton(r, roomContainer, "star3", 5);
    messageBus.subscribe("exhibitMove", e => {
        if (1 === e) {
            if (gameVars.horrorPoint) {
                if (!gameObjectsTemp.entranceFlicker) {
                    gameObjectsTemp.entranceFlicker = true;
                    setTimeout(() => {
                        gameObjects.generalDarkness.alpha = 0.04;
                        setTimeout(() => {
                            gameObjects.generalDarkness.alpha = 0;
                            setTimeout(() => {
                                gameObjects.generalDarkness.alpha = 0.07;
                                setTimeout(() => {
                                    gameObjects.generalDarkness.alpha = 0;
                                    gameVarsTemp.startDarkFlicker = true;
                                }, 20);
                            }, 1800);
                        }, 150);
                    }, 2400);
                }
            } else {
                tweenVolume("gladiator0", 0.85);
                if (gameVars.darkPoint) {
                    tweenVolume("gladiator1", 0);
                    tweenVolume("gladiator2", 1);
                }
            }
        } else if (0 === e) {
            if (!gameVars.horrorPoint) {
                tweenVolume("gladiator0", 1);
                if (gameVars.darkPoint) {
                    tweenVolume("gladiator1", 0, 1500);
                    tweenVolume("gladiator2", 0, 1500);
                    setTimeout(() => {
                        gameObjects.musicBoxNote.alpha = 0;
                        gameObjects.musicBoxNote2.alpha = 0;
                        gameObjectsTemp.stoppedMusic = true;
                        gameObjects.sounds.gladiator1.stop();
                        gameObjects.sounds.gladiator2.stop();
                    }, 1500);
                }
            }
        }
        if (1 === e && gameVars.darkPoint && !gameVars.clownRun) {
            gameVars.clownRun = true;
            setTimeout(() => {
                gameObjects.crawlClown.setVisible(true);
                gameObjects.crawlClown.play("clownCrawl");
                playSound("clownhorn", undefined, 0.65);
            }, 2300);
        }
    });
}

function createStarButton(e, container, a, s) {
    let o;
    return o = new Button(globalScene, container, () => {
        if (!o.isAnimating) {
            o.isAnimating = true;
            if (gameVars.horrorPoint) {
                if (gameVarsTemp.pauseStarScare) {
                    gameVarsTemp.pauseStarScare = false;
                } else {
                    gameVarsTemp.pauseStarScare = true;
                    o.destroy();
                    let a = "starx" + s, i = "shout" + s, n = globalScene.add.image(e.x, e.y + 400, "menu", a);
                    container.add(n);
                    playDeathRattle(n);
                    playSound(i);
                }
            }
            o.tweenScale({
                scaleX: -1 * o.getScaleX(),
                duration: 700 + 300 * Math.random(),
                ease: "Sine.easeInOut",
                onComplete: () => {
                    o.isAnimating = false;
                }
            });
        }
    }, {
        atlas: "menu",
        ref: a,
        x: e.x,
        y: e.y + 400
    }, {
        atlas: "menu",
        ref: a
    });
}

function showInfoTextLoop(e, t = 0, a = true) {
    if (e.length > 0) {
        if (!a) {
            playSound("lidslam");
        }
        let s = e.shift(), o = t + s.time, i = 3500 - o;
        updateInfoText(s.text, i, a);
        setTimeout(() => {
            showInfoTextLoop(e, o, a);
        }, s.time);
    }
}

function playDeathRattle(e, t = 1) {
    globalScene.tweens.timeline({
        targets: e,
        tweens: [ {
            scaleY: 1.2,
            duration: 40,
            ease: "Cubic.easeOut"
        }, {
            scaleY: 0.8,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 1.25,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 0.8,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 1.25,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 0.8,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 1.25,
            duration: 80,
            ease: "Cubic.easeInOut",
            onComplete: () => {
                e.destroy();
            }
        } ]
    });
}
