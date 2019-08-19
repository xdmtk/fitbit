import { HeartRateSensor } from "heart-rate";
import document from "document";
import { display } from "display";
import clock from "clock";
import { battery } from "power";
import { today } from "user-activity";
import { memory } from "system";
import { display } from "display";
import { me } from "companion";
import { Barometer } from "barometer";
import * as messaging from "messaging";







/* 
 *
 * Misc
 *
 */
function splitLines(text) {
	let words = text.split("");
	let line = "";
	words.forEach(function (element){
        line += element;
	});
	return line;
}


function padDigit(digit) {
	if (digit < 10) {
		return "0" + digit;
	}
	else {
		return digit;
	}
}


function padLine(text) {
	while (text.length < lineLimit) {
		text += " ";
	}
	return text;
}


function msgCycler() {
	let l = msgList.length;
	msgenum += 1;
	if (msgenum === l) {
		msgenum = 0;
	}
}


function altitudeFromPressure(pressure) {
	  return (1 - (pressure/1013.25)**0.190284)*145366.45;
}



/* 
 *
 * Main BG Animation Function
 *
 */
function pulsate() {
	if (display.on) {
		ticker = true;
		if (frameNumber < 31 && f) {
			frameNumber += 1;
		}
		else if (frameNumber > 0 && !f) {
			frameNumber -= 1;
		}
		else {
			f = !f;
		}
		frameString = "pulse/p-" + frameNumber + ".png";
		bgImage.image = frameString;
	}
	else {
		clearInterval(pulser);
		ticker = false;
	}
}


/* 
 *
 * Heart Rate Monitor Functiion
 *
 */
function startHrm(){
	// Start Heart monitor
	hrm = new HeartRateSensor();
	hrm.onreading = function() {
		hbpm = hrm.heartRate;
	}
	hrm.start();
}


function startBrm() {

	bar = new Barometer();
	bar.onreading = function()  {
		elev = altitudeFromPressure(bar.pressure / 100);
	}

	// Begin monitoring the sensor
	bar.start();
}



/* 
 *
 * Sensor Master Controls
 *
 */
function sensorControl(control) {
	if (control === "start") {
		hrm.start();
		bar.start();
	}
	else if (control === "stop") {
		hrm.stop();
		bar.stop();
	}
}











/* 
 *
 * BETA: Weather functions
 *
 */
// Request weather data from the companion
function fetchWeather() {
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		// Send a command to the companion
		messaging.peerSocket.send({
		command: 'weather'
		});
	}
}

// Display the weather data received from the companion
function processWeatherData(data) {
	console.log("The temperature is: " + data.temperature);
	console.log("The city is: " + data.city);
	console.log("The conditions are: " + data.condition);
	
	temperature = ((data.temperature*1.8)- 459.67).toFixed(0);
	city = data.city;
	conditions = data.condition;

}


function setupWeatherModule() {
	// Listen for the onopen event
	messaging.peerSocket.onopen = function() {
		// Fetch weather when the connection opens
		console.log("fetching weather");
		fetchWeather();
	}

	// Listen for messages from the companion
	messaging.peerSocket.onmessage = function(evt) {
		if (evt.data) {
			processWeatherData(evt.data);
		}
	}

	// Listen for the onerror event
	messaging.peerSocket.onerror = function(err) {
	// Handle any errors
	console.log("Connection error: " + err.code + " - " + err.message);
	}

	console.log("setting interval");
	// Fetch the weather every 30 minutes
	setInterval(fetchWeather, 30 * 1000 * 60);
}

