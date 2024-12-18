function setupRoomClown1(e, o, a) {
    let l;
    gameObjects.exhibit.setBackgroundAtIndex(o, "bgs", "bg4"), gameObjects.roomClown1 = {
        roomIndex: o,
        roomContainer: a
    }, gameObjects.roomClown1.portraitWhite = globalScene.add.image(0, gameVars.halfHeight - 50, "roomClown", "portraitWhite"), a.add(gameObjects.roomClown1.portraitWhite), gameObjects.roomClown1.portrait = globalScene.add.image(0, gameVars.halfHeight - 50, "roomClown", "portrait"), a.add(gameObjects.roomClown1.portrait), gameObjects.roomClown1.flower = e.add.image(300, gameVars.height - 28, "misc", "flower1"), gameObjects.roomClown1.flower.setOrigin(.5, 1), a.add(gameObjects.roomClown1.flower), gameObjects.roomClown1.clown = globalScene.add.image(0, gameVars.halfHeight + 93, "roomClown", "clownsmall1"), a.add(gameObjects.roomClown1.clown), gameObjects.roomClown1.nose = new Button(e, a, () => {
        nosePress1(o, a)
    }, {
        atlas: "roomClown",
        ref: "noseglow",
        x: 12,
        y: gameVars.halfHeight + 73,
        alpha: .001,
        scaleX: .155,
        scaleY: .155
    }, {
        atlas: "roomClown",
        ref: "noseglow",
        alpha: 1,
        scaleX: .158,
        scaleY: .158
    }), gameObjects.roomClown1.nose.setScale(145, 30), l = messageBus.subscribe("exhibitMove", e => {
        if (e === o) {

            setTimeout(() => {
                if (gameVars.firstNosePressed) {
                    return;
                }
                let clownNoseFlash = globalScene.add.image(gameVars.halfWidth + 26, gameVars.halfHeight + 67, "roomClown", "clownnoseflash");
                clownNoseFlash.setScale(0.27, 0.37).setRotation(-0.35);

                globalScene.tweens.add({
                    targets: clownNoseFlash,
                    alpha: 0,
                    duration: 700,
                    completeDelay: 2000,
                    onComplete: () => {
                        if (!gameVars.firstNosePressed) {
                            clownNoseFlash.alpha = 0.7;
                            clownNoseFlash.scaleX = 0.27;
                            clownNoseFlash.scaleY = 0.37;
                            globalScene.tweens.add({
                                targets: clownNoseFlash,
                                alpha: 0,
                                ease: 'Quad.easeOut',
                                duration: 800,
                                onComplete: () => {
                                    clownNoseFlash.destroy();
                                }
                            });
                            globalScene.tweens.add({
                                targets: clownNoseFlash,
                                scaleX: 0.6,
                                scaleY: 0.83,
                                ease: 'Cubic.easeOut',
                                duration: 800,
                            });
                        } else {
                            clownNoseFlash.destroy();
                        }
                    }
                });
                globalScene.tweens.add({
                    targets: clownNoseFlash,
                    scaleX: 0.6,
                    scaleY: 0.83,
                    ease: 'Cubic.easeOut',
                    duration: 700,
                });
            }, 1500)

            l.unsubscribe();
            let e = gameObjects.clownWelcomePic.x,
                o = gameObjects.clownWelcomePic.y,
                a = gameObjects.clownWelcomePic.scaleX;
            gameObjects.clownWelcomePic.destroy(), gameObjects.clownWelcomePic = globalScene.add.image(e, o, "menu", "framesEnter4"), gameObjects.clownWelcomePic.scaleX = a, gameObjects.clownWelcomePic.scaleY = a, gameObjects.clownWelcomePic.cantChange = !0, gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic), tweenVolume("gladiator0", .5)
        }
    })
}

function setupRoomClown2(e, o, a) {
    let l;
    gameObjects.exhibit.setBackgroundAtIndex(o, "bgs", "bg7"), gameObjects.roomClown2 || (gameObjects.roomClown2 = {
        roomIndex: o,
        roomContainer: a
    }), gameObjects.roomClown2.portraitWhite = globalScene.add.image(0, gameVars.halfHeight - 50, "roomClown", "portraitWhite"), a.add(gameObjects.roomClown2.portraitWhite), gameObjects.roomClown2.portrait = globalScene.add.image(0, gameVars.halfHeight - 50, "roomClown", "portrait"), a.add(gameObjects.roomClown2.portrait), gameObjects.roomClown2.flower = e.add.image(300, gameVars.height - 28, "misc", "flower1"), gameObjects.roomClown2.flower.setOrigin(.5, 1), a.add(gameObjects.roomClown2.flower), gameObjects.roomClown2.clown = globalScene.add.image(0, gameVars.halfHeight + 14, "roomClown", "clownnormal"), a.add(gameObjects.roomClown2.clown), gameObjects.roomClown2.clown.scaleX = .25, gameObjects.roomClown2.clown.scaleY = .25, gameObjects.roomClown2.nose = new Button(e, a, () => {
        nosePress2(o, a)
    }, {
        atlas: "roomClown",
        ref: "noseglow",
        x: 19,
        y: gameVars.halfHeight - 14,
        alpha: .001,
        scaleX: .25,
        scaleY: .25
    }, {
        atlas: "roomClown",
        ref: "noseglow",
        alpha: 1,
        scaleX: .25,
        scaleY: .25
    }), l = messageBus.subscribe("exhibitMove", e => {
        e === o && (l.unsubscribe(), gameObjects.roomClown1 && gameObjects.exhibit.removeIndex(gameObjects.roomClown1.roomIndex))
    })
}

function setupRoomClown3(e, o, a) {
    let l;
    gameObjects.exhibit.setBackgroundAtIndex(o, "bgs", "bg9"), gameObjects.roomClown3 || (gameObjects.roomClown3 = {
        roomIndex: o,
        roomContainer: a
    }), gameObjects.roomClown3.portraitWhite = globalScene.add.image(5, gameVars.halfHeight - 50, "roomClown", "portraitWhite"), a.add(gameObjects.roomClown3.portraitWhite), gameObjects.roomClown3.portrait = globalScene.add.image(5, gameVars.halfHeight - 50, "roomClown", "portrait"), a.add(gameObjects.roomClown3.portrait), gameObjects.roomClown3.clown = globalScene.add.image(0, gameVars.halfHeight - 46, "roomClown", "clownlarge1"), a.add(gameObjects.roomClown3.clown), gameObjects.roomClown3.nose = new Button(e, {
        container: a,
        normal: {
            atlas: "roomClown",
            ref: "noseglow",
            x: 25.5,
            y: gameVars.halfHeight - 83,
            alpha: .001,
            scaleX: .33,
            scaleY: .33
        },
        hover: {
            atlas: "roomClown",
            ref: "noseglow",
            alpha: 1,
            scaleX: .335,
            scaleY: .335
        },
        onMouseUp: () => {
            nosePress3(o, a)
        }
    }), l = messageBus.subscribe("exhibitMove", e => {
        e === o && (l.unsubscribe(), gameObjects.roomClown2 && gameObjects.exhibit.removeIndex(gameObjects.roomClown2.roomIndex))
    }), messageBus.subscribe("prepareFinalClown", l => {
        disableMoveButtons(), gameObjects.roomClown3.portrait.destroy(), gameObjects.roomClown3.clown = globalScene.add.image(0, gameVars.halfHeight + 60, "roomClown", "clowncreepy"), gameObjects.roomClown3.clown.scaleX = .75, gameObjects.roomClown3.clown.scaleY = .75, gameObjects.roomClown3.clownLeftEye = globalScene.add.image(-66, gameVars.halfHeight - 100, "roomClown", "leftEye"), gameObjects.roomClown3.clownLeftEye.origX = gameObjects.roomClown3.clownLeftEye.x, gameObjects.roomClown3.clownLeftEye.origY = gameObjects.roomClown3.clownLeftEye.y, gameObjects.roomClown3.clownLeftEye.scaleX = .75, gameObjects.roomClown3.clownLeftEye.scaleY = .75, gameObjects.roomClown3.clownRightEye = globalScene.add.image(203, gameVars.halfHeight - 60, "roomClown", "leftEye"), gameObjects.roomClown3.clownRightEye.origX = gameObjects.roomClown3.clownRightEye.x, gameObjects.roomClown3.clownRightEye.origY = gameObjects.roomClown3.clownRightEye.y, gameObjects.roomClown3.clownRightEye.scaleX = .75, gameObjects.roomClown3.clownRightEye.scaleY = .75, a.add(gameObjects.roomClown3.clown), a.add(gameObjects.roomClown3.clownLeftEye), a.add(gameObjects.roomClown3.clownRightEye), addToUpdateFuncList(shakeClownEyes), disableMoveLeftButton(), gameObjects.roomClown3.nose2 = new Button(e, a, () => {
            nosePressFinal(o, a)
        }, {
            atlas: "roomClown",
            ref: "noseglow",
            x: 58,
            y: gameVars.halfHeight - 22,
            alpha: .01,
            scaleX: .75,
            scaleY: .75
        }, {
            atlas: "roomClown",
            ref: "noseglow",
            alpha: .25
        })
    })
}

function shakeClownEyes() {
    gameObjects.roomClown3.clownRightEye.x = gameObjects.roomClown3.clownRightEye.origX + 2 * Math.random() + .003 * (gameVars.mouseposx - gameVars.halfWidth), gameObjects.roomClown3.clownRightEye.y = gameObjects.roomClown3.clownRightEye.origY + 2 * Math.random() + .0012 * (gameVars.mouseposy - gameVars.halfHeight), gameObjects.roomClown3.clownLeftEye.x = gameObjects.roomClown3.clownLeftEye.origX + 2 * Math.random() + .003 * (gameVars.mouseposx - gameVars.halfWidth), gameObjects.roomClown3.clownLeftEye.y = gameObjects.roomClown3.clownLeftEye.origY + 2 * Math.random() + .0012 * (gameVars.mouseposy - gameVars.halfHeight)
}

function nosePress1(e, o) {
    let a, l = gameObjects.roomClown1.clown.y;
    gameObjects.roomClown1.clown.destroy(), gameObjects.roomClown1.clown = globalScene.add.image(0, l, "roomClown", "clownsmall2"), o.add(gameObjects.roomClown1.clown), gameObjects.roomClown1.nose.destroy(), setTimeout(() => {
        createKey(5, gameVars.halfHeight + 130, gameObjects.roomClown1.roomIndex, gameObjects.roomClown1.roomContainer, !0)
    }, 100), a = messageBus.subscribe("exhibitMoveRight", () => {
        a.unsubscribe(), setTimeout(() => {
            let e = globalScene.add.image(0, l, "roomClown", "clownsmall3");
            o.add(e), playSound("clownlaugh1"), setTimeout(() => {
                e.destroy()
            }, 1e3), showStaticRand(1, null, void 0, .08), gameObjects.generalDarkness.alpha = .05, setTimeout(() => {
                gameObjects.generalDarkness.alpha = 0
            }, 50)
        }, 350)
    })
    gameVars.firstNosePressed = true;
}

function nosePress2(e, o) {
    gameObjects.roomClown2.nose.destroy();
    let a = gameObjects.roomClown2.clown.y;
    gameObjects.roomClown2.clown.destroy(), gameObjects.roomClown2.clown = globalScene.add.image(0, a, "roomClown", "clownlarge1"), o.add(gameObjects.roomClown2.clown), gameObjects.roomClown2.clown.scaleX = .76, gameObjects.roomClown2.clown.scaleY = .76, setTimeout(() => {
        gameObjects.generalDarkness.alpha = .03, setTimeout(() => {
            gameObjects.generalDarkness.alpha = .1, setTimeout(() => {
                gameObjects.generalDarkness.alpha = 0, setTimeout(() => {
                    gameObjects.generalDarkness.alpha = .05, setTimeout(() => {
                        gameObjects.generalDarkness.alpha = 0
                    }, 10)
                }, 500)
            }, 10)
        }, 50)
    }, 23), setTimeout(() => {
        createKey(12, gameVars.halfHeight + 150, gameObjects.roomClown2.roomIndex, gameObjects.roomClown2.roomContainer, !0)
    }, 500)
}

function nosePress3(e, o) {
    if (gameObjects.roomClown3.nose.setPos(19, -9999), gameObjects.roomClown3.clickedOnce) {
        gameObjects.roomClown3.nose.destroy(), playSound("keyfound"), setTimeout(() => {
            playSound("click3")
        }, 500);
        let a = globalScene.add.image(0, 600, "buttons", "key_red");
        o.add(a);
        gameVars.clownRedKeyUp = true;
        let l = new Button(globalScene, {
            container: o,
            normal: {
                ref: "blackPixel",
                x: 0,
                y: 615,
                scaleX: 55,
                scaleY: 25,
                alpha: .001
            },
            onHover: () => {
                l.destroy(), gameObjects.roomClown3.clown.visible = !1, gameObjects.roomClown3.clown.destroy();
                let a = globalScene.add.image(0, gameVars.halfHeight - 50, "roomClown", "clownlarge2");
                o.add(a), showStaticRand(3), playSound("clownlaugh2"), tempFreeze(800), setTimeout(() => {
                    a.x = -3, setTimeout(() => {
                        a.scaleX = 1.03, a.x = 4, setTimeout(() => {
                            a.x = -7, a.scaleX = 1.08, a.scaleY = 1.02, setTimeout(() => {
                                a.x = 9, a.scaleX = 1.18, a.scaleY = 1.05, setTimeout(() => {
                                    a.visible = !1;
                                    let l = globalScene.add.image(-150, gameVars.halfHeight - 94, "roomClown", "clownunleashed");
                                    o.add(l), setTimeout(() => {
                                        l.visible = !1;
                                        let t = globalScene.add.image(0, gameVars.halfHeight + 70, "roomClown", "clownunleashed2");
                                        t.scaleX = 1.02, t.scaleY = 1, o.add(t), setTimeout(() => {
                                            t.scaleX = 1.3, t.scaleY = 1.3, setTimeout(() => {
                                                t.scaleX = 1.25, t.scaleY = 1.25, showFlashArr([0, 1, 12, 2, 3, 12, 6, 13, 7, 14, 8], () => {
                                                    l.destroy(), a.destroy(), t.destroy(), gameObjects.roomClown3.portrait.destroy(), gameObjects.roomClown3.portrait = globalScene.add.image(0, gameVars.halfHeight - 50, "roomClown", "portraitbroken"), o.add(gameObjects.roomClown3.portrait), initDarkSequence(e), enableMoveButtons(), setTimeout(() => {
                                                        gameObjects.sounds.gladiator1.volume = .25, gameObjects.sounds.gladiator2.volume = 0, tweenVolume("gladiator1", 1), gameObjects.musicBoxNote.alpha = 1, gameObjects.musicBoxNote2.alpha = 1, gameObjects.musicBoxNote.origX = gameObjects.musicBox.x, gameObjects.musicBoxNote.origY = gameObjects.musicBox.y - 50, gameObjects.sounds.gladiator0.stop(), gameObjects.sounds.gladiator1.play({
                                                            loop: !0
                                                        }), gameObjects.sounds.gladiator2.play({
                                                            loop: !0
                                                        }), globalScene.tweens.timeline({
                                                            targets: [gameObjects.moveRightBtnHighlight, gameObjects.moveLeftBtnHighlight],
                                                            tweens: [{
                                                                alpha: 1,
                                                                ease: "Cubic.easeIn",
                                                                duration: 800
                                                            }, {
                                                                alpha: 0,
                                                                ease: "Quad.easeOut",
                                                                duration: 2e3
                                                            }]
                                                        })
                                                    }, 1700)
                                                })
                                            }, 50)
                                        }, 50)
                                    }, 200)
                                }, 20)
                            }, 40)
                        }, 40)
                    }, 40)
                }, 10)
            }
        })
    } else setTimeout(() => {
        playSound("keyfound");
        let e = globalScene.add.image(gameVars.halfWidth + 20, 600, "buttons", "key_yellow");
        setTimeout(() => {
            gameObjects.roomClown3.clownTemp = globalScene.add.image(-100, gameVars.halfHeight - 46, "roomClown", "clownlarge2"), gameObjects.roomClown3.clownTemp.scaleX = 1.5, gameObjects.roomClown3.clownTemp.alpha = 0.5, o.add(gameObjects.roomClown3.clownTemp), setTimeout(() => {
                gameObjects.roomClown3.clownTemp.x = 20
            }, 0), setTimeout(() => {
            	let clownNoseFlash = globalScene.add.image(gameVars.halfWidth + 39, gameVars.halfHeight - 151, "roomClown", "clownnoseflash");

		        globalScene.tweens.add({
		            targets: clownNoseFlash,
		            alpha: 0,
		            duration: 700,
		            completeDelay: 2000,
		            onComplete: () => {
		            	if (!gameVars.clownRedKeyUp) {
		            		clownNoseFlash.alpha = 0.7;
		            		clownNoseFlash.scaleX = 1.2;
		            		clownNoseFlash.scaleY = 1.2;
					        globalScene.tweens.add({
					            targets: clownNoseFlash,
					            alpha: 0,
					            ease: 'Quad.easeOut',
					            duration: 800,
					            onComplete: () => {
					            	clownNoseFlash.destroy();
					            }
					        });
					        globalScene.tweens.add({
					            targets: clownNoseFlash,
					            scaleX: 2,
					            scaleY: 2,
					            ease: 'Cubic.easeOut',
					            duration: 800,
					        });
		            	} else {
		            		clownNoseFlash.destroy();
		            	}
		            }
		        });
		        globalScene.tweens.add({
		            targets: clownNoseFlash,
		            scaleX: 2,
		            scaleY: 2,
		            ease: 'Cubic.easeOut',
		            duration: 700,
		        });


            	let clownLargeInstant = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, "roomClown", "clownlarge3");
				clownLargeInstant.setScale(2);
		        globalScene.tweens.add({
		            targets: clownLargeInstant,
		            alpha: 0,
		            ease: 'Quart.easeOut',
		            duration: 120,
		            onComplete: () => {
		            	clownLargeInstant.destroy();
		            }
		        });

                gameObjects.roomClown3.clown.destroy(), gameObjects.roomClown3.clownTemp.destroy(), gameObjects.roomClown3.clown = globalScene.add.image(0, gameVars.halfHeight - 47, "roomClown", "clownlarge3"), gameObjects.roomClown3.clown.scaleX = .93, gameObjects.roomClown3.clown.scaleY = .96, o.add(gameObjects.roomClown3.clown), gameObjects.roomClown3.mouthlarge = globalScene.add.image(0, gameVars.halfHeight - 50, "roomClown", "mouthlarge"), gameObjects.roomClown3.mouthlarge.scaleX = .93, gameObjects.roomClown3.mouthlarge.scaleY = .96, gameObjects.roomClown3.mouthlarge.origScaleY = gameObjects.roomClown3.mouthlarge.scaleY, o.add(gameObjects.roomClown3.mouthlarge), addToUpdateFuncList(shakeClownMouth), playSound("click1"), setTimeout(() => {
                    e.destroy(), playSound("click", 4), showStaticRand(3, null, () => {
                        showFlashRand(1)
                    }, .3), setTimeout(() => {
                        showStaticLite(3, 3)
                    }, 300), setTimeout(() => {
                        gameObjects.roomClown3.nose.setPos(35, gameVars.halfHeight - 155), playSound("click1")
                    }, 400), gameObjects.roomClown3.clickedOnce = !0
                }, 40)
            }, 50)
        }, 700)
    }, 100)
}

function nosePressFinal(e, o) {
    gameObjects.roomClown3.nose2.destroy(), gameObjects.roomClown3.clown.destroy(), gameObjects.roomClown3.mouthlarge.destroy(), removeFromUpdateFuncList(shakeClownMouth), gameObjects.roomClown3.clown = globalScene.add.image(0, gameVars.halfHeight + 60, "roomClown", "clownnormal"), gameObjects.roomClown3.clown.scaleX = .75, gameObjects.roomClown3.clown.scaleY = .75, o.add(gameObjects.roomClown3.clown), setTimeout(() => {
        createKey(25, gameVars.halfHeight + 180, gameObjects.roomClown3.roomIndex, gameObjects.roomClown3.roomContainer, !0, disableMoveLeftButton)
    }, 100)
}

function shakeClownMouth() {
    gameObjects.roomClown3.mouthlarge.scaleY = gameObjects.roomClown3.mouthlarge.origScaleY + .05 * Math.random() + .01
}