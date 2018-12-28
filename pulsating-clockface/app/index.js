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
	clock.granularity = 'seconds';
	clock.ontick = function () {
		if (!ticker) {
			pulser = setInterval(function() {
				pulsate();
			}, 50);
		}
	}
}

// TODO: Create functions to type text into window terminal style



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
			if (f) {
				f = false;
			} 
			else {
				f = true;
			}
		}
		frameString = "pulse/p-" + frameNumber + ".png";
		bgImage.image = frameString;
		console.log(frameString);
	}
	else {
		clearInterval(pulser);
		ticker = false;
	}
}


main();
