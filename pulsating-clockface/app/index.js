import { HeartRateSensor } from "heart-rate";
import document from "document";
import { display } from "display";
import clock from "clock";
import { battery } from "power";
import { today } from "user-activity";
import { memory } from "system";






const bgImage = document.getElementById("background-frame");
const l1 = document.getElementById("line1");
const l2 = document.getElementById("line2");
const l3 = document.getElementById("line3");
const l4 = document.getElementById("line4");
const l5 = document.getElementById("line5");
const lineLimit = 21;
const msgList = [ devStatsStr, healthStatsStr ];



var bashStr = "#!/bin/bash";
var frameNumber = 0;
var frameString = "";
var f = true;
var ticker = false;
var pulser;
var datevar;
var date;
var time;
var batPercent;
var calories;
var mem;
var dist;
var steps
var hbpm;
var elev;

var writing = false;
var abortWrite = false;
var msgenum = 0;



var tb = true;

/* 
 *
 * Main Function
 *
 */
function main() {

	startHrm();
	
	clock.granularity = 'seconds';
	clock.ontick = function (evt) {
		datevar = evt.date;
		if (!ticker) {
			pulser = setInterval(function() {
				pulsate();
			}, 60);
		}
		if (!writing) {
			writing = true;
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
		hbpm = "wait";
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
	console.log("in write");
	let chars = splitLines(text);
	let x = 1;
	let f = 0;
	let c = 0;
	var outline = "";
	console.log(chars);
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
	}, 500);


}







/* 
 *
 * Misc
 *
 */
function splitLines(text) {
	console.log("in split lines");
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
	let hrm = new HeartRateSensor();
	hrm.onreading = function() {
		hbpm = hrm.heartRate;
	}
	hrm.start();
}




main();
