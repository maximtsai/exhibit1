function setupRoomFaucet(scene, roomIndex, roomContainer) {
    let t, s;
    gameObjects.exhibit.setBackgroundAtIndex(roomIndex, "bgs", "bg3");
    gameObjects.roomFaucetObjs = {
        roomIndex: roomIndex,
        roomContainer: roomContainer,
        rotAccumulate: -4,
        overflowAmt: 0,
        soundCooldown: 0,
        leverLength: 230,
        guideArrowNeedsReset: false,
        arrowDistDelay: 0,
        arrowAccumulateBump: 0,
        dollImages: [],
        redDamper: 0
    };
    gameObjects.roomFaucetObjs.container = roomContainer;
    setWashyDollImage("washyHappy");
    setWashyDollImage("washyDrowned");
    setWashyDollImage("washyNeutral");
    setWashyDollImage("washyWorried");
    setWashyDollImage("washyRelaxed");
    setupFaucetInk();
    gameObjects.roomFaucetObjs.pipe1 = scene.add.image(-545, 161, "roomFaucet", "pipe1");
    gameObjects.roomFaucetObjs.pipe2 = scene.add.image(-425, 300, "roomFaucet", "pipe2");
    gameObjects.roomFaucetObjs.pipe3 = scene.add.image(-305, 90, "roomFaucet", "pipe3");
    gameObjects.roomFaucetObjs.pipe4 = scene.add.image(-88, 70, "roomFaucet", "pipe4");
    roomContainer.add(gameObjects.roomFaucetObjs.pipe1);
    roomContainer.add(gameObjects.roomFaucetObjs.pipe2);
    roomContainer.add(gameObjects.roomFaucetObjs.pipe3);
    roomContainer.add(gameObjects.roomFaucetObjs.pipe4);
    gameObjects.roomFaucetObjs.portrait = scene.add.image(200, 142, "roomFaucet", "portrait");
    gameObjects.roomFaucetObjs.portraitRed = scene.add.image(gameObjects.roomFaucetObjs.portrait.x, gameObjects.roomFaucetObjs.portrait.y, "roomFaucet", "portraitRed");
    gameObjects.roomFaucetObjs.portraitRed.alpha = 0;
    roomContainer.add(gameObjects.roomFaucetObjs.portrait);
    roomContainer.add(gameObjects.roomFaucetObjs.portraitRed);
    gameObjects.roomFaucetObjs.duck = scene.add.image(310, gameVars.height - 20, "roomFaucet", "duck");
    gameObjects.roomFaucetObjs.duck.setOrigin(0.5, 1);
    gameObjects.roomFaucetObjs.duck.scaleX = 0.45;
    gameObjects.roomFaucetObjs.duck.scaleY = 0.45;
    roomContainer.add(gameObjects.roomFaucetObjs.duck);
    gameObjects.roomFaucetObjs.hose = scene.add.image(164, -50, "roomFaucet", "hose");
    gameObjects.roomFaucetObjs.hose.setOrigin(0.5, 0);
    gameObjects.roomFaucetObjs.hose.origX = gameObjects.roomFaucetObjs.hose.x;
    gameObjects.roomFaucetObjs.hose.origY = gameObjects.roomFaucetObjs.hose.y;
    gameObjects.roomFaucetObjs.hose.velX = 0;
    gameObjects.roomFaucetObjs.hose.velY = 0;
    roomContainer.add(gameObjects.roomFaucetObjs.hose);
    gameObjects.roomFaucetObjs.handle = new Button(scene, {
        container: roomContainer,
        normal: {
            atlas: "buttons",
            ref: "glow",
            x: 0,
            scaleX: 1.15,
            scaleY: 1.15,
            y: gameVars.halfHeight,
            alpha: 0.001
        },
        hover: {
            atlas: "buttons",
            ref: "glow",
            alpha: 0.7
        },
        isDraggable: true,
        onDrop: dropHandle
    });
    gameObjects.roomFaucetObjs.placard = new Button(scene, roomContainer, () => {
        if (gameVars.horrorPoint) {
            if (gameObjects.roomFaucetObjs.roomCompleted) {
                updateInfoText(TEXT.faucet.done);
            } else {
                updateInfoText(TEXT.faucet.name);
            }
        } else if (gameVars.darkPoint) {
            updateInfoText(TEXT.faucet.dark);
        } else {
            updateInfoText(TEXT.faucet.name);
        }
    }, {
        atlas: "buttons",
        ref: "placard",
        x: 380,
        y: gameVars.height - 240
    }, {
        atlas: "buttons",
        ref: "placard_hover"
    });
    gameObjects.roomFaucetObjs.lever = scene.add.image(gameObjects.roomFaucetObjs.hose.x - 111, gameVars.halfHeight - 39, "roomFaucet", "lever");
    roomContainer.add(gameObjects.roomFaucetObjs.lever);
    gameObjects.roomFaucetObjs.lever.rotation = -0.73;
    gameObjects.roomFaucetObjs.lever.rotVel = 0;
    gameObjects.roomFaucetObjs.waterCounter = 1;
    gameObjects.roomFaucetObjs.freeDropletPool = [];
    gameObjects.roomFaucetObjs.activeDroplets = [];
    gameObjects.roomFaucetObjs.dragline = scene.add.sprite(0, -9999, "blackPixel");
    gameObjects.roomFaucetObjs.dragline.scaleY = 20;
    gameObjects.roomFaucetObjs.handle.offsetY = 0;
    resetHandlePos();
    addToUpdateFuncList(roomFaucetUpdate);
    messageBus.subscribe("exhibitMove", e => {
        if (e === roomIndex) {
            if (gameVars.darkPoint) {
                addToUpdateFuncList(faucetRedUpdate);
                globalScene.tweens.add({
                    targets: gameObjects.roomFaucetObjs.duck,
                    x: 280,
                    ease: "Quad.easeOut",
                    duration: 400,
                    delay: 1500
                });
            }
            addGuideArrowToContainer(gameObjects.roomFaucetObjs.roomContainer);
            updateGuideArrow(0, -9999);
            tweenVolume("gladiator0", 0.3);
            tweenVolume("gladiator1", 0.6);
            tweenVolume("gladiator2", 0.5);
        }
    });
    t = messageBus.subscribe("startDarkSequence", e => {
        gameObjects.roomFaucetObjs.isLocked = false;
        gameObjects.roomFaucetObjs.handle.reappear();
        resetHandlePos();
        gameObjects.roomFaucetObjs.portraitRed.alpha = 1;
        t.unsubscribe();
    });
    s = messageBus.subscribe("startHorrorSequence", e => {
        gameObjects.roomFaucetObjs.isLocked = false;
        gameObjects.roomFaucetObjs.handle.reappear();
        resetHandlePos();
        gameObjects.roomFaucetObjs.firstComplete = true;
        removeFromUpdateFuncList(faucetRedUpdate);
        gameObjects.roomFaucetObjs.portraitRed.destroy();
        s.unsubscribe();
    });
}

function setupFaucetInk() {
    gameObjects.roomFaucetObjs.ink = globalScene.add.image(-160, gameVars.halfHeight + 99, "roomFaucet", "ink1");
    gameObjects.roomFaucetObjs.ink.origX = gameObjects.roomFaucetObjs.ink.x;
    gameObjects.roomFaucetObjs.ink.setOrigin(0.5, 0);
    gameObjects.roomFaucetObjs.ink.alpha = 0;
    gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.ink);
}

function roomFaucetUpdate(e) {
    let a = false;
    if (!gameObjects.roomFaucetObjs.handle.getIsDragged() || gameObjects.roomFaucetObjs.roomCompleted || gameObjects.roomFaucetObjs.isLocked) {
        if (gameObjects.roomFaucetObjs.guideArrowNeedsReset) {
            gameObjects.roomFaucetObjs.guideArrowNeedsReset = false;
            resetGuideArrowFaucet();
        }
    } else {
        gameObjects.roomFaucetObjs.soundCooldown--;
        let o = gameObjects.roomFaucetObjs.handle.getXPos(), t = gameObjects.roomFaucetObjs.handle.getYPos() - gameObjects.roomFaucetObjs.handle.offsetY, s = o - gameObjects.roomFaucetObjs.lever.x, r = t - gameObjects.roomFaucetObjs.lever.y, m = Math.atan2(r, s) + 0.5 * Math.PI;
        if (m > Math.PI) {
            m -= 2 * Math.PI;
        }
        let c = m - gameObjects.roomFaucetObjs.lever.rotation;
        if (c > Math.PI) {
            c -= 2 * Math.PI;
        } else if (c < -Math.PI) {
            c += 2 * Math.PI;
        }
        let b = 0;
        if (c > 0.01) {
            b = Math.min(0.0024, 0.006 * c);
        } else if (c < -0.01) {
            b = Math.max(-0.0024, 0.006 * c);
        }
        if (gameVars.horrorPoint && b < 0 && gameObjects.roomFaucetObjs.lever.rotation > 0.8) {
            b = 0;
        }
        gameObjects.roomFaucetObjs.lever.rotVel += b;
        gameObjects.roomFaucetObjs.lever.rotVel *= 0.88;
        a = true;
        if (Math.abs(gameObjects.roomFaucetObjs.lever.rotation + 0.2) < 0.03 && gameObjects.roomFaucetObjs.soundCooldown <= 0) {
            if (gameObjects.roomFaucetObjs.lever.rotVel > 0.005) {
                playSound("metalsqueak1");
                gameObjects.roomFaucetObjs.soundCooldown = 50;
            } else if (gameObjects.roomFaucetObjs.lever.rotVel < -0.005) {
                playSound("metalsqueak2");
                gameObjects.roomFaucetObjs.soundCooldown = 50;
            }
            gameObjects.roomFaucetObjs.lever.rotVel *= 0.5;
        }
        if (gameObjects.roomFaucetObjs.lever.rotation < -0.75) {
            if (gameVars.darkPoint && gameObjects.exhibit.needCleanup) {
                gameObjects.exhibit.needCleanup = false;
                gameObjects.roomFaucetObjs.isLocked = true;
                gameObjects.roomFaucetObjs.handle.disappear();
                setWashyDollImage("washyRelaxed");
                setTimeout(() => {
                    playSound("deepbell4");
                    updateInfoTextSoft(TEXT.roomCleaned, 2000);
                }, 300);
            }
            gameObjects.roomFaucetObjs.lever.rotation = -0.74;
            gameObjects.roomFaucetObjs.lever.rotVel *= -0.35;
        } else if (gameObjects.roomFaucetObjs.lever.rotVel > 0.001 && gameObjects.roomFaucetObjs.lever.rotation > 0.78 && !gameObjects.roomFaucetObjs.firstComplete && !gameVars.horrorPoint && !gameVars.darkPoint) {
            gameObjects.roomFaucetObjs.handle.disappear();
            gameObjects.roomFaucetObjs.firstComplete = true;
            gameObjects.roomFaucetObjs.isLocked = true;
            gameObjects.roomFaucetObjs.lever.rotation = 0.799;
            setTimeout(() => {
                createKey(-365, gameVars.halfHeight + 85, gameObjects.roomFaucetObjs.roomIndex, gameObjects.roomFaucetObjs.roomContainer, true);
            }, 100);
        } else if (gameObjects.roomFaucetObjs.lever.rotation > 0.8) {
            if (gameVars.horrorPoint) {
                if (gameObjects.roomFaucetObjs.lever.rotVel > 0.002) {
                    let a = 0.01 * (2 + gameObjects.roomFaucetObjs.lever.rotation + gameObjects.roomFaucetObjs.rotAccumulate);
                    if (Math.random() < a * e) {
                        gameObjects.roomFaucetObjs.rotAccumulate = -3.25;
                        if (Math.random() < 0.75 * gameObjects.roomFaucetObjs.lever.rotation - 0.75) {
                            if (gameObjects.roomFaucetObjs.soundCooldown <= 0) {
                                playSound("metalgrind", 4);
                                gameObjects.roomFaucetObjs.soundCooldown = 45;
                            }
                            if (gameObjects.roomFaucetObjs.lever.rotation > 1.2 && !gameObjects.roomFaucetObjs.usingBentLever) {
                                gameObjects.roomFaucetObjs.usingBentLever = true;
                                gameObjects.roomFaucetObjs.lever.alpha = 0;
                                gameObjects.roomFaucetObjs.leverBent = globalScene.add.image(gameObjects.roomFaucetObjs.lever.x, gameObjects.roomFaucetObjs.lever.y, "roomFaucet", "leverhalfbroken");
                                gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.leverBent);
                            }
                            gameObjects.roomFaucetObjs.lever.rotVel = Math.max(0.03, 0.16 - 0.025 * gameObjects.roomFaucetObjs.lever.rotation);
                            if (gameObjects.roomFaucetObjs.lever.rotation < 2.5) {
                                showFlashRand(1, undefined, undefined, 0.4 * (gameObjects.roomFaucetObjs.lever.rotation - 1));
                            }
                        } else {
                            if (gameObjects.roomFaucetObjs.soundCooldown <= 0) {
                                playSound("metalsqueak1");
                                gameObjects.roomFaucetObjs.soundCooldown = 30;
                            }
                            gameObjects.roomFaucetObjs.lever.rotVel = Math.max(0.015, 0.07 - 0.025 * gameObjects.roomFaucetObjs.lever.rotation);
                            if (gameObjects.roomFaucetObjs.lever.rotation < 2.5) {
                                showStaticRand(1, undefined, undefined, 0.45 * (gameObjects.roomFaucetObjs.lever.rotation - 1));
                            }
                        }
                        createExtraDrops(2);
                    }
                }
            } else {
                gameObjects.roomFaucetObjs.lever.rotation = 0.785;
                gameObjects.roomFaucetObjs.lever.rotVel *= -0.12;
            }
            gameObjects.roomFaucetObjs.rotAccumulate += 0.016;
            gameObjects.roomFaucetObjs.lever.rotVel *= Math.max(1.6 - gameObjects.roomFaucetObjs.lever.rotation, 0.43);
        }
        updateGuideArrowFaucet();
        if (gameObjects.roomFaucetObjs.lever.rotation > 0.63) {
            gameObjects.roomFaucetObjs.arrowAccumulateBump += 0.02;
            if (gameObjects.roomFaucetObjs.arrowAccumulateBump > 1) {
                gameObjects.roomFaucetObjs.arrowAccumulateBump = 0;
                updateGuideArrowFaucet(true);
            }
        }
        updateWashyExpression(gameObjects.roomFaucetObjs.lever.rotation);
        gameObjects.roomFaucetObjs.guideArrowNeedsReset = true;
    }
    if (gameObjects.roomFaucetObjs.lever.rotation > -0.5) {
        let e = Math.max(0, 7 * (gameObjects.roomFaucetObjs.lever.rotation + 0.35)), a = 13;
        if (gameObjects.roomFaucetObjs.lever.rotation > 2.8) {
            shakeBGPipes(12);
            if (!gameObjects.roomFaucetObjs.roomCompleted) {
                gameObjects.roomFaucetObjs.duck.scaleX = -0.45;
                let e = gameObjects.roomFaucetObjs.portrait.x, a = gameObjects.roomFaucetObjs.portrait.y;
                gameObjects.roomFaucetObjs.portrait.destroy();
                gameObjects.roomFaucetObjs.portrait = globalScene.add.image(e, a, "roomFaucet", "portraitBlack");
                gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.portrait);
                gameObjects.roomFaucetObjs.ink.alpha = 1;
                gameObjects.sounds.watergurgle.play({
                    loop: true
                });
                messageBus.subscribe("exhibitMove", e => {
                    let a = Math.abs(e - gameObjects.roomFaucetObjs.roomIndex);
                    tweenVolume("watergurgle", Math.max(0, 1 / (1 + a * a * 0.6) - 0.22));
                });
                gameObjects.roomFaucetObjs.hose.destroy();
                let o = gameObjects.roomFaucetObjs.hose.origX, t = gameObjects.roomFaucetObjs.hose.origY;
                gameObjects.roomFaucetObjs.hose = globalScene.add.image(o, t, "roomFaucet", "hosebroken");
                gameObjects.roomFaucetObjs.hose.origX = o;
                gameObjects.roomFaucetObjs.hose.origY = t;
                gameObjects.roomFaucetObjs.hose.setOrigin(0.5, 0);
                gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.hose);
                gameObjects.roomFaucetObjs.lever.rotation = 2.65;
                gameObjects.roomFaucetObjs.handle.destroy();
                let s = gameObjects.roomFaucetObjs.lever.x, r = gameObjects.roomFaucetObjs.lever.y;
                gameObjects.roomFaucetObjs.leverBent.destroy();
                gameObjects.roomFaucetObjs.leverBent = globalScene.add.image(s, r, "roomFaucet", "leverbroken");
                gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.leverBent);
                showFlashArr([ 0, 5, 15, 6, 15, 16, 2, 16, 16, 7, 0 ], () => {
                    showStaticRand(5);
                    setTimeout(() => {
                        showStaticRand(2);
                        setTimeout(() => {
                            showStaticRand(1, undefined, undefined, 0.05);
                        }, 750);
                    }, 750);
                });
                gameVars.walkSlow = true;
                gameObjects.roomFaucetObjs.roomCompleted = true;
                updateWashyExpression(999);
                setTimeout(() => {
                    gameObjects.roomFaucetObjs.startOverflow = true;
                }, 600);
                setTimeout(() => {
                    createKey(-155, gameVars.halfHeight + 160, gameObjects.roomFaucetObjs.roomIndex, gameObjects.roomFaucetObjs.roomContainer, false);
                }, 1500);
            }
            let e = 3 * (Math.random() - 0.5), a = 1.5 * (Math.random() - 0.5);
            gameObjects.roomFaucetObjs.hose.x = gameObjects.roomFaucetObjs.hose.origX + e;
            gameObjects.roomFaucetObjs.hose.y = gameObjects.roomFaucetObjs.hose.origY + a;
            gameObjects.roomFaucetObjs.lever.x = gameObjects.roomFaucetObjs.hose.x - 111 + e;
            gameObjects.roomFaucetObjs.lever.y = gameVars.halfHeight - 39 + a;
            gameObjects.roomFaucetObjs.lever.rotation = 3;
            gameObjects.roomFaucetObjs.ink.x = gameObjects.roomFaucetObjs.ink.origX + 0.4 * e;
            updateInk();
        } else {
            if (e < a) {
                gameObjects.roomFaucetObjs.waterCounter -= e;
                if (gameObjects.roomFaucetObjs.waterCounter <= 0) {
                    gameObjects.roomFaucetObjs.waterCounter = 100;
                    createWaterDrop();
                }
            }
            if (e > a - 4) {
                shakeBGPipes(e);
                let o = e - (a - 4), t = (Math.random() - 0.5) * o * 0.6, s = (Math.random() - 0.5) * o * 0.3, r = gameObjects.roomFaucetObjs.hose.origX - gameObjects.roomFaucetObjs.hose.x, m = gameObjects.roomFaucetObjs.hose.origY - gameObjects.roomFaucetObjs.hose.y;
                gameObjects.roomFaucetObjs.lever.x = gameObjects.roomFaucetObjs.hose.x - 111 - r;
                gameObjects.roomFaucetObjs.lever.y = gameVars.halfHeight - 39 - m;
                gameObjects.roomFaucetObjs.hose.velX += t + 0.65 * r;
                gameObjects.roomFaucetObjs.hose.velY += s + 0.65 * m;
                gameObjects.roomFaucetObjs.hose.velX *= 0.6;
                gameObjects.roomFaucetObjs.hose.velY *= 0.6;
                gameObjects.roomFaucetObjs.hose.x += gameObjects.roomFaucetObjs.hose.velX;
                gameObjects.roomFaucetObjs.hose.y += gameObjects.roomFaucetObjs.hose.velY;
                gameObjects.roomFaucetObjs.lever.x += 0.75 * gameObjects.roomFaucetObjs.hose.velX;
                gameObjects.roomFaucetObjs.lever.y += 0.5 * gameObjects.roomFaucetObjs.hose.velY;
            }
        }
    }
    for (let a = 0; a < gameObjects.roomFaucetObjs.activeDroplets.length; a++) {
        let o = gameObjects.roomFaucetObjs.activeDroplets[a];
        o.velY += 0.1;
        o.y += o.velY * e;
        if (o.y > gameVars.halfHeight + 208) {
            o.y = -9999;
            gameObjects.roomFaucetObjs.activeDroplets.splice(a, 1);
            gameObjects.roomFaucetObjs.freeDropletPool.push(o);
        }
    }
    if (a) {
        gameObjects.roomFaucetObjs.lever.rotation += gameObjects.roomFaucetObjs.lever.rotVel * e;
    }
    if (gameObjects.roomFaucetObjs.leverBent) {
        gameObjects.roomFaucetObjs.leverBent.x = gameObjects.roomFaucetObjs.lever.x;
        gameObjects.roomFaucetObjs.leverBent.y = gameObjects.roomFaucetObjs.lever.y;
        gameObjects.roomFaucetObjs.leverBent.rotation = gameObjects.roomFaucetObjs.lever.rotation;
    }
}

function updateInk() {
    gameObjects.roomFaucetObjs.ink.scaleX = 0.995 + 0.01 * Math.random();
}

function createWaterDrop() {
    let e = gameObjects.roomFaucetObjs.freeDropletPool.pop();
    if (!e) {
        (e = globalScene.add.image(0, 0, "roomFaucet", "waterdrop")).setDepth(5);
        gameObjects.roomFaucetObjs.container.add(e);
    }
    e.scaleX = 0.85;
    setTimeout(() => {
        e.scaleX = 0.95;
        setTimeout(() => {
            e.scaleX = 1;
        }, 30);
    }, 30);
    e.velY = 0.4;
    e.x = gameObjects.roomFaucetObjs.hose.x - 360 + 90 * Math.random();
    e.y = gameObjects.roomFaucetObjs.hose.y + 624;
    gameObjects.roomFaucetObjs.activeDroplets.push(e);
}

function dropHandle() {
    resetHandlePos();
}

function resetHandlePos() {
    let e = gameObjects.roomFaucetObjs.lever.x, a = gameObjects.roomFaucetObjs.lever.y, o = gameObjects.roomFaucetObjs.lever.rotation - 0.5 * Math.PI, t = e + Math.cos(o) * gameObjects.roomFaucetObjs.leverLength, s = a + Math.sin(o) * gameObjects.roomFaucetObjs.leverLength + gameObjects.roomFaucetObjs.handle.offsetY;
    gameObjects.roomFaucetObjs.handle.setPos(t, s);
}

function updateGuideArrowFaucet(e) {
    let a = gameObjects.roomFaucetObjs.lever.x, o = gameObjects.roomFaucetObjs.lever.y, t = gameObjects.roomFaucetObjs.lever.rotation - 0.5 * Math.PI, s = a + Math.cos(t) * (gameObjects.roomFaucetObjs.leverLength + 7), r = o + Math.sin(t) * (gameObjects.roomFaucetObjs.leverLength + 7) + gameObjects.roomFaucetObjs.handle.offsetY, m = gameVars.mouseposx - s - gameVars.halfWidth, c = gameVars.mouseposy - r, b = Math.min(150, Math.sqrt(m * m + c * c));
    if (b < 35) {
        b = 0;
    } else if (b > 70 && e) {
        b += 20;
    }
    gameObjects.roomFaucetObjs.arrowDistDelay = 0.6 * gameObjects.roomFaucetObjs.arrowDistDelay + 0.4 * b;
    let O = Math.atan2(c, m);
    updateGuideArrow(s, r, O, gameObjects.roomFaucetObjs.arrowDistDelay);
}

function resetGuideArrowFaucet() {
    updateGuideArrow(0, -9999);
    gameObjects.roomFaucetObjs.arrowDistDelay = 0;
}

function createExtraDrops(e) {
    for (let a = 0; a < e; a++) {
        createWaterDrop();
    }
    setTimeout(() => {
        createExtraDrops(e - 1);
    }, 25);
}

function setWashyDollImage(e) {
    if (gameObjects.roomFaucetObjs.doll) {
        if (gameObjects.roomFaucetObjs.doll == gameObjects.roomFaucetObjs.dollImages[e]) {
            return;
        }
        gameObjects.roomFaucetObjs.doll.visible = false;
    }
    if (!gameObjects.roomFaucetObjs.dollImages[e]) {
        let a = globalScene.add.image(-145, gameVars.height - 163, "roomFaucet", e);
        gameObjects.roomFaucetObjs.dollImages[e] = a;
        gameObjects.roomFaucetObjs.roomContainer.add(a);
    }
    gameObjects.roomFaucetObjs.dollImages[e].visible = true;
    gameObjects.roomFaucetObjs.doll = gameObjects.roomFaucetObjs.dollImages[e];
    bounceWashyDoll();
}

function bounceWashyDoll() {
    gameObjects.roomFaucetObjs.doll.scaleY = 1.008;
    setTimeout(() => {
        gameObjects.roomFaucetObjs.doll.scaleY = 1.004;
        setTimeout(() => {
            gameObjects.roomFaucetObjs.doll.scaleY = 1;
        }, 40);
    }, 50);
}

function updateWashyExpression(e) {
    if (!gameObjects.roomFaucetObjs.firstComplete || gameVars.darkPoint || gameVars.horrorPoint) {
        if (gameObjects.roomFaucetObjs.roomCompleted) {
            setWashyDollImage("washyDrowned");
        } else {
            setWashyDollImage(e < -0.25 ? "washyRelaxed" : e < 1.6 ? "washyNeutral" : "washyWorried");
        }
    } else {
        setWashyDollImage("washyHappy");
    }
}

function shakeBGPipes(e) {
    if (e > 9) {
        let a = 0.5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe1.x = Math.random() * a - 545;
        gameObjects.roomFaucetObjs.pipe1.y = 161 + Math.random() * a;
    }
    if (e > 10) {
        let a = 0.5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe2.x = Math.random() * a - 425;
        gameObjects.roomFaucetObjs.pipe2.y = 300 + Math.random() * a;
    }
    if (e > 11) {
        let a = 0.5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe3.x = Math.random() * a - 305;
        gameObjects.roomFaucetObjs.pipe3.y = 90 + Math.random() * a;
    }
    if (e > 11.5) {
        let a = 0.5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe4.x = Math.random() * a - 88;
        gameObjects.roomFaucetObjs.pipe4.y = 70 + Math.random() * a;
    }
}

function faucetRedUpdate() {
    let e = gameVars.mouseposx - gameObjects.roomFaucetObjs.portraitRed.x - gameVars.halfWidth, a = gameVars.mouseposy - gameObjects.roomFaucetObjs.portraitRed.y, o = Math.abs(e) + Math.abs(a), t = Math.max(0, Math.min(1, 0.003 * (o - 70 - gameObjects.roomFaucetObjs.redDamper)));
    if (t > gameObjects.roomFaucetObjs.portraitRed.alpha) {
        gameObjects.roomFaucetObjs.portraitRed.alpha = 0.95 * gameObjects.roomFaucetObjs.portraitRed.alpha + 0.05 * t;
        if (gameObjects.roomFaucetObjs.portraitRed.alpha < 0.85) {
            gameObjects.roomFaucetObjs.redDamper += 0.8;
        }
    } else {
        gameObjects.roomFaucetObjs.portraitRed.alpha = 0.88 * gameObjects.roomFaucetObjs.portraitRed.alpha + 0.12 * t;
    }
}
