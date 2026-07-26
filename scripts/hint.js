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

function handleEntranceHint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Entrance Room (Normal State)");
            break;
        case "dark":
            console.log("Hint: Entrance Room (Dark State)");
            break;
        case "horror":
            console.log("Hint: Entrance Room (Horror State)");
            break;
    }
}

function handlePumpHint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Pump Room (Normal State)");
            break;
        case "dark":
            console.log("Hint: Pump Room (Dark State)");
            break;
        case "horror":
            console.log("Hint: Pump Room (Horror State)");
            break;
    }
}

function handleFaucetHint(state) {
    switch (state) {
        case "normal":
            console.log("Hint: Faucet Room (Normal State)");
            break;
        case "dark":
            console.log("Hint: Faucet Room (Dark State)");
            break;
        case "horror":
            console.log("Hint: Faucet Room (Horror State)");
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
