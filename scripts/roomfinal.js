function setupRoomFinal(scene, roomIndex, roomContainer) {
	gameObjects.exhibit.setBackgroundAtIndex(roomIndex, 'bgs', 'bg4');
	let tempDoor = scene.add.image(0, 507, 'buttons', 'exitDoorWhite');
	roomContainer.add(tempDoor);
	gameObjects.exitDoorFinal = new Button(
		scene,
		roomContainer,
		() => { onFinalExitClick(scene) },
		{
			"atlas": "buttons",
			"ref": "exitDoorNormal",
			"x": -210,
			"y": 507
		},
		{
			"atlas": "buttons",
			"ref": "exitDoorOver"
		},
		{
			"atlas": "buttons",
			"ref": "exitDoorOver"
		},
		{
			"atlas": "buttons",
			"ref": "exitDoorNormal"
		}
	);
	gameObjects.exitDoorFinal.setOrigin(0, 0.5);
}

function onFinalExitClick(scene) {
	if (typeof messageBus !== "undefined" && messageBus) {
		messageBus.publish("doorOpened");
	}
	gameObjects.exitDoorFinal.setState('disable');
	gameDelay(() => {
		playSound('dooropen2');
	}, 50);
	scene.tweens.add({
		targets: scene.cameras.main,
		zoom: 4.1,
		ease: "Quad.easeIn",
		duration: 6250,
		onComplete: () => {
			scene.cameras.main.setZoom(1);
			let fakeBackground = scene.add.image(0, gameVars.halfHeight, 'misc', 'scrollworld');
			fakeBackground.x = gameVars.width - fakeBackground.width * 0.5;
			fakeBackground.y = fakeBackground.height * 0.5;
			let whiteScreen = scene.add.image(gameVars.halfWidth, gameVars.halfHeight, 'whitePixel');
			whiteScreen.scaleX = 1000; whiteScreen.scaleY = 800;
			scene.tweens.add({
				targets: whiteScreen,
				alpha: 0,
				duration: 2200
			});
			scene.tweens.add({
				targets: whiteScreen,
				scaleX: whiteScreen.scaleX + 1,
				duration: 2400,
				onComplete: () => {
					runEpilogue(fakeBackground);
				}
			});

			scene.tweens.add({
				targets: fakeBackground,
				y: fakeBackground.y - (fakeBackground.height - gameVars.height),
				duration: 25000
			});
		}
	});
	gameObjects.exitDoorFinal.tweenScale({
		scaleX: 0.96,
		duration: 100,
		ease: "Cubic.easeOut",
		onComplete: () => {
			gameObjects.exitDoorFinal.tweenScale({
				scaleX: 0.2,
				duration: 5000,
				ease: "Cubic.easeIn",
				onComplete: () => {
					gameObjects.exitDoorFinal.tweenScale({
						scaleX: 0.15,
						duration: 500,
						ease: "Cubic.easeOut",
						onComplete: () => {
						}
					});
				}
			});
		}
	});
}

function runEpilogue(background) {
	let clown = globalScene.add.image(gameVars.halfWidth + 95, 450, "roomClown", 'clowndoor');

	let clownFrame = globalScene.add.image(gameVars.halfWidth - 1200, 457, 'buttons', 'exitDoorOpenSurround');

	let clownhand = globalScene.add.image(gameVars.halfWidth + 40, 565, "roomClown", 'clownhand');
	clown.scaleX = -0.3;
	clown.scaleY = 0.72;
	clown.rotation = -0.9;
	clown.visible = false;
	clownhand.visible = false;

	let box = globalScene.add.image(gameVars.halfWidth + 100, 774, "buttons", 'musicBox');
	box.visible = false;

	let clownDoor = globalScene.add.image(gameVars.halfWidth - 1200 + 200, 507, 'buttons', 'exitDoorNormal');
	clownDoor.setOrigin(0, 0.5);
	clownDoor.scaleX = -0.6;

	globalScene.tweens.add({
		targets: background,
		x: background.x + 1200,
		ease: 'Cubic.easeInOut',
		duration: 3200
	});
	globalScene.tweens.add({
		targets: [clownDoor, clownFrame],
		x: '+=1200',
		ease: 'Cubic.easeInOut',
		duration: 3200,
		onComplete: () => {
			clown.visible = true;
			clownhand.visible = true;
			globalScene.tweens.add({
				targets: clown,
				x: '-=125',
				scaleX: -0.71,
				ease: 'Cubic.easeOut',
				duration: 1000,
				onComplete: () => {
					if (!gameObjectsTemp.boxBroken) {
						box.visible = true;
						globalScene.tweens.add({
							targets: [box],
							x: '-=350',
							ease: 'Cubic.easeOut',
							duration: 1000,
							onComplete: () => {
								playSound('g6');
							}
						});
					}

					globalScene.tweens.add({
						targets: clownhand,
						rotation: -0.25,
						yoyo: true,
						ease: 'Sine.easeInOut',
						duration: 400,
						repeat: 1,
						onComplete: () => {
							// clown closes door
							globalScene.tweens.add({
								targets: [clownhand, clown],
								scaleX: '-=0.1',
								x: '+=65',
								ease: 'Cubic.easeIn',
								duration: 350
							});
							globalScene.tweens.add({
								targets: clownDoor,
								scaleX: -1,
								ease: 'Quad.easeIn',
								duration: 350,
								onComplete: () => {
									playSound('doorslam');
									zoomTemp(1.04);
									showStaticLite(6, 25, 4, 1);
									globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, 'theEnd');
									gameDelay(() => {

										let background = document.getElementById('background');
										background.style.opacity = '0';
										let leftborder = document.getElementById('leftborder');
										if (leftborder) leftborder.style.opacity = '0';
										let rightborder = document.getElementById('rightborder');
										if (rightborder) rightborder.style.opacity = '0';
										let topborder = document.getElementById('topborder');
										if (topborder) topborder.style.opacity = '0';
										let bottomborder = document.getElementById('bottomborder');
										if (bottomborder) bottomborder.style.opacity = '0';

										let gameEndScreen = globalScene.add.image(gameVars.halfWidth, gameVars.halfHeight, 'blackPixel');
										gameEndScreen.scaleX = 999;
										gameEndScreen.scaleY = 999;
										gameObjectsTemp.endText = globalScene.add.text(100, 80, "Game by Maxim Tsai", { fontFamily: 'Times New Roman', fontSize: 30, color: '#ffffff', align: 'left' });
										gameObjectsTemp.endText.alpha = 0;
										globalScene.tweens.add({
											targets: gameObjectsTemp.endText,
											alpha: 1,
											duration: 900,
											onComplete: () => {
												gameObjectsTemp.endText2 = globalScene.add.text(100, 140, "Art by Theresa Kao", { fontFamily: 'Times New Roman', fontSize: 30, color: '#ffffff', align: 'left' });
												gameObjectsTemp.endText2.alpha = 0;
												globalScene.tweens.add({
													targets: gameObjectsTemp.endText2,
													alpha: 1,
													duration: 900,
													onComplete: () => {
														gameObjectsTemp.endText3 = globalScene.add.text(100, 200, "Special Helpers: @hby_stuff, Ester Tsai, Yuan Lin, Peikun Tsai", { fontFamily: 'Times New Roman', fontSize: 30, color: '#ffffff', align: 'left' });
														gameObjectsTemp.endText3.alpha = 0;
														globalScene.tweens.add({
															targets: gameObjectsTemp.endText3,
															alpha: 1,
															duration: 900,
															onComplete: () => {
																let finalText = "Random game trivia:\n\n";
																finalText += "- Engine used: Phaser 3\n";
																finalText += "- Development Time: 4 months\n";
																finalText += "- Number of Image Files: ~320\n";
																finalText += "- Number of Audio Files Files: ~105\n";
																finalText += "- Trickiest thing to draw: Jack in the Box's neck\n";
																// finalText += "- Click the stars in the Welcome lobby in the order '1, 3, 2, 1, 5' to unlock developer notes\n";

																gameObjectsTemp.endText5 = globalScene.add.text(100, 380, finalText, { fontFamily: 'Times New Roman', fontSize: 26, color: '#ffffff', align: 'left' });
																gameObjectsTemp.endText5.setOrigin(0, 0.5);
																gameObjectsTemp.endText5.alpha = 0;
																globalScene.tweens.add({
																	targets: gameObjectsTemp.endText5,
																	alpha: 1,
																	duration: 900,
																	onComplete: () => {
																		gameObjectsTemp.lastText = globalScene.add.text(100, 530, "Thank you for playing", { fontFamily: 'Times New Roman', fontSize: 48, color: '#ffffff', align: 'center' });
																		gameObjectsTemp.lastText.setOrigin(0, 0.5);
																		gameObjectsTemp.lastText.alpha = 0;
																		globalScene.tweens.add({
																			targets: gameObjectsTemp.lastText,
																			alpha: 1,
																			duration: 2500,
																			delay: 2500
																		});
																		gameDelay(() => {

																			gameObjectsTemp.replayText = globalScene.add.text(100, 700, 'REPLAY', { fontFamily: 'Times New Roman', fontSize: 28, color: '#ffffff', align: 'right' });
																			gameObjectsTemp.replayText.setOrigin(0, 0.5);
																			gameObjectsTemp.replayText.alpha = 0.05;
																			globalScene.tweens.add({
																				targets: gameObjectsTemp.replayText,
																				alpha: 0.6,
																				duration: 2000
																			});
																			let replay = new Button(
																				globalScene,
																				undefined,
																				() => {
																					const restartGame = () => {
																						if (globalScene && globalScene.sound) {
																							globalScene.sound.stopAll();
																						}
																						gameVars = {
																							bloodHandActive: false,
																							hintCount: (gameVars && gameVars.hintCount !== undefined) ? gameVars.hintCount : 2,
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
																							soundMult: 1,
																							smallWindow: !1
																						};
																						oneTimeScares = {};
																						gameObjectsTemp = {};
																						gameVarsTemp = {
																							darkFlickerCountdown: 1e3
																						};
																						gameObjects = {
																							buttonList: [],
																							draggedObj: null,
																							loadingWelcomes: [],
																							noteList: [],
																							starPressSequence: []
																						};
																						updateFuncList = [];
																						keyPosX = null;
																						keyPosY = null;
																						keyRoomIdx = null;

																						// These live at module scope in main.js and survive a scene
																						// restart, so they must be cleared by hand. Leaving them set
																						// strands the replay on the loading screen with no start
																						// button: bootLoadHandled makes onLoaderBatchComplete return
																						// early, and onLoadComplete itself begins with
																						// `if (deferredAudioLoaded) return`. deferredAudioLoaded also
																						// gates loadDeferredAudio, so without this the 51 deferred
																						// sounds never get re-registered after a replay.
																						bootLoadHandled = false;
																						deferredAudioLoaded = false;

																						// The scene shutdown tears the loader's listeners down, but the
																						// `installed` latch would stop them being re-registered, which
																						// silently disables asset retries for the whole replay.
																						assetRetry.installed = false;
																						assetRetry.counts = {};
																						assetRetry.failedReqs = {};
																						assetRetry.pending = 0;

																						// No gameplayStart() here - this returns the player to the
																						// loading/menu screen. startGame() raises it when they actually
																						// begin playing again.

																						if (globalScene && globalScene.scene) {
																							globalScene.scene.restart();
																						} else {
																							location.reload();
																						}
																					};
																					if (window.GameSDK && typeof window.GameSDK.showAd === 'function') {
																						window.GameSDK.showAd('midgame', { onFinished: restartGame });
																					} else {
																						restartGame();
																					}
																				},
																				{
																					"ref": "whitePixel",
																					"x": 195,
																					"y": 700,
																					scaleX: 390,
																					scaleY: 40,
																					alpha: 0.001
																				}
																			);

																			replay.setOnHoverFunc(() => {
																				if (gameObjectsTemp && gameObjectsTemp.replayText) gameObjectsTemp.replayText.alpha = 1;
																			});
																			replay.setOnHoverOutFunc(() => {
																				if (gameObjectsTemp && gameObjectsTemp.replayText) gameObjectsTemp.replayText.alpha = 0.7;
																			});

																		}, 2500);
																	}
																});
															}
														});
													}
												});
											}
										})
										if (!gameObjectsTemp.boxBroken) {
											playSound('gladiator0');
											gameObjects.sounds['gladiator0'].volume = 1 * gameVars.soundMult;
										} else {
											tweenVolume('gladiatorx', 0.6);
										}
									}, 325);
								}
							});
						}
					});
				}
			});
			globalScene.tweens.add({
				targets: [clownhand],
				x: '-=130',
				ease: 'Cubic.easeOut',
				duration: 1250
			});

		}
	});
}
