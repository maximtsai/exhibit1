// The row of exhibit rooms. Each room index has a background, an optional foreground
// and a button container; moving left/right slides them across the screen.
class Exhibit {
    constructor(scene, bgContainer, foregroundContainer, btnContainer) {
        this.scene = scene;
        this.listOfBGs = [];
        this.listOfForegrounds = [];
        this.listOfBtnCtnrs = [];
        // listOfBGs must stay first: it drives the end-of-move callback
        this.listOfLists = [
            this.listOfBGs,
            this.listOfForegrounds,
            this.listOfBtnCtnrs
        ];
        this.resetListOfCantMove();
        this.currentScene = 1;
        this.leftImage = null;
        this.centerImage = null;
        this.rightImage = null;
        this.bgContainer = bgContainer;
        this.foregroundContainer = foregroundContainer;
        this.btnContainer = btnContainer;
        this.isMoving = false;

        this.peekAmt = 80;
        this.centerSpot = gameVars.halfWidth;
        this.leftSpot = -gameVars.halfWidth - this.peekAmt;
        this.rightSpot = gameVars.halfWidth + gameVars.width + this.peekAmt;

        gameVars.lateUpdateCurrentScene = 1; // start at 1
        messageBus.subscribe('exhibitMoveComplete', (index) => {
            gameVars.lateUpdateCurrentScene = index;
        });
    }

    initPos(pos) {
        this.currentScene = pos;
        for (let i = 0; i < this.listOfLists.length; i++) {
            let currList = this.listOfLists[i];
            if (currList[this.currentScene]) {
                this.centerImage = currList[this.currentScene];
                this.centerImage.x = gameVars.halfWidth;
            }
        }
    }

    // Next index in `step` direction that has a room, or -1 if there is none
    findNextScene(step) {
        for (let i = this.currentScene + step; i >= 0 && i < this.listOfBGs.length; i += step) {
            if (this.listOfBGs[i]) {
                return i;
            }
        }
        return -1;
    }

    moveLeft() {
        gameVarsTemp.hasMoved = true;
        if (this.needCleanup) {
            // First attempt gets the generic line, later ones the room-specific hint
            let hint = TEXT.cleanupHints[this.currentScene];
            if (gameVarsTemp.needSecondClue && hint) {
                updateInfoTextSoft(hint, 2000);
            } else {
                updateInfoTextSoft(TEXT.cleanUpFirst, 2250);
                setTimeout(() => {
                    gameVarsTemp.needSecondClue = true;
                }, 1000)
            }
            return;
        }
        if (gameVars.darkPoint && this.currentScene >= 3) {
            this.needCleanup = true;
        }

        // Player moves to the left, thus moving all images to the right
        let newScene = this.findNextScene(-1);
        if (newScene < 0 || this.isMoving) {
            return;
        }
        disableMoveButtons();
        this.isMoving = true;
        let oldScene = this.currentScene;
        this.currentScene = newScene;
        messageBus.publish('exhibitMove', this.currentScene, oldScene);
        messageBus.publish('exhibitMoveLeft', this.currentScene, oldScene);

        gameObjects.exhibCntr.swayAccX = -0.8;
        for (let i = 0; i < this.listOfLists.length; i++) {
            this.shiftListLeft(this.listOfLists[i], this.currentScene, oldScene, i === 0);
        }
        gameObjects.flashDim.brightVal = 0.1;
    }

    shiftListLeft(list, newSceneNum, oldSceneNum, isMain) {
        let animateSpeed = gameVars.walkSlow ? 3300 : 1500;

        // new room comes in from the left
        this.centerImage = list[newSceneNum];
        if (this.centerImage) {
            this.centerImage.x = this.leftSpot;
            this.shiftAnimCenter = this.scene.tweens.timeline({
                targets: this.centerImage,
                tweens: [{
                    ease: "Cubic.easeInOut",
                    x: this.centerSpot,
                    duration: animateSpeed
                }]
            });
        }
        // current room leaves to the right
        this.rightImage = list[oldSceneNum];
        if (this.rightImage) {
            this.rightImage.x = this.centerSpot;
            this.shiftAnimRight = this.scene.tweens.timeline({
                targets: this.rightImage,
                tweens: [{
                    ease: "Cubic.easeInOut",
                    x: this.rightSpot,
                    duration: animateSpeed,
                    onComplete: () => {
                        if (isMain) {
                            this.isMoving = false;
                            gameObjects.exhibCntr.swayAccX = -0.08;
                            gameObjects.exhibCntr.swayAccY = 0.05;
                            gameObjects.exhibCntr.swayAmt = 0.025;
                            messageBus.publish('exhibitMoveComplete', this.currentScene);

                            if (this.listOfCantMove[newSceneNum]) {
                                // at furthest left, can't move
                                if (newSceneNum !== 0) {
                                    enableMoveLeftButton();
                                }
                            } else if (newSceneNum === 0) {
                                enableMoveRightButton();
                            } else {
                                enableMoveButtons();
                            }
                        }
                    }
                }]
            });
        }
    }

    moveRight(fast) {
        gameVarsTemp.hasMoved = true;
        // Player moves to the right, thus moving all images to the left
        let newScene = this.findNextScene(1);
        if (newScene < 0 || this.isMoving) {
            return;
        }
        disableMoveButtons();
        this.isMoving = true;
        let oldScene = this.currentScene;
        this.currentScene = newScene;
        messageBus.publish('exhibitMove', this.currentScene, oldScene);
        messageBus.publish('exhibitMoveRight', this.currentScene, oldScene);

        gameObjects.exhibCntr.swayAccX = 0.8;
        for (let i = 0; i < this.listOfLists.length; i++) {
            this.shiftListRight(this.listOfLists[i], this.currentScene, oldScene, i === 0, fast);
        }
        gameObjects.flashDim.brightVal = 0.1;
    }

    shiftListRight(list, newSceneNum, oldSceneNum, isMain, fast) {
        let animateSpeed = gameVars.walkSlow ? 3500 : 1500;
        if (fast) {
            animateSpeed = 1;
        }

        // new room comes in from the right
        this.centerImage = list[newSceneNum];
        if (this.centerImage) {
            this.centerImage.x = this.rightSpot;
            this.shiftAnimCenter = this.scene.tweens.timeline({
                targets: this.centerImage,
                tweens: [{
                    ease: "Cubic.easeInOut",
                    x: this.centerSpot,
                    duration: animateSpeed
                }]
            });
        }
        // current room leaves to the left
        this.leftImage = list[oldSceneNum];
        if (this.leftImage) {
            this.leftImage.x = this.centerSpot;
            this.shiftAnimRight = this.scene.tweens.timeline({
                targets: this.leftImage,
                tweens: [{
                    ease: "Cubic.easeInOut",
                    x: this.leftSpot,
                    duration: animateSpeed,
                    onComplete: () => {
                        if (isMain) {
                            this.isMoving = false;
                            gameObjects.exhibCntr.swayAccX = fast ? 0.01 : 0.08;
                            gameObjects.exhibCntr.swayAccY = fast ? 0.01 : 0.05;
                            gameObjects.exhibCntr.swayAmt = 0.025;
                            messageBus.publish('exhibitMoveComplete', this.currentScene);

                            if (this.listOfCantMove[newSceneNum]) {
                                enableMoveLeftButton();
                            } else {
                                enableMoveButtons();
                            }
                        }
                    }
                }]
            });
        }
    }

    setBackgroundAtIndex(x, ref, atlasRef) {
        let newImage = this.scene.add.sprite(-9999, gameVars.halfHeight, ref, atlasRef);
        this.bgContainer.add(newImage);
        if (this.listOfBGs[x]) {
            this.listOfBGs[x].destroy();
        }
        this.listOfBGs[x] = newImage;
        if (x === this.currentScene) {
            this.listOfBGs[x].x = this.centerSpot;
        }
    }

    setForegroundAtIndex(x, ref, atlasRef, yVal) {
        let yPos = yVal || gameVars.halfHeight;
        let newImage = this.scene.add.sprite(-9999, yPos, ref, atlasRef);
        newImage.setDepth(5);
        this.foregroundContainer.add(newImage);
        if (this.listOfForegrounds[x]) {
            this.listOfForegrounds[x].destroy();
        }
        this.listOfForegrounds[x] = newImage;
        if (x === this.currentScene) {
            this.listOfForegrounds[x].x = this.centerSpot;
        }
    }

    addBtnCtnrToIndex(x, btnCtnr) {
        btnCtnr.x = -9999;
        this.btnContainer.add(btnCtnr);
        if (this.listOfBtnCtnrs[x] && this.currentScene === x) {
            // move aside the old button container
            this.listOfBtnCtnrs[x].x = -9999;
        }
        this.listOfBtnCtnrs[x] = btnCtnr;
    }

    removeIndex(x) {
        this.listOfBGs[x] = null;
        this.listOfForegrounds[x] = null;
        this.listOfBtnCtnrs[x] = null;
    }

    // Rooms that block moving right until they're solved (indexes match ROOMS in helpermain.js).
    // Solving a room calls setCantMoveIdx(index, false).
    resetListOfCantMove() {
        this.listOfCantMove = [
            false, false,
            true, true, true, true, true, true,
            false, false, false, false, false, true, true, true, true
        ];
    }

    setCantMoveIdx(idx, val = false) {
        this.listOfCantMove[idx] = val;
    }

    getCurrentScene() {
        return this.currentScene;
    }
}
