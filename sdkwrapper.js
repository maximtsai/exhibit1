let useSDK = false;
let crazysdk = null;
let gameplayOn = false;

function sdkWrapperInit() {
	if (useSDK) {
		PokiSDK.init().then(() => {
		    console.log("Poki SDK successfully initialized");
		    // fire your function to continue to game
		}).catch(() => {
		    console.log("Initialized, something went wrong, load you game anyway");
		    // fire your function to continue to game
		});
	}
}

function sdkWrapperGameLoadingStart() {
	if (useSDK) {
		// crazysdk.sdkGameLoadingStart()
	}
}

function sdkWrapperRequestResponsiveBanner(name) {
	if (useSDK) {
		// crazysdk.requestResponsiveBanner([name])
	}
}

function sdkWrapperGameLoadingStop() {
	if (useSDK) {
		PokiSDK.gameLoadingFinished();
	}
}

function sdkWrapperGameplayStart() {
	if (!gameplayOn) {
		if (useSDK) {
			PokiSDK.gameplayStart();
		}
		gameplayOn = true;
		console.log("Gameplay Start");
	}
}

function sdkWrapperGameplayStop() {
	if (gameplayOn) {
		if (useSDK) {
			PokiSDK.gameplayStop();
		}
		gameplayOn = false;
		console.log("Gameplay Stop");
	}
}

function sdkWrapperClearAllBanners() {
	if (useSDK) {

	}
}

function sdkCommercialBreak(onStart, onResume) {
	if (useSDK) {
		console.log("commercial break");
		PokiSDK.commercialBreak(() => {
			console.log("commercial break - on start");
		// you can pause any background music or other audio here
			onStart();
		}).then(() => {
		    // PokiSDK.gameplayStart();
		    onResume();
		  // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		  // continue your game here
		});
	}
}


function sdkRewardedBreak() {
	if (useSDK) {
		console.log("rewarded break");
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		}).then((success) => {
		    if(success) {
		        // video was displayed, give reward
		    } else {
		        // video not displayed, should not give reward
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
		    // continue your game here
		});
	}
}

function sdkWrapperResizeBanners() {
	if (useSDK) {

	}
}
