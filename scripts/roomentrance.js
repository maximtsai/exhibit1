function setupRoomEntrance(e, t, a) {
    gameObjects.scenex = e;
    gameObjects.contextx = a;
    gameObjects.exhibit.setForegroundAtIndex(1, "menu", "welcome", gameVars.halfHeight - 55), gameObjects.entrance = {
        lines: []
    }, gameObjects.entrance.welcomeBtn = new Button(e, a, () => {
        if (gameVars.horrorPoint && !gameObjects.entrance.showedHorrorText) {
            gameObjects.entrance.showedHorrorText = !0, showInfoTextLoop([{
                text: "Welcome to the Exhibit of Smiles! :)",
                time: 750
            }, {
                text: "Welcome to the Exhibit of S̶m̵i̷l̸e̵s̵!! :)",
                time: 100
            }, {
                text: "Welcome to the Exhibit of S̶m̵i̷l̸e̵s̵!! :)",
                time: 25
            }, {
                text: "Welcome to the Exhibit of S̴o̵r̷r̷o̵w̴s̵!̶ :̵(",
                time: 25
            }, {
                text: "Welcome to the Exhibit of S̷̢͛m̷͕͒i̷̜̍l̵͓̏e̵̳̿s̵͈͒!̸͎̄ ̶̩͑:̶̛̣(̶͚͂",
                time: 25
            }, {
                text: "Welcome to the Exhibit of Smiles! :)",
                time: 100
            }, {
                text: "Welcome to the Exhibit of S̵o̶r̸r̷o̸w̸s̵!̴:|",
                time: 50
            }, {
                text: "Welcome to the Exhibit of Sorrows   ",
                time: 1750
            }])
        } else if (gameVars.horrorPoint) {
            showInfoTextLoop([{
                text: "Welcome to the Exhibit of S̶m̵i̷l̸e̵s̵!! :)",
                time: 100
            }, {
                text: "Welcome to the Exhibit of Smiles! :)",
                time: 200
            }, {
                text: "Welcome to the Exhibit of S̴o̵r̷r̷o̵w̴s̵!̶ :̵(",
                time: 50
            }, {
                text: "Welcome to the Exhibit of Smiles! :)",
                time: 100
            }, {
                text: "Welcome to the Exhibit of S̵o̶r̸r̷o̸w̸s̵!̴:|",
                time: 100
            }, {
                text: "Welcome to the Exhibit of Sorrows   ",
                time: 300
            }, {
                text: "Welcome to the Exhibit of S̷̢͛m̷͕͒i̷̜̍l̵͓̏e̵̿s̵͈͒!̸͎̄",
                time: 50
            }, {
                text: " ",
                time: 550
            }])
        } else gameVarsTemp.brokeMusicBox ? updateInfoText("Welcome to the Exhibit of Smiles.") : updateInfoText("Welcome to the Exhibit of Smiles! :)")
    }, {
        atlas: "menu",
        ref: "welcomeText",
        x: -6,
        y: gameVars.halfHeight - 80,
        alpha: 1
    }, {
        atlas: "menu",
        ref: "welcomeTextGlow",
        preload: !0
    }, {
        atlas: "menu",
        ref: "welcomeTextGlow",
        preload: !0
    }, {
        atlas: "menu",
        ref: "welcomeText",
        preload: !0
    }), gameObjects.entrance.entryLights1 = e.add.image(-3, gameVars.halfHeight - 57, "menu", "entrancelights1"), gameObjects.entrance.entryLights1.counter = 0, gameObjects.entrance.entryLights1.status = "brighten", gameObjects.entrance.entryLights2 = e.add.image(-3, gameVars.halfHeight - 57, "menu", "entrancelights2"), gameObjects.entrance.entryLights1.alpha = 0, gameObjects.entrance.entryLights2.alpha = 0, a.add(gameObjects.entrance.entryLights1), a.add(gameObjects.entrance.entryLights2), gameObjects.entrance.creditsMenu = e.add.image(0, gameVars.halfHeight - 55, "menu", "credits"), gameObjects.entrance.creditsMenu.alpha = 0, a.add(gameObjects.entrance.creditsMenu);
    let s = e.add.image(-490, -200, "blackPixel").setOrigin(.5, 0).setScale(2, 200);
    a.add(s), gameObjects.entrance.lines.push(s);
    let o = e.add.image(-270, -330, "blackPixel").setOrigin(.5, 0).setScale(2, 200);
    a.add(o), gameObjects.entrance.lines.push(o);
    let i = e.add.image(-20, -280, "blackPixel").setOrigin(.5, 0).setScale(2, 200);
    a.add(i), gameObjects.entrance.lines.push(i);
    let n = e.add.image(320, -190, "blackPixel").setOrigin(.5, 0).setScale(2, 200);
    a.add(n), gameObjects.entrance.lines.push(n);
    let r = e.add.image(500, -310, "blackPixel").setOrigin(.5, 0).setScale(2, 200);


	let asdfJack = e.add.image(330, -300, "roomJack", "doll").setRotation(-3.12).setScale(0.8);
	a.add(asdfJack);

    gameObjects.crawlClown = e.add.sprite(40, 453, "roomClown2", "frame0000.png").setScale(-2, 2).setVisible(false);
    a.add(gameObjects.crawlClown);

    e.anims.create({
        key: 'clownCrawl',
        frames: e.anims.generateFrameNames('roomClown2', {
            prefix: 'frame',
            suffix: '.png',
            start: 0,
            end: 7,
            zeroPad: 4,
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
            		let sfx = playSound('nyaha', undefined, 0.05);
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
	}, 18000)
    a.add(r), gameObjects.entrance.lines.push(r), gameObjectsTemp.starReplace = createStarButton(s, a, "star1", 1), createStarButton(o, a, "star2", 2), createStarButton(i, a, "star3", 3), createStarButton(n, a, "star2", 4), createStarButton(r, a, "star3", 5), messageBus.subscribe("exhibitMove", e => {
        1 === e ? gameVars.horrorPoint ? gameObjectsTemp.entranceFlicker || (gameObjectsTemp.entranceFlicker = !0, setTimeout(() => {
            gameObjects.generalDarkness.alpha = .04, setTimeout(() => {
                gameObjects.generalDarkness.alpha = 0, setTimeout(() => {
                    gameObjects.generalDarkness.alpha = .07, setTimeout(() => {
                        gameObjects.generalDarkness.alpha = 0, gameVarsTemp.startDarkFlicker = !0
                    }, 20)
                }, 1800)
            }, 150)
        }, 2400)) : (tweenVolume("gladiator0", .85), gameVars.darkPoint && (tweenVolume("gladiator1", 0), tweenVolume("gladiator2", 1))) : 0 === e && (gameVars.horrorPoint || (tweenVolume("gladiator0", 1), gameVars.darkPoint && (tweenVolume("gladiator1", 0, 1500), tweenVolume("gladiator2", 0, 1500), setTimeout(() => {
            gameObjects.musicBoxNote.alpha = 0, gameObjects.musicBoxNote2.alpha = 0, gameObjectsTemp.stoppedMusic = !0, gameObjects.sounds.gladiator1.stop(), gameObjects.sounds.gladiator2.stop()
        }, 1500))))

        if (1 === e && gameVars.darkPoint && !gameVars.clownRun) {
            gameVars.clownRun = true;
            setTimeout(() => {
                gameObjects.crawlClown.setVisible(true);
                gameObjects.crawlClown.play('clownCrawl')
                playSound("clownhorn", undefined, 0.65);
            }, 2300)
        }
    })
}

function createStarButton(e, t, a, s) {
    let o;
    return o = new Button(globalScene, t, () => {
        if (!o.isAnimating) {
            if (o.isAnimating = !0, gameVars.horrorPoint)
                if (gameVarsTemp.pauseStarScare) gameVarsTemp.pauseStarScare = !1;
                else {
                    gameVarsTemp.pauseStarScare = !0, o.destroy();
                    let a = "starx" + s,
                        i = "shout" + s,
                        n = globalScene.add.image(e.x, e.y + 400, "menu", a);
                    t.add(n), playDeathRattle(n), playSound(i)
                } o.tweenScale({
                scaleX: -1 * o.getScaleX(),
                duration: 700 + 300 * Math.random(),
                ease: "Sine.easeInOut",
                onComplete: () => {
                    o.isAnimating = !1
                }
            })
        }
    }, {
        atlas: "menu",
        ref: a,
        x: e.x,
        y: e.y + 400
    }, {
        atlas: "menu",
        ref: a
    })
}

function showInfoTextLoop(e, t = 0, a = !0) {
    if (e.length > 0) {
        a || playSound("lidslam");
        let s = e.shift(),
            o = t + s.time,
            i = 3500 - o;
        updateInfoText(s.text, i, a), setTimeout(() => {
            showInfoTextLoop(e, o, a)
        }, s.time)
    }
}

function playDeathRattle(e, t = 1) {
    globalScene.tweens.timeline({
        targets: e,
        tweens: [{
            scaleY: 1.2,
            duration: 40,
            ease: "Cubic.easeOut"
        }, {
            scaleY: .8,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 1.25,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: .8,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 1.25,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: .8,
            duration: 80,
            ease: "Cubic.easeInOut"
        }, {
            scaleY: 1.25,
            duration: 80,
            ease: "Cubic.easeInOut",
            onComplete: () => {
                e.destroy()
            }
        }]
    })
}