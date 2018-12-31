import * as fs from "fs";
import document from "document";
import clock from "clock";

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

var plusMin;
var totalCals;
var datevar;
/*
let data = fs.readFileSync("ascii.txt", "ascii");

if (data.length) {
	let ascii_data = "dicks!";
	fs.writeFileSync("ascii.txt", ascii_data, "ascii");

}
else {
	let ascii_data = "Fuck you you little bitch";
	fs.writeFileSync("ascii.txt", ascii_data, "ascii");
}
*/

function main() {
	loadCaloricData();
	setupButtonHandlers();
	
	clock.granularity = 'hours';
	clock.ontick = function (evt) {
		datevar = evt.date;
		setDateStr();
	}
}

function checkUser() {
	console.log("in checkuser");
	///if (fs.readFileSync("user.txt", "ascii") === "") {







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



function loadCaloricData() {
	let data = fs.readFileSync("cd.txt", "ascii");

	if (data) {
		console.log("Read data: " + data);
		totalCals = parseInt(data);

	}
	else {
		let ascii_data = "0";
		fs.writeFileSync("cd.txt", ascii_data, "ascii");
		totalCals = 0;
	}
	elemCalories.text = totalCals;
}


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

}


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
	let totalCalStr = totalCals + "";
	fs.writeFileSync("cd.txt", totalCalStr, "ascii");
}


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
	dateText.text = "Caloric Data for - " + dateStr();
}






		
main();
