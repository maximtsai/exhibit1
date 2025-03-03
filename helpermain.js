function updateInfoText(e, t = 3200, a) {
	gameObjects.infoText.setText("\n " + e + " \n"), a && (gameObjects.infoText.setOrigin(0, .5), gameObjects.infoText.x = gameVars.halfWidth - 360, gameObjects.infoText.y = gameVars.halfHeight + 220),  gameVarsTemp.updateTextAnim && gameVarsTemp.updateTextAnim.isPlaying() && gameVarsTemp.updateTextAnim.stop(), gameVarsTemp.updateTextAnim = gameObjects.scene.tweens.timeline({
		targets: gameObjects.infoText,
		tweens: [{
			alpha: 1,
			duration: 25
		}, {
			alpha: .95,
			duration: t
		}, {
			alpha: 0,
			duration: 200,
			onComplete: () => {
				a && (gameObjects.infoText.setOrigin(.5, .5), gameObjects.infoText.x = gameVars.halfWidth)
			}
		}]
	})
}

function updateInfoTextSoft(e, t = 3e3) {
	gameObjects.infoText.setText("\n " + e + " \n"), gameVarsTemp.updateTextAnim && gameVarsTemp.updateTextAnim.isPlaying() && gameVarsTemp.updateTextAnim.stop(), gameVarsTemp.updateTextAnim = gameObjects.scene.tweens.timeline({
		targets: gameObjects.infoText,
		tweens: [{
			alpha: 1,
			duration: 250
		}, {
			alpha: .95,
			duration: t
		}, {
			alpha: 0,
			duration: 300
		}]
	})
}

function initExhibit(e) {
	gameObjects.exhibit.setBackgroundAtIndex(0, "bgs", "bg0"), gameObjects.exhibit.setBackgroundAtIndex(1, "bgs", "bg1"), setupRoomEntrance(e, 1, gameObjects.gameCtnr1), setupRoomPump(e, 2, gameObjects.gameCtnr2), setupRoomFaucet(e, 3, gameObjects.gameCtnr3), setupRoomClown1(e, 4, gameObjects.gameCtnr4), setupRoomHandy(e, 5, gameObjects.gameCtnr5), setupRoomStretch(e, 6, gameObjects.gameCtnr6), setupRoomClown2(e, 7, gameObjects.gameCtnr7), setupRoomJack(e, 13, gameObjects.gameCtnr13), setupRoomClown3(e, 14, gameObjects.gameCtnr14), setupRoomFinal(e, 15, gameObjects.gameCtnr15), gameObjects.exhibit.initPos(1)
}

function addDarkToExhibit() {}

function onStandClick(e) {
	gameVars.canCloseStand = !1, disableMoveButtons();
	let t = "stand_display",
		a = gameVars.horrorPoint && !gameVarsTemp.seenHorrorStand;
	a ? (t = "stand_display_4", gameVarsTemp.seenHorrorStand = !0) : gameVarsTemp.standSeenOnce || (t = "stand_display_3"), gameObjects.standDisplay = new Button(e, gameObjects.gameCtnr1, () => {
		onStandDisplayClick(e)
	}, {
		atlas: "buttons",
		ref: t,
		x: 0,
		y: gameVars.halfHeight
	}), a ? (gameObjects.standDisplay.setAlpha(1), gameObjects.standDisplay.setScale(1), gameObjectsTemp.voidGlow = e.add.image(0, gameVars.halfHeight, "buttons", "stand_void_glow"), gameObjectsTemp.voidGlow.alpha = .95, gameObjects.gameCtnr1.add(gameObjectsTemp.voidGlow), addToUpdateFuncList(animateVoidGlow), playSound("void", undefined, 0.7), gameObjects.museumStand.setState("disable"), gameObjects.standArrow.destroy(), gameObjects.entrance.entryLights1.alpha = 0, gameObjects.entrance.entryLights2.alpha = 0, removeFromUpdateFuncList(flipEntryLights), gameObjects.standDisplay.tweenScale({
		scaleX: 1.15,
		scaleY: 1.22,
		alpha: 1,
		duration: 3300,
		onComplete: () => {
			gameVars.canCloseStand = !0, onStandDisplayClick(e, !0), gameObjectsTemp.voidGlow.destroy(), removeFromUpdateFuncList(animateVoidGlow), gameObjects.sounds.void.stop(), updateInfoText("==>\n==>\n==>")
		}
	})) : (gameObjects.standDisplay.setAlpha(.5), gameObjects.standDisplay.setScale(.98), gameObjects.standDisplay.tweenScale({
		scaleX: 1,
		scaleY: 1,
		alpha: 1,
		duration: 200,
		ease: "Cubic.easeOut",
		onComplete: () => {
			gameVarsTemp.standSeenOnce || gameObjects.standDisplay.setAllRef("stand_display"), gameVars.canCloseStand = !0
		}
	}), gameObjects.standDisplay.runFuncOnImage(e => {
		e.scaleX = .97, e.scaleY = .97, e.alpha = .65, gameObjects.scene.tweens.timeline({
			targets: e,
			tweens: [{
				scaleX: 1,
				scaleY: 1,
				alpha: 1,
				duration: 200,
				ease: "Cubic.easeOut"
			}]
		})
	}))
}

function onStandDisplayClick(e, t = !1) {
	gameVars.canCloseStand && (gameObjects.standDisplay.setState("disable"), gameVarsTemp.standSeenOnce || (gameObjects.standDisplay.setAllRef("stand_display_2"), gameVarsTemp.standSeenOnce = !0), gameObjects.standDisplay.tweenScale({
		scaleX: .98,
		scaleY: .98,
		alpha: 0,
		duration: t ? 0 : 225,
		ease: "Cubic.easeOut",
		onComplete: () => {
			enableMoveButtons(!gameVars.horrorPoint), gameObjects.undoCreditsButton.reappear(), gameObjects.standDisplay.destroy()
		}
	}))
}

function onCreditsClick(e) {
	showMoveRightFlash();
	gameObjects.creditsButton.disappear(), gameObjects.entrance.welcomeBtn.disappear(), e.tweens.add({
		targets: gameObjects.entrance.creditsMenu,
		alpha: 1,
		ease: "Cubic.easeOut",
		duration: 750,
		onComplete: () => {
			gameObjects.undoCreditsButton.reappear()
		}
	})
}

function undoCreditsClick(e) {
	if (oneTimeScares.creditsScareCount || (oneTimeScares.creditsScareCount = 0), 0 === oneTimeScares.creditsScareCount) oneTimeScares.creditsScare = !0;
	else if (3 === oneTimeScares.creditsScareCount) {
		let t = e.add.image(gameVars.halfWidth, gameVars.halfHeight, "menu", "face1");
		t.scaleX = 2, t.scaleY = 2, e.tweens.add({
			targets: t,
			scaleX: 25,
			scaleY: 25,
			ease: "Quad.easeIn",
			duration: 450,
			onComplete: () => {
				t.destroy()
			}
		}), shakeImage(t, 450)
	}
	oneTimeScares.creditsScareCount++, gameObjects.undoCreditsButton.disappear(), e.tweens.add({
		targets: gameObjects.entrance.creditsMenu,
		alpha: 0,
		duration: 100,
		onComplete: () => {
			gameObjects.creditsButton.reappear(), gameObjects.entrance.welcomeBtn.reappear()
		}
	})
}

function shakeImage(e, t, a, s) {
	let o = e.x,
		c = e.y;
	a && (o = a), s && (c = s), e.x += 7 * (Math.random() - .5) * e.scaleX, e.y += 7 * (Math.random() - .5) * e.scaleY, setTimeout(() => {
		shakeImage(e, t - 20, o, c)
	}, 20)
}

function shakeHoriz(e) {}

function getUpBtnFromIndex(e) {
	switch (e) {
		case 2:
			return gameObjects.upvote2;
		case 3:
			return gameObjects.upvote3;
		case 4:
			return gameObjects.upvote4;
		case 5:
			return gameObjects.upvote5;
		case 6:
			return gameObjects.upvote6;
		case 7:
			return gameObjects.upvote7;
		case 8:
			return gameObjects.upvote8;
		case 9:
			return gameObjects.upvote9;
		case 10:
			return gameObjects.upvote10;
		case 11:
			return gameObjects.upvote11;
		case 12:
			return gameObjects.upvote12;
		case 13:
			return gameObjects.upvote13;
		case 14:
			return gameObjects.upvote14;
		case 15:
			return gameObjects.upvote15;
		default:
			console.error("unrecognized index ", e)
	}
}

function getDownBtnFromIndex(e) {
	switch (e) {
		case 2:
			return gameObjects.downvote2;
		case 3:
			return gameObjects.downvote3;
		case 4:
			return gameObjects.downvote4;
		case 5:
			return gameObjects.downvote5;
		case 6:
			return gameObjects.downvote6;
		case 7:
			return gameObjects.downvote7;
		case 8:
			return gameObjects.downvote8;
		case 9:
			return gameObjects.downvote9;
		case 10:
			return gameObjects.downvote10;
		case 11:
			return gameObjects.downvote11;
		case 12:
			return gameObjects.downvote12;
		case 13:
			return gameObjects.downvote13;
		case 14:
			return gameObjects.downvote14;
		case 15:
			return gameObjects.downvote15;
		default:
			console.error("unrecognized index ", e)
	}
}

function onExitClick(e) {
	if (!gameVarsTemp.doorNotClickable) return gameVars.finishedDarkPoint ? (gameObjects.exitDoor.disappear(), gameObjects.exitDoorWhite = e.add.image(-215, 507, "buttons", "exitDoorWhite"), gameObjects.exitDoorWhite.setOrigin(0, .5), gameObjects.gameCtnr0.add(gameObjects.exitDoorWhite), gameObjects.exitDoorOpen = e.add.image(-215, 507, "buttons", "exitDoorOpen"), gameObjects.exitDoorOpen.setOrigin(0, .5), gameObjects.gameCtnr0.add(gameObjects.exitDoorOpen), gameObjects.clownDoor = e.add.image(-42, 385, "roomClown", "clowndoor"), gameObjects.clownDoor.setScale(.6), gameObjects.gameCtnr0.add(gameObjects.clownDoor), gameObjects.exitDoorAnimated = e.add.image(-193, 507, "buttons", "exitDoorNormal"), gameObjects.exitDoorAnimated.setOrigin(.05, .5), gameObjects.gameCtnr0.add(gameObjects.exitDoorAnimated), disableMoveButtons(), gameVarsTemp.doorNotClickable = !0, setTimeout(() => {
		showStaticRand(3, void 0, () => {
			showFlashRand(1)
		}), e.tweens.add({
			targets: gameObjects.clownDoor,
			x: 85,
			rotation: 1,
			ease: "Cubic.easeOut",
			duration: 20,
			onComplete: () => {
				e.tweens.add({
					targets: gameObjects.clownDoor,
					x: 0,
					rotation: .5,
					ease: "Cubic.easeIn",
					duration: 370,
					delay: 60
				})
			}
		})
	}, 2750), gameObjects.exitDoorAnimated.scaleX = .98, setTimeout(() => {
		playSound("dooropen")
	}, 50), e.tweens.add({
		targets: gameObjects.exitDoorAnimated,
		scaleX: .74,
		duration: 3e3,
		ease: "Cubic.easeIn",
		onComplete: () => {
			setTimeout(() => {
				setTimeout(() => {
					playSound("doorslam")
				}, 120), e.tweens.add({
					targets: gameObjects.exitDoorAnimated,
					scaleX: 1,
					duration: 150,
					ease: "Cubic.easeIn",
					onComplete: () => {
						new Button(e, gameObjects.gameCtnr0, () => {
							updateInfoText("Locked. But now that the lights\nare on, I can head RIGHT ->", 4800)
						}, {
							ref: "blackPixel",
							x: -3,
							y: gameVars.halfHeight + 55,
							scaleX: 205,
							scaleY: 330,
							alpha: .01
						}), new Button(e, gameObjects.gameCtnr0, () => {
							updateInfoText("Emergency power is on. It might not last long.", 4500), gameObjectsTemp.emergencyLightsFlag || (gameObjectsTemp.emergencyLightsFlag = !0, setTimeout(() => {
								gameObjects.generalDarkness.alpha = .1, setTimeout(() => {
									gameObjects.generalDarkness.alpha = 0, setTimeout(() => {
										gameObjects.generalDarkness.alpha = .1, setTimeout(() => {
											gameObjects.generalDarkness.alpha = 0
										}, 50)
									}, 800)
								}, 50)
							}, 1200))
						}, {
							ref: "blackPixel",
							x: -400,
							y: gameVars.halfHeight + 90,
							scaleX: 100,
							scaleY: 80,
							alpha: .01
						});
						gameObjects.tempTeeth = e.add.image(gameVars.halfWidth, gameVars.halfHeight, "menu", "teeth"), gameObjects.tempTeeth.scaleY = 1.15;
						let t = gameObjectsTemp.starReplace.getXPos(),
							a = gameObjectsTemp.starReplace.getYPos(),
							s = e.add.image(t, a, "menu", "spareeye");
						gameObjects.gameCtnr1.add(s), gameObjectsTemp.starReplace.disappear(), showStaticLite(15, 20, 2.5), setTimeout(() => {
							gameObjects.tempTeeth.scaleY = 1.2, e.tweens.add({
								targets: gameObjects.tempTeeth,
								scaleY: 1,
								duration: 300,
								ease: "Quad.easeIn",
								onComplete: () => {
									gameObjects.tempTeeth.destroy(), showFlashRand(3, void 0, () => {
										showStaticRand(3), setTimeout(() => {
											showStaticRand(1), setTimeout(() => {
												s.destroy(), gameObjectsTemp.starReplace.reappear()
											}, 3e3)
										}, 20)
									})
								}
							}), e.cameras.main.setZoom(1), enableMoveButtons();
							gameObjects.exitDoor.reappear(), gameObjects.exitDoor.setState("disable"), gameObjects.clownDoor.destroy(), gameObjects.exitDoorOpen.destroy(), gameObjects.exitDoorAnimated.destroy(), gameObjects.exitDoorWhite.destroy(), gameVarsTemp.doorFailed = !0, gameObjects.moveRightBtn.setOnMouseUpFunc(gameObjects.exhibit.moveRight.bind(gameObjects.exhibit)), messageBus.publish("temporarilyNormal"), messageBus.publish("startHorrorSequence"), gameVars.baseSway = .04, gameObjects.exhibit.resetListOfCantMove()
						}, 30)
					}
				})
			}, 150)
		}
	}), void e.tweens.add({
		targets: e.cameras.main,
		zoom: 1.4,
		ease: "Quad.easeIn",
		duration: 2950
	})) : void(gameVarsTemp.doorFailed ? (gameObjects.generalDarkness.alpha = 1, gameObjects.exitDoor.setState("disable"), setTimeout(() => {
		gameObjects.generalDarkness.alpha = 0
	}, 50)) : gameVars.darkPoint ? updateInfoText("Turn on the lights first", 3e3) : updateInfoText("You just arrived\nExibits to the right! ->", 3500))
}

function setupGameplayButtons(e) {
	gameObjects.gameCtnr0 = e.add.container(0, 0), gameObjects.gameCtnr1 = e.add.container(0, 0), gameObjects.gameCtnr2 = e.add.container(0, 0), gameObjects.gameCtnr3 = e.add.container(0, 0), gameObjects.gameCtnr4 = e.add.container(0, 0), gameObjects.gameCtnr5 = e.add.container(0, 0), gameObjects.gameCtnr6 = e.add.container(0, 0), gameObjects.gameCtnr7 = e.add.container(0, 0), gameObjects.gameCtnr8 = e.add.container(0, 0), gameObjects.gameCtnr9 = e.add.container(0, 0), gameObjects.gameCtnr10 = e.add.container(0, 0), gameObjects.gameCtnr11 = e.add.container(0, 0), gameObjects.gameCtnr12 = e.add.container(0, 0), gameObjects.gameCtnr13 = e.add.container(0, 0), gameObjects.gameCtnr14 = e.add.container(0, 0), gameObjects.gameCtnr15 = e.add.container(0, 0), gameObjects.exhibit.addBtnCtnrToIndex(0, gameObjects.gameCtnr0), gameObjects.exhibit.addBtnCtnrToIndex(1, gameObjects.gameCtnr1), gameObjects.exhibit.addBtnCtnrToIndex(2, gameObjects.gameCtnr2), gameObjects.exhibit.addBtnCtnrToIndex(3, gameObjects.gameCtnr3), gameObjects.exhibit.addBtnCtnrToIndex(4, gameObjects.gameCtnr4), gameObjects.exhibit.addBtnCtnrToIndex(5, gameObjects.gameCtnr5), gameObjects.exhibit.addBtnCtnrToIndex(6, gameObjects.gameCtnr6), gameObjects.exhibit.addBtnCtnrToIndex(7, gameObjects.gameCtnr7), gameObjects.exhibit.addBtnCtnrToIndex(8, gameObjects.gameCtnr8), gameObjects.exhibit.addBtnCtnrToIndex(9, gameObjects.gameCtnr9), gameObjects.exhibit.addBtnCtnrToIndex(10, gameObjects.gameCtnr10), gameObjects.exhibit.addBtnCtnrToIndex(11, gameObjects.gameCtnr11), gameObjects.exhibit.addBtnCtnrToIndex(12, gameObjects.gameCtnr12), gameObjects.exhibit.addBtnCtnrToIndex(13, gameObjects.gameCtnr13), gameObjects.exhibit.addBtnCtnrToIndex(14, gameObjects.gameCtnr14), gameObjects.exhibit.addBtnCtnrToIndex(15, gameObjects.gameCtnr15), gameObjects.exitDoor = new Button(e, gameObjects.gameCtnr0, () => {
		onExitClick(e)
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
	}), gameObjects.exitDoor.setOrigin(0, .5), gameObjects.powerSwitch = new Button(e, gameObjects.gameCtnr0, onTurnOnPower, {
		atlas: "buttons",
		ref: "powerSwitchNormal",
		scaleX: .8,
		scaleY: .8,
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
	}), gameObjects.musicBoxNote = globalScene.add.image(345, gameVars.halfHeight + 30, "misc", "note"), gameObjects.musicBoxNote.origX = gameObjects.musicBoxNote.x, gameObjects.musicBoxNote.origY = gameObjects.musicBoxNote.y, gameObjects.musicBoxNote.velY = -2.5, gameObjects.gameCtnr0.add(gameObjects.musicBoxNote), gameObjects.musicBoxNote2 = globalScene.add.image(-635, gameVars.halfHeight + 20, "misc", "note"), gameObjects.musicBoxNote2.origX = gameObjects.musicBoxNote2.x, gameObjects.musicBoxNote2.origY = gameObjects.musicBoxNote2.y, gameObjects.musicBoxNote2.velY = -5, gameObjects.gameCtnr1.add(gameObjects.musicBoxNote2), gameObjects.musicBox, gameObjects.musicBoxButton = new Button(e, gameObjects.gameCtnr0, () => {
		if (!gameObjectsTemp.cantPressMusicBox)
			if (gameObjectsTemp.cantPressMusicBox = !0, setTimeout(() => {
					gameObjectsTemp.cantPressMusicBox = !1
				}, 450), setTimeout(() => {
					gameObjects.sounds.gladiator0.stop(), gameObjects.musicBoxNote.alpha = 0, gameObjects.musicBoxNote2.alpha = 0, gameObjects.sounds.gladiator1.stop(), gameObjects.sounds.gladiator2.stop()
				}, 120), gameObjectsTemp.boxBroken) gameVars.darkPoint ? updateInfoText("The music box is... broken?") : (gameVarsTemp.brokeMusicBox = !0, updateInfoText("The music box won't turn on now."));
			else if (gameObjectsTemp.stoppedMusic)
			if (playSound("stopmusic"), gameObjects.musicBoxStand.rotation = .012, globalScene.tweens.add({
					targets: gameObjects.musicBoxStand,
					rotation: 0,
					yoyo: !0,
					eease: "Sine.easeInOut",
					duration: 500
				}), globalScene.tweens.add({
					targets: gameObjects.musicBox,
					x: "+=-16",
					ease: "Quad.easeOut",
					duration: 450
				}), gameObjects.musicBoxButton.setPos(gameObjects.musicBox.x - 15, gameObjects.musicBox.y), gameObjectsTemp.boxTeetering) {
				if (gameObjects.musicBoxButton.setPos(gameObjects.musicBox.x - 15, gameVars.height - 105), globalScene.tweens.add({
						targets: gameObjects.musicBox,
						y: gameVars.height - 105,
						ease: "Quad.easeIn",
						duration: 250,
						onComplete: () => {
							let e = gameObjects.musicBox.x;
							gameObjects.musicBox.destroy(), gameObjects.musicBox = globalScene.add.image(e, gameVars.height - 105, "buttons", "musicBoxBroken"), gameObjects.gameCtnr0.add(gameObjects.musicBox), gameObjects.gameCtnr0.bringToTop(gameObjects.musicBoxStand), playSound("glassbreak"), setTimeout(() => {
								playSound("horrortrack1")
							}, 3500), gameObjectsTemp.boxBroken = !0, gameObjects.musicBoxHandle.destroy(), gameObjects.musicBoxButton.setHoverAlpha(.15)
						}
					}), !gameObjects.clownWelcomePic.cantChange) {
					let e = gameObjects.clownWelcomePic.x,
						t = gameObjects.clownWelcomePic.y,
						a = gameObjects.clownWelcomePic.scaleX;
					gameObjects.clownWelcomePic.destroy(), gameObjects.clownWelcomePic = globalScene.add.image(e, t, "menu", "framesEnter3"), gameObjects.clownWelcomePic.scaleX = a, gameObjects.clownWelcomePic.scaleY = a, gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic)
				}
			} else gameObjectsTemp.boxTeetering = !0;
		else if (playSound("stopmusic"), gameObjects.musicBoxStand.rotation = .01, gameObjectsTemp.stoppedMusic = !0, globalScene.tweens.add({
				targets: gameObjects.musicBox,
				x: 355,
				ease: "Cubic.easeOut",
				duration: 400
			}), globalScene.tweens.add({
				targets: gameObjects.musicBoxStand,
				rotation: 0,
				yoyo: !0,
				eease: "Sine.easeInOut",
				duration: 500
			}), !gameObjects.clownWelcomePic.cantChange) {
			let e = gameObjects.clownWelcomePic.x,
				t = gameObjects.clownWelcomePic.y,
				a = gameObjects.clownWelcomePic.scaleX;
			gameObjects.clownWelcomePic.destroy(), gameObjects.clownWelcomePic = globalScene.add.image(e, t, "menu", "framesEnter2"), gameObjects.clownWelcomePic.scaleX = a, gameObjects.clownWelcomePic.scaleY = a, gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic)
		}
	}, {
		atlas: "buttons",
		ref: "glow",
		x: 345,
		y: gameVars.height - 340,
		scaleX: 1.35,
		scaleY: 1.35,
		alpha: .01
	}, {
		atlas: "buttons",
		ref: "glow",
		alpha: .9
	}), gameObjects.musicBox = globalScene.add.image(345, gameVars.height - 340, "buttons", "musicBox"), gameObjects.gameCtnr0.add(gameObjects.musicBox), gameObjects.musicBoxHandle = globalScene.add.image(gameObjects.musicBox.x, gameObjects.musicBox.y + 31, "buttons", "musicBoxHandle"), gameObjects.gameCtnr0.add(gameObjects.musicBoxHandle), gameObjects.musicBoxStand = globalScene.add.image(345, gameVars.height - 27, "buttons", "boxStand"), gameObjects.musicBoxStand.setOrigin(.5, 1), gameObjects.gameCtnr0.add(gameObjects.musicBoxStand), gameObjects.clownWelcomePic = globalScene.add.sprite(-378, gameVars.height - 273, "menu", "framesEnter2"), gameObjects.clownWelcomePic.scaleX = .85, gameObjects.clownWelcomePic.scaleY = .85, gameObjects.gameCtnr1.add(gameObjects.clownWelcomePic), gameObjects.creditsButton = new Button(e, gameObjects.gameCtnr1, () => {
		onCreditsClick(e);
	}, {
		atlas: "menu",
		ref: "credits_normal",
		x: 0,
		y: gameVars.halfHeight + 135,
		scaleX: .85,
		scaleY: .85
	}, {
		atlas: "menu",
		ref: "credits_hover",
		scaleX: .86,
		scaleY: .86
	}, {
		atlas: "menu",
		ref: "credits_hover",
		scaleX: .88,
		scaleY: .88
	}), gameObjects.undoCreditsButton = new Button(e, gameObjects.gameCtnr1, () => {
		undoCreditsClick(e)
	}, {
		ref: "blackPixel",
		x: 0,
		y: gameVars.halfHeight - 55,
		scaleX: 400,
		scaleY: 330,
		alpha: .001
	}), gameObjects.undoCreditsButton.disappear()
	setTimeout(() => {
		gameObjects.clownWelcomePic.setFrame('framesEnter1');
		playSound('click4', undefined, 0.25)
	}, 3900)

}

function setupInstructionsStand(e) {
	gameObjects.museumStand = new Button(e, gameObjects.gameCtnr1, () => {
		onStandClick(e)
	}, {
		atlas: "buttons",
		ref: "stand_normal",
		x: 367,
		y: 945
	}, {
		atlas: "buttons",
		ref: "stand_hover",
		preload: !0
	}, {
		atlas: "buttons",
		ref: "stand_hover",
		preload: !0
	}, {
		atlas: "buttons",
		ref: "stand_disabled",
		preload: !0
	}), gameObjects.museumStand.setOrigin(.5, 1)
}

function onTurnOnPower() {
	gameVars.finishedDarkPoint || (gameVars.darkPoint ? (gameVars.finishedDarkPoint = !0, playSoundOnce("flickeron"), gameObjects.powerSwitch.setState("disable"), gameObjects.candleDark.alpha = .25, gameObjects.candleBright.alpha = 0, setTimeout(() => {
		gameObjects.candleDark.alpha = 1, setTimeout(() => {
			gameObjects.candleDark.alpha = .25, setTimeout(() => {
				gameObjects.candleDark.alpha = .9, setTimeout(() => {
					gameVars.darkPoint = !1, gameVars.horrorPoint = !0, gameObjects.candleDark.alpha = 0, gameObjects.candleBright.alpha = 0, gameObjects.flashDim.alpha = 0
				}, 200)
			}, 75)
		}, 250)
	}, 50), gameObjects.moveRightBtn.setOnMouseUpFunc(() => {
		updateInfoText("You have stayed long enough. You should EXIT. ", 4500)
	})) : updateInfoText("The lights are working fine."))
}

function initDarkSequence(e) {
	addDarkToExhibit(), enableMoveLeftButton(), gameVars.baseSway = .03, enableFlashlight(!0), gameVars.darkPoint = !0, messageBus.publish("startDarkSequence"), gameObjects.moveRightBtn.setOnMouseUpFunc(() => {
		updateInfoText("It's too dark to go forward. \n<- Head left to EXIT.", 5e3)
	})
}

function enableFlashlight(e) {
	let t = e ? .9 : 0;
	e && (gameVars.initialExtraDark = 15), gameObjects.candleDark.alpha = t, gameObjects.candleBright.alpha = t
}

function makeWelcomeImage(e, t = !1) {
	let a = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight - 50, "loadingSS", e);
	return gameObjects.loadingWelcomes[e] = a, t && (gameObjectsTemp.loadingWelcomeFollower && gameObjectsTemp.loadingWelcomeFollower.destroy(), gameObjectsTemp.loadingWelcomeFollower = a, gameObjects.loadingCntr.add(a)), a
}

function addToUpdateFuncList(e) {
	e ? updateFuncList.push(e) : console.warn("invalid function added")
}

function removeFromUpdateFuncList(e) {
	let t = updateFuncList.indexOf(e);
	t > -1 && updateFuncList.splice(t, 1)
}

function createKey(e, t, a, s, o = !0, c) {
	let n;
	return playSound("keyfound"), (n = new Button(globalScene, s, () => {
		n.destroy(), o ? playSound("keyget") : playSound("keygetred"), tempFreeze(500), gameObjects.exhibit.setCantMoveIdx(a, !1), setTimeout(() => {
			enableMoveButtons(true), c && c()
		}, 100)
	}, {
		atlas: "buttons",
		ref: o ? "key_yellow" : "key_red",
		x: e,
		y: t - 9
	}, {
		atlas: "buttons",
		ref: o ? "key_yellow_glow" : "key_red_glow"
	})).setScale(.98), setTimeout(() => {
		n.setScale(1.02), n.setPos(n.getPosX(), n.getPosY() + 5), setTimeout(() => {
			n.setScale(1), n.setPos(n.getPosX(), n.getPosY() + 2.5), setTimeout(() => {
				n.setPos(n.getPosX(), n.getPosY() + 1), setTimeout(() => {
					n.setPos(n.getPosX(), n.getPosY() + .5)
				}, 30)
			}, 30)
		}, 30)
	}, 30), n
}

function initFlashScreens() {
	gameObjects.flashScreens = [];
	for (let e = 0; e < 20; e++) {
		let t = "static" + e,
			a = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, "flashScreens", t);
		a.scaleX = 1.5, a.scaleY = 1.5, a.setDepth(9999), a.alpha = 0, gameObjects.flashScreens[e] = a
	}
}

function initStaticScreens() {
	gameObjects.staticScreens = [];
	for (let e = 0; e < 4; e++) {
		let t = "static" + e,
			a = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, "staticScreens", t);
		a.scaleX = 1.5, a.scaleY = 1.5, a.setDepth(9999), a.alpha = 0, gameObjects.staticScreens[e] = a
	}
	gameObjects.staticLite = [];
	for (let e = 0; e < 12; e++) {
		gameObjects.staticLite[e] = [];
		let t = "staticlite" + e,
			a = globalScene.add.image(0, 0, "staticLite", t);
		a.isFree = !0, a.setDepth(9999), a.alpha = 0, gameObjects.staticLite[e].push(a)
	}
}

function showFlashArr(e, t) {
	if (e.length > 0) {
		let a = e[0];
		newArr = e.slice(1), gameObjects.flashScreens[a].alpha = 1, setTimeout(() => {
			gameObjects.flashScreens[a].alpha = 0, showFlashArr(newArr, t)
		}, 50)
	} else t && t()
}

function showFlashRand(e = 1, t, a, s = 1, o) {
	if (o) {
		let e = "click" + (Math.floor(4 * Math.random()) + 1);
		gameObjects.sounds[e].play({
			volume: .15 * Math.random() + .15 * s
		})
	}
	if (e >= 1) {
		let c = Math.floor(7 * Math.random()) + 5;
		c === t && (c = Math.floor(7 * Math.random()) + 5), gameObjects.flashScreens[c].alpha = s, setTimeout(() => {
			gameObjects.flashScreens[c].alpha = 0, showFlashRand(e - 1, c, a, s, o)
		}, 40)
	} else a && a()
}

function showStaticRand(e = 1, t = !1, a, s = 1, o = !0) {
	if (o) {
		let e = "click" + (Math.floor(4 * Math.random()) + 1);
		gameObjects.sounds[e].play({
			volume: .1 * Math.random() + .1 * s
		})
	}
	if (e >= 1) {
		let o = Math.floor(Math.random() * gameObjects.staticScreens.length);
		gameObjects.staticScreens[o].alpha = 1 === e ? Math.min(.2, s) : Math.min(1, s + .2 * (Math.random() - .5)), gameObjects.staticScreens[o].scaleX = t ? -1.5 - .1 * Math.random : 1.5 + .1 * Math.random(), setTimeout(() => {
			gameObjects.staticScreens[o].alpha = 0, showStaticRand(e - 1, !t, a, s, !1)
		}, 30)
	} else void 0 !== a && a()
}

function showStaticLite(e = 4, t = 4, a = 2, s = .15) {
	if (0 === e) return;
	let o = 0;
	for (; o < t;) o++, showStaticLiteObj(a, s);
	setTimeout(() => {
		showStaticLite(e - 1, t, a, s)
	}, 50)
}

function showStaticLiteObj(e, t) {
	let a = Math.floor(12 * Math.random()),
		s = a <= 5,
		o = gameObjects.staticLite[a],
		c = null;
	for (let e = 0; e < o.length && !(c = o[e]).isFree; e++);
	if (null == c) {
		let e = "staticlite" + a;
		(c = globalScene.add.image(0, 0, "staticLite", e)).setDepth(9999), gameObjects.staticLite[a].push(c)
	}
	c.alpha = .25 * t + Math.random() * t * .5, c.isFree = !1, c.x = Math.random() * gameVars.width * 1.1 - 50, c.y = Math.random() * gameVars.height * 1.1 - 50;
	let n = Math.abs(gameVars.halfWidth - c.x),
		m = Math.abs(gameVars.halfHeight - c.y);
	distFromCenterUnit = .5 + n / gameVars.halfWidth + m / gameVars.halfHeight, c.alpha *= distFromCenterUnit, c.scaleX = e, c.scaleY = e;
	let i = Math.random() > .5 ? -1 : 1;
	if (s) c.scaleX *= 1 + 5 * Math.random() * i, c.scaleY *= 1 + Math.random();
	else {
		let e = .75 * Math.random();
		c.scaleX *= .5 + e * i, c.scaleY *= .5 + e, c.rotation = 6.28 * Math.random()
	}
	let g = 10 + 100 * Math.random();
	setTimeout(() => {
		c.alpha = 0, c.isFree = !0
	}, g)
}

function zoomTemp(e) {
	globalScene.cameras.main.setZoom(e), globalScene.tweens.add({
		targets: globalScene.cameras.main,
		zoom: 1,
		ease: "Cubic.easeOut",
		duration: 400
	})
}

function addScreenShake(e, t) {
	globalScene.cameras.main.x += e, globalScene.cameras.main.y += e
}

function showFlashCustom(e) {
	globalScene.add.image(0, 0, "imgName")
}

function flipEntryLights(e = 1) {
	let t = gameVars.horrorPoint ? 20 + 150 * Math.random() : 75;
	"brighten" === gameObjects.entrance.entryLights1.status ? (gameObjects.entrance.entryLights1.counter += e, gameObjects.entrance.entryLights1.counter > t && (gameObjects.entrance.entryLights1.counter = 0, gameObjects.entrance.entryLights1.status = "dim", gameObjects.entrance.entryLights1.alpha = .1, gameObjects.entrance.entryLights2.alpha = .85, setTimeout(() => {
		gameObjects.entrance.entryLights1.alpha = 0, gameObjects.entrance.entryLights2.alpha = 1
	}, 60))) : "dim" === gameObjects.entrance.entryLights1.status && (gameObjects.entrance.entryLights1.counter += e, gameObjects.entrance.entryLights1.counter > t && (gameObjects.entrance.entryLights1.counter = 0, gameObjects.entrance.entryLights1.status = "brighten", gameObjects.entrance.entryLights1.alpha = .85, gameObjects.entrance.entryLights2.alpha = .1, setTimeout(() => {
		gameObjects.entrance.entryLights1.alpha = 1, gameObjects.entrance.entryLights2.alpha = 0
	}, 60)))
}

function animateVoidGlow() {
	let e = .025 * (gameObjects.standDisplay.getScaleY() - 1);
	gameObjectsTemp.voidGlow.scaleX = gameObjects.standDisplay.getScaleX() * (.998 + .005 * Math.random()), gameObjectsTemp.voidGlow.scaleY = gameObjects.standDisplay.getScaleY() * (.998 + .006 * Math.random()) * (e + 1), gameObjectsTemp.voidGlow.alpha -= .2, gameObjectsTemp.voidGlow.alpha < .01 && (gameObjectsTemp.voidGlow.alpha = 1)
}

function ftueMoveButton(e = !1) {
	globalScene.tweens.timeline({
		targets: [gameObjects.moveRightBtnHighlight, gameObjects.moveLeftBtnHighlight],
		tweens: [{
			alpha: e ? .75 : 1,
			ease: "Cubic.easeIn",
			duration: 800
		}, {
			alpha: 0,
			ease: "Quad.easeOut",
			duration: 2e3,
			onComplete: () => {
				setTimeout(() => {
					gameVarsTemp.hasMoved || ftueMoveButton(!0)
				}, 7e3)
			}
		}]
	})
}

function updateMusicBox(e) {
	if (gameObjectsTemp.boxBroken || (gameObjects.musicBoxHandle.x = gameObjects.musicBox.x, gameObjects.musicBoxHandle.y = gameObjects.musicBox.y + 15), 1 === gameVars.lateUpdateCurrentScene && 1 === gameObjects.exhibit.getCurrentScene() && gameObjects.musicBoxNote2.alpha > .01) {
		let t = gameObjects.musicBoxNote2.velY * e;
		gameObjects.musicBoxNote2.y += t, gameObjects.musicBoxNote2.x -= t, gameObjects.musicBoxNote2.velY *= 1 - .06 * e, gameObjects.musicBoxNote2.velY > -.5 && (gameObjects.musicBoxNote2.scaleY = .85 * gameObjects.musicBoxNote2.scaleY - .1, gameObjects.musicBoxNote2.scaleX = gameObjects.musicBoxNote2.scaleY, gameObjects.musicBoxNote2.scaleY <= .1 && (gameObjects.musicBoxNote2.scaleX = 1, gameObjects.musicBoxNote2.scaleY = 1, gameObjects.musicBoxNote2.velY = -6, gameObjects.musicBoxNote2.x = gameObjects.musicBoxNote2.origX, gameObjects.musicBoxNote2.y = gameObjects.musicBoxNote2.origY + 150 * (Math.random() - .5)))
	} else gameObjects.musicBoxNote2.scaleX = 0, gameObjects.musicBoxNote2.scaleY = 0;
	(0 === gameVars.lateUpdateCurrentScene || 0 === gameObjects.exhibit.getCurrentScene() && gameObjects.musicBoxNote.alpha > .01) && (gameObjectsTemp.stoppedMusic || (gameObjects.musicBoxHandle.rotation += .01 * e), gameObjects.musicBoxNote.y += gameObjects.musicBoxNote.velY * e, gameObjects.musicBoxNote.velY *= 1 - .08 * e, gameObjects.musicBoxNote.velY > -.445 && (gameObjects.musicBoxNote.scaleY = .85 * gameObjects.musicBoxNote.scaleY - .1, gameObjects.musicBoxNote.scaleX = gameObjects.musicBoxNote.scaleY, gameObjects.musicBoxNote.scaleY <= .1 && (gameObjects.musicBoxNote.scaleX = 1, gameObjects.musicBoxNote.scaleY = 1, gameObjects.musicBoxNote.velY = -2.5, gameObjects.musicBoxNote.x = gameObjects.musicBoxNote.origX + 70 * (Math.random() - .5), gameObjects.musicBoxNote.y = gameObjects.musicBoxNote.origY)))
}