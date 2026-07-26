/**
 * @fileoverview Hint system module for managing hint counter, badge display, and rewarded ads.
 */

if (typeof gameVars !== "undefined" && gameVars.hintCount === undefined) {
    gameVars.hintCount = 1;
}

function showHint() {
    console.log("show hint");
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
