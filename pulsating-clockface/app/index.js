import document from "document";
import { display } from "display";
import clock from "clock";

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


function main() {
	write("Time -> 10:47:18 PM   Date -> wednesday    Battery -> 37%     ");
	clock.granularity = 'seconds';
	clock.ontick = function () {
		if (!ticker) {
			pulser = setInterval(function() {
				pulsate();
			}, 50);
		}
	};
}

// TODO: Create functions to type text into window terminal style
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
	}, 100);
}


function splitLines(text) {
	console.log("in split lines");
	let words = text.split("");
	let line = "";
	words.forEach(function (element){
        line += element;
	});
	return line;
}


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
