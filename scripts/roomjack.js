function setupRoomJack(e, a, o) {
    let t, s;
    gameObjects.exhibit.setBackgroundAtIndex(a, "bgs", "bg8"), gameObjects.roomJackObjs || (gameObjects.roomJackObjs = {
        roomIndex: a,
        roomContainer: o,
        jackJumpState: "default",
        shouldUpdate: !1,
        maxRotSpeed: .007,
        totalDistRotated: 0,
        horrorCountdown: .6,
        horrorState: 0,
        noteCount: 0,
        rotateMusicAccumulate: 0,
        speedRatio: 1,
        canSpin: !0,
        eyeOffsetX: 0,
        eyeOffsetY: 0
    }), setupJackMusicSequence(), gameObjects.roomJackObjs.floor = e.add.image(0, 960, "roomJack", "floor"), gameObjects.roomJackObjs.floor.setOrigin(.5, 1), o.add(gameObjects.roomJackObjs.floor), setupPortraits(o, e), gameObjects.roomJackObjs.streamers = e.add.image(0, -20, "roomJack", "streamers"), gameObjects.roomJackObjs.streamers.scaleX = .88, gameObjects.roomJackObjs.streamers.scaleY = .9, gameObjects.roomJackObjs.streamers.setOrigin(.5, 0), o.add(gameObjects.roomJackObjs.streamers), gameObjects.roomJackObjs.neck1 = e.add.image(-450, -140, "roomJack", "neck"), gameObjects.roomJackObjs.neck2 = e.add.image(0, -150, "roomJack", "neck"), gameObjects.roomJackObjs.neck3 = e.add.image(450, -140, "roomJack", "neck"), gameObjects.roomJackObjs.neck1.scaleX = .9, gameObjects.roomJackObjs.neck1.scaleY = .9, gameObjects.roomJackObjs.neck2.scaleX = -.9, gameObjects.roomJackObjs.neck2.scaleY = .9, gameObjects.roomJackObjs.neck2.rotation = 2, gameObjects.roomJackObjs.neck3.scaleX = .9, gameObjects.roomJackObjs.neck3.scaleY = .9, gameObjects.roomJackObjs.neck2.rotation = 3, gameObjects.roomJackObjs.neck1.visible = !1, gameObjects.roomJackObjs.neck2.visible = !1, gameObjects.roomJackObjs.neck3.visible = !1, o.add(gameObjects.roomJackObjs.neck1), o.add(gameObjects.roomJackObjs.neck2), o.add(gameObjects.roomJackObjs.neck3), setupJackArms(e), gameObjects.roomJackObjs.dollCreepy = e.add.image(-5, 2010, "roomJack", "dollcreepy"), gameObjects.roomJackObjs.dollCreepy.origYPos = 2010, gameObjects.roomJackObjs.dollCreepy.scaleX = .42, o.add(gameObjects.roomJackObjs.dollCreepy), gameObjects.roomJackObjs.dollHeadUnder = e.add.image(-5, 2010, "roomJack", "dollEyeless").setOrigin(.5, 1), gameObjects.roomJackObjs.dollHeadUnder.scaleX = .42, o.add(gameObjects.roomJackObjs.dollHeadUnder), gameObjects.roomJackObjs.headPopup1 = e.add.image(-5, -9999, "roomJack", "popup1"), gameObjects.roomJackObjs.headPopup1.visible = !1, o.add(gameObjects.roomJackObjs.headPopup1), gameObjects.roomJackObjs.pedestal = e.add.image(-10, gameVars.height + 66, "roomJack", "pedestal"), gameObjects.roomJackObjs.pedestal.setOrigin(.5, 1), o.add(gameObjects.roomJackObjs.pedestal), gameObjects.roomJackObjs.dollHeadFlash1 = e.add.image(-6, 585, "roomJack", "jack_flashes_rough_1").setOrigin(.5, 1), gameObjects.roomJackObjs.dollHeadFlash1.visible = !1, o.add(gameObjects.roomJackObjs.dollHeadFlash1), gameObjects.roomJackObjs.dollHeadFlash2 = e.add.image(-6, 585, "roomJack", "jack_flashes_rough_2").setOrigin(.5, 1), gameObjects.roomJackObjs.dollHeadFlash2.visible = !1, o.add(gameObjects.roomJackObjs.dollHeadFlash2), gameObjects.roomJackObjs.box = e.add.image(0, 665, "roomJack", "box"), o.add(gameObjects.roomJackObjs.box), gameObjects.roomJackObjs.lid = e.add.image(93, 575, "roomJack", "lid"), gameObjects.roomJackObjs.lid.rotVel = 0, o.add(gameObjects.roomJackObjs.lid), gameObjects.roomJackObjs.dollEyes = e.add.image(-5, 2010, "roomJack", "dollEyes").setOrigin(.5, 1), gameObjects.roomJackObjs.dollEyes.scaleX = .8, gameObjects.roomJackObjs.dollEyes.visible = !1, o.add(gameObjects.roomJackObjs.dollEyes), gameObjects.roomJackObjs.dollHead = e.add.image(-5, 2010, "roomJack", "dollEyeless").setOrigin(.5, 1), gameObjects.roomJackObjs.dollHead.scaleX = .8, gameObjects.roomJackObjs.dollHead.visible = !1, o.add(gameObjects.roomJackObjs.dollHead), gameObjects.roomJackObjs.halfHeightDiffDoll = .5 * (gameObjects.roomJackObjs.dollCreepy.height - 2 * gameObjects.roomJackObjs.dollHead.height), gameObjects.roomJackObjs.dollHead.y = gameObjects.roomJackObjs.dollCreepy.y - gameObjects.roomJackObjs.halfHeightDiffDoll, gameObjects.roomJackObjs.dollHeadUnder.y = gameObjects.roomJackObjs.dollHead.y, gameObjects.roomJackObjs.dollEyes.y = gameObjects.roomJackObjs.dollHead.y, gameObjects.roomJackObjs.headPopup2 = e.add.image(gameObjects.roomJackObjs.dollHead.x, -9999, "roomJack", "popup2"), gameObjects.roomJackObjs.headPopup2.visible = !1, o.add(gameObjects.roomJackObjs.headPopup2), gameObjects.roomJackObjs.placard = new Button(e, o, () => {
        gameVars.horrorPoint ? updateInfoText("Turn the handle.") : gameVars.darkPoint && gameObjects.roomJackObjs.canSpin ? updateInfoText("Unturn the handle.") : updateInfoText("Jack in the Box")
    }, {
        atlas: "buttons",
        ref: "placard",
        x: -4,
        y: gameVars.height - 73
    }, {
        atlas: "buttons",
        ref: "placard_hover",
        preload: !0
    }), gameObjects.roomJackObjs.spinner = e.add.image(0, 670, "roomJack", "spinner"), o.add(gameObjects.roomJackObjs.spinner), gameObjects.roomJackObjs.spinner.rotVel = 0, gameObjects.roomJackObjs.dollface = e.add.image(80, -320, "roomJack", "dollface"), gameObjects.roomJackObjs.dollface.rotation = 3.16, gameObjects.roomJackObjs.dollface.scaleExpand = .001, gameObjects.roomJackObjs.dollface.scaleX = .5, gameObjects.roomJackObjs.dollface.scaleY = .5, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.dollface), gameObjects.roomJackObjs.dollmouth = e.add.image(80, -320, "roomJack", "dollmouth"), gameObjects.roomJackObjs.dollmouth.rotation = 3.16, gameObjects.roomJackObjs.dollmouth.scaleX = .5, gameObjects.roomJackObjs.dollmouth.scaleY = .5, gameObjects.roomJackObjs.dollmouth.scaleYRatio = 1.05, gameObjects.roomJackObjs.dollmouth.scaleYVel = .02, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.dollmouth), gameObjects.roomJackObjs.spinnerButton = new Button(e, {
        container: o,
        normal: {
            ref: "blackPixel",
            x: 0,
            y: gameVars.halfHeight,
            alpha: .001,
            scaleX: 58,
            scaleY: 58
        },
        isDraggable: !0,
        onDrop: resetSpinnerButton
    }), addToUpdateFuncList(roomJackUpdate), resetSpinnerButton(), messageBus.subscribe("exhibitMove", (e, o) => {
        e === a ? (tweenVolume("gladiator0", 0), tweenVolume("gladiator1", .9), tweenVolume("gladiator2", .1), tweenVolume("gladiatorx", .1), gameVars.darkPoint && (gameObjects.roomJackObjs.eyeOffsetX = 4, setTimeout(() => {
            removeFromUpdateFuncList(shakeJackHead), gameObjects.roomJackObjs.eyeOffsetX = 0, gameObjects.roomJackObjs.dollHead.rotation = 0, gameObjects.roomJackObjs.dollHeadSmile.visible = !1
        }, 1300)), addGuideArrowToContainer(gameObjects.roomJackObjs.roomContainer), updateGuideArrow(0, -9999), gameObjects.roomJackObjs.shouldUpdate = !0, gameObjects.roomJackObjs.lightsReady && (gameObjects.moveLeftBtn.setOnMouseUpFunc(() => {
            gameObjects.roomJackObjs.eyeOffsetY += 1, gameObjects.moveLeftBtn.setState("disable"), updateInfoText("There is no reason to turn back", 4500), console.log("...")
        }), globalScene.tweens.add({
            targets: gameObjects.roomJackObjs.lights,
            alpha: .8,
            scaleX: 2,
            scaleY: 2,
            duration: 3e3
        }))) : (setTimeout(() => {
            gameObjects.roomJackObjs.shouldUpdate = !1
        }, 600), gameVars.darkPoint && e < a && o === a && (gameObjects.roomJackObjs.fakeEyes = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight + 20, "roomJack", "dollEyesFake"), gameObjects.roomJackObjs.fakeEyes.scaleY = .01, setTimeout(() => {
            gameObjects.roomJackObjs.dollHeadSmile.visible = !0
        }, 250), globalScene.tweens.add({
            targets: gameObjects.roomJackObjs.fakeEyes,
            scaleY: 1,
            duration: 150,
            ease: "Cubic.easeIn",
            delay: 250
        }), globalScene.tweens.add({
            targets: gameObjects.roomJackObjs.fakeEyes,
            x: gameVars.width + 80 + gameVars.halfWidth,
            duration: 1510,
            ease: "Cubic.easeInOut",
            onComplete: () => {
                gameObjects.roomJackObjs.fakeEyes.destroy(), gameObjects.roomJackObjs.dollHeadSmile.visible = !1
            }
        })))
    }), t = messageBus.subscribe("startDarkSequence", e => {
        gameObjects.roomJackObjs.portraitBox.visible = !0, gameObjects.roomJackObjs.portraitGiraffe.visible = !0, gameObjects.roomJackObjs.noteCount = 0, gameObjects.roomJackObjs.rotateMusicAccumulate = 0, gameObjects.roomJackObjs.totalDistRotated = 0, gameObjects.roomJackObjs.canSpin = !0, gameObjects.roomJackObjs.dollHeadSmile = globalScene.add.image(gameObjects.roomJackObjs.dollHead.x, gameObjects.roomJackObjs.dollHead.y, "roomJack", "dollEyelessSmile").setOrigin(.5, 1), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.dollHeadSmile), addToUpdateFuncList(shakeJackHead), t.unsubscribe()
    }), s = messageBus.subscribe("startHorrorSequence", e => {
        gameObjects.roomJackObjs.noteCount = 0, gameObjects.roomJackObjs.rotateMusicAccumulate = 0, gameObjects.roomJackObjs.totalDistRotated = 0, gameObjects.roomJackObjs.canSpin = !0, gameObjects.roomJackObjs.eyeOffsetX = 0, gameObjects.roomJackObjs.eyeOffsetY = 0, s.unsubscribe()
    }), messageBus.subscribe("speedUp", () => {
        gameObjects.roomJackObjs.speedRatio *= 1.05
    }), messageBus.subscribe("speedDown", () => {
        gameObjects.roomJackObjs.speedRatio *= .8
    }), messageBus.subscribe("passedSafePoint", () => {
        gameObjects.roomJackObjs.passedSafePoint = !0
    })
}

function roomJackUpdate(e) {
    if (gameObjects.roomJackObjs.shouldUpdate) {
        if (gameObjects.roomJackObjs.spinnerButton.getIsDragged() && gameObjects.roomJackObjs.canSpin || gameObjects.roomJackObjs.isAutopilot) {
            let a = gameObjects.roomJackObjs.spinnerButton.getXPos(),
                o = gameObjects.roomJackObjs.spinnerButton.getYPos(),
                t = a - gameObjects.roomJackObjs.spinner.x,
                s = o - gameObjects.roomJackObjs.spinner.y,
                c = Math.atan2(s, t);
            c > Math.PI && (c -= 2 * Math.PI);
            let m = c - gameObjects.roomJackObjs.spinner.rotation;
            m > Math.PI ? m -= 2 * Math.PI : m < -Math.PI && (m += 2 * Math.PI);
            let r = gameObjects.roomJackObjs.maxRotSpeed * gameObjects.roomJackObjs.speedRatio,
                b = 0;
            gameObjects.roomJackObjs.isAutopilot ? (b = r, gameObjects.roomJackObjs.spinnerButton.getIsDragged() && m < .01 && (b -= Math.min(.5 * r, Math.abs(.003 * m)))) : m > .01 && !gameVars.darkPoint ? b = Math.min(r, .02 * m) : gameVars.darkPoint && m < .01 && (b = Math.max(-r, .02 * m)), gameObjects.roomJackObjs.slowRotation && (b *= .45), Math.abs(b) > 1e-5 && (gameObjects.roomJackObjs.spinner.rotVel += b * e), gameObjects.roomJackObjs.spinner.rotation += gameObjects.roomJackObjs.spinner.rotVel, gameObjects.roomJackObjs.totalDistRotated += gameObjects.roomJackObjs.spinner.rotVel, gameVars.darkPoint ? checkMusicSequenceDark(gameObjects.roomJackObjs.spinner.rotVel) : gameVars.horrorPoint ? checkMusicSequenceHorror(gameObjects.roomJackObjs.spinner.rotVel, e) : checkMusicSequenceNormal(gameObjects.roomJackObjs.spinner.rotVel)
        }
        gameObjects.roomJackObjs.spinnerButton.getIsDragged() && gameObjects.roomJackObjs.canSpin && updateGuideArrowJack(), gameObjects.roomJackObjs.spinner.rotVel *= .5, gameObjects.roomJackObjs.animateLid && (gameObjects.roomJackObjs.lid.rotation += gameObjects.roomJackObjs.lid.rotVel, gameObjects.roomJackObjs.lid.rotVel *= .831, gameObjects.roomJackObjs.lid.rotVel <= .01 && (gameObjects.roomJackObjs.animateLid = !1)), "jump" === gameObjects.roomJackObjs.jackJumpState && (gameObjects.roomJackObjs.lid.rotation += gameObjects.roomJackObjs.lid.rotVel, gameObjects.roomJackObjs.lid.rotVel *= .831, gameObjects.roomJackObjs.lid.rotation > 3 && (gameObjects.roomJackObjs.jackJumpState = "finished", gameVars.horrorPoint || setTimeout(() => {
            createKey(gameObjects.roomJackObjs.box.x, gameObjects.roomJackObjs.box.y - 60, gameObjects.roomJackObjs.roomIndex, gameObjects.roomJackObjs.roomContainer, !0)
        }, 250))), gameObjects.roomJackObjs.dollHead.x = gameObjects.roomJackObjs.dollCreepy.x, gameObjects.roomJackObjs.dollHead.y = gameObjects.roomJackObjs.dollCreepy.y - gameObjects.roomJackObjs.halfHeightDiffDoll, gameObjects.roomJackObjs.dollHead.scaleX = gameObjects.roomJackObjs.dollCreepy.scaleX, gameObjects.roomJackObjs.dollEyes.x = gameObjects.roomJackObjs.dollCreepy.x + gameObjects.roomJackObjs.eyeOffsetX, gameObjects.roomJackObjs.dollEyes.y = gameObjects.roomJackObjs.dollCreepy.y - gameObjects.roomJackObjs.halfHeightDiffDoll + gameObjects.roomJackObjs.eyeOffsetY, gameObjects.roomJackObjs.dollEyes.scaleX = gameObjects.roomJackObjs.dollCreepy.scaleX, gameObjects.roomJackObjs.dollHeadUnder.x = gameObjects.roomJackObjs.dollHead.x, gameObjects.roomJackObjs.dollHeadUnder.y = gameObjects.roomJackObjs.dollHead.y, gameObjects.roomJackObjs.dollHeadUnder.scaleX = gameObjects.roomJackObjs.dollHead.scaleX, updateJackArmsLeft(e), gameObjects.roomJackObjs.useAltArmMovement ? updateJackArmsRightAuto() : updateJackArmsRight()
    }
}

function resetSpinnerButton() {
    let e = gameObjects.roomJackObjs.spinner.x + 121 * Math.cos(gameObjects.roomJackObjs.spinner.rotation),
        a = gameObjects.roomJackObjs.spinner.y + 121 * Math.sin(gameObjects.roomJackObjs.spinner.rotation);
    gameObjects.roomJackObjs.spinnerButton.setPos(e, a), resetGuideArrowJack()
}

function createNoteVisual(e, a, o = 15728640) {
    let t = null;
    gameObjects.noteList.length > 0 ? t = gameObjects.noteList.pop() : ((t = globalScene.add.image(0, 0, "misc", "note")).depth = 999, gameObjects.roomJackObjs.roomContainer.add(t)), t.x = e, t.y = a, t.scaleX = .85, t.scaleY = .85, t.setTint(o);
    let s = .1 * Math.random();
    globalScene.tweens.add({
        targets: t,
        ease: "Cubic.easeOut",
        scaleX: 1.03 + s,
        scaleY: 1.03 + s,
        duration: 250,
        onComplete: () => {
            globalScene.tweens.add({
                targets: t,
                ease: "Cubic.easeIn",
                scaleX: .99 + s,
                scaleY: .99 + s,
                duration: 250,
                onComplete: () => {
                    globalScene.tweens.add({
                        targets: t,
                        scaleX: 1 + s,
                        scaleY: 1 + s,
                        duration: 200,
                        onComplete: () => {
                            globalScene.tweens.add({
                                targets: t,
                                ease: "Cubic.easeIn",
                                scaleX: 0,
                                scaleY: 0,
                                duration: 125
                            })
                        }
                    })
                }
            })
        }
    }), globalScene.tweens.add({
        targets: t,
        ease: "Cubic.easeOut",
        y: t.y - 50 + 10 * Math.random(),
        duration: 700,
        onComplete: () => {
            gameObjects.noteList.push(t)
        }
    })
}

function checkMusicSequenceNormal(e) {
    if ("default" !== gameObjects.roomJackObjs.jackJumpState) return;
    if (gameObjects.roomJackObjs.rotateMusicAccumulate += e, gameObjects.roomJackObjs.noteCount >= gameObjects.roomJackObjs.musicDataNormal.length) return gameObjects.roomJackObjs.jackJumpState = "jump", gameObjects.roomJackObjs.lid.rotVel = .51, animatePopUp(), playLastNotes(), playSound("nyaha"), playSound("squeakopen"), gameObjects.roomJackObjs.canSpin = !1, void resetGuideArrowJack();
    let a = gameObjects.roomJackObjs.musicDataNormal[gameObjects.roomJackObjs.noteCount];
    if (gameObjects.roomJackObjs.rotateMusicAccumulate > a.accumulate) {
        if (a.static) showStaticRand(1, void 0, void 0, .06);
        else if (a.slowSpin) gameObjects.roomJackObjs.slowRotation = !0;
        else {
            let e = void 0;
            playMusicBoxNote(a.note, a.volume, a.tint, e), gameObjects.roomJackObjs.slowRotation = !1
        }
        gameObjects.roomJackObjs.noteCount++, gameObjects.roomJackObjs.rotateMusicAccumulate = 0
    }
}

function checkMusicSequenceDark(e) {
    if (!gameObjects.exhibit.needCleanup) return;
    gameObjects.roomJackObjs.rotateMusicAccumulate -= e;
    let a = gameObjects.roomJackObjs.musicDataDark[gameObjects.roomJackObjs.noteCount];
    a ? gameObjects.roomJackObjs.rotateMusicAccumulate > a.accumulate && (a.static ? showStaticRand(1, void 0, void 0, .06) : a.slowSpin ? gameObjects.roomJackObjs.slowRotation = !0 : (playMusicBoxNote(a.note, a.volume, a.tint), gameObjects.roomJackObjs.slowRotation = !1), gameObjects.roomJackObjs.noteCount++, gameObjects.roomJackObjs.rotateMusicAccumulate = 0) : (gameObjects.roomJackObjs.lid.rotation -= .09, gameObjects.roomJackObjs.dollCreepy.y = Math.min(2010, gameObjects.roomJackObjs.dollCreepy.y + 11), gameObjects.roomJackObjs.dollCreepy.scaleX = Math.max(.4, gameObjects.roomJackObjs.dollCreepy.scaleX - .07), gameObjects.roomJackObjs.dollHead.visible = !1, gameObjects.roomJackObjs.dollEyes.visible = !1, gameObjects.roomJackObjs.dollHeadUnder.visible = !0, gameObjects.roomJackObjs.playedSlam || (setTimeout(() => {
        playSound("lidslam"), setTimeout(() => {
            zoomTemp(1.028), gameObjects.roomJackObjs.dollCreepy.y = 2010, gameObjects.roomJackObjs.lid.rotation = 0
        }, 170)
    }, 70), gameObjects.roomJackObjs.playedSlam = !0)), gameObjects.roomJackObjs.dollCreepy.y = Math.min(2010, gameObjects.roomJackObjs.dollCreepy.y - 5 * e), gameObjects.roomJackObjs.lid.rotation = Math.max(0, gameObjects.roomJackObjs.lid.rotation + .2 * e), gameObjects.roomJackObjs.lid.rotation <= .01 && (gameObjects.roomJackObjs.lid.rotation = 0, gameObjects.exhibit.needCleanup = !1, gameObjects.roomJackObjs.canSpin = !1, resetGuideArrowJack(), setTimeout(() => {
        playSound("deepbell1"), updateInfoTextSoft("Room cleaned up.", 2500)
    }, 400))
}

function checkMusicSequenceHorror(e, a = 1) {
    if (gameObjects.roomJackObjs.rotateMusicAccumulate += e, gameObjects.roomJackObjs.startFinale) {
        let a = e * (gameObjects.roomJackObjs.isAutopilot ? 23 : 7);
        if (gameObjects.roomJackObjs.dollCreepy.y -= a, gameObjects.roomJackObjs.neck1.rotation += .004 * a, gameObjects.roomJackObjs.neck2.rotation -= .004 * a, gameObjects.roomJackObjs.neck3.rotation += .004 * a, gameObjects.roomJackObjs.eyeOffsetY -= .05 * a, gameObjects.roomJackObjs.eyeOffsetY < -24 && (gameObjects.roomJackObjs.eyeOffsetY = 24), addScreenShake((Math.random() - .5) * e * 3, (Math.random() - .5) * e * 3), gameObjects.roomJackObjs.dollCreepy.y < -600) {
            addScreenShake((Math.random() - .5) * e * 4, (Math.random() - .5) * e * 8), gameObjects.roomJackObjs.dollface.y += 40 * e, gameObjects.roomJackObjs.dollface.x -= 3 * e, gameObjects.roomJackObjs.dollface.rotation += .001 * e;
            let a = .035 * e;
            gameObjects.roomJackObjs.dollface.scaleY = gameObjects.roomJackObjs.dollface.scaleY + a, gameObjects.roomJackObjs.dollface.scaleX = gameObjects.roomJackObjs.dollface.scaleY * (1 + .05 * Math.sin(20 * gameObjects.roomJackObjs.rotateMusicAccumulate)), showStaticLite(), gameObjects.roomJackObjs.dollface.y > 590 && (removeFromUpdateFuncList(roomJackUpdate), disableMoveLeftButton(), showFlashRand(5, void 0, () => {
                showStaticRand(4), gameObjects.sounds.squeak3.stop(), gameObjects.exhibit.moveRight(!0), gameObjects.roomJackObjs.neck1.visible = !1, gameObjects.roomJackObjs.neck2.visible = !1, gameObjects.roomJackObjs.neck3.visible = !1, disableMoveButtons(), gameObjects.roomJackObjs.dollface.destroy(), gameObjects.roomJackObjs.dollmouth.destroy(), showFlashArr([5, 6, 7, 8, 17, 9, 17, 10, 18], () => {
                    disableMoveLeftButton(), setTimeout(() => {
                        disableMoveLeftButton()
                    }, 20)
                })
            }))
        } else gameObjects.roomJackObjs.dollCreepy.y < 950 && (Math.random() < .25 && showStaticLite(1), gameObjects.roomJackObjs.playedLaugh || (gameObjects.roomJackObjs.playedLaugh = !0, playSound("clownlaughfinal"), tweenVolume("gladiatorx", 0), messageBus.publish("prepareFinalClown")))
    }
    if (gameObjects.roomJackObjs.dollmouth.x = gameObjects.roomJackObjs.dollface.x, gameObjects.roomJackObjs.dollmouth.y = gameObjects.roomJackObjs.dollface.y, gameObjects.roomJackObjs.dollmouth.scaleX = gameObjects.roomJackObjs.dollface.scaleX, gameObjects.roomJackObjs.dollmouth.scaleY = gameObjects.roomJackObjs.dollface.scaleY * gameObjects.roomJackObjs.dollmouth.scaleYRatio, gameObjects.roomJackObjs.dollmouth.scaleYRatio <= 1 ? gameObjects.roomJackObjs.dollmouth.scaleYVel = .035 : gameObjects.roomJackObjs.dollmouth.scaleYRatio >= 1.14 && (gameObjects.roomJackObjs.dollmouth.scaleYVel = -.035), gameObjects.roomJackObjs.dollmouth.scaleYRatio += gameObjects.roomJackObjs.dollmouth.scaleYVel, gameObjects.roomJackObjs.noteCount >= gameObjects.roomJackObjs.musicDataHorror.length) return;
    let o = gameObjects.roomJackObjs.musicDataHorror[gameObjects.roomJackObjs.noteCount];
    if (gameObjects.roomJackObjs.rotateMusicAccumulate > o.accumulate) {
        if (o.sfx && playSound(o.sfx), o.static) {
            o.duration && o.duration;
            let e = o.duration ? 1 : .25;
            showStaticRand(1, void 0, void 0, e)
        } else o.slowSpin ? gameObjects.roomJackObjs.slowRotation = !0 : o.popupHeadHorror ? (gameObjects.roomJackObjs.placard.setOnMouseUpFunc(() => {
            showStaticLite(), updateInfoText("TURN THE HANDLE")
        }), gameObjects.roomJackObjs.jackJumpState = "jump", gameObjects.roomJackObjs.lid.rotVel = .4, gameObjects.roomJackObjs.dollHeadUnder.destroy(), animatePopUp(), playSound("nyaha"), playSound("squeakopen"), setTimeout(() => {
            showStaticRand(2, void 0, void 0, .15), setTimeout(() => {
                showStaticRand(1, void 0, void 0, .07)
            }, 3e3)
        }, 1600)) : o.startFinale ? startFinale() : o.showLeftArm ? (gameObjects.roomJackObjs.dollHeadFlash2.visible = !1, showFlashRand(2), jumpOutLeftArm(), showStaticRand(2, void 0, void 0, .15), setTimeout(() => {
            gameObjects.roomJackObjs.passedSafePoint || (gameObjects.sounds.pumpamb.play(), gameObjects.sounds.pumpamb.volume = 1, gameObjects.roomJackObjs.dollHeadFlash2.visible = !0, gameObjects.roomJackObjs.dollHeadFlash2.scaleX = .9, gameObjects.roomJackObjs.dollHeadFlash2.scaleY = .9, gameObjects.roomJackObjs.dollHead.visible = !1, gameObjects.roomJackObjs.dollEyes.visible = !1, gameObjects.roomJackObjs.dollCreepy.visible = !1, addToUpdateFuncList(shakeHeadFlashTwo), setTimeout(() => {
                gameObjects.sounds.pumpamb.stop(), gameObjects.roomJackObjs.dollHeadFlash2.visible = !1, removeFromUpdateFuncList(shakeHeadFlashTwo), showStaticRand(1), showFlashRand(1), gameObjects.roomJackObjs.dollHead.visible = !0, gameObjects.roomJackObjs.dollEyes.visible = !0, gameObjects.roomJackObjs.dollCreepy.visible = !0
            }, 385))
        }, 7e3)) : o.showRightArm ? (gameObjects.roomJackObjs.dollHead.visible = !1, gameObjects.roomJackObjs.dollEyes.visible = !1, gameObjects.roomJackObjs.dollCreepy.visible = !1, gameObjects.roomJackObjs.lights.alpha *= .5, gameObjects.roomJackObjs.dollHeadFlash1.visible = !0, gameObjects.roomJackObjs.dollHeadFlash1.scaleX = .8, gameObjects.roomJackObjs.dollHeadFlash1.scaleY = .8, addToUpdateFuncList(shakeHeadFlashOne), showFlashRand(2), setTimeout(() => {
            showFlashRand(1), playSound("squeak1")
        }, 150), playSound("void"), playSound("stopmusic"), setTimeout(() => {
            showFlashRand(2), gameObjects.roomJackObjs.dollHead.visible = !0, gameObjects.roomJackObjs.dollEyes.visible = !0, gameObjects.roomJackObjs.dollCreepy.visible = !0, removeFromUpdateFuncList(shakeHeadFlashOne), gameObjects.roomJackObjs.dollHeadFlash1.destroy(), gameObjects.roomJackObjs.lights.alpha *= 2, jumpOutRightArm(), gameObjects.sounds.void.stop()
        }, 475), showStaticRand(2, void 0, void 0, .15)) : o.message ? messageBus.publish(o.message) : o.startAutoSpin ? (gameObjects.roomJackObjs.spinnerButton.destroy(), gameObjects.roomJackObjs.speedRatio = 12.5, flipToAutoSpinArm()) : o.updateProp ? gameObjects.roomJackObjs[o.updateProp] = o.updateVal : o.special || (playMusicBoxNote(o.note, o.volume, o.tint), gameObjects.roomJackObjs.slowRotation = !1);
        gameObjects.roomJackObjs.noteCount++, gameObjects.roomJackObjs.rotateMusicAccumulate = 0
    }
}

function setupJackMusicSequence() {
    gameObjects.roomJackObjs.musicDataNormal = [{
        accumulate: .1,
        note: "g6",
        tint: 6684842
    }, {
        accumulate: .195,
        slowSpin: !0
    }, {
        accumulate: .05,
        note: "c7b",
        tint: 1118702
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        note: "g7",
        tint: 16711680
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .45,
        slowSpin: !0
    }, {
        accumulate: .05,
        static: !0
    }, {
        accumulate: .15,
        static: !0
    }, {
        accumulate: .4,
        note: "g6",
        tint: 3342506,
        volume: .5
    }, {
        accumulate: .01,
        note: "c7",
        tint: 4607,
        volume: .4
    }, {
        accumulate: .01,
        note: "e7",
        tint: 2280618,
        volume: .3
    }, {
        accumulate: .01,
        note: "a7",
        tint: 16724787
    }], gameObjects.roomJackObjs.musicDataDark = [{
        accumulate: .02,
        slowSpin: !0
    }, {
        accumulate: .05,
        static: !0
    }, {
        accumulate: .1,
        note: "a7",
        tint: 16724787
    }, {
        accumulate: .6,
        note: "g7",
        tint: 15597568
    }, {
        accumulate: .6,
        note: "f7b",
        tint: 11184674
    }, {
        accumulate: .6,
        note: "e7",
        tint: 2263159
    }, {
        accumulate: .6,
        note: "d7",
        tint: 26231
    }, {
        accumulate: .6,
        note: "c7b",
        tint: 1118532
    }, {
        accumulate: .8,
        static: !0
    }, {
        accumulate: .02,
        slowSpin: !0
    }, {
        accumulate: .01,
        note: "g6s",
        tint: 0
    }], gameObjects.roomJackObjs.musicDataHorror = [{
        accumulate: .02,
        slowSpin: !0
    }, {
        accumulate: .05,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .1,
        static: !0,
        duration: 4
    }, {
        accumulate: .02,
        slowSpin: !0,
        sfx: "squeak2"
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .5,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .2,
        note: "e7",
        tint: 2280618
    }, {
        accumulate: .2,
        note: "g7",
        tint: 16711680
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .8,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .65,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        note: "g7",
        tint: 16711680
    }, {
        accumulate: .2,
        note: "e7",
        tint: 2280618
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .01,
        static: !0
    }, {
        accumulate: .2,
        slowSpin: !0
    }, {
        accumulate: .01,
        static: !0
    }, {
        accumulate: .2,
        slowSpin: !0,
        sfx: "squeak2"
    }, {
        accumulate: .05,
        popupHeadHorror: !0
    }, {
        accumulate: .3,
        slowSpin: !0
    }, {
        accumulate: .35,
        startFinale: !0,
        sfx: "squeak1"
    }, {
        accumulate: .4,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .01,
        showLeftArm: !0
    }, {
        accumulate: .01,
        slowSpin: !0
    }, {
        accumulate: .3,
        slowSpin: !0,
        sfx: "squeak1"
    }, {
        accumulate: .3,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .01,
        message: "passedSafePoint"
    }, {
        accumulate: .01,
        message: "speedDown"
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        note: "g7",
        tint: 16711680
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        showRightArm: !0
    }, {
        accumulate: .01,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .8,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .5,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .6,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .3,
        startAutoSpin: !0
    }];
    let e = [{
            accumulate: .2,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .4,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .2,
            note: "d7",
            tint: 56831
        }, {
            accumulate: .4,
            note: "d7",
            tint: 56831
        }, {
            accumulate: .2,
            note: "e7",
            tint: 65280
        }, {
            accumulate: .2,
            note: "g7",
            tint: 16711680
        }, {
            accumulate: .2,
            note: "e7",
            tint: 65280
        }, {
            accumulate: .2,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .4,
            note: "g6",
            tint: 3342506
        }, {
            accumulate: .2,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .4,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .2,
            note: "d7",
            tint: 56831
        }, {
            accumulate: .4,
            note: "d7",
            tint: 56831
        }, {
            accumulate: .2,
            note: "e7",
            tint: 65280
        }, {
            accumulate: .6,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .4,
            note: "g6",
            tint: 3342506
        }],
        a = [{
            accumulate: .2,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .2,
            note: "c7",
            tint: 4607
        }, {
            accumulate: .2,
            note: "d7",
            tint: 56831
        }, {
            accumulate: .2,
            note: "g7",
            tint: 65280
        }, {
            accumulate: .01,
            message: "speedUp"
        }],
        o = [{
            accumulate: .2,
            note: "f7",
            tint: 4607
        }, {
            accumulate: .2,
            note: "f7b",
            tint: 4607
        }, {
            accumulate: .01,
            message: "speedUp"
        }];
    gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat([{
        accumulate: .4,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .4,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .01,
        message: "disableMoveButtons"
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        note: "g7",
        tint: 16711680
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .01,
        message: "speedUp"
    }, {
        accumulate: .4,
        note: "g6",
        tint: 3342506
    }, {
        accumulate: .2,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .2,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .8,
        note: "d7",
        tint: 56831
    }, {
        accumulate: .2,
        note: "e7",
        tint: 65280
    }, {
        accumulate: .4,
        note: "c7",
        tint: 4607
    }, {
        accumulate: .01,
        message: "speedUp"
    }]), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(e), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(e), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(a), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(a), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(o), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(o), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(o), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat(o), gameObjects.roomJackObjs.musicDataHorror = gameObjects.roomJackObjs.musicDataHorror.concat([{
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .01,
        message: "speedUp"
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .01,
        message: "speedUp"
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .01,
        message: "speedUp"
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .01,
        message: "speedUp"
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .2,
        note: "creepysfx",
        tint: 0
    }, {
        accumulate: .01,
        message: "speedUp"
    }])
}

function playLastNotes() {
    setTimeout(() => {
        playMusicBoxNote("d7", void 0, 56831), setTimeout(() => {
            playMusicBoxNote("f7", void 0, 16776960), setTimeout(() => {
                playMusicBoxNote("e7", void 0, 65280), setTimeout(() => {
                    playMusicBoxNote("c7", void 0, 4607)
                }, 400)
            }, 200)
        }, 200)
    }, 1e3)
}

function playMusicBoxNote(e, a, o, t) {
    playSound(e, void 0, a);
    let s = t;
    null == s && (s = gameObjects.roomJackObjs.box.x + 150 * (Math.random() - .5)), createNoteVisual(s, gameObjects.roomJackObjs.box.y - 8 * Math.random() - 110, o)
}

function updateGuideArrowJack() {
    let e = gameObjects.roomJackObjs.spinner.x,
        a = gameObjects.roomJackObjs.spinner.y,
        o = gameObjects.roomJackObjs.spinner.rotation,
        t = e + 121 * Math.cos(o),
        s = a + 121 * Math.sin(o),
        c = gameVars.mouseposx - t - gameVars.halfWidth,
        m = gameVars.mouseposy - s,
        r = Math.min(120, Math.sqrt(c * c + m * m));
    r < 35 && (r = 0);
    let b = Math.atan2(m, c);
    updateGuideArrow(t, s, b, r)
}

function resetGuideArrowJack() {
    updateGuideArrow(0, -9999)
}

function animatePopUp() {
    gameObjects.roomJackObjs.headPopup1.visible = !0, gameObjects.roomJackObjs.dollCreepy.visible = !1, addToUpdateFuncList(updatePopUp), globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.dollCreepy,
        y: gameObjects.roomJackObjs.dollCreepy.origYPos - 266,
        ease: "Cubic.easeOut",
        duration: 275,
        onComplete: () => {
            globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.dollCreepy,
                y: gameObjects.roomJackObjs.dollCreepy.origYPos - 260,
                ease: "Elastic",
                easeParams: [1.3, .25],
                duration: 500
            })
        }
    }), globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.dollCreepy,
        scaleX: .65,
        ease: "Cubic.easeIn",
        duration: 75,
        onComplete: () => {
            gameObjects.roomJackObjs.headPopup1.visible = !1, gameObjects.roomJackObjs.headPopup2.visible = !0, globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.dollCreepy,
                scaleX: 1.3,
                ease: "Cubic.easeIn",
                duration: 110,
                onComplete: () => {
                    globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.dollCreepy,
                        scaleX: 1,
                        ease: "Cubic.easeOut",
                        duration: 60,
                        onComplete: () => {
                            gameObjects.roomJackObjs.headPopup2.visible = !1, gameObjects.roomJackObjs.dollEyes.visible = !0, gameObjects.roomJackObjs.dollHead.visible = !0, gameObjects.roomJackObjs.dollCreepy.visible = !0, gameObjects.roomJackObjs.dollHeadUnder.visible = !1, removeFromUpdateFuncList(updatePopUp)
                        }
                    })
                }
            })
        }
    })
}

function updatePopUp() {
    let e = gameObjects.roomJackObjs.dollCreepy.y - 1400,
        a = gameObjects.roomJackObjs.dollCreepy.scaleX;
    gameObjects.roomJackObjs.headPopup1.y = e, gameObjects.roomJackObjs.headPopup2.y = e, gameObjects.roomJackObjs.headPopup2.scaleX = a
}

function setupJackArms(e) {
    gameObjects.roomJackObjs.leftArm1 = e.add.image(-52, gameVars.height + 310, "roomJack", "upperArm").setOrigin(.02, .5), gameObjects.roomJackObjs.leftArm1.shadowLength = .03, gameObjects.roomJackObjs.leftArm1.origX = gameObjects.roomJackObjs.leftArm1.x, gameObjects.roomJackObjs.leftArm1.rotation = .5 * -Math.PI, gameObjects.roomJackObjs.leftArm1.goalRot = gameObjects.roomJackObjs.leftArm1.rotation, gameObjects.roomJackObjs.leftArm1.trueRot = gameObjects.roomJackObjs.leftArm1.rotation, gameObjects.roomJackObjs.leftArm2 = e.add.image(0, 9999, "roomJack", "midArm").setOrigin(.06, .5), gameObjects.roomJackObjs.leftArm2.rotation = .5 * Math.PI, gameObjects.roomJackObjs.leftArm2.goalRot = gameObjects.roomJackObjs.leftArm2.rotation, gameObjects.roomJackObjs.leftArm2.trueRot = gameObjects.roomJackObjs.leftArm2.rotation, gameObjects.roomJackObjs.leftArm2.scaleY = -1, gameObjects.roomJackObjs.leftArm3 = e.add.image(0, 9999, "roomJack", "lowerArm").setOrigin(.07, .5), gameObjects.roomJackObjs.leftArm3.scaleY = -1, gameObjects.roomJackObjs.leftArm3.rotation = .5 * Math.PI, gameObjects.roomJackObjs.leftArm3.goalRot = gameObjects.roomJackObjs.leftArm3.rotation, gameObjects.roomJackObjs.leftArm3.trueRot = gameObjects.roomJackObjs.leftArm3.rotation, gameObjects.roomJackObjs.leftHand = e.add.image(0, 9999, "roomJack", "hand2"), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.leftArm1), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.leftArm2), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.leftArm3), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.leftHand), gameObjects.roomJackObjs.rightArm1 = e.add.image(52, gameVars.height + 310, "roomJack", "upperArm").setOrigin(.02, .5), gameObjects.roomJackObjs.rightArm1.shadowLength = .03, gameObjects.roomJackObjs.rightArm1.origX = gameObjects.roomJackObjs.rightArm1.x, gameObjects.roomJackObjs.rightArm1.rotation = .5 * -Math.PI, gameObjects.roomJackObjs.rightArm1.goalRot = gameObjects.roomJackObjs.rightArm1.rotation, gameObjects.roomJackObjs.rightArm1.trueRot = gameObjects.roomJackObjs.rightArm1.rotation, gameObjects.roomJackObjs.rightArm2 = e.add.image(0, 9999, "roomJack", "midArm").setOrigin(.06, .45), gameObjects.roomJackObjs.rightArm2.rotation = .5 * Math.PI, gameObjects.roomJackObjs.rightArm2.goalRot = gameObjects.roomJackObjs.rightArm2.rotation, gameObjects.roomJackObjs.rightArm2.trueRot = gameObjects.roomJackObjs.rightArm2.rotation, gameObjects.roomJackObjs.rightArm3 = e.add.image(0, 9999, "roomJack", "lowerArm").setOrigin(.07, .5), gameObjects.roomJackObjs.rightArm3.scaleY = -1, gameObjects.roomJackObjs.rightArm3.rotation = .5 * Math.PI, gameObjects.roomJackObjs.rightArm3.goalRot = gameObjects.roomJackObjs.rightArm3.rotation, gameObjects.roomJackObjs.rightArm3.trueRot = gameObjects.roomJackObjs.rightArm3.rotation, gameObjects.roomJackObjs.rightHand = e.add.image(0, 9999, "roomJack", "hand2"), gameObjects.roomJackObjs.rightHand.scaleX = -1, gameObjects.roomJackObjs.rightElbow = {
        x: 0,
        y: 0,
        velX: 0,
        velY: 0
    }, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.rightArm1), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.rightArm2), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.rightArm3), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.rightHand), updateJackArmsLeft(), updateJackArmsRight()
}

function updateJackArmsLeft() {
    let e = gameObjects.roomJackObjs.leftArm1,
        a = gameObjects.roomJackObjs.leftArm2,
        o = gameObjects.roomJackObjs.leftArm3;
    gameObjects.roomJackObjs.leftHand;
    a.x = e.x + e.width * e.scaleX * Math.cos(e.rotation) * (.87 + e.shadowLength), a.y = e.y + e.width * e.scaleX * Math.sin(e.rotation) * (.87 + e.shadowLength), o.x = a.x + a.width * a.scaleX * Math.cos(a.rotation) * .97, o.y = a.y + a.width * a.scaleX * Math.sin(a.rotation) * .97, gameObjects.roomJackObjs.leftHand.x = o.x + o.width * o.scaleX * Math.cos(o.rotation) * .95, gameObjects.roomJackObjs.leftHand.y = o.y + o.width * o.scaleX * Math.sin(o.rotation) * .95, e.x = gameObjects.roomJackObjs.leftArm1.origX - Math.random(), gameObjects.roomJackObjs.leftArm1.trueRot = .1 * gameObjects.roomJackObjs.leftArm1.trueRot + .9 * gameObjects.roomJackObjs.leftArm1.goalRot, gameObjects.roomJackObjs.leftArm2.trueRot = .1 * gameObjects.roomJackObjs.leftArm2.trueRot + .9 * gameObjects.roomJackObjs.leftArm2.goalRot, gameObjects.roomJackObjs.leftArm3.trueRot = .1 * gameObjects.roomJackObjs.leftArm3.trueRot + .9 * gameObjects.roomJackObjs.leftArm3.goalRot, gameObjects.roomJackObjs.leftArm1.rotation = gameObjects.roomJackObjs.leftArm1.trueRot + .02 * Math.random(), gameObjects.roomJackObjs.leftArm2.rotation = gameObjects.roomJackObjs.leftArm2.trueRot + .02 * Math.random(), gameObjects.roomJackObjs.leftArm3.rotation = gameObjects.roomJackObjs.leftArm3.trueRot + .01 * Math.random()
}

function updateJackArmsRight() {
    let e = gameObjects.roomJackObjs.rightArm1,
        a = gameObjects.roomJackObjs.rightArm2,
        o = gameObjects.roomJackObjs.rightArm3;
    a.x = e.x + e.width * e.scaleX * Math.cos(e.rotation) * (.86 + e.shadowLength), a.y = e.y + e.width * e.scaleX * Math.sin(e.rotation) * (.86 + e.shadowLength), o.x = a.x + a.width * a.scaleX * Math.cos(a.rotation), o.y = a.y + a.width * a.scaleX * Math.sin(a.rotation), gameObjects.roomJackObjs.rightHand.x = o.x + o.width * o.scaleX * Math.cos(o.rotation) * .97, gameObjects.roomJackObjs.rightHand.y = o.y + o.width * o.scaleX * Math.sin(o.rotation) * .97, e.x = gameObjects.roomJackObjs.rightArm1.origX - Math.random(), gameObjects.roomJackObjs.rightArm1.trueRot = .1 * gameObjects.roomJackObjs.rightArm1.trueRot + .9 * gameObjects.roomJackObjs.rightArm1.goalRot, gameObjects.roomJackObjs.rightArm2.trueRot = .1 * gameObjects.roomJackObjs.rightArm2.trueRot + .9 * gameObjects.roomJackObjs.rightArm2.goalRot, gameObjects.roomJackObjs.rightArm3.trueRot = .1 * gameObjects.roomJackObjs.rightArm3.trueRot + .9 * gameObjects.roomJackObjs.rightArm3.goalRot, gameObjects.roomJackObjs.rightArm1.rotation = gameObjects.roomJackObjs.rightArm1.trueRot + .02 * Math.random(), gameObjects.roomJackObjs.rightArm2.rotation = gameObjects.roomJackObjs.rightArm2.trueRot + .02 * Math.random(), gameObjects.roomJackObjs.rightArm3.rotation = gameObjects.roomJackObjs.rightArm3.trueRot + .01 * Math.random(), gameObjects.roomJackObjs.rightElbow.x = a.x + a.width * a.scaleX * Math.cos(a.rotation) * .96, gameObjects.roomJackObjs.rightElbow.y = a.y + a.width * a.scaleX * Math.sin(a.rotation) * .96
}

function updateJackArmsRightAuto() {
    let e = gameObjects.roomJackObjs.rightArm1,
        a = gameObjects.roomJackObjs.rightArm2,
        o = gameObjects.roomJackObjs.rightArm3;
    if (gameObjects.roomJackObjs.rightArm1.rotation = gameObjects.roomJackObjs.rightArm1.trueRot + .01 * Math.random() + .3 * Math.sin(gameObjects.roomJackObjs.spinner.rotation) + .25, gameObjects.roomJackObjs.readyToGrabSpinner) {
        let e = 121,
            a = gameObjects.roomJackObjs.spinner.x + Math.cos(gameObjects.roomJackObjs.spinner.rotation) * e,
            t = gameObjects.roomJackObjs.spinner.y + Math.sin(gameObjects.roomJackObjs.spinner.rotation) * e;
        gameObjects.roomJackObjs.rightHand.x = a, gameObjects.roomJackObjs.rightHand.y = t, gameObjects.roomJackObjs.rightHand.rotation = .35 * (o.rotation - 2.38)
    }
    gameObjects.roomJackObjs.readyToGrabSpinner ? (o.x = gameObjects.roomJackObjs.rightHand.x + 105, o.y = gameObjects.roomJackObjs.rightHand.y + 45) : (o.x = gameObjects.roomJackObjs.rightHand.x, o.y = gameObjects.roomJackObjs.rightHand.y), a.x = e.x + e.width * e.scaleX * Math.cos(e.rotation) * .87, a.y = e.y + e.width * e.scaleX * Math.sin(e.rotation) * .87;
    let t = gameObjects.roomJackObjs.rightElbow.y - a.y,
        s = gameObjects.roomJackObjs.rightElbow.x - a.x,
        c = gameObjects.roomJackObjs.rightElbow.y - o.y,
        m = gameObjects.roomJackObjs.rightElbow.x - o.x;
    a.rotation = Math.atan2(t, s), gameObjects.roomJackObjs.rightArm2.rotation < .5 * -Math.PI && (a.rotation = .4, gameObjects.roomJackObjs.rightElbow.x = a.x + a.width * a.scaleX * Math.cos(a.rotation) * .96, gameObjects.roomJackObjs.rightElbow.y = a.y + a.width * a.scaleX * Math.sin(a.rotation) * .96), o.rotation = Math.atan2(c, m) + Math.PI;
    let r = .97 * Math.sqrt(s * s + t * t),
        b = 1.1 * Math.sqrt(m * m + c * c),
        O = r - a.width;
    gameObjects.roomJackObjs.rightElbow.velX += s * O * -.003, gameObjects.roomJackObjs.rightElbow.velY += t * O * -.003;
    let j = b - o.width;
    gameObjects.roomJackObjs.rightElbow.velX += m * j * -.003, gameObjects.roomJackObjs.rightElbow.velY += c * j * -.003, gameObjects.roomJackObjs.rightElbow.x += gameObjects.roomJackObjs.rightElbow.velX, gameObjects.roomJackObjs.rightElbow.y += gameObjects.roomJackObjs.rightElbow.velY + .01, gameObjects.roomJackObjs.rightElbow.velX *= .75, gameObjects.roomJackObjs.rightElbow.velY *= .75
}

function flipToAutoSpinArm() {
    if (gameObjects.roomJackObjs.triggeredAutopilot) return;
    gameObjects.roomJackObjs.triggeredAutopilot = !0, gameObjects.roomJackObjs.rightArm2.setOrigin(-.03, .5);
    let e = gameObjects.roomJackObjs.rightArm3.rotation;
    gameObjects.roomJackObjs.rightArm3.rotation = e + 2 * Math.PI, gameObjects.roomJackObjs.rightArm3.setOrigin(.98, .5), gameObjects.roomJackObjs.rightArm3.x = gameObjects.roomJackObjs.rightHand.x, gameObjects.roomJackObjs.rightArm3.y = gameObjects.roomJackObjs.rightHand.y, globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.rightArm1,
        scaleX: .9,
        x: "-=15",
        y: "-=20",
        ease: "Quad.easeOut",
        duration: 200
    });
    let a = gameObjects.roomJackObjs.spinner.x + 121 * Math.cos(gameObjects.roomJackObjs.spinner.rotation),
        o = gameObjects.roomJackObjs.spinner.y + 121 * Math.sin(gameObjects.roomJackObjs.spinner.rotation);
    gameObjects.roomJackObjs.useAltArmMovement = !0, globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.rightHand,
        x: a + 120,
        y: o + 5,
        ease: "Quad.easeIn",
        duration: 225,
        onComplete: () => {
            gameObjects.roomJackObjs.isAutopilot = !0, gameObjects.roomJackObjs.readyToGrabSpinner = !0, setTimeout(() => {
                gameObjects.sounds.squeak3.play({
                    loop: !0
                }), gameObjects.sounds.squeak3.volume = 1, showStaticLite()
            }, 2200);
            let e = gameObjects.roomJackObjs.rightHand.x,
                a = gameObjects.roomJackObjs.rightHand.y;
            gameObjects.roomJackObjs.rightHand.rotation;
            gameObjects.roomJackObjs.rightHand.destroy(), gameObjects.roomJackObjs.rightHand = globalScene.add.image(e, a, "roomJack", "hand3"), gameObjects.roomJackObjs.rightHand.rotation = 0, gameObjects.roomJackObjs.rightHand.scaleY = 1.08, gameObjects.roomJackObjs.rightArm3.scaleY = 1.15, zoomTemp(1.01), gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.rightHand), resetJackLights(), gameObjects.roomJackObjs.lights.alpha *= .5, setTimeout(() => {
                gameObjects.roomJackObjs.lights.alpha *= 2
            }, 80), globalScene.tweens.add({
                targets: [gameObjects.roomJackObjs.rightHand, gameObjects.roomJackObjs.rightArm3],
                scaleY: 1,
                ease: "Quad.easeOut",
                duration: 200
            })
        }
    }), gameObjects.roomJackObjs.roomContainer.bringToTop(gameObjects.roomJackObjs.rightArm3), gameObjects.roomJackObjs.roomContainer.bringToTop(gameObjects.roomJackObjs.rightHand), resetJackLights(), updateJackArmsRightAuto(), gameObjects.roomJackObjs.rightArm2.rotation < .5 * -Math.PI && (gameObjects.roomJackObjs.rightArm2.rotation = -.1)
}

function jumpOutLeftArm() {
    let e = gameObjects.roomJackObjs.leftArm1;
    gameObjects.roomJackObjs.leftArm2, gameObjects.roomJackObjs.leftArm3, gameObjects.roomJackObjs.leftHand;
    e.y = gameVars.height + 300, gameObjects.roomJackObjs.leftArm3.rotation = .5 * Math.PI, playSound("emerge1"), gameObjects.roomJackObjs.dollHead.rotation = .15, gameObjects.roomJackObjs.dollEyes.rotation = .16, globalScene.tweens.add({
        targets: [gameObjects.roomJackObjs.dollHead, gameObjects.roomJackObjs.dollEyes],
        rotation: 0,
        ease: "Cubic.easesIn",
        duration: 600
    }), globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.leftArm2,
        goalRot: 1.5,
        ease: "Quad.easeIn",
        duration: 250,
        onComplete: () => {
            globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.leftArm3,
                ease: "Elastic",
                easeParams: [.1, .92],
                goalRot: 1.4,
                duration: 400,
                onComplete: () => {
                    globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.leftArm3,
                        ease: "Cubic.easeIn",
                        goalRot: 2.44,
                        duration: 1400,
                        onComplete: () => {
                            globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.leftArm3,
                                ease: "Cubic.easeIn",
                                goalRot: 1.68,
                                duration: 300,
                                onComplete: () => {
                                    zoomTemp(1.03), playSound("groundthud2"), gameObjects.roomJackObjs.leftArm1.scaleY = 1.1, gameObjects.roomJackObjs.leftArm2.scaleY = -1.12, gameObjects.roomJackObjs.leftArm3.scaleY = -1.12, globalScene.tweens.add({
                                        targets: [gameObjects.roomJackObjs.leftArm1],
                                        ease: "Cubic.easeIn",
                                        scaleY: 1,
                                        duration: 250
                                    }), globalScene.tweens.add({
                                        targets: [gameObjects.roomJackObjs.leftArm2, gameObjects.roomJackObjs.leftArm3],
                                        ease: "Cubic.easeIn",
                                        scaleY: -1,
                                        duration: 250
                                    }), gameObjects.roomJackObjs.portraitGiraffe.destroy(), gameObjects.roomJackObjs.portraitGiraffe2.visible = !0, gameObjects.roomJackObjs.portraitBox.destroy(), gameObjects.roomJackObjs.portraitBox2.visible = !0, gameObjects.roomJackObjs.streamers.destroy(), gameObjects.roomJackObjs.neck1.visible = !0, gameObjects.roomJackObjs.neck2.visible = !0, gameObjects.roomJackObjs.neck3.visible = !0, setTimeout(() => {
                                        gameObjects.roomJackObjs.lights.alpha *= .5, setTimeout(() => {
                                            gameObjects.roomJackObjs.lights.alpha *= 2
                                        }, 80)
                                    }, 50)
                                }
                            }), globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.leftArm2,
                                ease: "Cubic.easeIn",
                                scaleX: 1.08,
                                goalRot: 2.86,
                                duration: 300
                            }), globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.leftArm1,
                                shadowLength: 0,
                                scaleX: .8,
                                goalRot: -1.9,
                                ease: "Cubic.easeIn",
                                origX: "-=80",
                                y: "+=23",
                                duration: 300
                            });
                            let e = gameObjects.roomJackObjs.leftHand.x,
                                a = gameObjects.roomJackObjs.leftHand.y,
                                o = gameObjects.roomJackObjs.leftHand.rotation;
                            gameObjects.roomJackObjs.leftHand.destroy(), gameObjects.roomJackObjs.leftHand = globalScene.add.image(e, a, "roomJack", "hand1"), gameObjects.roomJackObjs.leftHand.rotation = o, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.leftHand), resetJackLights(), globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.leftHand,
                                rotation: 0,
                                ease: "Cubic.easeIn",
                                duration: 280
                            })
                        }
                    }), globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.leftArm2,
                        ease: "Quad.easeOut",
                        goalRot: 4.7,
                        duration: 1400
                    }), globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.leftArm1,
                        goalRot: -1.2,
                        ease: "Quad.easeInOut",
                        origX: "-=10",
                        y: "-=60",
                        duration: 1400
                    }), gameObjects.roomJackObjs.leftArm2.setOrigin(.05, .5)
                }
            }), globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.leftArm2,
                goalRot: 2.7,
                duration: 450
            }), globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.leftArm1,
                shadowLength: .02,
                scaleX: 1.1,
                goalRot: -1.35,
                origX: "+=60",
                y: "-=240",
                duration: 350
            })
        }
    }), globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.leftArm1,
        ease: "Quad.easeIn",
        scaleX: 1.05,
        goalRot: -1.48,
        origX: "+=30",
        y: "-=350",
        duration: 250
    })
}

function jumpOutRightArm() {
    let e = gameObjects.roomJackObjs.rightArm1;
    gameObjects.roomJackObjs.rightArm2, gameObjects.roomJackObjs.rightArm3, gameObjects.roomJackObjs.rightHand;
    e.scaleX = .8, e.y = gameVars.height + 300, gameObjects.roomJackObjs.rightArm3.rotation = .5 * Math.PI, playSound("emerge2"), gameObjects.roomJackObjs.dollHead.rotation = -.15, gameObjects.roomJackObjs.dollEyes.rotation = -.16, globalScene.tweens.add({
        targets: [gameObjects.roomJackObjs.dollHead, gameObjects.roomJackObjs.dollEyes],
        rotation: 0,
        ease: "Cubic.easesIn",
        duration: 600
    }), globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.rightArm2,
        goalRot: 1.65,
        ease: "Quad.easeIn",
        duration: 200,
        onComplete: () => {
            globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.rightArm3,
                ease: "Elastic",
                easeParams: [.1, .92],
                goalRot: 1.78,
                duration: 350,
                onComplete: () => {
                    globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.rightArm3,
                        ease: "Cubic.easeIn",
                        goalRot: .7,
                        duration: 1200,
                        onComplete: () => {
                            globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.rightArm3,
                                ease: "Cubic.easeIn",
                                goalRot: 1.44,
                                duration: 300,
                                onComplete: () => {
                                    zoomTemp(1.03), playSound("groundthud2"), gameObjects.roomJackObjs.rightArm1.scaleY = 1.1, gameObjects.roomJackObjs.rightArm2.scaleY = 1.12, gameObjects.roomJackObjs.rightArm3.scaleY = 1.12, globalScene.tweens.add({
                                        targets: [gameObjects.roomJackObjs.rightArm1, gameObjects.roomJackObjs.rightArm2, gameObjects.roomJackObjs.rightArm3],
                                        ease: "Cubic.easeIn",
                                        scaleY: 1,
                                        duration: 250
                                    }), gameObjects.roomJackObjs.portraitGiraffe2.destroy(), gameObjects.roomJackObjs.portraitGiraffe3.visible = !0, gameObjects.roomJackObjs.portraitBox2.destroy(), gameObjects.roomJackObjs.portraitBox3.visible = !0, setTimeout(() => {
                                        playSound("metalsqueak2"), gameObjects.roomJackObjs.placard.tweenScale({
                                            y: "+= 1",
                                            rotation: .5,
                                            duration: 200,
                                            ease: "Cubic.easeOut"
                                        }), gameObjects.roomJackObjs.placard.setOnMouseUpFunc(showTurnHandleLots)
                                    }, 300), gameObjects.roomJackObjs.lights.alpha *= .5, setTimeout(() => {
                                        gameObjects.roomJackObjs.lights.alpha *= 2
                                    }, 80), setTimeout(() => {
                                        flipToAutoSpinArm()
                                    }, 7500)
                                }
                            }), globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.rightArm2,
                                ease: "Cubic.easeIn",
                                scaleX: 1.08,
                                goalRot: .2,
                                duration: 300
                            }), globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.rightArm1,
                                scaleX: .8,
                                goalRot: -1.28,
                                ease: "Cubic.easeIn",
                                origX: "+=80",
                                y: "+=23",
                                duration: 300
                            });
                            let e = gameObjects.roomJackObjs.rightHand.x,
                                a = gameObjects.roomJackObjs.rightHand.y,
                                o = gameObjects.roomJackObjs.rightHand.rotation;
                            gameObjects.roomJackObjs.rightHand.destroy(), gameObjects.roomJackObjs.rightHand = globalScene.add.image(e, a, "roomJack", "hand1"), gameObjects.roomJackObjs.rightHand.scaleX = -1, gameObjects.roomJackObjs.rightHand.rotation = o, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.rightHand), resetJackLights(), globalScene.tweens.add({
                                targets: gameObjects.roomJackObjs.rightHand,
                                rotation: 0,
                                ease: "Cubic.easeIn",
                                duration: 280
                            }), gameObjects.roomJackObjs.rightArm2.setOrigin(0, .5)
                        }
                    }), globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.rightArm2,
                        ease: "Quad.easeOut",
                        goalRot: -1.56,
                        duration: 1200
                    }), globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.rightArm1,
                        shadowLength: 0,
                        goalRot: -1.94,
                        ease: "Quad.easeInOut",
                        origX: "+=10",
                        y: "-=60",
                        duration: 1200
                    }), globalScene.tweens.add({
                        targets: gameObjects.roomJackObjs.rightHand,
                        ease: "Cubic.easeIn",
                        rotation: -.2,
                        delay: 1200,
                        duration: 200
                    }), gameObjects.roomJackObjs.rightArm2.setOrigin(.05, .5)
                }
            }), globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.rightArm2,
                goalRot: .44,
                duration: 400
            }), globalScene.tweens.add({
                targets: gameObjects.roomJackObjs.rightArm1,
                shadowLength: .02,
                scaleX: 1.1,
                goalRot: -1.79,
                origX: "-=60",
                y: "-=240",
                duration: 300
            })
        }
    }), globalScene.tweens.add({
        targets: gameObjects.roomJackObjs.rightArm1,
        ease: "Quad.easeIn",
        scaleX: 1.05,
        goalRot: -1.66,
        origX: "-=30",
        y: "-=350",
        duration: 200
    })
}

function showTurnHandleLots() {
    gameObjects.roomJackObjs.placard.setOnMouseUpFunc(() => {});
    let e = [{
        text: "TURN THE HANDLE",
        time: 1e3
    }, {
        text: "TURN THE HANDLE TURN THE HANDLE",
        time: 500
    }, {
        text: "TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE",
        time: 100
    }, {
        text: "TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE",
        time: 50
    }, {
        text: dupeTurnTheHandle(1),
        time: 100
    }, {
        text: dupeTurnTheHandle(2),
        time: 100
    }, {
        text: dupeTurnTheHandle(3),
        time: 100
    }, {
        text: dupeTurnTheHandle(4),
        time: 100
    }, {
        text: dupeTurnTheHandle(5),
        time: 200
    }, {
        text: " ",
        time: 800
    }];
    showInfoTextLoop(e, void 0, !1), setTimeout(() => {
        flipToAutoSpinArm()
    }, 3300)
}

function startFinale() {
    gameObjects.roomJackObjs.startFinale = !0, gameObjects.roomJackObjs.dollface = globalScene.add.image(80, -320, "roomJack", "dollface"), gameObjects.roomJackObjs.dollface.rotation = 3.16, gameObjects.roomJackObjs.dollface.scaleExpand = .001, gameObjects.roomJackObjs.dollface.scaleX = .5, gameObjects.roomJackObjs.dollface.scaleY = .5, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.dollface), gameObjects.roomJackObjs.dollmouth = globalScene.add.image(80, -320, "roomJack", "dollmouth"), gameObjects.roomJackObjs.dollmouth.rotation = 3.16, gameObjects.roomJackObjs.dollmouth.scaleX = .5, gameObjects.roomJackObjs.dollmouth.scaleY = .5, gameObjects.roomJackObjs.dollmouth.scaleYRatio = 1.05, gameObjects.roomJackObjs.dollmouth.scaleYVel = .02, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.dollmouth)
}

function dupeTurnTheHandle(e = 0) {
    let a = "TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE TURN THE HANDLE\n";
    for (; e > 0;) e -= 1, a += a;
    return a
}

function resetJackLights() {
    let e = gameObjects.roomJackObjs.lights.x,
        a = gameObjects.roomJackObjs.lights.y,
        o = gameObjects.roomJackObjs.lights.alpha;
    gameObjects.roomJackObjs.lights.destroy(), gameObjects.roomJackObjs.lights = globalScene.add.image(e, a, "roomJack", "lights2"), gameObjects.roomJackObjs.lights.alpha = o + .03, gameObjects.roomJackObjs.lights.scaleX = 2, gameObjects.roomJackObjs.lights.scaleY = 2, gameObjects.roomJackObjs.roomContainer.add(gameObjects.roomJackObjs.lights)
}

function shakeJackHead() {
    gameObjects.roomJackObjs.dollHeadSmile.rotation = -.01 * Math.random()
}

function setupPortraits(e, a) {
    gameObjects.roomJackObjs.portraitBox = a.add.image(-345, 295, "roomJack", "portrait1"), gameObjects.roomJackObjs.portraitBox.visible = !1, e.add(gameObjects.roomJackObjs.portraitBox), gameObjects.roomJackObjs.portraitBox2 = a.add.image(gameObjects.roomJackObjs.portraitBox.x, gameObjects.roomJackObjs.portraitBox.y, "roomJack", "portrait2"), gameObjects.roomJackObjs.portraitBox2.visible = !1, e.add(gameObjects.roomJackObjs.portraitBox2), gameObjects.roomJackObjs.portraitBox3 = a.add.image(gameObjects.roomJackObjs.portraitBox.x, gameObjects.roomJackObjs.portraitBox.y, "roomJack", "portrait3"), gameObjects.roomJackObjs.portraitBox3.visible = !1, e.add(gameObjects.roomJackObjs.portraitBox3), gameObjects.roomJackObjs.portraitGiraffe = a.add.image(330, 400, "roomJack", "portrait4").setOrigin(.5, 1), gameObjects.roomJackObjs.portraitGiraffe.visible = !1, e.add(gameObjects.roomJackObjs.portraitGiraffe), gameObjects.roomJackObjs.portraitGiraffe2 = a.add.image(330, 400, "roomJack", "portrait7").setOrigin(.5, 1), gameObjects.roomJackObjs.portraitGiraffe2.visible = !1, e.add(gameObjects.roomJackObjs.portraitGiraffe2), gameObjects.roomJackObjs.portraitGiraffe3 = a.add.image(330, 400, "roomJack", "portrait4x").setOrigin(.5, 1), gameObjects.roomJackObjs.portraitGiraffe3.visible = !1, e.add(gameObjects.roomJackObjs.portraitGiraffe3)
}

function shakeHeadFlashOne(e = 1) {
    let a = Math.floor(.45 * gameObjects.roomJackObjs.dollHeadFlash1.scaleX * 7) / 7 - .4;
    gameObjects.roomJackObjs.dollHeadFlash1.rotation = .04 * (Math.random() - .5) - a;
    let o = .001 + gameObjects.roomJackObjs.dollHeadFlash1.scaleX * gameObjects.roomJackObjs.dollHeadFlash1.scaleX * .006;
    gameObjects.roomJackObjs.dollHeadFlash1.scaleX += o * e, gameObjects.roomJackObjs.dollHeadFlash1.scaleY += o * e
}

function shakeHeadFlashTwo(e = 1) {
    let a = Math.floor(.25 * gameObjects.roomJackObjs.dollHeadFlash1.scaleX * 6) / 6 - .2;
    gameObjects.roomJackObjs.dollHeadFlash2.rotation = .05 * (Math.random() - .5) - a;
    let o = .001 + gameObjects.roomJackObjs.dollHeadFlash2.scaleX * gameObjects.roomJackObjs.dollHeadFlash2.scaleX * .006;
    gameObjects.roomJackObjs.dollHeadFlash2.scaleX += o * e, gameObjects.roomJackObjs.dollHeadFlash2.scaleY += o * e
}