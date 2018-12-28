import document from "document";
import { display } from "display";
import clock from "clock";

let bgImage = document.getElementById("background-frame");
let frameNumber = 0;
let frameString = "";
let f = true;
var expire = false;
var ticker = false;
var pulser;
clock.granularity = 'seconds';



clock.ontick = function () {
	if (!ticker) {
		pulser = setInterval(function() {
			pulsate();
		}, 50);
	}
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
