(function () {
    'use strict';

    // ===========================================================================
    // 1. BaseSDKAdapter — defines the full interface all platforms must implement.
    //    Methods that a platform doesn't support should be no-ops or return
    //    sensible defaults (see each adapter below).
    // ===========================================================================
    class BaseSDKAdapter {
        // --- Lifecycle ---

        // Called once at boot. Must resolve before any other SDK calls are made.
        init() { return Promise.resolve(true); }

        // Called when game starts loading assets.
        loadingStart() { }

        // Called when the first frame of the game has rendered (critical on YT).
        firstFrameReady() { }

        // Called when all assets are loaded and the game is interactive.
        loadingStop() { }

        // Called when meaningful gameplay begins (after menus/loading).
        gameplayStart() { }

        // Called when gameplay pauses (menu opened, ad shown, tab hidden, etc.)
        gameplayStop() { }

        // Tells the platform to signal a positive user moment (e.g. merge streak).
        happyTime() { }

        // --- Audio ---

        // Returns a boolean: whether the host container currently allows audio.
        isAudioEnabled() { return true; }

        // Registers a callback for when the host requests the game to pause.
        // cb: () => void
        // Returns: an unsubscribe function (() => void) if the platform supports it.
        onPause(cb) { return () => { }; }

        // Registers a callback for when the host requests the game to resume.
        // cb: () => void
        // Returns: an unsubscribe function (() => void) if the platform supports it.
        onResume(cb) { return () => { }; }

        // Registers a callback for when the host's audio enablement state changes.
        // cb: (enabled: boolean) => void
        // Returns: an unsubscribe function (() => void) if the platform supports it.
        onAudioEnabledChange(cb) { return () => { }; }

        // Unsubscribes all registered event listeners (onPause, onResume, onAudioEnabledChange).
        // Call this when tearing down the game to prevent memory leaks.
        cleanup() { }

        // --- Score / Leaderboard ---

        // Sends the player's score to the platform.
        // score: number
        setScore(score) { return Promise.resolve(false); }

        // --- User Identity ---

        // Returns a Promise resolving to user profile info, e.g. { username: string, profilePictureUrl: string } or null.
        getUser() { return Promise.resolve(null); }

        // --- Data Persistence (blob) ---

        // Serializes and saves a string to the platform's cloud storage.
        // data: string (UTF-16, max 3 MiB on YouTube)
        saveData(data) { return Promise.resolve(); }

        // Loads the previously saved data string from platform cloud storage.
        // Returns: Promise<string>
        loadData() { return Promise.resolve(null); }

        // Convenience method to serialize and save a JSON object.
        saveJSON(obj) {
            try {
                return this.saveData(JSON.stringify(obj));
            } catch (e) {
                console.error('[GameSDK] Failed to stringify JSON for save:', e);
                return Promise.resolve();
            }
        }

        // Convenience method to load and parse a JSON object.
        async loadJSON() {
            try {
                const str = await this.loadData();
                return str ? JSON.parse(str) : null;
            } catch (e) {
                console.error('[GameSDK] Failed to parse JSON from load:', e);
                return null;
            }
        }

        // --- Data Persistence (key-value) ---

        // Saves a value under a key. Both key and value are strings.
        async setItem(key, value) {
            try { localStorage.setItem(key, String(value)); } catch (e) { }
        }

        // Loads a value by key. Returns the value string or null.
        async getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                return null;
            }
        }

        // Removes a key-value pair.
        async removeItem(key) {
            try { localStorage.removeItem(key); } catch (e) { }
        }

        // Clears all key-value data.
        async clearData() {
            try { localStorage.clear(); } catch (e) { }
        }

        // --- Locale ---

        // Returns a BCP-47 locale tag (e.g. "en-US").
        getLanguage() { return navigator.language || 'en-US'; }

        // --- Environment ---

        // Returns the current platform environment.
        // 'local' | 'crazygames' | 'youtube' | 'disabled'
        getEnvironment() { return 'local'; }

        // Requests an ad.
        // type: 'midgame' | 'rewarded'
        // callbacks: { onStarted: () => void, onFinished: () => void, onError: (err) => void }
        //   - onStarted: game should mute audio and pause gameplay.
        //   - onFinished: game should resume and unmute. For 'rewarded', this fires only if reward was earned.
        //   - onError: game should resume and unmute. Error may be 'adblock', 'unfilled', 'adCooldown', etc.
        // rewardId: String (required for YouTube Playables rewarded ads)
        // Returns: Promise<boolean> (true if ad completed successfully, false on error/cancel)
        showAd(type, callbacks, rewardId = 'default-reward') { return Promise.resolve(true); }

        // Returns whether an adblocker is likely present.
        // Platforms without detection should return false.
        hasAdblock() { return Promise.resolve(false); }

        // Triggers haptic vibration feedback.
        // pattern: number | Array<number> (e.g. 100 or [100, 50, 100])
        vibrate(pattern) {
            // Standard web vibration API — CrazyGames exposes no haptics module.
            if (navigator.vibrate) {
                try {
                    navigator.vibrate(pattern);
                } catch (e) {
                    // Fail silently (e.g. when blocked in iframe sandboxes)
                }
            }
        }
    }



    // 3. CrazyGamesAdapter
    //    Wraps the CrazyGames HTML5 SDK v3 (window.CrazyGames.SDK namespace).
    //    SDK script: <script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>
    //    Docs: https://docs.crazygames.com/sdk/
    //
    //    Module map:
    //      SDK.game  — lifecycle: loadingStart, loadingStop, gameplayStart,
    //                  gameplayStop, happytime
    //      SDK.ad    — ads: requestAd('midgame'|'rewarded', { adStarted,
    //                  adFinished, adError }), hasAdblock
    //      SDK.user  — player: getUser, isUserAccountAvailable, systemInfo
    //      SDK.data  — cloud-synced storage: getItem, setItem, removeItem, clear
    //      SDK.environment — 'local' | 'crazygames' | 'disabled'
    //
    //    Notes:
    //      - CrazyGames no longer supports SDK leaderboards (addScore is a no-op
    //        in the SDK), so setScore() is a no-op here — kept for interface parity.
    //      - CrazyGames has no firstFrameReady / onPause / onResume /
    //        onAudioEnabledChange / openYTContent hooks; those stay as no-op stubs
    //        so existing game code can keep calling them.
    // ===========================================================================
    class CrazyGamesAdapter extends BaseSDKAdapter {
        constructor() {
            super();
            this.cg = null; // reference to window.CrazyGames.SDK once initialized
            // Memoized init promise so init() is safe to call more than once.
            this._initPromise = null;
            // Blob save lives under this key in the CrazyGames data module.
            this._saveKey = 'merge_mansion_save';
            // Audio muting state from CG game settings.
            this._muted = false;
            // Registered callbacks for audio enabled changes.
            this._audioCallbacks = [];
            // Bound settings change listener so we can remove it in cleanup().
            this._boundSettingsListener = null;
        }

        init() {
            if (this._initPromise) return this._initPromise;
            this._initPromise = (async () => {
                const sdk = (window.CrazyGames && window.CrazyGames.SDK) || null;
                if (!sdk) {
                    console.log('[CrazyGamesAdapter] CrazyGames SDK not present.');
                    return false;
                }
                try {
                    await sdk.init();
                    this.cg = sdk;
                    // Read initial muteAudio setting
                    try {
                        this._muted = !!(this.cg.game && this.cg.game.settings && this.cg.game.settings.muteAudio);
                    } catch (e) { }
                    // Register settings change listener to track muteAudio toggles
                    if (this.cg.game && typeof this.cg.game.addSettingsChangeListener === 'function') {
                        this._boundSettingsListener = (newSettings) => {
                            const wasMuted = this._muted;
                            this._muted = !!(newSettings && newSettings.muteAudio);
                            if (wasMuted !== this._muted) {
                                for (const cb of this._audioCallbacks) {
                                    try { cb(!this._muted); } catch (e) { }
                                }
                            }
                        };
                        this.cg.game.addSettingsChangeListener(this._boundSettingsListener);
                    }
                    console.log('[CrazyGamesAdapter] SDK initialized. environment =', this.getEnvironment());
                    return true;
                } catch (e) {
                    console.warn('[CrazyGamesAdapter] init failed:', e);
                    return false;
                }
            })();
            return this._initPromise;
        }

        // CrazyGames has no first-frame hook — YouTube-only no-op stub.
        firstFrameReady() { }

        // Signals to CrazyGames that the game has started loading assets.
        loadingStart() {
            if (!this.cg || !this.cg.game) return;
            try {
                this.cg.game.loadingStart();
            } catch (e) {
                console.warn('[CrazyGamesAdapter] loadingStart failed:', e);
            }
        }

        // Signals to CrazyGames that loading is complete and the game is playable.
        loadingStop() {
            if (!this.cg || !this.cg.game) return;
            try {
                this.cg.game.loadingStop();
            } catch (e) {
                console.warn('[CrazyGamesAdapter] loadingStop failed:', e);
            }
        }

        // Signals that meaningful gameplay has begun/resumed (used for ad timing).
        gameplayStart() {
            if (!this.cg || !this.cg.game) return;
            try {
                this.cg.game.gameplayStart();
            } catch (e) {
                console.warn('[CrazyGamesAdapter] gameplayStart failed:', e);
            }
        }

        // Signals that gameplay has paused/stopped (menu opened, ad shown, etc.).
        gameplayStop() {
            if (!this.cg || !this.cg.game) return;
            try {
                this.cg.game.gameplayStop();
            } catch (e) {
                console.warn('[CrazyGamesAdapter] gameplayStop failed:', e);
            }
        }

        // Signals a celebratory player moment (merge streak, win, etc.).
        happyTime() {
            if (!this.cg || !this.cg.game) return;
            try {
                this.cg.game.happytime();
            } catch (e) {
                console.warn('[CrazyGamesAdapter] happytime failed:', e);
            }
        }

        // Returns whether CrazyGames allows audio. Reads the SDK's muteAudio
        // setting live, falling back to the cached value if the SDK isn't ready.
        // Deliberately PURE (no write to this._muted): the settings-change
        // listener is the sole writer, so its `wasMuted !== this._muted` edge
        // detection stays reliable. A getter that also wrote _muted could pre-sync
        // it — e.g. from the 1s poll — and make the change event miss its edge.
        isAudioEnabled() {
            if (this.cg && this.cg.game && this.cg.game.settings && typeof this.cg.game.settings.muteAudio === 'boolean') {
                return !this.cg.game.settings.muteAudio;
            }
            return !this._muted;
        }

        // CrazyGames has no pause/resume events — YouTube-only no-op
        // stubs returning an unsubscribe function for interface parity.
        onPause(cb) { return () => { }; }
        onResume(cb) { return () => { }; }

        // Registers a callback for muteAudio changes via CG game settings.
        // cb: (enabled: boolean) => void
        // Returns: an unsubscribe function.
        onAudioEnabledChange(cb) {
            this._audioCallbacks.push(cb);
            return () => {
                const idx = this._audioCallbacks.indexOf(cb);
                if (idx !== -1) this._audioCallbacks.splice(idx, 1);
            };
        }

        // Tears down the settings change listener and clears callbacks.
        cleanup() {
            if (this.cg && this.cg.game && typeof this.cg.game.removeSettingsChangeListener === 'function' && this._boundSettingsListener) {
                try {
                    this.cg.game.removeSettingsChangeListener(this._boundSettingsListener);
                } catch (e) { }
            }
            this._boundSettingsListener = null;
            this._audioCallbacks = [];
        }

        // CrazyGames removed SDK leaderboard support — no-op for interface parity.
        setScore(score) { return Promise.resolve(false); }

        // Returns the logged-in CrazyGames user, or null if unavailable/guest.
        async getUser() {
            if (!this.cg || !this.cg.user) return null;
            try {
                if (typeof this.cg.user.isUserAccountAvailable === 'function' && !await this.cg.user.isUserAccountAvailable()) return null;
                const user = await this.cg.user.getUser();
                if (!user) return null;
                return {
                    username: user.username,
                    profilePictureUrl: user.profilePictureUrl
                };
            } catch (e) {
                console.warn('[CrazyGamesAdapter] getUser failed:', e);
                return null;
            }
        }

        // --- Data Persistence (blob) — CrazyGames data module (cloud-synced) ---

        saveData(data) {
            if (!this.cg || !this.cg.data) return Promise.resolve();
            try {
                this.cg.data.setItem(this._saveKey, data);
            } catch (e) {
                console.warn('[CrazyGamesAdapter] saveData failed:', e);
            }
            return Promise.resolve();
        }

        loadData() {
            if (!this.cg || !this.cg.data) return Promise.resolve(null);
            try {
                const val = this.cg.data.getItem(this._saveKey);
                return Promise.resolve(val != null ? val : null);
            } catch (e) {
                console.warn('[CrazyGamesAdapter] loadData failed:', e);
                return Promise.resolve(null);
            }
        }

        // --- Data Persistence (key-value) — CrazyGames data module ---

        async setItem(key, value) {
            if (!this.cg || !this.cg.data) return;
            try { this.cg.data.setItem(key, String(value)); } catch (e) {
                console.warn('[CrazyGamesAdapter] setItem failed:', e);
            }
        }

        async getItem(key) {
            if (!this.cg || !this.cg.data) return null;
            try {
                const val = this.cg.data.getItem(key);
                return val != null ? val : null;
            } catch (e) {
                return null;
            }
        }

        async removeItem(key) {
            if (!this.cg || !this.cg.data) return;
            try { this.cg.data.removeItem(key); } catch (e) { }
        }

        async clearData() {
            if (!this.cg || !this.cg.data) return;
            try { this.cg.data.clear(); } catch (e) { }
        }

        // Returns the user's locale (BCP-47) from CrazyGames, falling back to the browser.
        getLanguage() {
            try {
                const info = this.cg && this.cg.user && this.cg.user.systemInfo;
                if (info && info.locale) return info.locale;
            } catch (e) { }
            return navigator.language || 'en-US';
        }

        getEnvironment() {
            if (!this.cg) return 'disabled';
            try {
                return this.cg.environment || 'local';
            } catch (e) {
                return 'crazygames';
            }
        }

        // --- Ads (CrazyGames) ---
        //   requestAd fires adStarted when the ad begins, adFinished on completion
        //   (or reward earned for 'rewarded'), and adError on failure/no-fill.
        async showAd(type = 'midgame', callbacks = {}, rewardId = 'default-reward') {
            if (!this.cg || !this.cg.ad) {
                console.log(`[CrazyGamesAdapter] showAd(${type}) — ad module unavailable.`);
                if (callbacks.onFinished) callbacks.onFinished();
                return true;
            }
            // CrazyGames only supports 'midgame' and 'rewarded'.
            const adType = type === 'rewarded' ? 'rewarded' : 'midgame';
            return new Promise((resolve) => {
                let settled = false;
                const settle = (ok) => {
                    if (settled) return;
                    settled = true;
                    resolve(ok);
                };
                try {
                    this.cg.ad.requestAd(adType, {
                        adStarted: () => {
                            if (callbacks.onStarted) callbacks.onStarted();
                        },
                        adFinished: () => {
                            if (callbacks.onFinished) callbacks.onFinished();
                            settle(true);
                        },
                        adError: (err) => {
                            console.warn('[CrazyGamesAdapter] ad error:', err);
                            if (callbacks.onError) callbacks.onError(err);
                            settle(false);
                        }
                    });
                } catch (e) {
                    console.warn('[CrazyGamesAdapter] showAd failed:', e);
                    if (callbacks.onError) callbacks.onError(e);
                    settle(false);
                }
            });
        }

        async hasAdblock() {
            if (!this.cg || !this.cg.ad) return false;
            try {
                return await this.cg.ad.hasAdblock();
            } catch (e) {
                return false;
            }
        }
    }


    // ===========================================================================
    // 4. MockDevAdapter — local development fallback.
    //    All calls are logged to the console so you can verify integration points
    //    without deploying to either platform.
    // ===========================================================================
    class MockDevAdapter extends BaseSDKAdapter {
        init() {
            console.log('[MockSDK] Initialized (local dev environment).');
            if (!window.lib) {
                const mockEntries = [
                    { userId: '1', username: 'MansionMaster', score: 300, profilePicture: 'https://placekitten.com/50/50', userRank: null },
                    { userId: '2', username: 'SpeedMerger', score: 420, profilePicture: 'https://placekitten.com/50/51', userRank: null },
                    { userId: '3', username: 'DevPlayer_123', score: 540, profilePicture: 'https://placekitten.com/50/52', userRank: 3 },
                    { userId: '4', username: 'CasualBuilder', score: 740, profilePicture: 'https://placekitten.com/50/53', userRank: null }
                ];
                window.lib = {
                    addPlayerScoreToLeaderboard: (score, count) => {
                        console.log('[MockLib] addPlayerScoreToLeaderboard:', score, count);
                        const dev = mockEntries.find(e => e.userId === '3');
                        if (dev) dev.score = score;
                        return Promise.resolve(true);
                    },
                    getTopNEntriesFromLeaderboard: (count) => {
                        console.log('[MockLib] getTopNEntriesFromLeaderboard:', count);
                        const sorted = [...mockEntries].sort((a, b) => a.score - b.score);
                        const userIndex = sorted.findIndex(e => e.userId === '3');
                        return Promise.resolve({
                            entries: sorted.slice(0, count),
                            userRank: userIndex !== -1 ? userIndex + 1 : null
                        });
                    },
                    log: (msg) => {
                        console.log('[MockLib] log:', msg);
                    }
                };
            }
            return Promise.resolve(true);
        }
        loadingStart() {
            console.log('[MockSDK] loadingStart()');
        }
        firstFrameReady() {
            console.log('[MockSDK] firstFrameReady()');
        }
        loadingStop() {
            console.log('[MockSDK] loadingStop() / gameReady()');
        }
        gameplayStart() {
            console.log('[MockSDK] gameplayStart()');
        }
        gameplayStop() {
            console.log('[MockSDK] gameplayStop()');
        }
        happyTime() {
            console.log('[MockSDK] happyTime() 🎉');
        }
        // Stateful so the host-mute path is actually reproducible in dev: flip it
        // with window.__mockAudioEnabledChange(false). Deliberately unlogged —
        // the game polls this several times a second.
        isAudioEnabled() {
            return this._audioEnabled !== false;
        }
        onPause(cb) {
            console.log('[MockSDK] onPause() registered. (Trigger via window.__mockPause() in DevTools)');
            window.__mockPause = cb;
        }
        onResume(cb) {
            console.log('[MockSDK] onResume() registered. (Trigger via window.__mockResume() in DevTools)');
            window.__mockResume = cb;
        }
        onAudioEnabledChange(cb) {
            console.log('[MockSDK] onAudioEnabledChange() registered. (Trigger via window.__mockAudioEnabledChange(bool) in DevTools)');
            window.__mockAudioEnabledChange = (enabled) => {
                // Mirror the real host: the getter flips first, then the event fires.
                this._audioEnabled = enabled !== false;
                console.log('[MockSDK] audio enabled →', this._audioEnabled);
                cb(this._audioEnabled);
            };
        }
        setScore(score) {
            console.log('[MockSDK] setScore:', score);
            return Promise.resolve(true);
        }
        getUser() {
            console.log('[MockSDK] getUser() called.');
            return Promise.resolve({ username: 'Player', profilePictureUrl: 'https://placekitten.com/100/100' });
        }

        // --- Data Persistence (blob) ---

        saveData(data) {
            console.log('[MockSDK] saveData() → storing to localStorage');
            try { localStorage.setItem('merge_mansion_save', data); } catch (e) { }
            return Promise.resolve();
        }
        loadData() {
            const data = localStorage.getItem('merge_mansion_save');
            console.log('[MockSDK] loadData() →', data ? 'found saved data' : 'no data found');
            return Promise.resolve(data);
        }

        // --- Data Persistence (key-value via localStorage) ---

        setItem(key, value) {
            console.log('[MockSDK] setItem(' + key + ')');
            try { localStorage.setItem('mock_' + key, value); } catch (e) { }
            return Promise.resolve();
        }
        getItem(key) {
            const val = localStorage.getItem('mock_' + key);
            console.log('[MockSDK] getItem(' + key + ') →', val ? 'found' : 'null');
            return Promise.resolve(val);
        }
        removeItem(key) {
            console.log('[MockSDK] removeItem(' + key + ')');
            try { localStorage.removeItem('mock_' + key); } catch (e) { }
            return Promise.resolve();
        }
        clearData() {
            console.log('[MockSDK] clearData()');
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('mock_')) keys.push(k);
            }
            keys.forEach(k => localStorage.removeItem(k));
            return Promise.resolve();
        }

        getLanguage() {
            const lang = navigator.language || 'en-US';
            console.log('[MockSDK] getLanguage() →', lang);
            return lang;
        }
        getEnvironment() {
            console.log('[MockSDK] getEnvironment() → local');
            return 'local';
        }
        showAd(type, callbacks = {}, rewardId = 'default-reward') {
            console.log(`[MockSDK] showAd(${type}, rewardId: ${rewardId}) → simulated (resolves instantly)`);
            console.log('[MockSDK] Simulating: onStarted → onFinished');
            if (callbacks.onStarted) callbacks.onStarted();
            setTimeout(() => {
                if (callbacks.onFinished) callbacks.onFinished();
            }, 100);
            return Promise.resolve(true);
        }
        hasAdblock() {
            console.log('[MockSDK] hasAdblock() → false');
            return Promise.resolve(false);
        }
        vibrate(pattern) {
            console.log('[MockSDK] vibrate() called with pattern:', pattern);
            super.vibrate(pattern);
        }
    }


    // Static Initialization
    const DISABLE_CRAZYGAMES = false; // Set to false to re-enable CrazyGames SDK
    const params = new URLSearchParams(window.location.search);
    const force = params.get('sdk');
    let adapter;

    if (!DISABLE_CRAZYGAMES && (force === 'crazygames' ||
        (force !== 'local' && force !== 'mock' && window.CrazyGames && window.CrazyGames.SDK))) {
        adapter = new CrazyGamesAdapter();
    } else {
        adapter = new MockDevAdapter();
    }

    // Kick off initialization. CrazyGamesAdapter.init() memoizes its promise, so
    // the awaited init() call in main.js reuses this same initialization.
    adapter.init();

    // Expose globally as window.GameSDK
    window.GameSDK = adapter;
})();
