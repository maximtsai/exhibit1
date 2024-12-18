function setupRoomPump(e, o, a) {
    gameObjects.exhibit.setBackgroundAtIndex(o, "bgs", "bg2"), gameObjects.roomPumpObjs = {
        canPump: !0,
        roomIndex: o,
        roomContainer: a,
        shouldUpdate: !1,
        pumpAmt: 0,
        pumpCheckpoint: 0,
        prevFloatyState: 0,
        floatyGoalScaleX: 1,
        floatyGoalScaleY: 1,
        floatyGoalPosX: 0,
        floatyGoalPosY: 0,
        pressCooldown: 0
    }, gameObjects.roomPumpObjs.cleanupBtn = new Button(globalScene, gameObjects.roomPumpObjs.roomContainer, cleanupPump, {
        atlas: "buttons",
        ref: "glow",
        alpha: .05,
        x: 0,
        y: -9999,
        scaleX: 1.75,
        scaleY: 1.75
    }, {
        atlas: "buttons",
        ref: "glow",
        alpha: .8,
        scaleX: 1.85,
        scaleY: 1.8
    }, {
        atlas: "buttons",
        ref: "glow",
        alpha: 1,
        scaleX: 1.85,
        scaleY: 1.8
    }), gameObjects.roomPumpObjs.frames = e.add.image(0, 245, "roomPump", "framesFloaty1"), a.add(gameObjects.roomPumpObjs.frames), gameObjects.roomPumpObjs.frames.alpha = 0, gameObjects.roomPumpObjs.pumpBtn = new Button(globalScene, gameObjects.roomPumpObjs.roomContainer, pumpReleased, {
        atlas: "buttons",
        ref: "glow",
        alpha: .05,
        x: -240,
        y: 505,
        scaleX: isMobile ? 1.7 : 1.6,
        scaleY: isMobile ? 1.1 : 1
    }, {
        atlas: "buttons",
        ref: "glow",
        alpha: .8,
        scaleX: 1.7,
        scaleY: 1.1
    }, {
        atlas: "buttons",
        ref: "glow",
        alpha: .001,
        scaleX: 1.7,
        scaleY: 1.1
    }), gameObjects.roomPumpObjs.pumpBtn.setOnMouseDownFunc(pumpPressed), gameObjects.roomPumpObjs.extraGlow = e.add.image(-240, 505, "buttons", "glow"), gameObjects.roomPumpObjs.extraGlow.scaleX = 1.95, gameObjects.roomPumpObjs.extraGlow.scaleY = 1.45, gameObjects.roomPumpObjs.extraGlow.alpha = 0, gameObjects.roomPumpObjs.roomContainer.add(gameObjects.roomPumpObjs.extraGlow), gameObjects.roomPumpObjs.placard = new Button(e, a, () => {
        gameVars.horrorPoint ? gameObjects.roomPumpObjs.roomComplete ? updateInfoText("Pop.") : updateInfoText("Mr. Floaty") : gameVars.darkPoint ? updateInfoText("He liked balloons,\nhow they float, how they pop") : updateInfoText("Mr. Floaty")
    }, {
        atlas: "buttons",
        ref: "placard",
        x: 20,
        y: gameVars.height - 100
    }, {
        atlas: "buttons",
        ref: "placard_hover"
    }), gameObjects.roomPumpObjs.balloon1 = e.add.image(-474, gameVars.height - 135, "roomPump", "balloonFloaty1"), gameObjects.roomPumpObjs.balloon1.rotation = -.02, gameObjects.roomPumpObjs.balloon1.setOrigin(.5, 1), a.add(gameObjects.roomPumpObjs.balloon1), gameObjects.roomPumpObjs.balloon2 = e.add.image(510, gameVars.height - 139, "roomPump", "balloonFloaty2"), gameObjects.roomPumpObjs.balloon2.rotation = .02, gameObjects.roomPumpObjs.balloon2.setOrigin(.5, 1), a.add(gameObjects.roomPumpObjs.balloon2), gameObjects.roomPumpObjs.button = e.add.image(-240, 492, "roomPump", "button"), gameObjects.roomPumpObjs.pumplines = e.add.image(-240, 415, "roomPump", "pumplines").setVisible(false), gameObjects.roomPumpObjs.button.origY = gameObjects.roomPumpObjs.button.y, a.add(gameObjects.roomPumpObjs.button), a.add(gameObjects.roomPumpObjs.pumplines), gameObjects.roomPumpObjs.fan = e.add.image(-240, 621, "roomPump", "fan"), gameObjects.roomPumpObjs.fan.rotVel = 0, a.add(gameObjects.roomPumpObjs.fan), gameObjects.roomPumpObjs.hose = e.add.image(gameObjects.roomPumpObjs.fan.x + 64, gameObjects.roomPumpObjs.fan.y + 71, "roomPump", "hose"), gameObjects.roomPumpObjs.hose.setOrigin(0, 1), gameObjects.roomPumpObjs.hose.rotation = .15, gameObjects.roomPumpObjs.hose.baseRotation = gameObjects.roomPumpObjs.hose.rotation, gameObjects.roomPumpObjs.hose.scaleX = .85, gameObjects.roomPumpObjs.hose.scaleY = .85, a.add(gameObjects.roomPumpObjs.hose), gameObjects.roomPumpObjs.compressor = e.add.image(-240, 621, "roomPump", "compressor"), a.add(gameObjects.roomPumpObjs.compressor), addToUpdateFuncList(roomPumpUpdate), gameObjects.roomPumpObjs.floatyState = 0;
    let m, t, s, b = gameVars.halfHeight + 175;


    gameObjects.roomPumpObjs.floatyGoalPosX = 135, gameObjects.roomPumpObjs.floatyGoalPosY = b, gameObjects.roomPumpObjs.floatySprites = [e.add.image(135, b, "roomPump", "floaty1"), e.add.image(135, b, "roomPump", "floaty2"), e.add.image(135, b, "roomPump", "floaty3"), e.add.image(135, b, "roomPump", "floaty4"), e.add.image(135, b, "roomPump", "floaty5"), e.add.image(135, b, "roomPump", "floaty6"), e.add.image(135, b, "roomPump", "floaty7"), e.add.image(135, b, "roomPump", "floatyX"), e.add.image(135, b, "roomPump", "floatyY")];
    for (let e = 0; e < gameObjects.roomPumpObjs.floatySprites.length; e++) gameObjects.roomPumpObjs.floatySprites[e].visible = !1, gameObjects.roomPumpObjs.floatySprites[e].setOrigin(.5, .55), a.add(gameObjects.roomPumpObjs.floatySprites[e]);
    gameObjects.roomPumpObjs.floaty = gameObjects.roomPumpObjs.floatySprites[0], gameObjects.roomPumpObjs.floaty.visible = !0, messageBus.subscribe("exhibitMove", e => {
        e === o ? setTimeout(() => {
        	gameObjects.roomPumpObjs.shouldUpdate = !0;
            setTimeout(() => {
	            if (gameObjects.roomPumpObjs.pumpAmt < 8 && (!gameVars.darkPoint || gameVars.horrorPoint)) {
	            	gameObjects.roomPumpObjs.pumplines.visible = true;
	            	setTimeout(() => {
		            	gameObjects.roomPumpObjs.pumplines.visible = false;
		            	setTimeout(() => {
			            	gameObjects.roomPumpObjs.pumplines.visible = true;
			            	setTimeout(() => {
				            	gameObjects.roomPumpObjs.pumplines.visible = false;
            setTimeout(() => {
	            if (gameObjects.roomPumpObjs.pumpAmt < 20) {
	            	gameObjects.roomPumpObjs.pumplines.visible = true;
	            	setTimeout(() => {
		            	gameObjects.roomPumpObjs.pumplines.visible = false;
		            	setTimeout(() => {
			            	gameObjects.roomPumpObjs.pumplines.visible = true;
			            	setTimeout(() => {
				            	gameObjects.roomPumpObjs.pumplines.visible = false;
			            	}, 350)
		            	}, 350)
	            	}, 350)
	            }
	        }, 5000)
			            	}, 350)
		            	}, 350)
	            	}, 350)
	            }
	        }, 4500)

    }, 0) : setTimeout(() => {
            gameObjects.roomPumpObjs.shouldUpdate = !1;
        }, 600)
    }), messageBus.subscribe("mouseUp", pumpReleased), m = messageBus.subscribe("exhibitMove", e => {
        e === o && (gameVars.darkPoint && (gameObjects.roomPumpObjs.frameKid = globalScene.add.image(-15, 140, "roomPump", "frameskid"), gameObjects.roomPumpObjs.frameKid.origX = gameObjects.roomPumpObjs.frameKid.x, gameObjects.roomPumpObjs.frameKid.origY = gameObjects.roomPumpObjs.frameKid.y, a.add(gameObjects.roomPumpObjs.frameKid), addToUpdateFuncList(frameKidUpdate)), gameVars.horrorPoint && gameObjects.roomPumpObjs.pumpAmt <= .1 && globalScene.tweens.timeline({
            targets: [gameObjects.roomPumpObjs.extraGlow],
            tweens: [{
                alpha: 1,
                duration: 2e3,
                ease: "Quad.easeIn",
                delay: 3e3
            }, {
                alpha: 0,
                duration: 1500,
                ease: "Quad.easeOut"
            }, {
                alpha: 1,
                duration: 2e3,
                ease: "Quad.easeIn",
                delay: 3e3
            }, {
                alpha: 0,
                duration: 1500,
                ease: "Quad.easeOut"
            }]
        }), tweenVolume("gladiator0", .5), tweenVolume("gladiator1", .35), tweenVolume("gladiator2", .75), gameObjects.roomPumpObjs.visitedOnce || (gameObjects.roomPumpObjs.visitedOnce = !0, gameObjects.roomPumpObjs.fan.rotVel += .003, globalScene.tweens.timeline({
            targets: [gameObjects.roomPumpObjs.balloon1, gameObjects.roomPumpObjs.balloon2],
            tweens: [{
                rotation: 0,
                duration: 5e3,
                yoyo: !0,
                ease: "Sine.easeInOut"
            }]
        })))
    }), t = messageBus.subscribe("startDarkSequence", e => {
        gameObjects.roomPumpObjs.cleanupBtn.setPos(gameObjects.roomPumpObjs.floaty.x, gameObjects.roomPumpObjs.floaty.y), gameObjects.roomPumpObjs.frames.alpha = 1, t.unsubscribe()
    }), s = messageBus.subscribe("startHorrorSequence", e => {
        removeFromUpdateFuncList(frameKidUpdate), gameObjects.roomPumpObjs.frameKid.isDestroyed || gameObjects.roomPumpObjs.frameKid.destroy(), gameObjects.roomPumpObjs.pumpBtn.reappear(), gameObjects.roomPumpObjs.pumpBtn.setPos(-240, 500), gameObjects.roomPumpObjs.canPump = !0, s.unsubscribe()
    })
}

function roomPumpUpdate(e) {
    if (!gameObjects.roomPumpObjs.shouldUpdate) return;
    let o = (gameObjects.roomPumpObjs.buttonPressed || gameObjects.roomPumpObjs.buttonPressCarryOver > 0) && gameObjects.roomPumpObjs.canPump;
    if (o ? (gameObjects.roomPumpObjs.buttonPressCarryOver -= e, gameObjects.roomPumpObjs.fan.rotVel += .004 * e, gameObjects.roomPumpObjs.button.y = Math.min(gameObjects.roomPumpObjs.button.origY + 25, gameObjects.roomPumpObjs.button.y + 10), gameObjects.roomPumpObjs.button.y >= gameObjects.roomPumpObjs.button.origY + 25 && (gameObjects.roomPumpObjs.fan.rotVel += .005 * e)) : gameObjects.roomPumpObjs.button.y = Math.max(gameObjects.roomPumpObjs.button.origY, gameObjects.roomPumpObjs.button.y - 2), gameObjects.roomPumpObjs.fan.rotation += gameObjects.roomPumpObjs.fan.rotVel, gameObjects.roomPumpObjs.fan.rotVel *= 1 - (1 - .965) * (1 + .8 * (e - 1)), gameObjects.roomPumpObjs.fan.rotVel > .03 && o) {
        let o = gameObjects.roomPumpObjs.pressCooldown > 2 ? .2 : 0,
            a = .43;
        gameObjects.roomPumpObjs.pumpAmt > 100 ? gameObjects.roomPumpObjs.pumpAmt <= 160 ? (a *= .7, o *= .7) : gameObjects.roomPumpObjs.pumpAmt <= 250 && (a *= .9, o *= .9) : gameObjects.roomPumpObjs.pumpAmt < 30 && (a *= 1.1), gameObjects.roomPumpObjs.pumpAmt += (a + o) * e
    } else gameObjects.roomPumpObjs.lastBreath || (gameObjects.roomPumpObjs.pumpAmt = Math.max(gameObjects.roomPumpObjs.pumpAmt -= e * gameVars.darkPoint ? 1 : .2, gameObjects.roomPumpObjs.pumpCheckpoint));
    updateFloatyPumpState(gameObjects.roomPumpObjs.pumpAmt), gameObjects.roomPumpObjs.floatyState > 4 && gameObjects.roomPumpObjs.floatyState < gameObjects.roomPumpObjs.floatySprites.length - 1 && Math.random() < 5e-4 * gameObjects.roomPumpObjs.floatyState && showStaticRand(Math.floor(Math.random() * gameObjects.roomPumpObjs.floatyState)), gameObjects.roomPumpObjs.floaty.scaleX = .9 * gameObjects.roomPumpObjs.floaty.scaleX + .1 * gameObjects.roomPumpObjs.floatyGoalScaleX, gameObjects.roomPumpObjs.floaty.scaleY = .9 * gameObjects.roomPumpObjs.floaty.scaleY + .1 * gameObjects.roomPumpObjs.floatyGoalScaleY, gameObjects.roomPumpObjs.floaty.x = .9 * gameObjects.roomPumpObjs.floaty.x + .1 * gameObjects.roomPumpObjs.floatyGoalPosX, gameObjects.roomPumpObjs.floaty.y = .9 * gameObjects.roomPumpObjs.floaty.y + .1 * gameObjects.roomPumpObjs.floatyGoalPosY, gameObjects.roomPumpObjs.pressCooldown = Math.max(0, gameObjects.roomPumpObjs.pressCooldown - e)
}

function updateFloatyPumpState(e) {
    let o = gameVars.halfHeight + 175;
    if (e < 4) {
        let a = e / 4;
        setFloatyGoalPos(135, o - 2 * a), setFloatyGoalScale(1, 1 + .02 * a), gameObjects.roomPumpObjs.hose.rotation = gameObjects.roomPumpObjs.hose.baseRotation, 0 !== gameObjects.roomPumpObjs.floatyState && (gameObjects.roomPumpObjs.floaty.scaleX = 1.02, gameObjects.roomPumpObjs.floaty.scaleY = 1.05), setFloatyState(0), gameVars.darkPoint || (gameObjects.roomPumpObjs.pumpCheckpoint = Math.max(gameObjects.roomPumpObjs.pumpCheckpoint, e - 8))
    } else if (e <= 100) {
        let a = Math.min(1, e / 60);
        setFloatyGoalScale(.75 + .26 * a, .9 + .12 * a);
        let m = 0;
        e <= 50 ? setFloatyGoalPos(135, o + -10 * a) : setFloatyGoalPos(67.5 + 67.5 * (1 - (m = Math.sqrt((e - 50) / 50))), o - 10 + -200 * m), gameObjects.roomPumpObjs.hose.rotation = .9 * gameObjects.roomPumpObjs.hose.rotation + .1 * (gameObjects.roomPumpObjs.hose.baseRotation - .6 * m), 1 !== gameObjects.roomPumpObjs.floatyState && (tweenVolume("gladiatorx", .25), gameObjects.roomPumpObjs.floaty.scaleX = .78, gameObjects.roomPumpObjs.floaty.scaleY = .92), setFloatyState(1), gameVars.darkPoint || (gameObjects.roomPumpObjs.pumpCheckpoint = Math.max(gameObjects.roomPumpObjs.pumpCheckpoint, e - 10))
    } else if (gameObjects.roomPumpObjs.hose.rotation = .93 * gameObjects.roomPumpObjs.hose.rotation + .07 * (gameObjects.roomPumpObjs.hose.baseRotation - .54 - 6e-4 * e), gameVars.horrorPoint || !gameObjects.roomPumpObjs.canPump || gameVars.darkPoint) {
        if (gameVars.horrorPoint)
            if (gameObjects.roomPumpObjs.pumpCheckpoint = Math.max(gameObjects.roomPumpObjs.pumpCheckpoint, e - 10), e <= 150) {
                setFloatyState(1);
                let a = 1 - (150 - e) / 50;
                setFloatyGoalScale(1 + .1 * a, 1 + .04 * a), setFloatyGoalPos(67.5, o - 215 - 30 * a)
            } else if (e <= 200) {
            let a = 1 - (200 - e) / 50;
            1 === gameObjects.roomPumpObjs.floatyState ? (showStaticRand(1, void 0, void 0, .06), gameObjects.roomPumpObjs.floaty.scaleX = .95, gameObjects.roomPumpObjs.floaty.scaleY = .95, gameObjects.roomPumpObjs.pumpCheckpoint += 8, playSoundOnce("muffle1"), addFloatyShake(3), setTimeout(() => {
                addFloatyShake(2)
            }, 0)) : 3 === gameObjects.roomPumpObjs.floatyState && (gameObjects.roomPumpObjs.floaty.scaleX = .98 + .09 * a, gameObjects.roomPumpObjs.floaty.scaleY = .98 + .07 * a), setFloatyState(2), setFloatyGoalScale(.98 + .09 * a, .98 + .07 * a), setFloatyGoalPos(67.5, o - 245 - 10 * a)
        } else if (e < 270) {
            let a = 1 - (270 - e) / 70;
            2 === gameObjects.roomPumpObjs.floatyState ? (showStaticRand(2, void 0, void 0, .1), showStaticLite(3, 6, 1), addFloatyShake(3), playSoundOnce("muffle2"), gameObjects.roomPumpObjs.floaty.scaleX = .89, gameObjects.roomPumpObjs.floaty.scaleY = .89, gameObjects.roomPumpObjs.pumpCheckpoint += 12) : 4 === gameObjects.roomPumpObjs.floatyState && (gameObjects.roomPumpObjs.floaty.scaleX = .9 + .1 * a, gameObjects.roomPumpObjs.floaty.scaleY = .9 + .09 * a), setFloatyState(3), addFloatyShake(1 + a), setFloatyGoalPos(67.5, o - 255 - 10 * a), setFloatyGoalScale(.9 + .1 * a, .9 + .09 * a), gameObjects.roomPumpObjs.balloon1.rotation = -.01 * a - .02, gameObjects.roomPumpObjs.balloon2.rotation = .01 * a + .02, !gameObjects.roomPumpObjs.showOverblown1 && e > 255 && (showStaticLite(1, 7, 1.5), setFloatyState(5), gameObjects.roomPumpObjs.floaty.scaleX = .78 + .05 * Math.random(), gameObjects.roomPumpObjs.floaty.scaleY = .78 + .05 * Math.random(), addFloatyShake(4, .2), setTimeout(() => {
                gameObjects.roomPumpObjs.pumpCheckpoint = 270, gameObjects.roomPumpObjs.showOverblown1 = !0, setFloatyState(4), gameObjects.roomPumpObjs.floaty.scaleX = .9 + .1 * a, gameObjects.roomPumpObjs.floaty.scaleY = .9 + .09 * a
            }, 120))
        } else if (e < 370) {
            3 === gameObjects.roomPumpObjs.floatyState && (showStaticLite(6, 10, 1.5), showStaticRand(3, void 0, void 0, .15), addFloatyShake(3), playSoundOnce("muffle3"), gameObjects.roomPumpObjs.floaty.scaleX = .82, gameObjects.roomPumpObjs.floaty.scaleY = .84, gameObjects.roomPumpObjs.pumpCheckpoint += 15), setFloatyState(4);
            let a = 1 - (370 - e) / 100;
            !gameObjects.roomPumpObjs.showOverblown2 && e > 355 && (showStaticLite(1, 7, 1.5), showStaticRand(1, void 0, void 0, .25), playSoundOnce("muffle4"), gameObjects.roomPumpObjs.pumpCheckpoint += 1, gameObjects.roomPumpObjs.randFlash1 || (gameObjects.roomPumpObjs.randFlash1 = !0, showAltReality(["balloon1", "balloon2", "balloon3", "balloon4", "balloon5"], 1.02), playSound("rubber6"), gameObjects.sounds.pumpamb.play({
                loop: !0
            }), gameObjects.sounds.pumpamb.volume = .1, tweenVolume("pumpamb", .3, 500)), setFloatyState(7), gameObjects.roomPumpObjs.floaty.scaleX = .7 + .05 * Math.random(), gameObjects.roomPumpObjs.floaty.scaleY = .68 + .05 * Math.random(), addFloatyShake(4, .6), setTimeout(() => {
                gameObjects.roomPumpObjs.showOverblown2 = !0, setFloatyState(4), gameObjects.roomPumpObjs.floaty.scaleX = .83 + .1 * a, gameObjects.roomPumpObjs.floaty.scaleY = .85 + .08 * a
            }, 200)), gameObjects.roomPumpObjs.balloon1.rotation = -.01 * a - .03, gameObjects.roomPumpObjs.balloon2.rotation = .03 + .01 * a, addFloatyShake(2 + a), setFloatyGoalPos(67.5, o - 265 - 10 * a), setFloatyGoalScale(.83 + .1 * a, .85 + .08 * a)
        } else if (e < 470) {
            setFloatyState(4);
            let o = 1 - (470 - e) / 100;
            gameObjects.roomPumpObjs.balloon1.rotation = -.01 * o - .04, gameObjects.roomPumpObjs.balloon2.rotation = .04 + .01 * o, addFloatyShake(3 + o), setFloatyGoalScale(.93 + .07 * o, .93 + .05 * o), gameObjects.sounds.pumpamb.volume = .3 + .7 * o
        } else if (e < 1e4) {
            gameObjects.roomPumpObjs.lastBreath = !0, gameObjects.roomPumpObjs.pumpAmt += 1;
            let o = 1 - (535 - e) / 20;
            if (playSoundOnce("muffle8"), setFloatyState(5), gameObjects.roomPumpObjs.floaty.scaleX = .75 + .01 * Math.random(), gameObjects.roomPumpObjs.floaty.scaleY = .75 + .01 * Math.random(), addFloatyShake(4, .05), gameObjects.roomPumpObjs.pumpCheckpoint += 10, e > 535) {
                if (!gameObjects.roomPumpObjs.roomComplete) {
                    playSound("splurt"), tweenVolume("gladiatorx", 1), showFlashRand(12, void 0, () => {
                        showStaticRand(2, null, () => {
                            createKey(20, gameVars.halfHeight + 240, gameObjects.roomPumpObjs.roomIndex, gameObjects.roomPumpObjs.roomContainer, !1), gameObjects.generalRedness.alpha = 1
                        })
                    }), gameObjects.sounds.fan1.stop(), gameObjects.sounds.fan2.stop();
                    for (let e = 0; e < gameObjects.roomPumpObjs.floatySprites.length; e++) gameObjects.roomPumpObjs.floatySprites[e].destroy();
                    gameObjects.roomPumpObjs.pumpBtn.destroy(), gameObjects.roomPumpObjs.hose.destroy(), pumpReleased(), gameObjects.scene.tweens.timeline({
                        targets: gameObjects.roomPumpObjs.balloon1,
                        tweens: [{
                            rotation: -.08,
                            duration: 600,
                            ease: "Cubic.easeOut"
                        }, {
                            rotation: .02,
                            duration: 3e3,
                            yoyo: !0,
                            ease: "Sine.easeInOut"
                        }]
                    }), gameObjects.scene.tweens.timeline({
                        targets: gameObjects.roomPumpObjs.balloon2,
                        tweens: [{
                            rotation: .08,
                            duration: 600,
                            ease: "Cubic.easeOut"
                        }, {
                            rotation: -.02,
                            duration: 3200,
                            yoyo: !0,
                            ease: "Sine.easeInOut"
                        }]
                    }), setTimeout(() => {
                        removeFromUpdateFuncList(roomPumpUpdate)
                    }, 1e4), gameObjects.roomPumpObjs.roomComplete = !0, gameObjects.roomPumpObjs.frames.destroy(), gameObjects.roomPumpObjs.frames = globalScene.add.image(0, 250, "roomPump", "framesFloaty2"), gameObjects.roomPumpObjs.roomContainer.add(gameObjects.roomPumpObjs.frames)
                }
            } else e > 525 ? (setFloatyState(6), gameObjects.roomPumpObjs.floaty.scaleX = .75 + .1 * Math.random() + .1 * o, gameObjects.roomPumpObjs.floaty.scaleY = .75 + .04 * Math.random() + .08 * o) : !gameObjects.roomPumpObjs.showOverblown3 && e > 505 && (gameObjects.roomPumpObjs.showOverblown3 = !0, tweenVolume("pumpamb", 0), setTimeout(() => {
                gameObjects.sounds.pumpamb.stop()
            }), showAltReality(["floaty1", "floaty2", "floaty3", "floaty2", "floaty4", "floaty1"], 1.02))
        }
    } else gameObjects.roomPumpObjs.canPump = !1, gameObjects.roomPumpObjs.pumpCheckpoint = 100, gameObjects.roomPumpObjs.pumpBtn.disappear(), setFloatyGoalPos(67.5, o - 215), setTimeout(() => {
        createKey(-60, gameVars.halfHeight - 130, gameObjects.roomPumpObjs.roomIndex, gameObjects.roomPumpObjs.roomContainer, !0)
    }, 300);
    let a = Math.min(1, 8 * gameObjects.roomPumpObjs.fan.rotVel - .2);
    if (a < .02 || gameObjects.roomPumpObjs.roomComplete) gameObjects.sounds.fan1.isPlaying && gameObjects.sounds.fan1.stop(), gameObjects.sounds.fan2.isPlaying && gameObjects.sounds.fan2.stop();
    else if (gameObjects.sounds.fan1.isPlaying || gameObjects.sounds.fan1.play({
            loop: !0
        }), gameObjects.sounds.fan2.isPlaying || gameObjects.sounds.fan2.play({
            loop: !0
        }), e < 150) gameObjects.sounds.fan1.volume = a, gameObjects.sounds.fan2.volume = 0;
    else if (e < 300) {
        let o = (e - 150) / 150;
        gameObjects.sounds.fan1.volume = (1 - o) * a, gameObjects.sounds.fan2.volume = o * a * 1.15
    } else gameObjects.sounds.fan1.volume = 0, gameObjects.sounds.fan2.volume = 1.15 * a
}

function pumpPressed() {
    gameObjects.roomPumpObjs.pressCooldown > 0 || (gameObjects.roomPumpObjs.buttonPressed = !0, gameObjects.roomPumpObjs.pressCooldown = 20, playSound("airpump", void 0, .25), gameObjects.roomPumpObjs.buttonPressCarryOver = 999999)
}

function pumpReleased() {
    gameObjects.roomPumpObjs.buttonPressed && (gameObjects.roomPumpObjs.buttonPressed = !1, gameObjects.roomPumpObjs.buttonPressCarryOver = 23)
}

function cleanupPump() {
    gameObjects.roomPumpObjs.cleanupBtn.destroy(), gameObjects.roomPumpObjs.pumpCheckpoint = 0, gameObjects.exhibit.needCleanup = !1, setTimeout(() => {
        playSound("deepbell5"), updateInfoTextSoft("Room cleaned up.", 2250)
    }, 500)
}

function setFloatyState(e) {
    if (e != gameObjects.roomPumpObjs.floatyState) {
        gameObjects.roomPumpObjs.prevFloatyState = gameObjects.roomPumpObjs.floatyState;
        let o = gameObjects.roomPumpObjs.floaty.x,
            a = gameObjects.roomPumpObjs.floaty.y,
            m = gameObjects.roomPumpObjs.floaty.scaleX,
            t = gameObjects.roomPumpObjs.floaty.scaleY;
        gameObjects.roomPumpObjs.floatyState = e, gameObjects.roomPumpObjs.floaty.visible = !1, gameObjects.roomPumpObjs.floaty = gameObjects.roomPumpObjs.floatySprites[gameObjects.roomPumpObjs.floatyState], gameObjects.roomPumpObjs.floaty.visible = !0, gameObjects.roomPumpObjs.floaty.x = o, gameObjects.roomPumpObjs.floaty.y = a, gameObjects.roomPumpObjs.floaty.scaleX = m, gameObjects.roomPumpObjs.floaty.scaleY = t
    }
}

function setFloatyGoalPos(e, o) {
    gameObjects.roomPumpObjs.floatyGoalPosX = e, gameObjects.roomPumpObjs.floatyGoalPosY = o
}

function addFloatyShake(e, o = 0) {
    gameObjects.roomPumpObjs.floaty.x += (Math.random() - .5) * e, gameObjects.roomPumpObjs.floaty.y += (Math.random() - .5) * e, gameObjects.roomPumpObjs.floaty.rotation *= .2, gameObjects.roomPumpObjs.floaty.rotation += (Math.random() - .5) * o
}

function setFloatyGoalScale(e, o) {
    gameObjects.roomPumpObjs.floatyGoalScaleX = e, gameObjects.roomPumpObjs.floatyGoalScaleY = o
}

function frameKidUpdate() {
    let e = gameVars.mouseposx - gameObjects.roomPumpObjs.frameKid.x - gameVars.halfWidth,
        o = gameVars.mouseposy - gameObjects.roomPumpObjs.frameKid.y,
        a = Math.abs(e) + Math.abs(o),
        m = Math.max(0, Math.min(1, .005 * (a - 150)));
    gameObjects.roomPumpObjs.frameKid.alpha = .9985 * gameObjects.roomPumpObjs.frameKid.alpha + .0015 * m, gameObjects.roomPumpObjs.frameKid.x = gameObjects.roomPumpObjs.frameKid.origX + 3 * Math.random() - 1.5, gameObjects.roomPumpObjs.frameKid.y = gameObjects.roomPumpObjs.frameKid.origY + 3 * Math.random() - 1.5, gameObjects.roomPumpObjs.frameKid.alpha < .95 && (removeFromUpdateFuncList(frameKidUpdate), gameObjects.roomPumpObjs.frameKid.destroy(), gameObjects.roomPumpObjs.frameKid.isDestroyed = !0)
}