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

        // Returns a Promise resolving to a BCP-47 locale tag (e.g. "en-US").
        // Async because YouTube's ytgame.system.getLanguage() returns a Promise -
        // the interface has to be the async one or the return type would differ
        // per platform and callers would break only on YouTube.
        getLanguage() { return Promise.resolve(navigator.language || 'en-US'); }

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



    // 2. YouTubePlayablesAdapter
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
            // Unsubscribe handles returned by onPause / onResume / onAudioEnabledChange.
            this._unsubs = [];
            // In-memory key-value store to replace local storage
            this._storage = {};
            // Calls made before the SDK script finished executing, replayed once
            // it appears. Without this a slow SDK load is indistinguishable from
            // a missing one: gameReady() would be dropped and YouTube would sit
            // on its own loading spinner forever with the game running behind it.
            this._pending = { firstFrameReady: false, gameReady: false, subs: [] };
            this._sdkWatchTimer = null;
        }

        // Resolved live rather than captured once in init(). The SDK is a separate
        // network request from a third-party origin, so it can execute after this
        // file does; caching window.ytgame at construction made any late arrival
        // permanent failure.
        get yt() {
            return window.ytgame || null;
        }

        init() {
            if (this.yt) {
                console.log('[YouTubePlayablesAdapter] ytgame SDK detected.');
                return Promise.resolve(true);
            }
            console.warn('[YouTubePlayablesAdapter] ytgame SDK not present yet — watching for it.');
            this._watchForSdk();
            return Promise.resolve(false);
        }

        // Poll for a late-loading SDK, then replay anything that was queued.
        _watchForSdk(timeoutMs = 15000, intervalMs = 250) {
            if (this._sdkWatchTimer || this.yt) return;
            let waited = 0;
            this._sdkWatchTimer = setInterval(() => {
                if (this.yt) {
                    clearInterval(this._sdkWatchTimer);
                    this._sdkWatchTimer = null;
                    console.log('[YouTubePlayablesAdapter] ytgame SDK arrived late — replaying queued calls.');
                    this._flushPending();
                    return;
                }
                waited += intervalMs;
                if (waited >= timeoutMs) {
                    clearInterval(this._sdkWatchTimer);
                    this._sdkWatchTimer = null;
                    console.error('[YouTubePlayablesAdapter] ytgame SDK never loaded after ' +
                        (timeoutMs / 1000) + 's; continuing without platform integration.');
                }
            }, intervalMs);
        }

        _flushPending() {
            let subs = this._pending.subs;
            this._pending.subs = [];
            for (let i = 0; i < subs.length; i++) {
                this._subscribe(subs[i].name, subs[i].cb);
            }
            if (this._pending.firstFrameReady) {
                this._pending.firstFrameReady = false;
                this.firstFrameReady();
            }
            if (this._pending.gameReady) {
                this._pending.gameReady = false;
                this.loadingStop();
            }
        }

        // Signals to YouTube that the first visual frame has rendered.
        // Must be called as soon as any content appears on screen.
        firstFrameReady() {
            let yt = this.yt;
            if (!yt || !yt.game) {
                this._pending.firstFrameReady = true;
                this._watchForSdk();
                return;
            }
            try {
                yt.game.firstFrameReady();
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] firstFrameReady failed:', e);
            }
        }

        // Signals to YouTube that all assets are loaded and the game is playable.
        // Dismisses the YouTube loading UI.
        loadingStop() {
            let yt = this.yt;
            if (!yt || !yt.game) {
                this._pending.gameReady = true;
                this._watchForSdk();
                return;
            }
            try {
                yt.game.gameReady();
                console.log('[YouTubePlayablesAdapter] gameReady() called.');
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] gameReady failed:', e);
            }
        }

        // YouTube does not have separate gameplayStart/gameplayStop hooks — no-ops.
        gameplayStart() { }
        gameplayStop() { }

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

        // Shared registration path. The game subscribes once at boot, which can be
        // before the SDK script has executed - queue those and register them for
        // real once it turns up, or pause/resume/mute events would be lost for the
        // whole session.
        _subscribe(name, cb) {
            let yt = this.yt;
            if (!yt || !yt.system || typeof yt.system[name] !== 'function') {
                this._pending.subs.push({ name: name, cb: cb });
                this._watchForSdk();
                return () => {
                    this._pending.subs = this._pending.subs.filter(s => s.cb !== cb);
                };
            }
            try {
                const unsub = yt.system[name](cb);
                if (typeof unsub === 'function') this._unsubs.push(unsub);
                return unsub || (() => { });
            } catch (e) {
                console.warn(`[YouTubePlayablesAdapter] ${name} failed:`, e);
                return () => { };
            }
        }

        // Registers a callback fired when YouTube requests the game to pause.
        // Returns the SDK's unsubscribe function.
        onPause(cb) { return this._subscribe('onPause', cb); }

        // Registers a callback fired when YouTube requests the game to resume.
        // Returns the SDK's unsubscribe function.
        onResume(cb) { return this._subscribe('onResume', cb); }

        // Registers a callback fired when YouTube's audio enablement changes.
        // Returns the SDK's unsubscribe function.
        onAudioEnabledChange(cb) { return this._subscribe('onAudioEnabledChange', cb); }

        // Unsubscribes all registered event listeners to prevent memory leaks.
        cleanup() {
            if (this._sdkWatchTimer) {
                clearInterval(this._sdkWatchTimer);
                this._sdkWatchTimer = null;
            }
            this._pending.subs = [];
            for (const unsub of this._unsubs) {
                try { unsub(); } catch (e) {
                    console.warn('[YouTubePlayablesAdapter] cleanup unsub failed:', e);
                }
            }
            this._unsubs = [];
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

        // ytgame.system.getLanguage() resolves asynchronously, so every path here
        // returns a Promise<string> to match the interface. Rejections fall back
        // to the browser locale rather than surfacing as an unhandled rejection.
        getLanguage() {
            const fallback = navigator.language || 'en-US';
            if (!this.yt || !this.yt.system) {
                return Promise.resolve(fallback);
            }
            try {
                return Promise.resolve(this.yt.system.getLanguage()).catch((e) => {
                    console.warn('[YouTubePlayablesAdapter] getLanguage failed:', e);
                    return fallback;
                });
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] getLanguage failed:', e);
                return Promise.resolve(fallback);
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
                // ContentType is a numeric enum: { VIDEO: 0, PLAYABLE: 1 }. VIDEO is
                // 0, so `|| 'VIDEO'` would discard the valid value and send a string
                // instead - check for undefined rather than falsiness.
                const ct = this.yt.engagement.ContentType;
                const contentType = (ct && ct.VIDEO !== undefined) ? ct.VIDEO : 0;
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
                // Do not treat missing ads as a successful rewarded view.
                if (type === 'rewarded') {
                    if (callbacks.onError) callbacks.onError('ads_unavailable');
                    return false;
                }
                if (callbacks.onFinished) callbacks.onFinished();
                return true;
            }
            try {
                if (callbacks.onStarted) callbacks.onStarted();

                // Official SDK:
                //   requestRewardedAd(rewardId) → Promise<boolean> (true = earned)
                //   requestInterstitialAd()     → Promise<void> (resolve = ok, reject = fail)
                if (type === 'rewarded') {
                    const earned = await this.yt.ads.requestRewardedAd(rewardId);
                    if (earned) {
                        if (callbacks.onFinished) callbacks.onFinished();
                    } else if (callbacks.onError) {
                        callbacks.onError('ad_not_earned');
                    }
                    return !!earned;
                }

                await this.yt.ads.requestInterstitialAd();
                // Gameplay must resume after a successful interstitial request.
                if (callbacks.onFinished) callbacks.onFinished();
                return true;
            } catch (e) {
                console.warn('[YouTubePlayablesAdapter] showAd failed:', e);
                if (callbacks.onError) callbacks.onError(e);
                // A mid-game ad that never played must still resume the game.
                // Ad requests reject routinely (adblock, unfilled, no network), and
                // callers use onFinished to unmute and continue — skipping it here
                // left the music silenced forever and the endgame replay button
                // dead. Rewarded ads deliberately do NOT resume this way, because
                // their onFinished is what grants the reward.
                if (type !== 'rewarded' && callbacks.onFinished) callbacks.onFinished();
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
    // 3. MockDevAdapter — local development fallback.
    //    All calls are logged to the console so you can verify integration points
    //    without deploying to either platform.
    // ===========================================================================
    class MockDevAdapter extends BaseSDKAdapter {
        init() {
            console.log('[MockSDK] Initialized (local dev environment).');
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
            return Promise.resolve(lang);
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
    const adapter = new YouTubePlayablesAdapter();

    adapter.init();

    // Silence the whole game for the duration of any ad. Individual call sites
    // only mute the music tracks they happen to know about, which left the
    // ambient loops (watergurgle, pumpamb, fan1/fan2 — all started with direct
    // .play() calls) audible underneath a YouTube interstitial. main.js owns the
    // actual mute so this cannot fight the host's own audio state.
    function suspendGameAudioForAd(suspended) {
        if (typeof window.setAdAudioSuspended === 'function') {
            try { window.setAdAudioSuspended(suspended); } catch (e) { }
        }
    }

    // Wrapped once here rather than inside each adapter so it covers every ad
    // path, including callers that reach for GameSDK.showAd directly.
    const _showAd = adapter.showAd.bind(adapter);
    adapter.showAd = function (type, callbacks, rewardId) {
        const cb = callbacks || {};
        return _showAd(type, {
            onStarted: () => {
                suspendGameAudioForAd(true);
                if (cb.onStarted) cb.onStarted();
            },
            onFinished: () => {
                suspendGameAudioForAd(false);
                if (cb.onFinished) cb.onFinished();
            },
            onError: (e) => {
                suspendGameAudioForAd(false);
                if (cb.onError) cb.onError(e);
            }
        }, rewardId);
    };

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
    // onError is required for correctness, not optional: rewarded ads reject
    // routinely (adblock, unfilled, closed early), and onFinished cannot double as
    // the resume hook because it is what grants the reward. Whatever onStart did,
    // undo it in onError. Game-wide audio is handled centrally by the showAd
    // wrapper above, so onError only needs to undo caller-specific state.
    window.sdkRewardedBreak = function (onStart, onFinished, onError) {
        if (window.GameSDK && typeof window.GameSDK.showAd === 'function') {
            window.GameSDK.showAd('rewarded', {
                onStarted: onStart,
                onFinished: onFinished,
                onError: onError
            });
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

