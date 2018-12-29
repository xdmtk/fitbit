import document from "document";
import { display } from "display";
import clock from "clock";
import { battery } from "power";
import { today } from "user-activity";





const bgImage = document.getElementById("background-frame");
const l1 = document.getElementById("line1");
const l2 = document.getElementById("line2");
const l3 = document.getElementById("line3");
const l4 = document.getElementById("line4");
const l5 = document.getElementById("line5");
const lineLimit = 21;

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
var writing = false;


var tb = true;

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
		if (!writing) {
			writing = true;
			write(statsStr());	
		}
	};
}




/* 
 *
 * Stats Fetch
 *
 */
function statsStr() {
	getStats();
	let t = "$ time -> " + time;
	let d = "$ date -> " + date;
	let b = "$ bat -> " + batPercent + "%";
	let c = "$ calories -> " + calories;
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
	let month = datevar.getMonth();
	let date = datevar.getDate();
	
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


function calorieStr() {
	return today.local.calories;
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
		if (c < lineLimit) {
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
			
			console.log("going to next line on char" + char[f]);
			// Go to next line
			x += 1;

			// Clear if all lines filled
			if (x === 6) {
				clearInterval(writer);
				clearTerminal();
			}

			// Reset char count
			c = 0;
		}

		// Clear interval when all chars printed
		if (f === text.length) {
			clearInterval(writer);
			clearTerminal();
		}
	}, 30);
}


function clearTerminal() {
	setTimeout(function () {
		for (let x = 1; x < 6; ++x) {
			let id = document.getElementById("line" + x);
			id.text = "";
		}
		setTimeout(function (){
			writing = false;
		}, 500);
	}, 2500);


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
