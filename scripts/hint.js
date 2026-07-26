/**
 * @fileoverview Hint system module for managing hint counter, badge display, and rewarded ads.
 */

if (typeof gameVars !== "undefined" && gameVars.hintCount === undefined) {
    gameVars.hintCount = 6;
}

class HintHand {
    constructor(scene, container, x = 0, y = 0, initialFrame = "hinthandopen", frames = ["hinthandopen", "hinthandclose", "hinthandpointer", "hinthandbroken"]) {
        this.scene = scene;
        this.container = container;
        this.x = x;
        this.y = y;
        this.frames = frames;
        this.currentIndex = 0;
        this.sprite = scene.add.sprite(x, y, "roomHandy", initialFrame);
        if (container) {
            container.add(this.sprite);
        }
        this.loopTimer = null;
    }

    setState(indexOrFrame) {
        if (typeof indexOrFrame === "number") {
            this.currentIndex = (indexOrFrame % this.frames.length + this.frames.length) % this.frames.length;
            this.sprite.setFrame(this.frames[this.currentIndex]);
        } else if (typeof indexOrFrame === "string") {
            let idx = this.frames.indexOf(indexOrFrame);
            if (idx !== -1) {
                this.currentIndex = idx;
            }
            this.sprite.setFrame(indexOrFrame);
        }
        return this;
    }

    nextState() {
        this.currentIndex = (this.currentIndex + 1) % this.frames.length;
        this.sprite.setFrame(this.frames[this.currentIndex]);
        return this.frames[this.currentIndex];
    }

    startLoop(intervalMs = 1500) {
        this.stopLoop();
        this.loopTimer = this.scene.time.addEvent({
            delay: intervalMs,
            callback: () => {
                this.nextState();
            },
            loop: true
        });
        return this;
    }

    stopLoop() {
        if (this.loopTimer) {
            this.loopTimer.remove();
            this.loopTimer = null;
        }
        return this;
    }

    setVisible(visible) {
        this.sprite.setVisible(visible);
        return this;
    }

    setFrame(frame) {
        this.setState(frame);
        return this;
    }

    destroy() {
        this.stopLoop();
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}

function getMajorState() {
    if (typeof gameVars === "undefined") return "normal";
    if (gameVars.horrorPoint) return "horror";
    if (gameVars.darkPoint) return "dark";
    return "normal";
}

let globalActiveHintCleanup = null;

function clearActiveHintHand() {
    if (globalActiveHintCleanup) {
        globalActiveHintCleanup();
        globalActiveHintCleanup = null;
    }
}

function getMoveRightPos() {
    let x = (typeof gameObjects !== "undefined" && gameObjects && gameObjects.moveRightBtn)
        ? gameObjects.moveRightBtn.getPosX()
        : ((typeof gameVars !== "undefined") ? (gameVars.width - 22) : 1188);
    let y = (typeof gameObjects !== "undefined" && gameObjects && gameObjects.moveRightBtn)
        ? gameObjects.moveRightBtn.getPosY()
        : ((typeof gameVars !== "undefined") ? gameVars.halfHeight : 460);
    return { x, y };
}

function getMoveLeftPos() {
    let x = (typeof gameObjects !== "undefined" && gameObjects && gameObjects.moveLeftBtn)
        ? gameObjects.moveLeftBtn.getPosX()
        : 15;
    let y = (typeof gameObjects !== "undefined" && gameObjects && gameObjects.moveLeftBtn)
        ? gameObjects.moveLeftBtn.getPosY()
        : ((typeof gameVars !== "undefined") ? gameVars.halfHeight : 460);
    return { x, y };
}

function isMoveRightEnabled() {
    if (typeof gameObjects === "undefined" || !gameObjects || !gameObjects.moveRightBtn) {
        return false;
    }
    return gameObjects.moveRightBtn.state !== "disable";
}

function isMoveLeftEnabled() {
    if (typeof gameObjects === "undefined" || !gameObjects || !gameObjects.moveLeftBtn) {
        return false;
    }
    return gameObjects.moveLeftBtn.state !== "disable";
}

function playPointHintAnimation(targetX, targetY, offsetY = -40, isLongPress = false) {
    clearActiveHintHand();

    if (typeof globalScene === "undefined" || !globalScene) return;

    let hintButtonX = (typeof gameVars !== "undefined") ? (gameVars.width - 140) : 1070;
    let hintButtonY = 51;
    let startX = hintButtonX - 40;
    let startY = hintButtonY + 40;

    let destinationX = targetX;
    let destinationY = targetY + offsetY;

    let hand = globalScene.add.sprite(startX, startY, "roomHandy", "hinthandopen");
    hand.setScrollFactor(0);
    hand.setDepth(1005);
    hand.setScale(0);
    hand.setAlpha(0);

    let isStopped = false;
    let activeTweens = [];
    let moveSub = null;
    let keySub = null;
    let keyClickSub = null;

    function stopAnimation() {
        if (isStopped) return;
        isStopped = true;
        activeTweens.forEach(t => {
            if (t && t.isPlaying) t.stop();
        });
        activeTweens = [];
        if (moveSub) {
            moveSub.unsubscribe();
            moveSub = null;
        }
        if (keySub) {
            keySub.unsubscribe();
            keySub = null;
        }
        if (keyClickSub) {
            keyClickSub.unsubscribe();
            keyClickSub = null;
        }
        if (hand) {
            hand.destroy();
            hand = null;
        }
    }

    if (typeof messageBus !== "undefined" && messageBus) {
        moveSub = messageBus.subscribe("exhibitMove", () => {
            stopAnimation();
        });
        keySub = messageBus.subscribe("keyAppeared", () => {
            stopAnimation();
        });
        keyClickSub = messageBus.subscribe("keyClicked", () => {
            stopAnimation();
        });
    }

    globalActiveHintCleanup = stopAnimation;

    function runAnimationCycle() {
        if (isStopped || !hand) return;

        hand.setFrame("hinthandopen");
        hand.setPosition(startX, startY);
        hand.setRotation(0);
        hand.setScale(0);
        hand.setAlpha(0);

        // 1. Pop in from start position (40px left and down from hint button)
        let popTween = globalScene.tweens.add({
            targets: hand,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 300,
            ease: "Back.easeOut",
            onComplete: () => {
                if (isStopped || !hand) return;

                // 2. Cubic.easeInOut tween to target position and turn into hinthandpointer
                let moveTween = globalScene.tweens.add({
                    targets: hand,
                    x: destinationX,
                    y: destinationY,
                    duration: 1000,
                    ease: "Cubic.easeInOut",
                    onStart: () => {
                        if (hand) hand.setFrame("hinthandpointer");
                    },
                    onComplete: () => {
                        if (isStopped || !hand) return;

                        // 3. Turn 165 degrees counter-clockwise (-165 degrees)
                        let rotateTween = globalScene.tweens.add({
                            targets: hand,
                            angle: -165,
                            duration: 350,
                            ease: "Cubic.easeOut",
                            onComplete: () => {
                                if (isStopped || !hand) return;

                                // 4. Press down short distance (+25px)
                                let holdDuration = isLongPress ? 500 : 0;
                                let pressDownTween = globalScene.tweens.add({
                                    targets: hand,
                                    y: destinationY + 25,
                                    duration: 120,
                                    ease: "Quad.easeOut",
                                    onComplete: () => {
                                        if (isStopped || !hand) return;

                                        // Hold down (500ms if long press), then bounce back up
                                        let releaseUpTween = globalScene.tweens.add({
                                            targets: hand,
                                            y: destinationY,
                                            duration: 120,
                                            delay: holdDuration,
                                            ease: "Quad.easeIn",
                                            onComplete: () => {
                                                if (isStopped || !hand) return;

                                                // 5. Fade away and repeat cycle
                                                let fadeTween = globalScene.tweens.add({
                                                    targets: hand,
                                                    alpha: 0,
                                                    duration: 400,
                                                    delay: 200,
                                                    onComplete: () => {
                                                        if (isStopped || !hand) return;

                                                        if (globalScene && globalScene.time) {
                                                            globalScene.time.delayedCall(500, () => {
                                                                if (!isStopped && hand) {
                                                                    runAnimationCycle();
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                                activeTweens.push(fadeTween);
                                            }
                                        });
                                        activeTweens.push(releaseUpTween);
                                    }
                                });
                                activeTweens.push(pressDownTween);
                            }
                        });
                        activeTweens.push(rotateTween);
                    }
                });
                activeTweens.push(moveTween);
            }
        });
        activeTweens.push(popTween);
    }

    runAnimationCycle();
}

function handleEntranceHint(state) {
    let rightPos = getMoveRightPos();
    let leftPos = getMoveLeftPos();

    switch (state) {
        case "normal":
        case "horror":
            playPointHintAnimation(rightPos.x, rightPos.y, -40, false);
            break;
        case "dark":
            playPointHintAnimation(leftPos.x, leftPos.y, -40, false);
            break;
    }
}

function handlePumpHint(state) {
    switch (state) {
        case "normal":
        case "horror":
            if (isMoveRightEnabled()) {
                let rightPos = getMoveRightPos();
                playPointHintAnimation(rightPos.x, rightPos.y, -40, false);
            } else {
                let fanX = ((typeof gameVars !== "undefined") ? gameVars.halfWidth : 605) - 240;
                let fanY = (typeof gameObjects !== "undefined" && gameObjects.roomPumpObjs && gameObjects.roomPumpObjs.button)
                    ? gameObjects.roomPumpObjs.button.y
                    : 492;
                playPointHintAnimation(fanX + 18, fanY, -110, true);
            }
            break;
        case "dark":
            if (isMoveLeftEnabled()) {
                let leftPos = getMoveLeftPos();
                playPointHintAnimation(leftPos.x, leftPos.y, -40, false);
            } else {
                let halfW = (typeof gameVars !== "undefined") ? gameVars.halfWidth : 605;
                let floatyX = halfW + 135;
                let floatyY = (typeof gameObjects !== "undefined" && gameObjects.roomPumpObjs && gameObjects.roomPumpObjs.floaty)
                    ? gameObjects.roomPumpObjs.floaty.y
                    : (((typeof gameVars !== "undefined") ? gameVars.halfHeight : 460) + 175);
                if (typeof gameObjects !== "undefined" && gameObjects.roomPumpObjs && gameObjects.roomPumpObjs.cleanupBtn && gameObjects.roomPumpObjs.cleanupBtn.getPosX() !== 0) {
                    floatyX = halfW + gameObjects.roomPumpObjs.cleanupBtn.getPosX();
                    floatyY = gameObjects.roomPumpObjs.cleanupBtn.getPosY();
                }
                playPointHintAnimation(floatyX, floatyY, -40, false);
            }
            break;
    }
}

function playGrabAtAnimation(targetX, targetY, onCompleteCallback) {
    clearActiveHintHand();

    if (typeof globalScene === "undefined" || !globalScene) return;

    let hintButtonX = (typeof gameVars !== "undefined") ? (gameVars.width - 140) : 1070;
    let hintButtonY = 51;
    let startX = hintButtonX - 40;
    let startY = hintButtonY + 40;

    let hand = globalScene.add.sprite(startX, startY, "roomHandy", "hinthandopen");
    hand.setScrollFactor(0);
    hand.setDepth(1005);
    hand.setScale(0);
    hand.setAlpha(0);

    let isStopped = false;
    let activeTweens = [];
    let moveSub = null;
    let keySub = null;

    function stopAnimation() {
        if (isStopped) return;
        isStopped = true;
        activeTweens.forEach(t => {
            if (t && t.isPlaying) t.stop();
        });
        activeTweens = [];
        if (moveSub) {
            moveSub.unsubscribe();
            moveSub = null;
        }
        if (keySub) {
            keySub.unsubscribe();
            keySub = null;
        }
        if (hand) {
            hand.destroy();
            hand = null;
        }
    }

    if (typeof messageBus !== "undefined" && messageBus) {
        moveSub = messageBus.subscribe("exhibitMove", stopAnimation);
        keySub = messageBus.subscribe("keyAppeared", stopAnimation);
    }

    globalActiveHintCleanup = stopAnimation;

    function runCycle() {
        if (isStopped || !hand) return;

        hand.setFrame("hinthandopen");
        hand.setPosition(startX, startY);
        hand.setRotation(0);
        hand.setScale(0);
        hand.setAlpha(0);

        // 1. Pop-in
        let popTween = globalScene.tweens.add({
            targets: hand,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 300,
            ease: "Back.easeOut",
            onComplete: () => {
                if (isStopped || !hand) return;

                // 2. Move to target position (no offset)
                let moveTween = globalScene.tweens.add({
                    targets: hand,
                    x: targetX,
                    y: targetY,
                    duration: 1250,
                    ease: "Cubic.easeInOut",
                    completeDelay: 500,
                    onComplete: () => {
                        if (isStopped || !hand) return;

                        // Transform to hinthandclose
                        hand.setFrame("hinthandclose");

                        if (onCompleteCallback) {
                            onCompleteCallback({
                                hand,
                                isStopped: () => isStopped,
                                activeTweens,
                                restartCycle: runCycle,
                                stopAnimation
                            });
                        }
                    }
                });
                activeTweens.push(moveTween);
            }
        });
        activeTweens.push(popTween);
    }

    runCycle();
}

function playClockwiseArcAnimation(context, pivotX, pivotY, sweepAngleDeg = 80, durationMs = 1500, onCompleteCallback) {
    let { hand, isStopped, activeTweens } = context;
    if (isStopped() || !hand) return;

    let dx = hand.x - pivotX;
    let dy = hand.y - pivotY;
    let radius = Math.sqrt(dx * dx + dy * dy);
    let startAngle = Math.atan2(dy, dx);
    let sweepAngleRad = sweepAngleDeg * (Math.PI / 180);

    let progressObj = { progress: 0 };
    let arcTween = globalScene.tweens.add({
        targets: progressObj,
        progress: 1,
        duration: durationMs,
        ease: "Cubic.easeInOut",
        onUpdate: () => {
            if (isStopped() || !hand) return;
            let currAngle = startAngle + progressObj.progress * sweepAngleRad;
            hand.x = pivotX + radius * Math.cos(currAngle);
            hand.y = pivotY + radius * Math.sin(currAngle);
        },
        onComplete: () => {
            if (isStopped() || !hand) return;
            if (onCompleteCallback) {
                onCompleteCallback(context);
            }
        }
    });
    activeTweens.push(arcTween);
}

function playFadeOutAnimation(context, delayMs = 200, durationMs = 400, onCompleteCallback) {
    let { hand, isStopped, activeTweens, restartCycle } = context;
    if (isStopped() || !hand) return;

    let fadeTween = globalScene.tweens.add({
        targets: hand,
        alpha: 0,
        delay: delayMs,
        duration: durationMs,
        onComplete: () => {
            if (isStopped() || !hand) return;
            if (onCompleteCallback) {
                onCompleteCallback(context);
            } else if (globalScene && globalScene.time) {
                globalScene.time.delayedCall(500, () => {
                    if (!isStopped() && hand) {
                        restartCycle();
                    }
                });
            }
        }
    });
    activeTweens.push(fadeTween);
}

function getFaucetHandleAndPivot() {
    let halfW = (typeof gameVars !== "undefined") ? gameVars.halfWidth : 605;
    let halfH = (typeof gameVars !== "undefined") ? gameVars.halfHeight : 460;

    let leverX = halfW + 53;
    let leverY = halfH - 39;

    if (typeof gameObjects !== "undefined" && gameObjects && gameObjects.roomFaucetObjs && gameObjects.roomFaucetObjs.lever) {
        leverX = halfW + gameObjects.roomFaucetObjs.lever.x;
        leverY = gameObjects.roomFaucetObjs.lever.y;
    }

    let handleX = leverX;
    let handleY = leverY - 230;

    if (typeof gameObjects !== "undefined" && gameObjects && gameObjects.roomFaucetObjs && gameObjects.roomFaucetObjs.handle) {
        handleX = halfW + gameObjects.roomFaucetObjs.handle.getPosX();
        handleY = gameObjects.roomFaucetObjs.handle.getPosY();
    }

    return { handleX, handleY, pivotX: leverX, pivotY: leverY };
}

function handleFaucetHint(state) {
    let rightPos = getMoveRightPos();
    let leftPos = getMoveLeftPos();

    switch (state) {
        case "normal":
        case "horror":
            if (isMoveRightEnabled()) {
                playPointHintAnimation(rightPos.x, rightPos.y, -40, false);
            } else {
                let { handleX, handleY, pivotX, pivotY } = getFaucetHandleAndPivot();
                playGrabAtAnimation(handleX, handleY, (context) => {
                    playClockwiseArcAnimation(context, pivotX, pivotY, 80, 800, (ctx) => {
                        playFadeOutAnimation(ctx, 200, 400);
                    });
                });
            }
            break;
        case "dark":
            if (isMoveLeftEnabled()) {
                playPointHintAnimation(leftPos.x, leftPos.y, -40, false);
            } else {
                let { handleX, handleY, pivotX, pivotY } = getFaucetHandleAndPivot();
                playGrabAtAnimation(handleX, handleY, (context) => {
                    playClockwiseArcAnimation(context, pivotX, pivotY, -80, 1500, (ctx) => {
                        playFadeOutAnimation(ctx, 200, 400);
                    });
                });
            }
            break;
    }
}

function handleClown1Hint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Clown Room 1 (Normal State)");
            break;
        case "dark":
            console.log("Hint: Clown Room 1 (Dark State)");
            break;
        case "horror":
            console.log("Hint: Clown Room 1 (Horror State)");
            break;
    }
}

function handleHandyHint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Handy Room (Normal State)");
            break;
        case "dark":
            console.log("Hint: Handy Room (Dark State)");
            break;
        case "horror":
            console.log("Hint: Handy Room (Horror State)");
            break;
    }
}

function handleStretchHint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Stretch Room (Normal State)");
            break;
        case "dark":
            console.log("Hint: Stretch Room (Dark State)");
            break;
        case "horror":
            console.log("Hint: Stretch Room (Horror State)");
            break;
    }
}

function handleClown2Hint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Clown Room 2 (Normal State)");
            break;
        case "dark":
            console.log("Hint: Clown Room 2 (Dark State)");
            break;
        case "horror":
            console.log("Hint: Clown Room 2 (Horror State)");
            break;
    }
}

function handleFlowerHint(roomIndex, state) {
    switch (state) {
        case "normal":
            console.log(`Hint: Flower Corridor (Room ${roomIndex}, Normal State)`);
            break;
        case "dark":
            console.log(`Hint: Flower Corridor (Room ${roomIndex}, Dark State)`);
            break;
        case "horror":
            console.log(`Hint: Flower Corridor (Room ${roomIndex}, Horror State)`);
            break;
    }
}

function handleJackHint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Jack in the Box Room (Normal State)");
            break;
        case "dark":
            console.log("Hint: Jack in the Box Room (Dark State)");
            break;
        case "horror":
            console.log("Hint: Jack in the Box Room (Horror State)");
            break;
    }
}

function handleClown3Hint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Clown Room 3 (Normal State)");
            break;
        case "dark":
            console.log("Hint: Clown Room 3 (Dark State)");
            break;
        case "horror":
            console.log("Hint: Clown Room 3 (Horror State)");
            break;
    }
}

function handleHintPress() {
    let currentRoomIndex = (typeof gameObjects !== "undefined" && gameObjects && gameObjects.exhibit)
        ? gameObjects.exhibit.currentScene
        : 1;
    let state = getMajorState();

    switch (currentRoomIndex) {
        case 0:
            console.log("Hint requested on Intro Screen - doing nothing.");
            break;
        case 1:
            handleEntranceHint(state);
            break;
        case 2:
            handlePumpHint(state);
            break;
        case 3:
            handleFaucetHint(state);
            break;
        case 4:
            handleClown1Hint(state);
            break;
        case 5:
            handleHandyHint(state);
            break;
        case 6:
            handleStretchHint(state);
            break;
        case 7:
            handleClown2Hint(state);
            break;
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            handleFlowerHint(currentRoomIndex, state);
            break;
        case 13:
            handleJackHint(state);
            break;
        case 14:
            handleClown3Hint(state);
            break;
        case 15:
            console.log("Hint requested in Final Room / Exit - doing nothing.");
            break;
        default:
            console.log(`Hint requested in unhandled room index ${currentRoomIndex} (${state} state) - doing nothing.`);
            break;
    }
}

function showHint() {
    playSound("keyfound");
    handleHintPress();
}

function updateHintCounter(count) {
    if (typeof gameVars !== "undefined") {
        gameVars.hintCount = Math.max(0, count);
    }
    if (typeof gameObjects !== "undefined" && gameObjects && gameObjects.hintCountText) {
        gameObjects.hintCountText.setText(String(gameVars ? gameVars.hintCount : 0));
    }
}

function onHintButtonPressed() {
    let currentHints = (typeof gameVars !== "undefined" && gameVars.hintCount !== undefined) ? gameVars.hintCount : 1;
    if (currentHints >= 1) {
        updateHintCounter(currentHints - 1);
        showHint();
    } else {
        if (typeof window.sdkRewardedBreak === 'function') {
            window.sdkRewardedBreak(
                null,
                () => {
                    // onFinished only fires on a successful/earned view - sdk-bridge.js
                    // calls it with no arguments, so there is no reward flag to check here.
                    showHint();
                },
                (err) => {
                    console.warn("Rewarded ad failed or closed early:", err);
                }
            );
        } else if (window.GameSDK && typeof window.GameSDK.showAd === 'function') {
            window.GameSDK.showAd('rewarded', {
                onFinished: () => {
                    showHint();
                }
            }, 'hint');
        } else {
            showHint();
        }
    }
}
