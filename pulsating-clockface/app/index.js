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
const lineLimit = 25;
const msgList = [ devStatsStr, healthStatsStr, envStatsStr];


// Misc
var bashStr = "#!/bin/bash";
var frameNumber = 0;
var frameString = "";
var f = true;
var isDev = false;

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

// Weather
var temperature;
var conditions;
var city;

// Writer globals
var writing = false;
var abortWrite = false;
var msgenum = 0;
var writer;

/* 
 *
 * Main Function
 *
 */
function main() {




	startHrm();
	startBrm();
	setupEventHandlers();
	datevar = new Date();
	setupWeatherModule();
	if (!writing && (datevar !== undefined)) {
		write(msgList[msgenum]());
		msgCycler();
	}
	
	clock.granularity = 'seconds';
	clock.ontick = function (evt) {
		datevar = evt.date;
		if (isDev) {
			if (l2.text.length > 17) {
				l2.text =  "$ time -> " + timeStr();
			}
		}
		if (!ticker) {
			pulser = setInterval(function() {
				pulsate();
			}, 60);
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
		console.log("mouse press");
		clearTerminal("now");
		clearInterval(writer);
		writer = null;
		setTimeout(function (){ 
			if (writer === null) {
				write(msgList[msgenum]());
			}
		}, 5);
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
	isDev = true;
	return bashStr + " -dev" + t + d + b + m;
}


function healthStatsStr() {
	setHealthStats();
	let c = "$ calories -> " + calories;
	let s = "$ steps ->  " + steps;
	let h = "$ h. bpm ->  " + hbpm;
	let e = "$ distance ->  " + dist + " mi";
	isDev = false;;
	return bashStr + " -self" + c + s + h + e;
}


function envStatsStr() {
	setEnvStats();	
	let w = "$ weather -> " + temperature + "F";
	let c = "$ city -> " + city;
	let co = "$ cur -> " + conditions;
	let e = "$ altitude -> " + elev + "ft";
	isDev = false;
	return bashStr + " -env" + w + c + co + e;
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
	if (temperature === undefined) {
		temperature = "--";
	}
	if (conditions === undefined) {
		conditions = "--";
	}
	if (city === undefined) {
		city = "--";
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
	writer = setInterval(function () {

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
				console.log("clearing terminal");
				console.log(this);
				clearInterval(writer);
				if (abortWrite) {
					abortWrite = !abortWrite;
					clearTerminal("now");
					return;
				}/*
				else {
					clearTerminal();
				}
				*/
			}

			// Reset char count
			c = 0;
		}

		// Clear interval when all chars printed
		if (f === text.length) {
			clearInterval(writer);
		//	clearTerminal();
		}
	}, 5);
}


function clearTerminal(timing="none") {
	console.log("in clear terminal");
	if (timing === "now") {
		for (let x = 1; x < 6; ++x) {
			let id = document.getElementById("line" + x);
			id.text = "";
		}
		writing = false;
	}
	else {
		setTimeout(function () {
			for (let x = 1; x < 6; ++x) {
				let id = document.getElementById("line" + x);
				id.text = "";
			}
			writing = false;
		}, 1250);
	}
	msgCycler();


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









main();
