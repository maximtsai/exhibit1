(function () {
    'use strict';

    // ===========================================================================
    // 0. Crypto helpers — CrazyGames v3 requires AES-GCM encrypted scores.
    //    The encryption key is a Base64-encoded 256-bit key from the Developer
    //    Portal's Leaderboard tab.
    // ===========================================================================



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

        // --- Platform-Specific Engagement ---

        // Opens a YouTube video by videoId. No-op on non-YT platforms.
        // videoId: string
        openYTContent(videoId) { }

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

        // --- Health / Diagnostics ---

        // Reports that an error occurred to the platform's diagnostics
        // (best-effort, no payload — the YT API takes no arguments).
        logError() { }

        // Reports a warning to the platform's diagnostics.
        logWarning() { }
    }



    // 3. YouTubePlayablesAdapter
    //    Wraps the YouTube Playables SDK (window.ytgame namespace).
    //    SDK script: <script src="https://www.youtube.com/game_api/v1"></script>
    //    Docs: https://developers.google.com/youtube/gaming/playables
    //
    //    Module map:
    //      ytgame.game       — lifecycle: firstFrameReady, gameReady, saveData, loadData
    //      ytgame.system     — environment: isAudioEnabled, onPause, onResume, getLanguage
    //      ytgame.engagement — player: sendScore, openYTContent
    //      ytgame.ads        — ads: requestInterstitialAd, requestRewardedAd
    // ===========================================================================
    class YouTubePlayablesAdapter extends BaseSDKAdapter {
        constructor() {
            super();
            this.yt = null; // reference to window.ytgame
            // Unsubscribe handles returned by onPause / onResume / onAudioEnabledChange.
            this._unsubs = [];
            // In-memory key-value store to replace local storage
            this._storage = {};
        }

        init() {
            this.yt = window.ytgame || null;
            if (!this.yt) {
                console.log('[YouTubePlayablesAdapter] ytgame SDK not present.');
                return Promise.resolve(false);
            }
            console.log('[YouTubePlayablesAdapter] ytgame SDK detected.');
            return Promise.resolve(true);
        }

        // Signals to YouTube that the first visual frame has rendered.
        // Must be called as soon as any content appears on screen.
        firstFrameReady() {
            if (!this.yt || !this.yt.game) return;
            try {
                this.yt.game.firstFrameReady();
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] firstFrameReady failed:', e);
            }
        }

        // Signals to YouTube that all assets are loaded and the game is playable.
        // Dismisses the YouTube loading UI.
        loadingStop() {
            if (!this.yt || !this.yt.game) return;
            try {
                this.yt.game.gameReady();
                console.log('[YouTubePlayablesAdapter] gameReady() called.');
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] gameReady failed:', e);
            }
        }

        // YouTube does not have separate gameplayStart/gameplayStop hooks — no-ops.
        gameplayStart() { }
        gameplayStop() { }

        // YouTube has no happyTime equivalent — no-op.
        happyTime() { }

        // Returns whether the YouTube container currently has audio enabled.
        isAudioEnabled() {
            if (!this.yt || !this.yt.system) return true;
            try {
                return this.yt.system.isAudioEnabled();
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] isAudioEnabled failed:', e);
                return true;
            }
        }

        // Registers a callback fired when YouTube requests the game to pause.
        // Returns the SDK's unsubscribe function.
        onPause(cb) {
            if (!this.yt || !this.yt.system) return () => { };
            try {
                const unsub = this.yt.system.onPause(cb);
                if (typeof unsub === 'function') this._unsubs.push(unsub);
                return unsub || (() => { });
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] onPause failed:', e);
                return () => { };
            }
        }

        // Registers a callback fired when YouTube requests the game to resume.
        // Returns the SDK's unsubscribe function.
        onResume(cb) {
            if (!this.yt || !this.yt.system) return () => { };
            try {
                const unsub = this.yt.system.onResume(cb);
                if (typeof unsub === 'function') this._unsubs.push(unsub);
                return unsub || (() => { });
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] onResume failed:', e);
                return () => { };
            }
        }

        // Registers a callback fired when YouTube's audio enablement changes.
        // Returns the SDK's unsubscribe function.
        onAudioEnabledChange(cb) {
            if (!this.yt || !this.yt.system) return () => { };
            try {
                const unsub = this.yt.system.onAudioEnabledChange(cb);
                if (typeof unsub === 'function') this._unsubs.push(unsub);
                return unsub || (() => { });
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] onAudioEnabledChange failed:', e);
                return () => { };
            }
        }

        // Unsubscribes all registered event listeners to prevent memory leaks.
        cleanup() {
            for (const unsub of this._unsubs) {
                try { unsub(); } catch (e) {
                    console.warn('[YouTubePlayablesAdapter] cleanup unsub failed:', e);
                }
            }
            this._unsubs = [];
        }

        // Sends the player's score to YouTube.
        // sendScore returns Promise<void> — we must await it and handle errors.
        async setScore(score) {
            if (!this.yt || !this.yt.engagement) return false;
            try {
                await this.yt.engagement.sendScore({ value: Math.floor(score) });
                return true;
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] sendScore failed:', e);
                return false;
            }
        }

        // YouTube Playables does not expose user profile data directly to the game for privacy reasons.
        getUser() {
            return Promise.resolve(null);
        }

        // --- Data Persistence (blob) ---

        saveData(data) {
            if (!this.yt || !this.yt.game) return Promise.resolve();
            try {
                // Wrap in Promise.resolve so an async rejection (e.g. SIZE_LIMIT_EXCEEDED)
                // is caught here rather than surfacing as an unhandled rejection.
                return Promise.resolve(this.yt.game.saveData(data)).catch((e) => {
                    console.warn('[YouTubePlayablesAdapter] saveData failed:', e);
                });
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] saveData failed:', e);
                return Promise.resolve();
            }
        }

        loadData() {
            if (!this.yt || !this.yt.game) return Promise.resolve(null);
            try {
                return this.yt.game.loadData();
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] loadData failed:', e);
                return Promise.resolve(null);
            }
        }

        // --- Data Persistence (in-memory key-value storage) ---

        async setItem(key, value) {
            this._storage[key] = String(value);
        }

        async getItem(key) {
            const val = this._storage[key];
            return val !== undefined ? val : null;
        }

        async removeItem(key) {
            delete this._storage[key];
        }

        async clearData() {
            this._storage = {};
        }

        getLanguage() {
            if (!this.yt || !this.yt.system) {
                return navigator.language || 'en-US';
            }
            try {
                return this.yt.system.getLanguage();
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] getLanguage failed:', e);
                return navigator.language || 'en-US';
            }
        }

        getEnvironment() {
            if (!this.yt) return 'disabled';
            try {
                return this.yt.IN_PLAYABLES_ENV ? 'youtube' : 'local';
            } catch (e) {
                return 'youtube';
            }
        }

        // Opens a YouTube video by its video ID in the YouTube app/site.
        openYTContent(videoId) {
            if (!this.yt || !this.yt.engagement) return;
            try {
                const contentType = (this.yt.engagement.ContentType && this.yt.engagement.ContentType.VIDEO) || 'VIDEO';
                // openYTContent returns a Promise that rejects with SdkError on
                // failure — catch it here or it surfaces as an unhandled rejection
                // (the surrounding try/catch only covers synchronous throws).
                Promise.resolve(this.yt.engagement.openYTContent({ id: videoId, contentType: contentType })).catch((e) => {
                    console.warn('[YouTubePlayablesAdapter] openYTContent failed:', e);
                });
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] openYTContent failed:', e);
            }
        }

        // --- Ads (YouTube Playables) ---

        async showAd(type = 'midgame', callbacks = {}, rewardId = 'default-reward') {
            if (!this.yt || !this.yt.ads) {
                console.log(`[YouTubePlayablesAdapter] showAd(${type}) — ytgame.ads not available.`);
                if (callbacks.onFinished) callbacks.onFinished();
                return true;
            }
            try {
                if (callbacks.onStarted) callbacks.onStarted();

                let rewarded = false;
                if (type === 'rewarded') {
                    rewarded = await this.yt.ads.requestRewardedAd(rewardId);
                    if (rewarded) {
                        if (callbacks.onFinished) callbacks.onFinished();
                    } else {
                        if (callbacks.onError) callbacks.onError('ad_closed_early');
                    }
                } else {
                    await this.yt.ads.requestInterstitialAd();
                    if (callbacks.onFinished) callbacks.onFinished();
                    rewarded = true;
                }

                return rewarded;
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] showAd failed:', e);
                if (callbacks.onError) callbacks.onError(e);
                return false;
            }
        }

        // YouTube manages adblock at the container level — game can't detect it.
        hasAdblock() {
            return Promise.resolve(false);
        }

        // --- Health / Diagnostics (ytgame.health) ---
        // Best-effort, rate-limited by YouTube. logError/logWarning take no
        // arguments — they only signal that an error/warning occurred.

        logError() {
            if (!this.yt || !this.yt.health || typeof this.yt.health.logError !== 'function') return;
            try {
                this.yt.health.logError();
            } catch (e) {
                // Never let diagnostics itself throw.
            }
        }

        logWarning() {
            if (!this.yt || !this.yt.health || typeof this.yt.health.logWarning !== 'function') return;
            try {
                this.yt.health.logWarning();
            } catch (e) {
                // Never let diagnostics itself throw.
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
        openYTContent(videoId) {
            console.log('[MockSDK] openYTContent(' + videoId + ') → opening in new tab');
            window.open('https://www.youtube.com/watch?v=' + videoId, '_blank');
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
    }


    // Static Initialization
    const params = new URLSearchParams(window.location.search);
    const force = params.get('sdk');
    let adapter;

    if (force === 'youtube' ||
        window.location.hostname.includes('youtube.com') ||
        (window.ytgame && window.ytgame.IN_PLAYABLES_ENV) ||
        window.ytPlayablesActive) {
        adapter = new YouTubePlayablesAdapter();
    } else {
        adapter = new MockDevAdapter();
    }

    adapter.init();

    // Expose globally as window.GameSDK
    window.GameSDK = adapter;

    // Backward compatibility shim functions for existing sdkWrapper calls across room scripts and main logic
    window.sdkWrapperInit = function () {
        if (window.GameSDK && typeof window.GameSDK.init === 'function') window.GameSDK.init();
    };
    window.sdkWrapperGameLoadingStart = function () {
        if (window.GameSDK && typeof window.GameSDK.loadingStart === 'function') window.GameSDK.loadingStart();
    };
    window.sdkWrapperGameLoadingStop = function () {
        if (window.GameSDK && typeof window.GameSDK.loadingStop === 'function') window.GameSDK.loadingStop();
    };
    window.sdkWrapperGameplayStart = function () {
        if (window.GameSDK && typeof window.GameSDK.gameplayStart === 'function') window.GameSDK.gameplayStart();
    };
    window.sdkWrapperGameplayStop = function () {
        if (window.GameSDK && typeof window.GameSDK.gameplayStop === 'function') window.GameSDK.gameplayStop();
    };
    window.sdkWrapperRequestResponsiveBanner = function () { };
    window.sdkWrapperClearAllBanners = function () { };
    window.sdkWrapperResizeBanners = function () { };
    window.sdkCommercialBreak = function (onStart, onResume) {
        if (window.GameSDK && typeof window.GameSDK.showAd === 'function') {
            window.GameSDK.showAd('midgame', { onStarted: onStart, onFinished: onResume });
        } else {
            if (onStart) onStart();
            if (onResume) onResume();
        }
    };
    window.sdkRewardedBreak = function (onStart, onFinished) {
        if (window.GameSDK && typeof window.GameSDK.showAd === 'function') {
            window.GameSDK.showAd('rewarded', { onStarted: onStart, onFinished: onFinished });
        } else {
            if (onStart) onStart();
            if (onFinished) onFinished(true);
        }
    };

    // Report uncaught errors and unhandled promise rejections to the platform's
    // health diagnostics (ytgame.health on YouTube; no-op elsewhere). The API
    // carries no payload — it only signals that an error occurred — and details
    // still reach the console as normal since these listeners don't swallow
    // anything. Self-throttled so an error inside the 60fps render loop doesn't
    // hammer the SDK (YouTube rate-limits on its end too).
    let lastHealthReport = 0;
    const reportError = () => {
        const now = Date.now();
        if (now - lastHealthReport < 5000) return;
        lastHealthReport = now;
        try { adapter.logError(); } catch (e) { }
    };
    window.addEventListener('error', reportError);
    window.addEventListener('unhandledrejection', reportError);
})();

