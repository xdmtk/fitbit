import { createRequest } from "endpoint";
import { me } from "companion";
import { localStorage } from "local-storage";
import * as messaging from "messaging";


const MIN_MULTIPLIER = 1000 * 60;
const HOUR_MULTIPLIER = 60;
const WAKEUP_TIMER = 4 * HOUR_MULTIPLIER * MIN_MULTIPLIER;

// me.wakeInterval = WAKEUP_TIMER;


function main() {
	setupMessaging();
}

function setupMessaging() {
	messaging.peerSocket.onopen = function() {
		console.log("Companion connection established, ready to send msg");
	}
	messaging.peerSocket.onerror = function(err) {
		console.log("Connection error: " + err.code + " - " + err.message);

	}
	messaging.peerSocket.onmessage = function(evt) {
			var userArr = evt.data.split(",");
			localStorage.setItem("calories", userArr[1]);
			localStorage.setItem("user", userArr[0]);
			console.log("incoming message with data: " + cal + "\nsetting local storage");
			
			uploadData();
	}
}

function uploadData() {
	let user = localStorage.getItem("user");
	let cals = localStorage.getItem("calories");
	var uid;
	if (user === "nick") {
		uid = 0;
	}
	else {
		uid = 1;
	}
	let endpoint = createRequest(uid,cals);
	fetch(endpoint)
	.then(function(response) {
		console.log("success fetch" + response) ;
	})
	.catch(function(error) {
		console.log("error fetch" + error) ;
	});


}


main();
