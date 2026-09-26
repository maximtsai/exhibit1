function updateInfoText(e, t = 3200, a) {
    gameObjects.infoText.setText("\n " + e + " \n");
    if (a) {
        gameObjects.infoText.setOrigin(0, 0.5);
        gameObjects.infoText.x = gameVars.halfWidth - 360;
        gameObjects.infoText.y = gameVars.halfHeight + 220;
    }
    if (gameVarsTemp.updateTextAnim && gameVarsTemp.updateTextAnim.isPlaying()) {
        gameVarsTemp.updateTextAnim.stop();
    }
    gameVarsTemp.updateTextAnim = gameObjects.scene.tweens.timeline({
        targets: gameObjects.infoText,
        tweens: [ {
            alpha: 1,
            duration: 25
        }, {
            alpha: 0.95,
            duration: t
        }, {
            alpha: 0,
            duration: 200,
            onComplete: () => {
                if (a) {
                    gameObjects.infoText.setOrigin(0.5, 0.5);
                    gameObjects.infoText.x = gameVars.halfWidth;
                }
            }
        } ]
    });
}

function updateInfoTextSoft(e, t = 3000) {
    gameObjects.infoText.setText("\n " + e + " \n");
    if (gameVarsTemp.updateTextAnim && gameVarsTemp.updateTextAnim.isPlaying()) {
        gameVarsTemp.updateTextAnim.stop();
    }
    gameVarsTemp.updateTextAnim = gameObjects.scene.tweens.timeline({
        targets: gameObjects.infoText,
        tweens: [ {
            alpha: 1,
            duration: 250
        }, {
            alpha: 0.95,
            duration: t
        }, {
            alpha: 0,
            duration: 300
        } ]
    });
}

// Rooms in walking order: [exhibit index, setup function].
// Indexes 8-12 are the flower rooms, added later by the startHorrorSequence listener in main.js.
const ROOMS = [
    [ 2, setupRoomPump ],
    [ 3, setupRoomFaucet ],
    [ 4, setupRoomClown1 ],
    [ 5, setupRoomHandy ],
    [ 6, setupRoomStretch ],
    [ 7, setupRoomClown2 ],
    [ 13, setupRoomJack ],
    [ 14, setupRoomClown3 ],
    [ 15, setupRoomFinal ]
];
const ROOM_COUNT = 16;

function initExhibit(scene) {
    gameObjects.exhibit.setBackgroundAtIndex(0, "bgs", "bg0");
    gameObjects.exhibit.setBackgroundAtIndex(1, "bgs", "bg1");
    setupRoomEntrance(scene, 1, gameObjects.gameCtnr1);
    for (let [ index, setup ] of ROOMS) {
        setup(scene, index, gameObjects["gameCtnr" + index]);
    }
    gameObjects.exhibit.initPos(1);
}

function onStandClick(scene) {
    gameVars.canCloseStand = false;
    disableMoveButtons();
    let t = "stand_display", a = gameVars.horrorPoint && !gameVarsTemp.seenHorrorStand;
    if (a) {
        t = "stand_display_4";
        gameVarsTemp.seenHorrorStand = true;
    } else if (!gameVarsTemp.standSeenOnce) {
        t = "stand_display_3";
    }
    gameObjects.standDisplay = new Button(scene, gameObjects.gameCtnr1, () => {
        onStandDisplayClick(scene);
    }, {
        atlas: "buttons",
        ref: t,
        x: 0,
        y: gameVars.halfHeight
    });
    if (a) {
        gameObjects.standDisplay.setAlpha(1);
        gameObjects.standDisplay.setScale(1);
        gameObjectsTemp.voidGlow = scene.add.image(0, gameVars.halfHeight, "buttons", "stand_void_glow");
        gameObjectsTemp.voidGlow.alpha = 0.95;
        gameObjects.gameCtnr1.add(gameObjectsTemp.voidGlow);
        addToUpdateFuncList(animateVoidGlow);
        playSound("void", undefined, 0.7);
        gameObjects.museumStand.setState("disable");
        gameObjects.standArrow.destroy();
        gameObjects.entrance.entryLights1.alpha = 0;
        gameObjects.entrance.entryLights2.alpha = 0;
        removeFromUpdateFuncList(flipEntryLights);
        gameObjects.standDisplay.tweenScale({
            scaleX: 1.15,
            scaleY: 1.22,
            alpha: 1,
            duration: 3300,
            onComplete: () => {
                gameVars.canCloseStand = true;
                onStandDisplayClick(scene, true);
                gameObjectsTemp.voidGlow.destroy();
                removeFromUpdateFuncList(animateVoidGlow);
                gameObjects.sounds.void.stop();
                updateInfoText(TEXT.lobby.standHorror);
            }
        });
    } else {
        gameObjects.standDisplay.setAlpha(0.5);
        gameObjects.standDisplay.setScale(0.98);
        gameObjects.standDisplay.tweenScale({
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 200,
            ease: "Cubic.easeOut",
            onComplete: () => {
                if (!gameVarsTemp.standSeenOnce) {
                    gameObjects.standDisplay.setAllRef("stand_display");
                }
                gameVars.canCloseStand = true;
            }
        });
        gameObjects.standDisplay.runFuncOnImage(e => {
            e.scaleX = 0.97;
            e.scaleY = 0.97;
            e.alpha = 0.65;
            gameObjects.scene.tweens.timeline({
                targets: e,
                tweens: [ {
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    duration: 200,
                    ease: "Cubic.easeOut"
                } ]
            });
        });
    }
}

function onStandDisplayClick(e, t = false) {
    if (gameVars.canCloseStand) {
        gameObjects.standDisplay.setState("disable");
        if (!gameVarsTemp.standSeenOnce) {
            gameObjects.standDisplay.setAllRef("stand_display_2");
            gameVarsTemp.standSeenOnce = true;
        }
        gameObjects.standDisplay.tweenScale({
            scaleX: 0.98,
            scaleY: 0.98,
            alpha: 0,
            duration: t ? 0 : 225,
            ease: "Cubic.easeOut",
            onComplete: () => {
                enableMoveButtons(!gameVars.horrorPoint);
                gameObjects.undoCreditsButton.reappear();
                gameObjects.standDisplay.destroy();
            }
        });
    }
}

function onCreditsClick(scene) {
    showMoveRightFlash();
    gameObjects.creditsButton.disappear();
    gameObjects.entrance.welcomeBtn.disappear();
    scene.tweens.add({
        targets: gameObjects.entrance.creditsMenu,
        alpha: 1,
        ease: "Cubic.easeOut",
        duration: 750,
        onComplete: () => {
            gameObjects.undoCreditsButton.reappear();
        }
    });
}

function undoCreditsClick(scene) {
    if (!oneTimeScares.creditsScareCount) {
        oneTimeScares.creditsScareCount = 0;
    }
    if (0 === oneTimeScares.creditsScareCount) {
        oneTimeScares.creditsScare = true;
    } else if (3 === oneTimeScares.creditsScareCount) {
        let t = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, "menu", "face1");
        t.scaleX = 2;
        t.scaleY = 2;
        scene.tweens.add({
            targets: t,
            scaleX: 25,
            scaleY: 25,
            ease: "Quad.easeIn",
            duration: 450,
            onComplete: () => {
                t.destroy();
            }
        });
        shakeImage(t, 450);
    }
    oneTimeScares.creditsScareCount++;
    gameObjects.undoCreditsButton.disappear();
    scene.tweens.add({
        targets: gameObjects.entrance.creditsMenu,
        alpha: 0,
        duration: 100,
        onComplete: () => {
            gameObjects.creditsButton.reappear();
            gameObjects.entrance.welcomeBtn.reappear();
        }
    });
}

function shakeImage(e, t, a, s) {
    if (t <= 0 || !e.active) {
        return;
    }
    let o = e.x, c = e.y;
    if (a) {
        o = a;
    }
    if (s) {
        c = s;
    }
    e.x += 7 * (Math.random() - 0.5) * e.scaleX;
    e.y += 7 * (Math.random() - 0.5) * e.scaleY;
    setTimeout(() => {
        shakeImage(e, t - 20, o, c);
    }, 20);
}

function onExitClick(scene) {
    if (!gameVarsTemp.doorNotClickable) {
        return gameVars.finishedDarkPoint ? (gameObjects.exitDoor.disappear(), gameObjects.exitDoorWhite = scene.add.image(-215, 507, "buttons", "exitDoorWhite"), 
        gameObjects.exitDoorWhite.setOrigin(0, 0.5), gameObjects.gameCtnr0.add(gameObjects.exitDoorWhite), 
        gameObjects.exitDoorOpen = scene.add.image(-215, 507, "buttons", "exitDoorOpen"), 
        gameObjects.exitDoorOpen.setOrigin(0, 0.5), gameObjects.gameCtnr0.add(gameObjects.exitDoorOpen), 
        gameObjects.clownDoor = scene.add.image(-42, 385, "roomClown", "clowndoor"), 
        gameObjects.clownDoor.setScale(0.6), gameObjects.gameCtnr0.add(gameObjects.clownDoor), 
        gameObjects.exitDoorAnimated = scene.add.image(-193, 507, "buttons", "exitDoorNormal"), 
        gameObjects.exitDoorAnimated.setOrigin(0.05, 0.5), gameObjects.gameCtnr0.add(gameObjects.exitDoorAnimated), 
        disableMoveButtons(), gameVarsTemp.doorNotClickable = true, setTimeout(() => {
            showStaticRand(3, undefined, () => {
                showFlashRand(1);
            });
            scene.tweens.add({
                targets: gameObjects.clownDoor,
                x: 85,
                rotation: 1,
                ease: "Cubic.easeOut",
                duration: 20,
                onComplete: () => {
                    scene.tweens.add({
                        targets: gameObjects.clownDoor,
                        x: 0,
                        rotation: 0.5,
                        ease: "Cubic.easeIn",
                        duration: 370,
                        delay: 60
                    });
                }
            });
        }, 2750), gameObjects.exitDoorAnimated.scaleX = 0.98, setTimeout(() => {
            playSound("dooropen");
        }, 50), scene.tweens.add({
            targets: gameObjects.exitDoorAnimated,
            scaleX: 0.74,
            duration: 3000,
            ease: "Cubic.easeIn",
            onComplete: () => {
                setTimeout(() => {
                    setTimeout(() => {
                        playSound("doorslam");
                    }, 120);
                    scene.tweens.add({
                        targets: gameObjects.exitDoorAnimated,
                        scaleX: 1,
                        duration: 150,
                        ease: "Cubic.easeIn",
                        onComplete: () => {
                            new Button(scene, gameObjects.gameCtnr0, () => {
                                updateInfoText(TEXT.lobby.doorLocked, 4800);
                            }, {
                                ref: "blackPixel",
                                x: -3,
                                y: gameVars.halfHeight + 55,
                                scaleX: 205,
                                scaleY: 330,
                                alpha: 0.01
                            });
                            new Button(scene, gameObjects.gameCtnr0, () => {
                                updateInfoText(TEXT.lobby.emergencyPower, 4500);
                                if (!gameObjectsTemp.emergencyLightsFlag) {
                                    gameObjectsTemp.emergencyLightsFlag = true;
                                    setTimeout(() => {
                                        gameObjects.generalDarkness.alpha = 0.1;
                                        setTimeout(() => {
                                            gameObjects.generalDarkness.alpha = 0;
                                            setTimeout(() => {
                                                gameObjects.generalDarkness.alpha = 0.1;
                                                setTimeout(() => {
                                                    gameObjects.generalDarkness.alpha = 0;
                                                }, 50);
                                            }, 800);
                                        }, 50);
                                    }, 1200);
                                }
                            }, {
                                ref: "blackPixel",
                                x: -400,
                                y: gameVars.halfHeight + 90,
                                scaleX: 100,
                                scaleY: 80,
                                alpha: 0.01
                            });
                            gameObjects.tempTeeth = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, "menu", "teeth");
                            gameObjects.tempTeeth.scaleY = 1.15;
                            let t = gameObjectsTemp.starReplace.getXPos(), a = gameObjectsTemp.starReplace.getYPos(), s = scene.add.image(t, a, "menu", "spareeye");
                            gameObjects.gameCtnr1.add(s);
                            gameObjectsTemp.starReplace.disappear();
                            showStaticLite(15, 20, 2.5);
                            setTimeout(() => {
                                gameObjects.tempTeeth.scaleY = 1.2;
                                scene.tweens.add({
                                    targets: gameObjects.tempTeeth,
                                    scaleY: 1,
                                    duration: 300,
                                    ease: "Quad.easeIn",
                                    onComplete: () => {
                                        gameObjects.tempTeeth.destroy();
                                        showFlashRand(3, undefined, () => {
                                            showStaticRand(3);
                                            setTimeout(() => {
                                                showStaticRand(1);
                                                setTimeout(() => {
                                                    s.destroy();
                                                    gameObjectsTemp.starReplace.reappear();
                                                }, 3000);
                                            }, 20);
                                        });
                                    }
                                });
                                scene.cameras.main.setZoom(1);
                                enableMoveButtons();
                                gameObjects.exitDoor.reappear();
                                gameObjects.exitDoor.setState("disable");
                                gameObjects.clownDoor.destroy();
                                gameObjects.exitDoorOpen.destroy();
                                gameObjects.exitDoorAnimated.destroy();
                                gameObjects.exitDoorWhite.destroy();
                                gameVarsTemp.doorFailed = true;
                                gameObjects.moveRightBtn.setOnMouseUpFunc(gameObjects.exhibit.moveRight.bind(gameObjects.exhibit));
                                messageBus.publish("temporarilyNormal");
                                messageBus.publish("startHorrorSequence");
                                gameVars.baseSway = 0.04;
                                gameObjects.exhibit.resetListOfCantMove();
                            }, 30);
                        }
                    });
                }, 150);
            }
        }), void scene.tweens.add({
            targets: scene.cameras.main,
            zoom: 1.4,
            ease: "Quad.easeIn",
            duration: 2950
        })) : void (gameVarsTemp.doorFailed ? (gameObjects.generalDarkness.alpha = 1, 
        gameObjects.exitDoor.setState("disable"), setTimeout(() => {
            gameObjects.generalDarkness.alpha = 0;
        }, 50)) : gameVars.darkPoint ? updateInfoText(TEXT.lobby.lightsFirst, 3000) : updateInfoText(TEXT.lobby.justArrived, 3500));
    }
}

// gameObjects.gameCtnr0 ... gameCtnr15, one button container per exhibit room
function createRoomContainers(scene) {
    for (let i = 0; i < ROOM_COUNT; i++) {
        let cntr = scene.add.container(0, 0);
        gameObjects["gameCtnr" + i] = cntr;
        gameObjects.exhibit.addBtnCtnrToIndex(i, cntr);
    }
}

function setupGameplayButtons(e) {
    createRoomContainers(e);
    gameObjects.exitDoor = new Button(e, gameObjects.gameCtnr0, () => {
        onExitClick(e);
    }, {
        atlas: "buttons",
        ref: "exitDoorNormal",
        x: -215,
        y: 507
    }, {
        atlas: "buttons",
        ref: "exitDoorOver"
    }, {
        atlas: "buttons",
        ref: "exitDoorOver"
    }, {
        atlas: "buttons",
        ref: "exitDoorDisable"
    });
    gameObjects.exitDoor.setOrigin(0, 0.5);
    gameObjects.powerSwitch = new Button(e, gameObjects.gameCtnr0, onTurnOnPower, {
        atlas: "buttons",
        ref: "powerSwitchNormal",
        scaleX: 0.8,
        scaleY: 0.8,
        x: -395,
        y: 550
    }, {
        atlas: "buttons",
        ref: "powerSwitchHover"
    }, {
        atlas: "buttons",
        ref: "powerSwitchHover"
    }, {
        atlas: "buttons",
        ref: "powerSwitchDisabled"
    });
    gameObjects.musicBoxNote = globalScene.add.image(345, gameVars.halfHeight + 30, "misc", "note");
    gameObjects.musicBoxNote.origX = gameObjects.musicBoxNote.x;
    gameObjects.musicBoxNote.origY = gameObjects.musicBoxNote.y;
    gameObjects.musicBoxNote.velY = -2.5;
    gameObjects.gameCtnr0.add(gameObjects.musicBoxNote);
    gameObjects.musicBoxNote2 = globalScene.add.image(-635, gameVars.halfHeight + 20, "misc", "note");
    gameObjects.musicBoxNote2.origX = gameObjects.musicBoxNote2.x;
    gameObjects.musicBoxNote2.origY = gameObjects.musicBoxNote2.y;
    gameObjects.musicBoxNote2.velY = -5;
    gameObjects.gameCtnr1.add(gameObjects.musicBoxNote2);
    gameObjects.musicBox;
    gameObjects.musicBoxButton = new Button(e, gameObjects.gameCtnr0, () => {
        if (!gameObjectsTemp.cantPressMusicBox) {
            gameObjectsTemp.cantPressMusicBox = true;
            setTimeout(() => {
                gameObjectsTemp.cantPressMusicBox = false;
            }, 450);
            setTimeout(() => {
                gameObjects.sounds.gladiator0.stop();
                gameObjects.musicBoxNote.alpha = 0;
                gameObjects.musicBoxNote2.alpha = 0;
                gameObjects.sounds.gladiator1.stop();
                gameObjects.sounds.gladiator2.stop();
            }, 120);
            if (gameObjectsTemp.boxBroken) {
                if (gameVars.darkPoint) {
                    updateInfoText(TEXT.lobby.musicBoxBroken);
                } else {
                    gameVarsTemp.brokeMusicBox = true;
                    updateInfoText(TEXT.lobby.musicBoxWontTurnOn);
                }
            } else if (gameObjectsTemp.stoppedMusic) {
                playSound("stopmusic");
                gameObjects.musicBoxStand.rotation = 0.012;
                globalScene.tweens.add({
                    targets: gameObjects.musicBoxStand,
                    rotation: 0,
                    yoyo: true,
                    ease: "Sine.easeInOut",
                    duration: 500
                });
                globalScene.tweens.add({
                    targets: gameObjects.musicBox,
                    x: "+=-16",
                    ease: "Quad.easeOut",
                    duration: 450
                });
                gameObjects.musicBoxButton.setPos(gameObjects.musicBox.x - 15, gameObjects.musicBox.y);
                if (gameObjectsTemp.boxTeetering) {
                    gameObjects.musicBoxButton.setPos(gameObjects.musicBox.x - 15, gameVars.height - 105);
                    globalScene.tweens.add({
                        targets: gameObjects.musicBox,
                        y: gameVars.height - 105,
                        ease: "Quad.easeIn",
                        duration: 250,
                        onComplete: () => {
                            let e = gameObjects.musicBox.x;
                            gameObjects.musicBox.destroy();
                            gameObjects.musicBox = globalScene.add.image(e, gameVars.height - 105, "buttons", "musicBoxBroken");
                            gameObjects.gameCtnr0.add(gameObjects.musicBox);
                            gameObjects.gameCtnr0.bringToTop(gameObjects.musicBoxStand);
                            playSound("glassbreak");
                            setTimeout(() => {
                                playSound("horrortrack1");
                            }, 3500);
                            gameObjectsTemp.boxBroken = true;
                            gameObjects.musicBoxHandle.destroy();
                            gameObjects.musicBoxButton.setHoverAlpha(0.15);
                        }
                    });
                    if (!gameObjects.clownWelcomePic.cantChange) {
                        let e = gameObjects.clownWelcomePic.x, t = gameObjects.clownWelcomePic.y, a = gameObjects.clownWelcomePic.scaleX;
                        gameObjects.clownWelcomePic.destroy();
                        gameObjects.clownWelcomePic = globalScene.add.image(e, t, "menu", "framesEnter3");
                        gameObjects.clownWelcomePic.scaleX = a;
                        gameObjects.clownWelcomePic.scaleY = a;
                        gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic);
                    }
                } else {
                    gameObjectsTemp.boxTeetering = true;
                }
            } else {
                playSound("stopmusic");
                gameObjects.musicBoxStand.rotation = 0.01;
                gameObjectsTemp.stoppedMusic = true;
                globalScene.tweens.add({
                    targets: gameObjects.musicBox,
                    x: 355,
                    ease: "Cubic.easeOut",
                    duration: 400
                });
                globalScene.tweens.add({
                    targets: gameObjects.musicBoxStand,
                    rotation: 0,
                    yoyo: true,
                    ease: "Sine.easeInOut",
                    duration: 500
                });
                if (!gameObjects.clownWelcomePic.cantChange) {
                    let e = gameObjects.clownWelcomePic.x, t = gameObjects.clownWelcomePic.y, a = gameObjects.clownWelcomePic.scaleX;
                    gameObjects.clownWelcomePic.destroy();
                    gameObjects.clownWelcomePic = globalScene.add.image(e, t, "menu", "framesEnter2");
                    gameObjects.clownWelcomePic.scaleX = a;
                    gameObjects.clownWelcomePic.scaleY = a;
                    gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic);
                }
            }
        }
    }, {
        atlas: "buttons",
        ref: "glow",
        x: 345,
        y: gameVars.height - 340,
        scaleX: 1.35,
        scaleY: 1.35,
        alpha: 0.01
    }, {
        atlas: "buttons",
        ref: "glow",
        alpha: 0.9
    });
    gameObjects.musicBox = globalScene.add.image(345, gameVars.height - 340, "buttons", "musicBox");
    gameObjects.gameCtnr0.add(gameObjects.musicBox);
    gameObjects.musicBoxHandle = globalScene.add.image(gameObjects.musicBox.x, gameObjects.musicBox.y + 31, "buttons", "musicBoxHandle");
    gameObjects.gameCtnr0.add(gameObjects.musicBoxHandle);
    gameObjects.musicBoxStand = globalScene.add.image(345, gameVars.height - 27, "buttons", "boxStand");
    gameObjects.musicBoxStand.setOrigin(0.5, 1);
    gameObjects.gameCtnr0.add(gameObjects.musicBoxStand);
    gameObjects.clownWelcomePic = globalScene.add.sprite(-378, gameVars.height - 273, "menu", "framesEnter2");
    gameObjects.clownWelcomePic.scaleX = 0.85;
    gameObjects.clownWelcomePic.scaleY = 0.85;
    gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic);
    gameObjects.creditsButton = new Button(e, gameObjects.gameCtnr1, () => {
        onCreditsClick(e);
    }, {
        atlas: "menu",
        ref: "credits_normal",
        x: 0,
        y: gameVars.halfHeight + 135,
        scaleX: 0.85,
        scaleY: 0.85
    }, {
        atlas: "menu",
        ref: "credits_hover",
        scaleX: 0.86,
        scaleY: 0.86
    }, {
        atlas: "menu",
        ref: "credits_hover",
        scaleX: 0.88,
        scaleY: 0.88
    });
    gameObjects.undoCreditsButton = new Button(e, gameObjects.gameCtnr1, () => {
        undoCreditsClick(e);
    }, {
        ref: "blackPixel",
        x: 0,
        y: gameVars.halfHeight - 55,
        scaleX: 400,
        scaleY: 330,
        alpha: 0.001
    });
    gameObjects.undoCreditsButton.disappear();
    setTimeout(() => {
        gameObjects.clownWelcomePic.setFrame("framesEnter1");
        playSound("click4", undefined, 0.25);
    }, 3900);
}

function setupInstructionsStand(e) {
    gameObjects.museumStand = new Button(e, gameObjects.gameCtnr1, () => {
        onStandClick(e);
    }, {
        atlas: "buttons",
        ref: "stand_normal",
        x: 367,
        y: 945
    }, {
        atlas: "buttons",
        ref: "stand_hover",
        preload: true
    }, {
        atlas: "buttons",
        ref: "stand_hover",
        preload: true
    }, {
        atlas: "buttons",
        ref: "stand_disabled",
        preload: true
    });
    gameObjects.museumStand.setOrigin(0.5, 1);
}

function onTurnOnPower() {
    if (!gameVars.finishedDarkPoint) {
        if (gameVars.darkPoint) {
            gameVars.finishedDarkPoint = true;
            playSoundOnce("flickeron");
            gameObjects.powerSwitch.setState("disable");
            gameObjects.candleDark.alpha = 0.25;
            gameObjects.candleBright.alpha = 0;
            setTimeout(() => {
                gameObjects.candleDark.alpha = 1;
                setTimeout(() => {
                    gameObjects.candleDark.alpha = 0.25;
                    setTimeout(() => {
                        gameObjects.candleDark.alpha = 0.9;
                        setTimeout(() => {
                            gameVars.darkPoint = false;
                            gameVars.horrorPoint = true;
                            gameObjects.candleDark.alpha = 0;
                            gameObjects.candleBright.alpha = 0;
                            gameObjects.flashDim.alpha = 0;
                        }, 200);
                    }, 75);
                }, 250);
            }, 50);
            gameObjects.moveRightBtn.setOnMouseUpFunc(() => {
                updateInfoText(TEXT.lobby.stayedLongEnough, 4500);
            });
        } else {
            updateInfoText(TEXT.lobby.lightsFine);
        }
    }
}

function initDarkSequence(e) {
    enableMoveLeftButton();
    gameVars.baseSway = 0.03;
    enableFlashlight(true);
    gameVars.darkPoint = true;
    messageBus.publish("startDarkSequence");
    gameObjects.moveRightBtn.setOnMouseUpFunc(() => {
        updateInfoText(TEXT.lobby.tooDark, 5000);
    });
}

function enableFlashlight(e) {
    let t = e ? 0.9 : 0;
    if (e) {
        gameVars.initialExtraDark = 15;
    }
    gameObjects.candleDark.alpha = t;
    gameObjects.candleBright.alpha = t;
}

function makeWelcomeImage(e, t = false) {
    let a = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "loadingSS", e);
    gameObjects.loadingWelcomes[e] = a;
    if (t) {
        if (gameObjectsTemp.loadingWelcomeFollower) {
            gameObjectsTemp.loadingWelcomeFollower.destroy();
        }
        gameObjectsTemp.loadingWelcomeFollower = a;
        gameObjects.loadingCntr.add(a);
    }
    return a;
}

function addToUpdateFuncList(e) {
    if (e) {
        updateFuncList.push(e);
    } else {
        console.warn("invalid function added");
    }
}

function removeFromUpdateFuncList(e) {
    let t = updateFuncList.indexOf(e);
    if (t > -1) {
        updateFuncList.splice(t, 1);
    }
}

function createKey(e, t, a, s, o = true, c) {
    let n;
    playSound("keyfound");
    (n = new Button(globalScene, s, () => {
        n.destroy();
        if (o) {
            playSound("keyget");
        } else {
            playSound("keygetred");
        }
        tempFreeze(500);
        gameObjects.exhibit.setCantMoveIdx(a, false);
        setTimeout(() => {
            enableMoveButtons(true);
            if (c) {
                c();
            }
        }, 100);
    }, {
        atlas: "buttons",
        ref: o ? "key_yellow" : "key_red",
        x: e,
        y: t - 9
    }, {
        atlas: "buttons",
        ref: o ? "key_yellow_glow" : "key_red_glow"
    })).setScale(0.98);
    setTimeout(() => {
        n.setScale(1.02);
        n.setPos(n.getPosX(), n.getPosY() + 5);
        setTimeout(() => {
            n.setScale(1);
            n.setPos(n.getPosX(), n.getPosY() + 2.5);
            setTimeout(() => {
                n.setPos(n.getPosX(), n.getPosY() + 1);
                setTimeout(() => {
                    n.setPos(n.getPosX(), n.getPosY() + 0.5);
                }, 30);
            }, 30);
        }, 30);
    }, 30);
    return n;
}

function initFlashScreens() {
    gameObjects.flashScreens = [];
    for (let e = 0; e < 20; e++) {
        let t = "static" + e, a = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, "flashScreens", t);
        a.scaleX = 1.5;
        a.scaleY = 1.5;
        a.setDepth(9999);
        a.alpha = 0;
        gameObjects.flashScreens[e] = a;
    }
}

function initStaticScreens() {
    gameObjects.staticScreens = [];
    for (let e = 0; e < 4; e++) {
        let t = "static" + e, a = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, "staticScreens", t);
        a.scaleX = 1.5;
        a.scaleY = 1.5;
        a.setDepth(9999);
        a.alpha = 0;
        gameObjects.staticScreens[e] = a;
    }
    gameObjects.staticLite = [];
    for (let e = 0; e < 12; e++) {
        gameObjects.staticLite[e] = [];
        let t = "staticlite" + e, a = globalScene.add.image(0, 0, "staticLite", t);
        a.isFree = true;
        a.setDepth(9999);
        a.alpha = 0;
        gameObjects.staticLite[e].push(a);
    }
}

function showFlashArr(e, t) {
    if (e.length > 0) {
        let a = e[0];
        let newArr = e.slice(1);
        gameObjects.flashScreens[a].alpha = 1;
        setTimeout(() => {
            gameObjects.flashScreens[a].alpha = 0;
            showFlashArr(newArr, t);
        }, 50);
    } else if (t) {
        t();
    }
}

function showFlashRand(e = 1, t, a, s = 1, o) {
    if (o) {
        let e = "click" + (Math.floor(4 * Math.random()) + 1);
        gameObjects.sounds[e].play({
            volume: 0.15 * Math.random() + 0.15 * s
        });
    }
    if (e >= 1) {
        let c = Math.floor(7 * Math.random()) + 5;
        if (c === t) {
            c = Math.floor(7 * Math.random()) + 5;
        }
        gameObjects.flashScreens[c].alpha = s;
        setTimeout(() => {
            gameObjects.flashScreens[c].alpha = 0;
            showFlashRand(e - 1, c, a, s, o);
        }, 40);
    } else if (a) {
        a();
    }
}

function showStaticRand(e = 1, t = false, a, s = 1, o = true) {
    if (o) {
        let e = "click" + (Math.floor(4 * Math.random()) + 1);
        gameObjects.sounds[e].play({
            volume: 0.1 * Math.random() + 0.1 * s
        });
    }
    if (e >= 1) {
        let o = Math.floor(Math.random() * gameObjects.staticScreens.length);
        gameObjects.staticScreens[o].alpha = 1 === e ? Math.min(0.2, s) : Math.min(1, s + 0.2 * (Math.random() - 0.5));
        gameObjects.staticScreens[o].scaleX = t ? -1.5 - 0.1 * Math.random() : 1.5 + 0.1 * Math.random();
        setTimeout(() => {
            gameObjects.staticScreens[o].alpha = 0;
            showStaticRand(e - 1, !t, a, s, false);
        }, 30);
    } else if (undefined !== a) {
        a();
    }
}

function showStaticLite(e = 4, t = 4, a = 2, s = 0.15) {
    if (0 === e) {
        return;
    }
    let o = 0;
    for (;o < t; ) {
        o++;
        showStaticLiteObj(a, s);
    }
    setTimeout(() => {
        showStaticLite(e - 1, t, a, s);
    }, 50);
}

function showStaticLiteObj(e, t) {
    let a = Math.floor(12 * Math.random()), s = a <= 5, o = gameObjects.staticLite[a], c = null;
    for (let e = 0; e < o.length && !(c = o[e]).isFree; e++) {}
    if (null == c) {
        let e = "staticlite" + a;
        (c = globalScene.add.image(0, 0, "staticLite", e)).setDepth(9999);
        gameObjects.staticLite[a].push(c);
    }
    c.alpha = 0.25 * t + Math.random() * t * 0.5;
    c.isFree = false;
    c.x = Math.random() * gameVars.width * 1.1 - 50;
    c.y = Math.random() * gameVars.height * 1.1 - 50;
    let n = Math.abs(gameVars.halfWidth - c.x), m = Math.abs(gameVars.halfHeight - c.y);
    let distFromCenterUnit = 0.5 + n / gameVars.halfWidth + m / gameVars.halfHeight;
    c.alpha *= distFromCenterUnit;
    c.scaleX = e;
    c.scaleY = e;
    let i = Math.random() > 0.5 ? -1 : 1;
    if (s) {
        c.scaleX *= 1 + 5 * Math.random() * i;
        c.scaleY *= 1 + Math.random();
    } else {
        let e = 0.75 * Math.random();
        c.scaleX *= 0.5 + e * i;
        c.scaleY *= 0.5 + e;
        c.rotation = 6.28 * Math.random();
    }
    let g = 10 + 100 * Math.random();
    setTimeout(() => {
        c.alpha = 0;
        c.isFree = true;
    }, g);
}

function zoomTemp(e) {
    globalScene.cameras.main.setZoom(e);
    globalScene.tweens.add({
        targets: globalScene.cameras.main,
        zoom: 1,
        ease: "Cubic.easeOut",
        duration: 400
    });
}

function addScreenShake(e, t) {
    globalScene.cameras.main.x += e;
    globalScene.cameras.main.y += e;
}

function flipEntryLights(e = 1) {
    let t = gameVars.horrorPoint ? 20 + 150 * Math.random() : 75;
    if ("brighten" === gameObjects.entrance.entryLights1.status) {
        gameObjects.entrance.entryLights1.counter += e;
        if (gameObjects.entrance.entryLights1.counter > t) {
            gameObjects.entrance.entryLights1.counter = 0;
            gameObjects.entrance.entryLights1.status = "dim";
            gameObjects.entrance.entryLights1.alpha = 0.1;
            gameObjects.entrance.entryLights2.alpha = 0.85;
            setTimeout(() => {
                gameObjects.entrance.entryLights1.alpha = 0;
                gameObjects.entrance.entryLights2.alpha = 1;
            }, 60);
        }
    } else if ("dim" === gameObjects.entrance.entryLights1.status) {
        gameObjects.entrance.entryLights1.counter += e;
        if (gameObjects.entrance.entryLights1.counter > t) {
            gameObjects.entrance.entryLights1.counter = 0;
            gameObjects.entrance.entryLights1.status = "brighten";
            gameObjects.entrance.entryLights1.alpha = 0.85;
            gameObjects.entrance.entryLights2.alpha = 0.1;
            setTimeout(() => {
                gameObjects.entrance.entryLights1.alpha = 1;
                gameObjects.entrance.entryLights2.alpha = 0;
            }, 60);
        }
    }
}

function animateVoidGlow() {
    let e = 0.025 * (gameObjects.standDisplay.getScaleY() - 1);
    gameObjectsTemp.voidGlow.scaleX = gameObjects.standDisplay.getScaleX() * (0.998 + 0.005 * Math.random());
    gameObjectsTemp.voidGlow.scaleY = gameObjects.standDisplay.getScaleY() * (0.998 + 0.006 * Math.random()) * (e + 1);
    gameObjectsTemp.voidGlow.alpha -= 0.2;
    if (gameObjectsTemp.voidGlow.alpha < 0.01) {
        gameObjectsTemp.voidGlow.alpha = 1;
    }
}

function ftueMoveButton(e = false) {
    globalScene.tweens.timeline({
        targets: [ gameObjects.moveRightBtnHighlight, gameObjects.moveLeftBtnHighlight ],
        tweens: [ {
            alpha: e ? 0.75 : 1,
            ease: "Cubic.easeIn",
            duration: 800
        }, {
            alpha: 0,
            ease: "Quad.easeOut",
            duration: 2000,
            onComplete: () => {
                setTimeout(() => {
                    if (!gameVarsTemp.hasMoved) {
                        ftueMoveButton(true);
                    }
                }, 7000);
            }
        } ]
    });
}

function updateMusicBox(e) {
    if (!gameObjectsTemp.boxBroken) {
        gameObjects.musicBoxHandle.x = gameObjects.musicBox.x;
        gameObjects.musicBoxHandle.y = gameObjects.musicBox.y + 15;
    }
    if (1 === gameVars.lateUpdateCurrentScene && 1 === gameObjects.exhibit.getCurrentScene() && gameObjects.musicBoxNote2.alpha > 0.01) {
        let t = gameObjects.musicBoxNote2.velY * e;
        gameObjects.musicBoxNote2.y += t;
        gameObjects.musicBoxNote2.x -= t;
        gameObjects.musicBoxNote2.velY *= 1 - 0.06 * e;
        if (gameObjects.musicBoxNote2.velY > -0.5) {
            gameObjects.musicBoxNote2.scaleY = 0.85 * gameObjects.musicBoxNote2.scaleY - 0.1;
            gameObjects.musicBoxNote2.scaleX = gameObjects.musicBoxNote2.scaleY;
            if (gameObjects.musicBoxNote2.scaleY <= 0.1) {
                gameObjects.musicBoxNote2.scaleX = 1;
                gameObjects.musicBoxNote2.scaleY = 1;
                gameObjects.musicBoxNote2.velY = -6;
                gameObjects.musicBoxNote2.x = gameObjects.musicBoxNote2.origX;
                gameObjects.musicBoxNote2.y = gameObjects.musicBoxNote2.origY + 150 * (Math.random() - 0.5);
            }
        }
    } else {
        gameObjects.musicBoxNote2.scaleX = 0;
        gameObjects.musicBoxNote2.scaleY = 0;
    }
    if (0 === gameVars.lateUpdateCurrentScene || 0 === gameObjects.exhibit.getCurrentScene() && gameObjects.musicBoxNote.alpha > 0.01) {
        if (!gameObjectsTemp.stoppedMusic) {
            gameObjects.musicBoxHandle.rotation += 0.01 * e;
        }
        gameObjects.musicBoxNote.y += gameObjects.musicBoxNote.velY * e;
        gameObjects.musicBoxNote.velY *= 1 - 0.08 * e;
        if (gameObjects.musicBoxNote.velY > -0.445) {
            gameObjects.musicBoxNote.scaleY = 0.85 * gameObjects.musicBoxNote.scaleY - 0.1;
            gameObjects.musicBoxNote.scaleX = gameObjects.musicBoxNote.scaleY;
            if (gameObjects.musicBoxNote.scaleY <= 0.1) {
                gameObjects.musicBoxNote.scaleX = 1;
                gameObjects.musicBoxNote.scaleY = 1;
                gameObjects.musicBoxNote.velY = -2.5;
                gameObjects.musicBoxNote.x = gameObjects.musicBoxNote.origX + 70 * (Math.random() - 0.5);
                gameObjects.musicBoxNote.y = gameObjects.musicBoxNote.origY;
            }
        }
    }
}
