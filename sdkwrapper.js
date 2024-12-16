let useSDK = true;

function sdkWrapperGameLoadingStart() {
    if (useSDK) {
        window.CrazyGames.SDK.game.loadingStart();
    }
}

function sdkWrapperRequestResponsiveBanner(name) {
    if (useSDK) {
        window.CrazyGames.SDK.banner.requestResponsiveBanner(name);
    }
}

function sdkWrapperGameLoadingStop() {
    if (useSDK) {
        window.CrazyGames.SDK.game.loadingStop();
    }
}

function sdkWrapperGameplayStart() {
    if (useSDK) {
        window.CrazyGames.SDK.game.gameplayStart();
    }
}

function sdkWrapperGameplayStop() {
    if (useSDK) {
        window.CrazyGames.SDK.game.gameplayStop();
    }
}

function sdkWrapperClearAllBanners() {
    if (useSDK) {
        window.CrazyGames.SDK.banner.clearAllBanners();
    }
}

function sdkCommercialBreak(onStart, onFinish) {
	if (useSDK) {
        const callbacks = {
            adFinished: () => {onFinish()},
            adError: (error, errorData) => {onFinish()},
            adStarted: () => {onStart()},
        };
        window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
	} else {
        onFinish();
    }
}

function sdkWrapperResizeBanners() {
    if (useSDK) {
        var divTop = document.getElementById('banner-container-top');
        var divBot = document.getElementById('banner-container-end');
        let halfWidthStr = window.innerWidth * 0.5 + "px";
        if (parseInt(game.canvas.style.height) < 400 || game.canvas.style.height == undefined) {
            gameVars.showTinyBanner = !0
        }
        if (!gameVars.showingBannerBot) {
            if (window.innerWidth < 970) {
                divBot.style.width = window.innerWidth + "px";
                divBot.style.left = "calc(50% - " + halfWidthStr + ")"
            } else {
                divBot.style.width = "970px";
                divBot.style.left = "calc(50% - 485px)"
            }
            if (gameVars.showTinyBanner) {
                divBot.style.height = "50px";
                divBot.style.width = "320px";
                divBot.style.left = "calc(50% - 160px)"
            } else {
                divBot.style.height = "120px"
            }
        }
        if (!gameVars.showingBannerTop) {
            if (window.innerWidth < 730) {
                divTop.style.width = window.innerWidth + "px";
                divTop.style.left = "calc(50% - " + halfWidthStr + ")"
            } else {
                divTop.style.width = "730px";
                divTop.style.left = "calc(50% - 365px)"
            }
            if (gameVars.showTinyBanner) {
                divTop.style.height = "50px";
                divBot.style.width = "320px";
                divBot.style.left = "calc(50% - 160px)"
            } else {
                divTop.style.height = "90px"
            }
        }
    }
}