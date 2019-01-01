import { createRequest } from "endpoint";
import { me } from "companion";
import { localStorage } from "local-storaddge";


const MIN_MULTIPLIER = 1000 * 60;
const HOUR_MULTIPLIER = 60;
const WAKEUP_TIMER = 4 * HOUR_MULTIPLIER * MIN_MULTIPLIER;

// me.wakeInterval = WAKEUP_TIMER;


function main() {
	setupMessaging();
}

function setupMessaging() {
	messaging.peerSocket.onopen = function() {
		socketReady = true;
		console.log("Companion connection established, ready to send msg");
	}
	messaging.peerSocket.onerror = function(err) {
		console.log("Connection error: " + err.code + " - " + err.message);
		socketReady = false;

	}
	messaging.peerSocket.onmessage = function(evt) {
			var cal = evt.data;
			localStorage.setItem("calories", cal);
			console.log("incoming message with data: " + cal + "\nsetting local storage");
	}
}



main();
