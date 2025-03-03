function setupRoomFaucet(e, a, o) {
    let t, s;
    gameObjects.exhibit.setBackgroundAtIndex(a, "bgs", "bg3"), gameObjects.roomFaucetObjs = {
        roomIndex: a,
        roomContainer: o,
        rotAccumulate: -4,
        overflowAmt: 0,
        soundCooldown: 0,
        leverLength: 230,
        guideArrowNeedsReset: !1,
        arrowDistDelay: 0,
        arrowAccumulateBump: 0,
        dollImages: [],
        redDamper: 0
    }, gameObjects.roomFaucetObjs.container = o, setWashyDollImage("washyHappy"), setWashyDollImage("washyDrowned"), setWashyDollImage("washyNeutral"), setWashyDollImage("washyWorried"), setWashyDollImage("washyRelaxed"), setupFaucetInk(), gameObjects.roomFaucetObjs.pipe1 = e.add.image(-545, 161, "roomFaucet", "pipe1"), gameObjects.roomFaucetObjs.pipe2 = e.add.image(-425, 300, "roomFaucet", "pipe2"), gameObjects.roomFaucetObjs.pipe3 = e.add.image(-305, 90, "roomFaucet", "pipe3"), gameObjects.roomFaucetObjs.pipe4 = e.add.image(-88, 70, "roomFaucet", "pipe4"), o.add(gameObjects.roomFaucetObjs.pipe1), o.add(gameObjects.roomFaucetObjs.pipe2), o.add(gameObjects.roomFaucetObjs.pipe3), o.add(gameObjects.roomFaucetObjs.pipe4), gameObjects.roomFaucetObjs.portrait = e.add.image(200, 142, "roomFaucet", "portrait"), gameObjects.roomFaucetObjs.portraitRed = e.add.image(gameObjects.roomFaucetObjs.portrait.x, gameObjects.roomFaucetObjs.portrait.y, "roomFaucet", "portraitRed"), gameObjects.roomFaucetObjs.portraitRed.alpha = 0, o.add(gameObjects.roomFaucetObjs.portrait), o.add(gameObjects.roomFaucetObjs.portraitRed), gameObjects.roomFaucetObjs.duck = e.add.image(310, gameVars.height - 20, "roomFaucet", "duck"), gameObjects.roomFaucetObjs.duck.setOrigin(.5, 1), gameObjects.roomFaucetObjs.duck.scaleX = .45, gameObjects.roomFaucetObjs.duck.scaleY = .45, o.add(gameObjects.roomFaucetObjs.duck), gameObjects.roomFaucetObjs.hose = e.add.image(164, -50, "roomFaucet", "hose"), gameObjects.roomFaucetObjs.hose.setOrigin(.5, 0), gameObjects.roomFaucetObjs.hose.origX = gameObjects.roomFaucetObjs.hose.x, gameObjects.roomFaucetObjs.hose.origY = gameObjects.roomFaucetObjs.hose.y, gameObjects.roomFaucetObjs.hose.velX = 0, gameObjects.roomFaucetObjs.hose.velY = 0, o.add(gameObjects.roomFaucetObjs.hose), gameObjects.roomFaucetObjs.handle = new Button(e, {
        container: o,
        normal: {
            atlas: "buttons",
            ref: "glow",
            x: 0,
            scaleX: 1.15,
            scaleY: 1.15,
            y: gameVars.halfHeight,
            alpha: .001
        },
        hover: {
            atlas: "buttons",
            ref: "glow",
            alpha: .7
        },
        isDraggable: !0,
        onDrop: dropHandle
    }), gameObjects.roomFaucetObjs.placard = new Button(e, o, () => {
        gameVars.horrorPoint ? gameObjects.roomFaucetObjs.roomCompleted ? updateInfoText("Faucet out of order") : updateInfoText("Mr. Washy") : gameVars.darkPoint ? updateInfoText("Just a gentle rinse") : updateInfoText("Mr. Washy")
    }, {
        atlas: "buttons",
        ref: "placard",
        x: 380,
        y: gameVars.height - 240
    }, {
        atlas: "buttons",
        ref: "placard_hover"
    }), gameObjects.roomFaucetObjs.lever = e.add.image(gameObjects.roomFaucetObjs.hose.x - 111, gameVars.halfHeight - 39, "roomFaucet", "lever"), o.add(gameObjects.roomFaucetObjs.lever), gameObjects.roomFaucetObjs.lever.rotation = -.73, gameObjects.roomFaucetObjs.lever.rotVel = 0, gameObjects.roomFaucetObjs.waterCounter = 1, gameObjects.roomFaucetObjs.freeDropletPool = [], gameObjects.roomFaucetObjs.activeDroplets = [], gameObjects.roomFaucetObjs.dragline = e.add.sprite(0, -9999, "blackPixel"), gameObjects.roomFaucetObjs.dragline.scaleY = 20, gameObjects.roomFaucetObjs.handle.offsetY = 0, resetHandlePos(), addToUpdateFuncList(roomFaucetUpdate), messageBus.subscribe("exhibitMove", e => {
        e === a && (gameVars.darkPoint && (addToUpdateFuncList(faucetRedUpdate), globalScene.tweens.add({
            targets: gameObjects.roomFaucetObjs.duck,
            x: 280,
            ease: "Quad.easeOut",
            duration: 400,
            delay: 1500
        })), addGuideArrowToContainer(gameObjects.roomFaucetObjs.roomContainer), updateGuideArrow(0, -9999), tweenVolume("gladiator0", .3), tweenVolume("gladiator1", .6), tweenVolume("gladiator2", .5))
    }), t = messageBus.subscribe("startDarkSequence", e => {
        gameObjects.roomFaucetObjs.isLocked = !1, gameObjects.roomFaucetObjs.handle.reappear(), resetHandlePos(), gameObjects.roomFaucetObjs.portraitRed.alpha = 1, t.unsubscribe()
    }), s = messageBus.subscribe("startHorrorSequence", e => {
        gameObjects.roomFaucetObjs.isLocked = !1, gameObjects.roomFaucetObjs.handle.reappear(), resetHandlePos(), gameObjects.roomFaucetObjs.firstComplete = !0, removeFromUpdateFuncList(faucetRedUpdate), gameObjects.roomFaucetObjs.portraitRed.destroy(), s.unsubscribe()
    })
}

function setupFaucetInk() {
    gameObjects.roomFaucetObjs.ink = globalScene.add.image(-160, gameVars.halfHeight + 99, "roomFaucet", "ink1"), gameObjects.roomFaucetObjs.ink.origX = gameObjects.roomFaucetObjs.ink.x, gameObjects.roomFaucetObjs.ink.setOrigin(.5, 0), gameObjects.roomFaucetObjs.ink.alpha = 0, gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.ink)
}

function roomFaucetUpdate(e) {
    let a = !1;
    if (!gameObjects.roomFaucetObjs.handle.getIsDragged() || gameObjects.roomFaucetObjs.roomCompleted || gameObjects.roomFaucetObjs.isLocked) gameObjects.roomFaucetObjs.guideArrowNeedsReset && (gameObjects.roomFaucetObjs.guideArrowNeedsReset = !1, resetGuideArrowFaucet());
    else {
        gameObjects.roomFaucetObjs.soundCooldown--;
        let o = gameObjects.roomFaucetObjs.handle.getXPos(),
            t = gameObjects.roomFaucetObjs.handle.getYPos() - gameObjects.roomFaucetObjs.handle.offsetY,
            s = o - gameObjects.roomFaucetObjs.lever.x,
            r = t - gameObjects.roomFaucetObjs.lever.y,
            m = Math.atan2(r, s) + .5 * Math.PI;
        m > Math.PI && (m -= 2 * Math.PI);
        let c = m - gameObjects.roomFaucetObjs.lever.rotation;
        c > Math.PI ? c -= 2 * Math.PI : c < -Math.PI && (c += 2 * Math.PI);
        let b = 0;
        if (c > .01 ? b = Math.min(.0024, .006 * c) : c < -.01 && (b = Math.max(-.0024, .006 * c)), gameVars.horrorPoint && b < 0 && gameObjects.roomFaucetObjs.lever.rotation > .8 && (b = 0), gameObjects.roomFaucetObjs.lever.rotVel += b, gameObjects.roomFaucetObjs.lever.rotVel *= .88, a = !0, Math.abs(gameObjects.roomFaucetObjs.lever.rotation + .2) < .03 && gameObjects.roomFaucetObjs.soundCooldown <= 0 && (gameObjects.roomFaucetObjs.lever.rotVel > .005 ? (playSound("metalsqueak1"), gameObjects.roomFaucetObjs.soundCooldown = 50) : gameObjects.roomFaucetObjs.lever.rotVel < -.005 && (playSound("metalsqueak2"), gameObjects.roomFaucetObjs.soundCooldown = 50), gameObjects.roomFaucetObjs.lever.rotVel *= .5), gameObjects.roomFaucetObjs.lever.rotation < -.75) gameVars.darkPoint && gameObjects.exhibit.needCleanup && (gameObjects.exhibit.needCleanup = !1, gameObjects.roomFaucetObjs.isLocked = !0, gameObjects.roomFaucetObjs.handle.disappear(), setWashyDollImage("washyRelaxed"), setTimeout(() => {
            playSound("deepbell4"), updateInfoTextSoft("Room cleaned up.", 2e3)
        }, 300)), gameObjects.roomFaucetObjs.lever.rotation = -.74, gameObjects.roomFaucetObjs.lever.rotVel *= -.35;
        else if (gameObjects.roomFaucetObjs.lever.rotVel > .001 && gameObjects.roomFaucetObjs.lever.rotation > .78 && !gameObjects.roomFaucetObjs.firstComplete && !gameVars.horrorPoint && !gameVars.darkPoint) gameObjects.roomFaucetObjs.handle.disappear(), gameObjects.roomFaucetObjs.firstComplete = !0, gameObjects.roomFaucetObjs.isLocked = !0, gameObjects.roomFaucetObjs.lever.rotation = .799, setTimeout(() => {
            createKey(-365, gameVars.halfHeight + 85, gameObjects.roomFaucetObjs.roomIndex, gameObjects.roomFaucetObjs.roomContainer, !0)
        }, 100);
        else if (gameObjects.roomFaucetObjs.lever.rotation > .8) {
            if (gameVars.horrorPoint) {
                if (gameObjects.roomFaucetObjs.lever.rotVel > .002) {
                    let a = .01 * (2 + gameObjects.roomFaucetObjs.lever.rotation + gameObjects.roomFaucetObjs.rotAccumulate);
                    Math.random() < a * e && (gameObjects.roomFaucetObjs.rotAccumulate = -3.25, Math.random() < .75 * gameObjects.roomFaucetObjs.lever.rotation - .75 ? (gameObjects.roomFaucetObjs.soundCooldown <= 0 && (playSound("metalgrind", 4), gameObjects.roomFaucetObjs.soundCooldown = 45), gameObjects.roomFaucetObjs.lever.rotation > 1.2 && !gameObjects.roomFaucetObjs.usingBentLever && (gameObjects.roomFaucetObjs.usingBentLever = !0, gameObjects.roomFaucetObjs.lever.alpha = 0, gameObjects.roomFaucetObjs.leverBent = globalScene.add.image(gameObjects.roomFaucetObjs.lever.x, gameObjects.roomFaucetObjs.lever.y, "roomFaucet", "leverhalfbroken"), gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.leverBent)), gameObjects.roomFaucetObjs.lever.rotVel = Math.max(.03, .16 - .025 * gameObjects.roomFaucetObjs.lever.rotation), gameObjects.roomFaucetObjs.lever.rotation < 2.5 && showFlashRand(1, void 0, void 0, .4 * (gameObjects.roomFaucetObjs.lever.rotation - 1))) : (gameObjects.roomFaucetObjs.soundCooldown <= 0 && (playSound("metalsqueak1"), gameObjects.roomFaucetObjs.soundCooldown = 30), gameObjects.roomFaucetObjs.lever.rotVel = Math.max(.015, .07 - .025 * gameObjects.roomFaucetObjs.lever.rotation), gameObjects.roomFaucetObjs.lever.rotation < 2.5 && showStaticRand(1, void 0, void 0, .45 * (gameObjects.roomFaucetObjs.lever.rotation - 1))), createExtraDrops(2))
                }
            } else gameObjects.roomFaucetObjs.lever.rotation = .785, gameObjects.roomFaucetObjs.lever.rotVel *= -.12;
            gameObjects.roomFaucetObjs.rotAccumulate += .016, gameObjects.roomFaucetObjs.lever.rotVel *= Math.max(1.6 - gameObjects.roomFaucetObjs.lever.rotation, .43)
        }
        updateGuideArrowFaucet(), gameObjects.roomFaucetObjs.lever.rotation > .63 && (gameObjects.roomFaucetObjs.arrowAccumulateBump += .02, gameObjects.roomFaucetObjs.arrowAccumulateBump > 1 && (gameObjects.roomFaucetObjs.arrowAccumulateBump = 0, updateGuideArrowFaucet(!0))), updateWashyExpression(gameObjects.roomFaucetObjs.lever.rotation), gameObjects.roomFaucetObjs.guideArrowNeedsReset = !0
    }
    if (gameObjects.roomFaucetObjs.lever.rotation > -.5) {
        let e = Math.max(0, 7 * (gameObjects.roomFaucetObjs.lever.rotation + .35)),
            a = 13;
        if (gameObjects.roomFaucetObjs.lever.rotation > 2.8) {
            if (shakeBGPipes(12), !gameObjects.roomFaucetObjs.roomCompleted) {
				gameObjects.roomFaucetObjs.duck.scaleX = -.45;
                let e = gameObjects.roomFaucetObjs.portrait.x,
                    a = gameObjects.roomFaucetObjs.portrait.y;
                gameObjects.roomFaucetObjs.portrait.destroy(), gameObjects.roomFaucetObjs.portrait = globalScene.add.image(e, a, "roomFaucet", "portraitBlack"), gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.portrait), gameObjects.roomFaucetObjs.ink.alpha = 1, gameObjects.sounds.watergurgle.play({
                    loop: !0
                }), messageBus.subscribe("exhibitMove", e => {
                    let a = Math.abs(e - gameObjects.roomFaucetObjs.roomIndex);
                    tweenVolume("watergurgle", Math.max(0, 1 / (1 + a * a * .6) - .22))
                }), gameObjects.roomFaucetObjs.hose.destroy();
                let o = gameObjects.roomFaucetObjs.hose.origX,
                    t = gameObjects.roomFaucetObjs.hose.origY;
                gameObjects.roomFaucetObjs.hose = globalScene.add.image(o, t, "roomFaucet", "hosebroken"), gameObjects.roomFaucetObjs.hose.origX = o, gameObjects.roomFaucetObjs.hose.origY = t, gameObjects.roomFaucetObjs.hose.setOrigin(.5, 0), gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.hose), gameObjects.roomFaucetObjs.lever.rotation = 2.65, gameObjects.roomFaucetObjs.handle.destroy();
                let s = gameObjects.roomFaucetObjs.lever.x,
                    r = gameObjects.roomFaucetObjs.lever.y;
                gameObjects.roomFaucetObjs.leverBent.destroy(), gameObjects.roomFaucetObjs.leverBent = globalScene.add.image(s, r, "roomFaucet", "leverbroken"), gameObjects.roomFaucetObjs.roomContainer.add(gameObjects.roomFaucetObjs.leverBent), showFlashArr([0, 5, 15, 6, 15, 16, 2, 16, 16, 7, 0], () => {
                    showStaticRand(5), setTimeout(() => {
                        showStaticRand(2), setTimeout(() => {
                            showStaticRand(1, void 0, void 0, .05)
                        }, 750)
                    }, 750)
                }), gameVars.walkSlow = !0, gameObjects.roomFaucetObjs.roomCompleted = !0, updateWashyExpression(999), setTimeout(() => {
                    gameObjects.roomFaucetObjs.startOverflow = !0
                }, 600), setTimeout(() => {
                    createKey(-155, gameVars.halfHeight + 160, gameObjects.roomFaucetObjs.roomIndex, gameObjects.roomFaucetObjs.roomContainer, !1)
                }, 1500)
            }
            let e = 3 * (Math.random() - .5),
                a = 1.5 * (Math.random() - .5);
            gameObjects.roomFaucetObjs.hose.x = gameObjects.roomFaucetObjs.hose.origX + e, gameObjects.roomFaucetObjs.hose.y = gameObjects.roomFaucetObjs.hose.origY + a, gameObjects.roomFaucetObjs.lever.x = gameObjects.roomFaucetObjs.hose.x - 111 + e, gameObjects.roomFaucetObjs.lever.y = gameVars.halfHeight - 39 + a, gameObjects.roomFaucetObjs.lever.rotation = 3, gameObjects.roomFaucetObjs.ink.x = gameObjects.roomFaucetObjs.ink.origX + .4 * e, updateInk()
        } else if (e < a && (gameObjects.roomFaucetObjs.waterCounter -= e, gameObjects.roomFaucetObjs.waterCounter <= 0 && (gameObjects.roomFaucetObjs.waterCounter = 100, createWaterDrop())), e > a - 4) {
            shakeBGPipes(e);
            let o = e - (a - 4),
                t = (Math.random() - .5) * o * .6,
                s = (Math.random() - .5) * o * .3,
                r = gameObjects.roomFaucetObjs.hose.origX - gameObjects.roomFaucetObjs.hose.x,
                m = gameObjects.roomFaucetObjs.hose.origY - gameObjects.roomFaucetObjs.hose.y;
            gameObjects.roomFaucetObjs.lever.x = gameObjects.roomFaucetObjs.hose.x - 111 - r, gameObjects.roomFaucetObjs.lever.y = gameVars.halfHeight - 39 - m, gameObjects.roomFaucetObjs.hose.velX += t + .65 * r, gameObjects.roomFaucetObjs.hose.velY += s + .65 * m, gameObjects.roomFaucetObjs.hose.velX *= .6, gameObjects.roomFaucetObjs.hose.velY *= .6, gameObjects.roomFaucetObjs.hose.x += gameObjects.roomFaucetObjs.hose.velX, gameObjects.roomFaucetObjs.hose.y += gameObjects.roomFaucetObjs.hose.velY, gameObjects.roomFaucetObjs.lever.x += .75 * gameObjects.roomFaucetObjs.hose.velX, gameObjects.roomFaucetObjs.lever.y += .5 * gameObjects.roomFaucetObjs.hose.velY
        }
    }
    for (let a = 0; a < gameObjects.roomFaucetObjs.activeDroplets.length; a++) {
        let o = gameObjects.roomFaucetObjs.activeDroplets[a];
        o.velY += .1, o.y += o.velY * e, o.y > gameVars.halfHeight + 208 && (o.y = -9999, gameObjects.roomFaucetObjs.activeDroplets.splice(a, 1), gameObjects.roomFaucetObjs.freeDropletPool.push(o))
    }
    a && (gameObjects.roomFaucetObjs.lever.rotation += gameObjects.roomFaucetObjs.lever.rotVel * e), gameObjects.roomFaucetObjs.leverBent && (gameObjects.roomFaucetObjs.leverBent.x = gameObjects.roomFaucetObjs.lever.x, gameObjects.roomFaucetObjs.leverBent.y = gameObjects.roomFaucetObjs.lever.y, gameObjects.roomFaucetObjs.leverBent.rotation = gameObjects.roomFaucetObjs.lever.rotation)
}

function updateInk() {
    gameObjects.roomFaucetObjs.ink.scaleX = .995 + .01 * Math.random()
}

function createWaterDrop() {
    let e = gameObjects.roomFaucetObjs.freeDropletPool.pop();
    e || ((e = globalScene.add.image(0, 0, "roomFaucet", "waterdrop")).setDepth(5), gameObjects.roomFaucetObjs.container.add(e)), e.scaleX = .85, setTimeout(() => {
        e.scaleX = .95, setTimeout(() => {
            e.scaleX = 1
        }, 30)
    }, 30), e.velY = .4, e.x = gameObjects.roomFaucetObjs.hose.x - 360 + 90 * Math.random(), e.y = gameObjects.roomFaucetObjs.hose.y + 624, gameObjects.roomFaucetObjs.activeDroplets.push(e)
}

function dropHandle() {
    resetHandlePos()
}

function resetHandlePos() {
    let e = gameObjects.roomFaucetObjs.lever.x,
        a = gameObjects.roomFaucetObjs.lever.y,
        o = gameObjects.roomFaucetObjs.lever.rotation - .5 * Math.PI,
        t = e + Math.cos(o) * gameObjects.roomFaucetObjs.leverLength,
        s = a + Math.sin(o) * gameObjects.roomFaucetObjs.leverLength + gameObjects.roomFaucetObjs.handle.offsetY;
    gameObjects.roomFaucetObjs.handle.setPos(t, s)
}

function updateGuideArrowFaucet(e) {
    let a = gameObjects.roomFaucetObjs.lever.x,
        o = gameObjects.roomFaucetObjs.lever.y,
        t = gameObjects.roomFaucetObjs.lever.rotation - .5 * Math.PI,
        s = a + Math.cos(t) * (gameObjects.roomFaucetObjs.leverLength + 7),
        r = o + Math.sin(t) * (gameObjects.roomFaucetObjs.leverLength + 7) + gameObjects.roomFaucetObjs.handle.offsetY,
        m = gameVars.mouseposx - s - gameVars.halfWidth,
        c = gameVars.mouseposy - r,
        b = Math.min(150, Math.sqrt(m * m + c * c));
    b < 35 ? b = 0 : b > 70 && e && (b += 20), gameObjects.roomFaucetObjs.arrowDistDelay = .6 * gameObjects.roomFaucetObjs.arrowDistDelay + .4 * b;
    let O = Math.atan2(c, m);
    updateGuideArrow(s, r, O, gameObjects.roomFaucetObjs.arrowDistDelay)
}

function resetGuideArrowFaucet() {
    updateGuideArrow(0, -9999), gameObjects.roomFaucetObjs.arrowDistDelay = 0
}

function createExtraDrops(e) {
    for (let a = 0; a < e; a++) createWaterDrop();
    setTimeout(() => {
        createExtraDrops(e - 1)
    }, 25)
}

function setWashyDollImage(e) {
    if (gameObjects.roomFaucetObjs.doll) {
        if (gameObjects.roomFaucetObjs.doll == gameObjects.roomFaucetObjs.dollImages[e]) return;
        gameObjects.roomFaucetObjs.doll.visible = !1
    }
    if (!gameObjects.roomFaucetObjs.dollImages[e]) {
        let a = globalScene.add.image(-145, gameVars.height - 163, "roomFaucet", e);
        gameObjects.roomFaucetObjs.dollImages[e] = a, gameObjects.roomFaucetObjs.roomContainer.add(a)
    }
    gameObjects.roomFaucetObjs.dollImages[e].visible = !0, gameObjects.roomFaucetObjs.doll = gameObjects.roomFaucetObjs.dollImages[e], bounceWashyDoll()
}

function bounceWashyDoll() {
    gameObjects.roomFaucetObjs.doll.scaleY = 1.008, setTimeout(() => {
        gameObjects.roomFaucetObjs.doll.scaleY = 1.004, setTimeout(() => {
            gameObjects.roomFaucetObjs.doll.scaleY = 1
        }, 40)
    }, 50)
}

function updateWashyExpression(e) {
    !gameObjects.roomFaucetObjs.firstComplete || gameVars.darkPoint || gameVars.horrorPoint ? gameObjects.roomFaucetObjs.roomCompleted ? setWashyDollImage("washyDrowned") : setWashyDollImage(e < -.25 ? "washyRelaxed" : e < 1.6 ? "washyNeutral" : "washyWorried") : setWashyDollImage("washyHappy")
}

function shakeBGPipes(e) {
    if (e > 9) {
        let a = .5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe1.x = Math.random() * a - 545, gameObjects.roomFaucetObjs.pipe1.y = 161 + Math.random() * a
    }
    if (e > 10) {
        let a = .5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe2.x = Math.random() * a - 425, gameObjects.roomFaucetObjs.pipe2.y = 300 + Math.random() * a
    }
    if (e > 11) {
        let a = .5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe3.x = Math.random() * a - 305, gameObjects.roomFaucetObjs.pipe3.y = 90 + Math.random() * a
    }
    if (e > 11.5) {
        let a = .5 * (e - 9);
        gameObjects.roomFaucetObjs.pipe4.x = Math.random() * a - 88, gameObjects.roomFaucetObjs.pipe4.y = 70 + Math.random() * a
    }
}

function faucetRedUpdate() {
    let e = gameVars.mouseposx - gameObjects.roomFaucetObjs.portraitRed.x - gameVars.halfWidth,
        a = gameVars.mouseposy - gameObjects.roomFaucetObjs.portraitRed.y,
        o = Math.abs(e) + Math.abs(a),
        t = Math.max(0, Math.min(1, .003 * (o - 70 - gameObjects.roomFaucetObjs.redDamper)));
    t > gameObjects.roomFaucetObjs.portraitRed.alpha ? (gameObjects.roomFaucetObjs.portraitRed.alpha = .95 * gameObjects.roomFaucetObjs.portraitRed.alpha + .05 * t, gameObjects.roomFaucetObjs.portraitRed.alpha < .85 && (gameObjects.roomFaucetObjs.redDamper += .8)) : gameObjects.roomFaucetObjs.portraitRed.alpha = .88 * gameObjects.roomFaucetObjs.portraitRed.alpha + .12 * t
}