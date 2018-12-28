import document from "document";
import { display } from "display";
import clock from "clock";
import { battery } from "power";
import { goals } from "user-activity";





const bgImage = document.getElementById("background-frame");
const l1 = document.getElementById("line1");
const l2 = document.getElementById("line2");
const l3 = document.getElementById("line3");
const l4 = document.getElementById("line4");
const l5 = document.getElementById("line5");


var frameNumber = 0;
var frameString = "";
var f = true;
var ticker = false;
var pulser;
var datevar;
var date;
var time;
var batPercent;


/* 
 *
 * Main Function
 *
 */
function main() {
	clock.granularity = 'seconds';
	clock.ontick = function (evt) {
		datevar = evt.date;
		if (!ticker) {
			pulser = setInterval(function() {
				pulsate();
			}, 50);
		}
	};
	write(statsStr());	
}




/* 
 *
 * Stats Fetch
 *
 */
function statsStr() {
	getStats();
	let t = padLine("$ time -> " + time);
	let d = padLine("$ date -> " + date);
	let b = padLine("$ bat -> " + batPercent + "%");
	let c = padline("$ calories -> " + calories);
	return t + d + b + c;
}


function getStats() {
	batPercent = battery.chargeLevel;
	time = timeStr();
	date = dateStr();
	calories = calorieStr();

}




/* 
 *
 * Auxillary Stats Functions
 *
 */
function dateStr() {
	let month = date.getMonth();
	let date - date.getDate();
	
	month = padDigit(month);
	date = padDigit(date);
	
	return month + "/" + date;
}



function timeStr() {
	let hours = datevar.getHours();
	let mer = "AM";
	if (hours > 12) {
		hours -= 12;
		mer = "PM";
	}
	else if (hours == 12) {
		mer = "PM";
	}
	else if (hours < 10) {
		hours = "0" + hours;
	}
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

	minutes = padDigit(minutes);
	seconds = padDigit(seconds);

	
	return hours + ":" + minutes + ":" + seconds + " " + mer;
}


function calorieStr() {
	return goals.calories;
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
		let id = document.getElementById("line" + x);
		if (!c) {
			id.text = "";
		}
		if (c < 19) {
			if (!c && (chars[f] == " ")) {
				f += 1;
			}
			else {
				id.text += chars[f];
				c += 1;
				f += 1;
			}
		} else {
			x += 1;
			if (x == 6) {
				clearInterval(writer);
			}
			c = 0;
		}
		if (f == text.length) {
			clearInterval(writer);
		}
	}, 60);
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


function padLine(text) {
	while (text.length < 19) {
		text += " ";
	}
	return text;
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


main();
