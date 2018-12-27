import clock from "clock"
import document from "document";

const clockText = document.getElementById("clock-text");
const dateText = document.getElementById("date-text");



clock.granularity = "seconds";
clock.ontick = (evt) => {
	let sec = evt.date.getSeconds();
	let min = evt.date.getMinutes();
	let hr = evt.date.getHours();
	let mer = "AM";

	if (hr >= 12) {
		mer = "PM";
		if ( hr > 12 ) {
			hr -= 12;
		}
	}
	clockText.text = hr + "." + min + "." + sec + " " + mer;

	let mon = evt.date.getMonth();
	let day = evt.date.getDate();
	dateText.text = mon + "/" + day;

	
}




console.log("Checl");




