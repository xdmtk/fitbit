import * as fs from "fs";
import document from "document";
import clock from "clock";
import * as messaging from "messaging";
import { today } from "user-activity";


const dateText = document.getElementById("date-title");
const elemCalories = document.getElementById("total-cals");
const text100 = document.getElementById("hundred");
const text50 = document.getElementById("fifty");
const text10 = document.getElementById("ten");

const fill100 = document.getElementById("hundredf");
const fill50 = document.getElementById("fiftyf");
const fill10 = document.getElementById("tenf");

const bord100 = document.getElementById("hundredb");
const bord50 = document.getElementById("fiftyb");
const bord10 = document.getElementById("tenb");

const buttonPm = document.getElementById("plus-button");
const bordbuttonPm = document.getElementById("plus-button");
const fillbuttonPm = document.getElementById("plus-buttonf");

const loginForm = document.getElementsByClassName("login");

const xeniaf = document.getElementById("xenia-login-buttonf");
const xenia = document.getElementById("xenia-login-button");
const xeniat = document.getElementById("name-user-xenia");
const xeniac = document.getElementById("click-area-xenia");

const nickf = document.getElementById("nick-login-buttonf");
const nick = document.getElementById("nick-login-button");
const nickt = document.getElementById("name-user-nick");
const nickc = document.getElementById("click-area-nick");


var plusMin;
var totalCals;
var datevar;
var user;
var loggingIn = false;
var debug = false;
var inputDate;



function main() {
	if (debug) {
		debugUser();
	}
	checkUser();
	loadCaloricData();
	setupButtonHandlers();
	
	clock.granularity = 'hours';
	clock.ontick = function (evt) {
		datevar = evt.date;
		setDateStr();
	}
}

/* Main Calorie Load */

function loadCaloricData() {
	let data = fs.readFileSync("cd.txt", "ascii");
	let dataFields = data.split(",");

	if (dataFields.length > 1) {
		console.log("Read data: " + data);
		totalCals = parseInt(dataFields[0]);
		inputDate = dataFields[1];
		
		if (inputDate !== getDateStr()) {
			let ascii_data = "0," + getDateStr();
			fs.writeFileSync("cd.txt", ascii_data, "ascii");
			totalCals = 0;
			inputDate === getDateStr();
		}

	}
	else {
		let ascii_data = "0," + getDateStr();
		fs.writeFileSync("cd.txt", ascii_data, "ascii");
		totalCals = 0;
	}
	elemCalories.text = totalCals;
}






/* Add/Subtract Calories */
function addSubtractCals(amount) {
	if (plusMin === "add") {
		if (totalCals + amount < 10000) {
			totalCals += amount;
		}
		else {
			totalCals = 9999;
		}

	}
	else {
		if (totalCals - amount >= 0) {
			totalCals -= amount;
		}
		else {
			totalCals = 0;
		}
	}


	elemCalories.text = totalCals;
	let totalCalStr = totalCals + "," + getDateStr();
	fs.writeFileSync("cd.txt", totalCalStr, "ascii");
	sendMessage(totalCals);
}


function getDateStr() {
	var datevar = new Date();
	let month = datevar.getMonth()+1;
	let date = datevar.getDate();
	let year = datevar.getYear()-100;
	
	return month + "/" + date + "/" + year;
}



function addSubtractMod(action) {
	console.log("in addsubtract mod with action: " + action);
	if (action === "read") {
		if (buttonPm.text === "+") {
			plusMin = "add";
		}
		else {
			plusMin = "subtract";
		}
	}
	else if (action === "flip") {
		if (buttonPm.text === "+") {
			console.log("flipping to subtract");
			plusMin = "subtract";
			buttonPm.text = "-";
		}
		else {
			console.log("flipping to add");
			plusMin = "add";
			buttonPm.text = "+";
		}
	}
}





/* Event Handlers */

function setupButtonHandlers() {
	addSubtractMod("read");	


	text100.onclick = function() { addSubtractCals(100); }
	text50.onclick =  function() { addSubtractCals(50); }
	text10.onclick = function() { addSubtractCals(10); }


	fill100.onclick = function() { addSubtractCals(100); }
	fill50.onclick =  function() { addSubtractCals(50); }
	fill10.onclick = function() { addSubtractCals(10); }


	bord100.onclick = function() { addSubtractCals(100); }
	bord50.onclick =  function() { addSubtractCals(50); }
	bord10.onclick = function() { addSubtractCals(10); }

	buttonPm.onclick = function() { addSubtractMod("flip"); }
	bordbuttonPm.onclick = function() { addSubtractMod("flip"); }
	fillbuttonPm.onclick = function() { addSubtractMod("flip"); }

	nick.onclick = function() { login("nick"); }
	nickf.onclick = function() { login("nick"); }
	nickt.onclick = function() {  login("nick"); }
	nickc.onclick = function() {  login("nick"); }

	xenia.onclick = function() { login("xenia"); }
	xeniaf.onclick = function() { login("xenia"); }
	xeniat.onclick =function() { login("xenia"); }
	xeniac.onclick =function() { login("xenia"); }


}


/* Login Functions */

function login(userParam) {
	if (!loggingIn) {
		console.log("in login with " + userParam);
		user = userParam;
		if (userParam === "nick") {
			nickf.fill = "white";
			setTimeout(function() {
				nickf.fill = "black";
			}, 20);
		}
		else {
			xeniaf.fill = "white";
			setTimeout(function() {
				xeniaf.fill = "black";
			}, 20);
		}

		loggingIn = !loggingIn;
		var u = userParam + "";
		fs.writeFileSync("user.txt", u, "ascii");
		let fader = setInterval(function () {
			loginForm.forEach(function(elem) {
				elem.opacity -= .1;
			});
		}, 100);
		setTimeout(function () {
			clearInterval(fader);
			loginForm.forEach(function(elem) {
				elem.style.display = "none";
			});
		}, 100);
		setDateStr();
	}
	else {
		console.log("handler already activated");
	}
}

function checkUser() {
	console.log("in checkuser");
	try {
		if (fs.readFileSync("user.txt", "ascii") === "") {
			loginForm.forEach(function(elem) {
				elem.style.display = "inherit";
			});
		}
		else {
			loginForm.forEach(function(elem) {
				elem.style.display = "none";
			});
			user = fs.readFileSync("user.txt", "ascii");
		}
	}
	catch {
		loginForm.forEach(function(elem) {
			elem.style.display = "inherit";
		});
	}

}


function setupMessaging() {
	messaging.peerSocket.onopen = function() {
		console.log("Companion connection established, ready to send msg");
	}
	messaging.peerSocket.onerror = function(err) {
		console.log("Connection error: " + err.code + " - " + err.message);

	}
}

function sendMessage(data) {
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		console.log("sending data: " + data);
		messaging.peerSocket.send(user + "," + data + "," + today.local.calories);
	}
	else {
		console.log("Connection is closed, cant send data");
	}
}






/* Aux Functions  */

function dateStr() {
	let month = datevar.getMonth()+1;
	let date = datevar.getDate();
	let year = datevar.getYear()-100;
	
	month = padDigit(month);
	date = padDigit(date);
	
	return month + "/" + date + "/" + year;
}

function padDigit(digit) {
	if (digit < 10) {
		return "0" + digit;
	}
	else {
		return digit;
	}
}

function setDateStr() {
	if (user === undefined) {
		dateText.text = "Caloric Data for - " + dateStr();
	}
	else {
		dateText.text = "Welcome " + user + " - Caloric Data for - " + dateStr();
		dateText.x -= 60;
	}

}

function debugUser() {
	fs.writeFileSync("user.txt", "", "ascii");
}





		
main();
