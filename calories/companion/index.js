import { createRequest } from "./endpoint";
import { me } from "companion";
import { localStorage } from "local-storage";
import * as messaging from "messaging";


const MIN_MULTIPLIER = 1000 * 60;
const HOUR_MULTIPLIER = 60;
const WAKEUP_TIMER = 2 * HOUR_MULTIPLIER * MIN_MULTIPLIER;



function main() {
	me.wakeInterval = WAKEUP_TIMER;
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
			localStorage.setItem("user", userArr[0]);
			localStorage.setItem("calories", userArr[1]);
			localStorage.setItem("burned", userArr[2]);
			localStorage.setItem("weight", userArr[3]);
			console.log("incoming message with data: " +
				userArr[1] +  " : " + userArr[2] + 
				" : " + userArr[0] + "\nsetting local storage");

			uploadData();
	}
}

function uploadData() {
    let uid = 0;
	let cals = localStorage.getItem("calories");
	let burned = localStorage.getItem("burned");
	let weight = localStorage.getItem("weight");
	let endpoint = createRequest(uid,cals,burned,weight);
	console.log("fetching endpoint: " + endpoint);
	fetch(endpoint, {
		headers: {
			'API_KEY' : `${getApiKey()}`
		}
	})
	.then(function(response) {
        response.json().then(function (t) {
            console.log("You calories: " + t[0][0]['calories']);
            console.log("Other calories: " + t[1][0]['calories']);
            localStorage.setItem("calYou", t[0][0]['calories']);
            localStorage.setItem("calOther", t[1][0]['calories']);

			messaging.peerSocket.send(t[0][0]['calories']+ "," + t[1][0]['calories'] + "," + t[1][0]['date']
                + "," + t[0][0]['burned'] + "," + t[1][0]['burned']);
			console.log("sent data back to device");


        });
	})
	.catch(function(error) {
		console.log("error fetch" + error) ;
	});


}


main();
