// scripts/save.js — progress save/restore for Exhibit of Sorrows.
//
// ---------------------------------------------------------------------------
// CONTRACT: a room is either FINISHED or FRESH. There is no in-between.
// ---------------------------------------------------------------------------
// We save story flags, which rooms are finished, which doors are unlocked, and
// which spawned keys are still lying around. We deliberately do NOT save
// mid-puzzle progress (pump inflation, lever angles, finger counts, spinner
// rotation). A player who quits halfway through a puzzle redoes that one
// puzzle; everything they had already completed stays completed.
//
// This is the whole design. Resist adding "just one" mid-state field — that is
// how the previous version grew a per-room reimplementation of every cinematic
// in the game, each of which silently rotted whenever a room was edited.
//
// Restore mechanics:
//  - Runs once inside setupGame, after every room's setup has registered its
//    messageBus subscribers, so re-publishing a topic reconstructs its visuals.
//  - Rooms are activated by publishing `exhibitMove`. That is the game's own
//    "the player is now in room N" signal: every room latches shouldUpdate,
//    spawns its guide arrows and prunes stale corridor entries off it. Calling
//    exhibit.initPos alone leaves the room inert — that was the "can't click
//    the pump until I leave and come back" bug.
//  - Published as exhibitMove(scene, scene) — passing the restored room as BOTH
//    new and old scene avoids every "the player came from room X" special case
//    (e.g. roomjack's fake-eyes scare, which fires on `o === jackIndex`).
//
// Storage: GameSDK's blob API is asynchronous and single-slot — saveData(data)
// takes no key and loadData() returns a Promise. Restore has to be synchronous,
// so the remote blob is prefetched at page load and read from cache.

var SAVE_VERSION = 2;
var SAVE_STORAGE_KEY = "exhibit1_save_v2";
var saveStorageFallback = {};
var saveDebounceTimer = null;
var saveKeyRegistry = {};
var saveRestoring = false;

// Story flags that survive a reload. Everything here is a plain scalar on
// gameVars; nothing that references a live GameObject may be added.
var saveGameVarsFields = [
    "darkPoint", "horrorPoint", "finishedDarkPoint",
    "clownRun", "firstNosePressed", "clownRedKeyUp",
    "walkSlow", "baseSway", "hintCount", "manualMuted", "bloodHandActive"
];

// Rooms that own their own save state, keyed by room index. A provider is
// {getStage, setStage}: getStage returns a value this file never interprets and
// setStage is handed that same value back on restore.
//
// The value may be any JSON-serialisable thing the room finds useful — an
// integer stage is the common case (roomhandy.js), but a room needing more can
// return an object (roomjack.js returns {stage, spin} so the crank keeps its
// angle). Return a falsy value to mean "no progress"; it is omitted from the
// save. Nothing here compares or does arithmetic on it.
//
// Rooms register from inside their setupRoom* function, which runs before
// applySaveStateIfNeeded at the end of setupGame. Registering at file top level
// would not work — save.js is concatenated after the room files (build.js), so
// only the hoisted function declaration is available that early, not this map.

var saveRoomStateProviders = {};

function registerRoomSaveState(roomIndex, provider) {
    saveRoomStateProviders[roomIndex] = provider;
}

// ---------------------------------------------------------------- storage ---

// Cache of the remote (GameSDK) blob, filled by saveStartPrefetch. Null means
// "no remote save"; the prefetch flag distinguishes that from "not asked yet".
var saveRemoteValue = null;
var saveRemotePrefetched = false;
var saveRemotePrefetchStarted = false;

// Is this Button or Phaser GameObject still usable?
//
// Buttons set isDestroyed on themselves (button.js:830). Phaser images have no
// such flag and simply drop their scene reference. Neither type has a
// `.destroyed` property, so the guards this replaces were always true and
// guarded nothing.
function saveAlive(o) {
    if (!o) return false;
    if (o.isDestroyed) return false;
    if (o.scene === null || o.scene === undefined) return false;
    return true;
}

function saveSdkAvailable() {
    return typeof window !== "undefined" && window.GameSDK && typeof window.GameSDK.loadData === "function";
}

// Reads the remote blob once at page load so restore can be synchronous.
//
// The YouTube adapter resolves window.ytgame lazily and returns Promise(null)
// while the third-party SDK script is still in flight, so an early empty answer
// is ambiguous. Retry until ytgame appears or the deadline passes; a real save
// short-circuits immediately.
function saveStartPrefetch(deadlineMs) {
    if (saveRemotePrefetchStarted) return;
    saveRemotePrefetchStarted = true;
    if (!saveSdkAvailable()) {
        saveRemotePrefetched = true;
        return;
    }
    var deadline = Date.now() + (deadlineMs || 8000);
    var attempt = function () {
        var p;
        try {
            p = window.GameSDK.loadData();
        } catch (e) {
            saveRemotePrefetched = true;
            return;
        }
        Promise.resolve(p).then(function (v) {
            if (typeof v === "string" && v.length > 0) {
                saveRemoteValue = v;
                saveRemotePrefetched = true;
                return;
            }
            // Empty answer: only trust it once the host SDK has actually loaded
            // (or we have waited long enough that it never will).
            if (window.ytgame || Date.now() >= deadline) {
                saveRemotePrefetched = true;
                return;
            }
            setTimeout(attempt, 250);
        }, function () {
            saveRemotePrefetched = true;
        });
    };
    attempt();
}

function saveStorageSet(s) {
    saveStorageFallback[SAVE_STORAGE_KEY] = s;
    saveRemoteValue = s;
    try { localStorage.setItem(SAVE_STORAGE_KEY, s); } catch (e) { /* incognito */ }
    try {
        // Single-slot blob API: saveData takes the payload only, no key.
        if (window.GameSDK && typeof window.GameSDK.saveData === "function") {
            window.GameSDK.saveData(s);
        }
    } catch (e) { /* ignore */ }
}

function saveStorageGet() {
    var s = saveRemoteValue;
    if (s == null) {
        try { s = localStorage.getItem(SAVE_STORAGE_KEY); } catch (e) { /* ignore */ }
    }
    if (s == null) s = saveStorageFallback[SAVE_STORAGE_KEY] || null;
    return s || null;
}

// Kick the remote read off as early as possible — this file is concatenated
// after sdk-bridge.js, so window.GameSDK already exists, and the asset preload
// plus the player clicking BEGIN gives it seconds to land. Touches no game
// globals, so it is safe at load time in the bundle. initSaveSystem calls it
// again as an idempotent safety net.
if (typeof window !== "undefined") saveStartPrefetch();

// ------------------------------------------------------------------ save ----

// True once the endgame starts. The finale is a single uninterruptible
// sequence, so we stop saving rather than trying to restore into the middle of
// it; a player who quits there resumes at the start of Mr. Jack's room.
function saveInFinale() {
    var j = gameObjects.roomJackObjs;
    return !!(j && (j.startFinale || j.isAutopilot || j.triggeredAutopilot || j.playedLaugh));
}

function collectSaveState() {
    if (typeof gameObjects === "undefined" || !gameObjects || !gameObjects.exhibit) return null;
    if (saveInFinale()) return null;

    var save = {
        version: SAVE_VERSION,
        savedAt: Date.now(),
        scene: gameObjects.exhibit.getCurrentScene(),
        story: {},
        rooms: {},
        cantMove: gameObjects.exhibit.listOfCantMove.slice(),
        needCleanup: !!gameObjects.exhibit.needCleanup,
        keys: []
    };

    if (typeof gameVars !== "undefined") {
        for (var i = 0; i < saveGameVarsFields.length; i++) {
            var f = saveGameVarsFields[i];
            if (gameVars[f] !== undefined) save.story[f] = gameVars[f];
        }
    }

    save.rooms = saveCollectRoomStages();

    for (var k in saveKeyRegistry) {
        save.keys.push({
            roomIdx: parseInt(k, 10),
            x: saveKeyRegistry[k].x,
            y: saveKeyRegistry[k].y,
            red: !!saveKeyRegistry[k].red
        });
    }
    return save;
}

// The single place that decides how far each room has got. Starts from the
// key-spawn history, then corroborates against the rooms' own completion flags
// so a room is never recorded as less finished than it actually is.
// Asks every room how far it has got. This file never interprets the values.
function saveCollectRoomStages() {
    var stages = {};
    for (var idx in saveRoomStateProviders) {
        var stage = saveRoomStateProviders[idx].getStage();
        if (stage) stages[idx] = stage;
    }
    return stages;
}

function saveNow() {
    var s = collectSaveState();
    if (!s) return;
    try {
        saveStorageSet(JSON.stringify(s));
    } catch (e) { /* ignore */ }
}

function saveClear() {
    saveKeyRegistry = {};
    saveRemoteValue = null;
    delete saveStorageFallback[SAVE_STORAGE_KEY];
    try { localStorage.removeItem(SAVE_STORAGE_KEY); } catch (e) { /* ignore */ }
    try {
        // removeItem only touches the adapter's in-memory key-value store, not
        // the blob — the blob is cleared by overwriting it with an empty string.
        if (window.GameSDK && typeof window.GameSDK.saveData === "function") {
            window.GameSDK.saveData("");
        }
        if (window.GameSDK && typeof window.GameSDK.removeItem === "function") {
            window.GameSDK.removeItem(SAVE_STORAGE_KEY);
        }
    } catch (e) { /* ignore */ }
}

function scheduleSave() {
    console.log("game saved")
    if (saveRestoring || saveDebounceTimer) return;
    saveDebounceTimer = setTimeout(function () {
        saveDebounceTimer = null;
        saveNow();
    }, 500);
}

function initSaveSystem() {
    if (initSaveSystem.done) return;
    initSaveSystem.done = true;
    saveStartPrefetch();
    if (typeof messageBus !== "undefined" && messageBus) {
        messageBus.subscribe("exhibitMove", scheduleSave);
        // Records only — deliberately does NOT schedule a save. A key often
        // spawns in the middle of its room's completion cinematic, so writing
        // here caught the room mid-flourish. Whenever the next save does happen
        // (room change, saveCheckpoint) it already knows about the key.
        //
        // Only the key's position is tracked. Which stage a room has reached is
        // the room's own business, reported through its save provider.
        messageBus.subscribe("keyAppeared", function (ev) {
            if (!ev || ev.roomIndex === undefined) return;
            saveKeyRegistry[ev.roomIndex] = { x: ev.x, y: ev.y, red: !!ev.red };
        });
        messageBus.subscribe("keyClicked", function (ev) {
            if (ev && ev.roomIndex !== undefined) delete saveKeyRegistry[ev.roomIndex];
            scheduleSave();
        });
        messageBus.subscribe("powerTurnedOn", scheduleSave);
        messageBus.subscribe("startDarkSequence", scheduleSave);
        messageBus.subscribe("startHorrorSequence", scheduleSave);
        messageBus.subscribe("startTrueStretchHorror", scheduleSave);
        messageBus.subscribe("temporarilyNormal", scheduleSave);
        messageBus.subscribe("saveCheckpoint", scheduleSave);
    }
    // NO unload-time saving. Refreshing the page must not write a save, so
    // there are deliberately no beforeunload / pagehide / visibilitychange
    // handlers here. A refresh returns the player to their last checkpoint
    // rather than to whatever transient state the page happened to be in.
    //
    // visibilitychange cannot be kept as a "backgrounded" hook either: browsers
    // fire it with state "hidden" on the way into an unload, ahead of pagehide,
    // so there is no way to tell a refresh apart from a tab switch at that
    // point. Keeping it would silently reintroduce saving on refresh.
}

// ---------------------------------------------------------------- restore ---

function applySaveStateIfNeeded() {
    if (!saveRemotePrefetched && saveSdkAvailable()) {
        console.warn("save: remote blob still loading at restore time; falling back to local storage.");
    }
    var raw = saveStorageGet();
    if (!raw) return;
    var save = null;
    try {
        save = JSON.parse(raw);
    } catch (e) {
        console.warn("save: stored data is not valid JSON, ignoring it.", e);
        return;
    }
    if (!save || save.version !== SAVE_VERSION) return;
    applySaveState(save);
}

function applySaveState(save) {
    if (!save || save.version !== SAVE_VERSION) return;
    if (typeof gameObjects === "undefined" || !gameObjects || !gameObjects.exhibit) return;
    saveRestoring = true;
    try {
        var story = save.story || {};
        var rooms = save.rooms || {};

        // 1. Story flags, before anything reads them.
        if (typeof gameVars !== "undefined") {
            for (var i = 0; i < saveGameVarsFields.length; i++) {
                var f = saveGameVarsFields[i];
                if (story[f] !== undefined) gameVars[f] = story[f];
            }
        }

        // 2. Door locks. The saved array is authoritative: resetListOfCantMove's
        //    defaults are the initial "blocked" values, but doors opened by a
        //    collected key must stay open.
        gameObjects.exhibit.resetListOfCantMove();
        if (Array.isArray(save.cantMove)) {
            for (var j = 0; j < save.cantMove.length; j++) {
                gameObjects.exhibit.setCantMoveIdx(j, !!save.cantMove[j]);
            }
        }
        gameObjects.exhibit.needCleanup = !!save.needCleanup;

        // 3. Global phase topics. Each room's phase subscriber was registered
        //    during setup and self-unsubscribes, so publishing once here
        //    reconstructs the per-room phase visuals exactly once.
        if (story.darkPoint && !story.finishedDarkPoint) initDarkSequence(globalScene);
        if (story.horrorPoint) messageBus.publish("startHorrorSequence");
        if (story.finishedDarkPoint) {
            messageBus.publish("powerTurnedOn");
            gameObjects.powerSwitch.setState("disable");
            gameObjects.candleDark.alpha = 0;
            gameObjects.candleBright.alpha = 0;
            gameObjects.flashDim.alpha = 0;
        }

        // 4. Finished rooms. Anything not listed stays exactly as setupGame
        //    built it, which is the fresh state. Each room's setStage also
        //    records the stage back onto the room, so the next save reports it.
        saveApplyFinishedRooms(rooms);

        // 5. Keys that spawned but were never picked up.
        saveKeyRegistry = {};
        var keys = save.keys || [];
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];
            var ctnr = gameObjects["gameCtnr" + key.roomIdx];
            if (!ctnr) continue;
            makeKeyButton(key.roomIdx, key.x, key.y, !!key.red, ctnr);
        }

        if (story.bloodHandActive && gameObjects.hand) gameObjects.hand.switchHand();

        // 6. Put the player in the room and activate it. initPos moves the
        //    sprites; exhibitMove is what makes the room live (see header).
        var scene = save.scene;
        if (typeof scene === "number" && scene >= 1) {
            gameObjects.exhibit.initPos(scene);
            messageBus.publish("exhibitMove", scene, scene);
            messageBus.publish("exhibitMoveComplete", scene);
        }

        // Mirrors the button state the slide's onComplete would have set
        // (exhibit.js shiftListRight): a room whose key is still uncollected
        // only lets the player back out to the left.
        //
        // The live path reaches that point having already called
        // disableMoveButtons() at the start of the slide, so enabling the left
        // button alone is enough. Restore has no preceding disable and Buttons
        // construct in NORMAL, so the right button must be disabled explicitly
        // or the player can walk straight through a locked door.
        if (gameObjects.exhibit.listOfCantMove[gameObjects.exhibit.getCurrentScene()]) {
            disableMoveRightButton();
            enableMoveLeftButton();
        } else {
            enableMoveButtons();
        }
        saveRestoreMoveButtonHandlers(story);
    } catch (err) {
        console.warn("applySaveState failed:", err);
    }
    saveRestoring = false;
}

// The right-hand move button is re-bound at story beats rather than per room.
function saveRestoreMoveButtonHandlers(story) {
    if (story.finishedDarkPoint) {
        gameObjects.moveRightBtn.setOnMouseUpFunc(function () {
            updateInfoText("You have stayed long enough. You should EXIT. ", 4500);
        });
    } else if (story.darkPoint) {
        gameObjects.moveRightBtn.setOnMouseUpFunc(function () {
            updateInfoText("It's too dark to go forward. \n<- Head left to EXIT.", 5000);
        });
    }
}

// -------------------------------------------------------------- room keys ---

function makeKeyButton(roomIdx, x, y, red, container) {
    // NOTE: `red` carries the same meaning as createKey's `o` param
    // (helpermain.js) — true means YELLOW key, false means RED key.
    saveKeyRegistry[roomIdx] = { x: x, y: y, red: red };
    keyPosX = (typeof gameVars !== "undefined" && gameVars) ? gameVars.halfWidth + x : x;
    keyPosY = y;
    keyRoomIdx = roomIdx;
    var n = new Button(globalScene, container, function () {
        keyPosX = null;
        keyPosY = null;
        keyRoomIdx = null;
        delete saveKeyRegistry[roomIdx];
        messageBus.publish("keyClicked", { roomIndex: roomIdx });
        n.destroy();
        red ? playSound("keyget") : playSound("keygetred");
        tempFreeze(500);
        gameObjects.exhibit.setCantMoveIdx(roomIdx, false);
        gameDelay(function () { enableMoveButtons(true); }, 100);
    }, {
        atlas: "buttons",
        ref: red ? "key_yellow" : "key_red",
        x: x,
        y: y - 9
    }, {
        atlas: "buttons",
        ref: red ? "key_yellow_glow" : "key_red_glow"
    });
    n.setScale(.98);
    return n;
}

// --------------------------------------------------------- finished rooms ---
//
// Every room now owns its own save state and registers a provider from inside
// its setupRoom* function. This file no longer knows anything about any room's
// internals — it stores whatever getStage returns and hands it back to
// setStage. See roomhandy.js for the simplest example (an integer stage) and
// roomjack.js for a room that needs more (an object).

function saveApplyFinishedRooms(rooms) {
    for (var idx in saveRoomStateProviders) {
        if (!rooms[idx]) continue;
        try {
            saveRoomStateProviders[idx].setStage(rooms[idx]);
        } catch (e) {
            console.warn("save: room " + idx + " failed to restore stage " + rooms[idx], e);
        }
    }
}


// ------------------------------------------- start-screen wipe UI (main.js) ---

function saveDestroyAll(items) {
    for (var i = 0; i < items.length; i++) {
        if (saveAlive(items[i])) items[i].destroy();
    }
}

// Tears down everything, link included. Used when the game actually starts.
function destroySaveWipeUI() {
    var u = (typeof gameObjectsTemp !== "undefined" && gameObjectsTemp) ? gameObjectsTemp.saveWipeUI : null;
    if (!u) return;
    saveDestroyAll([u.blocker, u.outline, u.panel, u.title, u.text, u.button, u.yesBtn, u.yesText, u.noBtn, u.noText, u.closeBtn, u.closeText, u.wipedText]);
    if (typeof gameObjectsTemp !== "undefined" && gameObjectsTemp) gameObjectsTemp.saveWipeUI = null;
}

// Tears down ONLY the confirmation popup, leaving the start-screen link alive.
//
// Declining must not take away the way back to the option — the previous
// version routed NO through destroySaveWipeUI, which killed the link too and
// left the player unable to wipe without reloading the page.
function closeWipeConfirm() {
    var u = (typeof gameObjectsTemp !== "undefined" && gameObjectsTemp) ? gameObjectsTemp.saveWipeUI : null;
    if (!u) return;
    saveDestroyAll([u.blocker, u.outline, u.panel, u.title, u.yesBtn, u.yesText, u.noBtn, u.noText, u.closeBtn, u.closeText]);
    // Drop the popup handles so showWipeConfirm's re-entry guard (which tests
    // for a live blocker) lets the box open again.
    gameObjectsTemp.saveWipeUI = { text: u.text, button: u.button };
}

// Shows the "SAVED GAME DETECTED" wipe link on the start screen. Called from
// onLoadComplete (main.js) once the welcome screen is up.
function maybeShowSaveWipeUI(a) {
    if (typeof saveStorageGet !== "function" || !saveStorageGet()) return;
    if (typeof gameObjects === "undefined" || !gameObjects || !gameObjects.loadingCntr) return;
    var c = gameObjects.loadingCntr;
    var text = a.add.text(gameVars.halfWidth, gameVars.height - 30, "SAVED GAME DETECTED. CLICK HERE TO WIPE SAVE.", {
        fontFamily: "Times New Roman",
        fontSize: 22,
        color: "#ffffff",
        align: "center"
    });
    text.setOrigin(.5, .5);
    text.setDepth(3);
    text.alpha = .6;
    c.add(text);
    var btn = new Button(a, c, function () {
        showWipeConfirm(a);
    }, {
        atlas: "loadingSS",
        ref: "transparent_pixel",
        x: gameVars.halfWidth,
        y: gameVars.height - 30,
        scaleX: 420,
        scaleY: 36
    });
    btn.setOnHoverFunc(function () { text.alpha = .85; });
    btn.setOnHoverOutFunc(function () { text.alpha = .6; });
    if (typeof gameObjectsTemp !== "undefined" && gameObjectsTemp) gameObjectsTemp.saveWipeUI = { text: text, button: btn };
}

// Confirmation popup for the wipe link.
function showWipeConfirm(a) {
    if (typeof gameObjects === "undefined" || !gameObjects || !gameObjects.loadingCntr) return;
    if (typeof gameObjectsTemp !== "undefined" && gameObjectsTemp && gameObjectsTemp.saveWipeUI && gameObjectsTemp.saveWipeUI.blocker) return;
    var c = gameObjects.loadingCntr;
    var blocker = new Button(a, c, function () { /* swallows clicks behind the popup */ }, {
        ref: "blackPixel",
        x: gameVars.halfWidth,
        y: gameVars.halfHeight,
        scaleX: 1000,
        scaleY: 1000,
        alpha: .75
    });

    var outline = a.add.image(gameVars.halfWidth, gameVars.halfHeight, "whitePixel");
    outline.scaleX = 368;
    outline.scaleY = 158;
    c.add(outline);

    var panel = a.add.image(gameVars.halfWidth, gameVars.halfHeight, "blackPixel");
    panel.scaleX = 360;
    panel.scaleY = 150;
    panel.alpha = .95;
    c.add(panel);

    var title = a.add.text(gameVars.halfWidth, gameVars.halfHeight - 25, "WIPE SAVED GAME?", {
        fontFamily: "Times New Roman",
        fontSize: 26,
        color: "#ffffff",
        align: "center"
    });
    title.setOrigin(.5, .5);
    c.add(title);

    var closeBtn = new Button(a, c, function () {
        closeWipeConfirm();
    }, {
        atlas: "loadingSS",
        ref: "transparent_pixel",
        x: gameVars.halfWidth + 164,
        y: gameVars.halfHeight - 59,
        scaleX: 30,
        scaleY: 30
    });

    var closeText = a.add.text(gameVars.halfWidth + 164, gameVars.halfHeight - 59, "X", {
        fontFamily: "Times New Roman",
        fontSize: 22,
        color: "#dddddd",
        align: "center"
    });
    closeText.setOrigin(.5, .5);
    closeText.setAlpha(0.8);
    c.add(closeText);

    closeBtn.setOnHoverFunc(function () {
        closeText.setScale(1.25);
        closeText.setColor("#ffffff");
        closeText.setAlpha(1.0);
    });
    closeBtn.setOnHoverOutFunc(function () {
        closeText.setScale(1.0);
        closeText.setColor("#dddddd");
        closeText.setAlpha(0.8);
    });

    var yesBtn = new Button(a, c, function () {
        saveClear();
        destroySaveWipeUI();
        var wiped = a.add.text(gameVars.halfWidth, gameVars.height - 30, "SAVE GAME WIPED", {
            fontFamily: "Times New Roman",
            fontSize: 22,
            color: "#ffffff",
            align: "center"
        });
        wiped.setOrigin(.5, .5);
        wiped.setDepth(3);
        wiped.alpha = 0;
        c.add(wiped);
        a.tweens.add({ targets: wiped, alpha: .6, duration: 1500, ease: "Linear" });
        if (typeof gameObjectsTemp !== "undefined" && gameObjectsTemp) gameObjectsTemp.saveWipeUI = { text: wiped };
    }, {
        atlas: "loadingSS",
        ref: "transparent_pixel",
        x: gameVars.halfWidth - 85,
        y: gameVars.halfHeight + 30,
        scaleX: 90,
        scaleY: 40
    });

    var yesText = a.add.text(gameVars.halfWidth - 85, gameVars.halfHeight + 30, "YES", {
        fontFamily: "Times New Roman",
        fontSize: 24,
        color: "#dddddd",
        align: "center"
    });
    yesText.setOrigin(.5, .5);
    yesText.setAlpha(0.8);
    c.add(yesText);

    yesBtn.setOnHoverFunc(function () {
        yesText.setScale(1.25);
        yesText.setColor("#ffffff");
        yesText.setAlpha(1.0);
    });
    yesBtn.setOnHoverOutFunc(function () {
        yesText.setScale(1.0);
        yesText.setColor("#dddddd");
        yesText.setAlpha(0.8);
    });

    var noBtn = new Button(a, c, function () {
        closeWipeConfirm();
    }, {
        atlas: "loadingSS",
        ref: "transparent_pixel",
        x: gameVars.halfWidth + 85,
        y: gameVars.halfHeight + 30,
        scaleX: 90,
        scaleY: 40
    });

    var noText = a.add.text(gameVars.halfWidth + 85, gameVars.halfHeight + 30, "NO", {
        fontFamily: "Times New Roman",
        fontSize: 24,
        color: "#dddddd",
        align: "center"
    });
    noText.setOrigin(.5, .5);
    noText.setAlpha(0.8);
    c.add(noText);

    noBtn.setOnHoverFunc(function () {
        noText.setScale(1.25);
        noText.setColor("#ffffff");
        noText.setAlpha(1.0);
    });
    noBtn.setOnHoverOutFunc(function () {
        noText.setScale(1.0);
        noText.setColor("#dddddd");
        noText.setAlpha(0.8);
    });

    var existing = gameObjectsTemp.saveWipeUI;
    gameObjectsTemp.saveWipeUI = {
        text: existing ? existing.text : null,
        button: existing ? existing.button : null,
        blocker: blocker,
        outline: outline,
        panel: panel,
        title: title,
        closeBtn: closeBtn,
        closeText: closeText,
        yesBtn: yesBtn,
        yesText: yesText,
        noBtn: noBtn,
        noText: noText
    };
}
