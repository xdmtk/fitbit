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








// ID's
const doc = document.getElementById("foo");
const bgImage = document.getElementById("background-frame");
const l1 = document.getElementById("line1");
const l2 = document.getElementById("line2");
const l3 = document.getElementById("line3");
const l4 = document.getElementById("line4");
const l5 = document.getElementById("line5");

// Message Vars
const lineLimit = 21;
const msgList = [ devStatsStr, healthStatsStr, envStatsStr ];


// Misc
var bashStr = "#!/bin/bash";
var frameNumber = 0;
var frameString = "";
var f = true;

// Clock and BG 
var ticker = false;
var pulser;
var datevar;

// Dev stats
var date;
var time;
var batPercent;
var mem;

// Health data
var dist;
var calories;
var steps

// Heart Rate
var hbpm;
var hrm;

// Barometer
var bar;
var elev;

// Writer globals
var writing = false;
var abortWrite = false;
var msgenum = 0;


/* 
 *
 * Main Function
 *
 */
function main() {




	startHrm();
	startBrm();
	setupEventHandlers();
	setupWeatherModule();
	
	clock.granularity = 'seconds';
	clock.ontick = function (evt) {
		datevar = evt.date;
		if (!ticker) {
			pulser = setInterval(function() {
				pulsate();
			}, 60);
		}
		if (!writing) {
			write(msgList[msgenum]());
			msgCycler();
		}
	};
}



/* 
 *
 * Stats Fetch
 *
 */
function setupEventHandlers() {
	doc.onmousedown = function () {
		abortWrite = true;
		console.log("mouse press");
	}
	setTimeout(function() {
		display.poke();
	}, 15000);
	console.log("disabling autoff");
	display.addEventListener("change", function(event) {
		if (!display.on) {
			sensorControl("stop");
			console.log("stopping sensors");
		}
		else {
			sensorControl("start");
			console.log("starting sensors");
		}
	});
			

	
}




/* 
 *
 * Stats Fetch
 *
 */
function devStatsStr() {
	setDevStats();
	let t = "$ time -> " + time;
	let d = "$ date -> " + date;
	let b = "$ battery -> " + batPercent + "%";
	let m = "$ memory -> " + mem + "%";
	return bashStr + " -dev" + t + d + b + m;
}


function healthStatsStr() {
	setHealthStats();
	let c = "$ calories -> " + calories;
	let s = "$ steps ->  " + steps;
	let h = "$ h. bpm ->  " + hbpm;
	let e = "$ distance ->  " + dist + " mi";
	return bashStr + " -self" + c + s + h + e;
}


function envStatsStr() {
	setEnvStats();	
	let e = "$ altitude -> " + elev + "ft";
	let f = "$ floors -> 777";
	let c = "$ city -> g. hills";
	let w = "$ weather -> --F";
	return bashStr + " -env" + e + f + c + w;
}


/* 
 *
 * Stats Set 
 *
 */

function setDevStats() {
	batPercent = batteryStr();
	time = timeStr();
	date = dateStr();
	mem = memoryStr();
}

function setHealthStats() {
	calories = calorieStr();
	steps = stepsStr();
	dist = distanceStr();
	if (hbpm === undefined) {
		hbpm = "--";
	}
}


function setEnvStats() {
	if (elev === undefined) {
		elev = "--";
	}
	else {
		elev = elev.toFixed(0);
	}
}

/* 
 *
 * Health Stats Functions
 *
 */
function stepsStr() {
	return today.local.steps;
}


function calorieStr() {
	return today.local.calories;
}

function distanceStr() {
	return (today.local.distance * .00062137).toFixed(1);
}




/* 
 *
 * Device Stats Functions
 *
 */

function batteryStr() {
	return battery.chargeLevel;
}


function dateStr() {
	let month = datevar.getMonth()+1;
	let date = datevar.getDate();
	let year = datevar.getYear()-100;
	
	month = padDigit(month);
	date = padDigit(date);
	
	return month + "/" + date + "/" + year;
}



function timeStr() {
	let hours = datevar.getHours();
	let mer = "AM";
	if (hours > 12) {
		hours -= 12;
		mer = "PM";
	}
	else if (hours === 12) {
		mer = "PM";
	}
	else if (hours < 10) {
		hours = "0" + hours;
	}
	let minutes = datevar.getMinutes();
	let seconds = datevar.getSeconds();

	minutes = padDigit(minutes);
	seconds = padDigit(seconds);

	
	return hours + ":" + minutes + ":" + seconds + " " + mer;
}

function memoryStr() {
	return Math.floor(((memory.native.used / memory.native.total)*100));
}












/* 
 *
 * Writer Functions
 *
 */
function write(text) {
	writing = true;
	let chars = splitLines(text);
	let x = 1;
	let f = 0;
	let c = 0;
	var outline = "";
	let writer = setInterval(function () {

		// Set line id
		let id = document.getElementById("line" + x);

		// Clear the line from existing text when c is 0
		if (!c) {
			id.text = "";
		}
		if (c < lineLimit && !abortWrite) {
			if (!c && (chars[f] === " ")) {
				f += 1;
			}
			else if (chars[f] === "$" && c) {
				c = 0;
				x += 1;
			}
			else {
				id.text += chars[f];
				c += 1;
				f += 1;
			}

		// Reaches line limit
		} else {
			
//			console.log("going to next line on char" + char[f]);
			// Go to next line
			x += 1;

			// Clear if all lines filled
			if ((x === 6) || (abortWrite)) {
				clearInterval(writer);
				clearTerminal();
				if (abortWrite) {
					abortWrite = !abortWrite;
				}
			}

			// Reset char count
			c = 0;
		}

		// Clear interval when all chars printed
		if (f === text.length) {
			clearInterval(writer);
			clearTerminal();
		}
	}, 5);
}


function clearTerminal() {
	setTimeout(function () {
		for (let x = 1; x < 6; ++x) {
			let id = document.getElementById("line" + x);
			id.text = "";
		}
		writing = false;
	}, 750);


}







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
}


function setupWeatherModule() {
	// Listen for the onopen event
	messaging.peerSocket.onopen = function() {
		// Fetch weather when the connection opens
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

	// Fetch the weather every 30 minutes
	setInterval(fetchWeather, 30 * 1000 * 60);
}









main();
