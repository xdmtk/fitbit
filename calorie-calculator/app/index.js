import * as fs from "fs";
import document from "document";

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

var plusMin;
var totalCals;
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
}



function addSubtractMod(action) {
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
			plusMin = "subtract";
			buttonPm.text = "-";
		}
		else {
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

	buttomPm.onclick = function() { addSubtractMod("flip"); }
}


function addSubtractCals(amount) {
	if (plusMin === "add") {
		totalCals += amount;
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



		
main();
