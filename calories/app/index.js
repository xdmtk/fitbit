import * as fs from "fs";

import document from "document";
import clock from "clock";
import * as messaging from "messaging";
import { today } from "user-activity";
import { vibration } from "haptics";
import { me as device } from "device";
import { user } from "user-profile";



const $elemCalories = document.getElementById('calorieDisplay');
const $elemWeight = document.getElementById('weightDisplay');
const $pushButtons = document.getElementsByClassName('pbtn');
const $pushButtonsWeight = document.getElementsByClassName('pbtn-weight');
const $nonPushButtons = document.getElementsByClassName('no-pbtn');
const $plusMinusCalDisplay = document.getElementById('calorieDisplay');

let totalCals;
let totalWeight = 0;
let inputDate;
let datevar;
let plusMin = '+';
let plusMinWeight = '+';


function main() {
	clock.granularity = 'hours';
	clock.ontick = function (evt) {
		datevar = evt.date;
	}
    setupEvents();
	loadCaloricData();
	loadWeightData();

	
}


function setupEvents() {
    
    for (let i = 0; i < $pushButtons.length; ++i) {
        $pushButtons[i].onactivate = function(evt) { 
            addSubtractCals($pushButtons[i].text);
            vibrateBump(); 
        }
    }
    for (let i = 0; i < $pushButtonsWeight.length; ++i) {
        $pushButtonsWeight[i].onactivate = function(evt) { 
            addSubtractWeight($pushButtonsWeight[i].text);
            vibrateBump(); 
        }
    }

    $plusMinusCalDisplay.onactivate = function(evt) {
        if (plusMin === '+') {
            $plusMinusCalDisplay.text = '- ' + $plusMinusCalDisplay.text.split(' ')[1];
            plusMin = '-';
        }
        else {
            $plusMinusCalDisplay.text = '+ ' + $plusMinusCalDisplay.text.split(' ')[1];
            plusMin = '+';
        }
    }
    $elemWeight.onactivate = function(evt) {
        if (plusMinWeight === '+') {
            $elemWeight.text = '- ' + $elemWeight.text.split(' ')[1];
            plusMinWeight = '-';
        }
        else {
            $elemWeight.text = '+ ' + $elemWeight.text.split(' ')[1];
            plusMinWeight = '+';
        }
    }




}

function vibrateBump() {
    vibration.start('bump');
    setTimeout(function () {
        vibration.stop();
    }, 100);
}


/* Main Calorie Load */

function loadCaloricData() {
    let data;
    try {
        data = fs.readFileSync("cd.txt", "ascii");
    }
    catch {
        fs.writeFileSync('cd.txt', '', 'ascii');
    }
	let dataFields = data.split(",");

	if (dataFields.length > 1) {
		console.log("Read data: " + data);
		totalCals = parseInt(dataFields[0]);
        if (isNaN(totalCals)) {
            totalCals = 0;
        }
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
	$elemCalories.text = plusMin + ' ' + totalCals;
}


/* Main Weight Load */

function loadWeightData() {
    let data;
    try {
        data = fs.readFileSync("wd.txt", "ascii");
    }
    catch {
        fs.writeFileSync('wd.txt', '', 'ascii');
    }
	let dataFields = data.split(",");

	if (dataFields.length > 1) {
		console.log("Read data: " + data);
		totalWeight = parseFloat(dataFields[0]);
        if (isNaN(totalWeight)) {
            totalWeight = 190;
        }
		inputDate = dataFields[1];

	}
	else {
		let ascii_data = "0," + getDateStr();
		fs.writeFileSync("wd.txt", ascii_data, "ascii");
		totalWeight = 190;
	}
	$elemWeight.text = plusMinWeight + ' ' + totalWeight.toFixed(2);
}


/* Add/Subtract Weight */
function addSubtractWeight(amount) {
    console.log(`In substract calls with amount ${amount} with totalweight ${totalWeight}`);
    amount = parseFloat(amount);

    if (plusMinWeight === '+') {
        totalWeight += amount;
    }
    else {
        totalWeight = ( totalWeight - amount < 0 ) ? 0 : totalWeight - amount;
    }
	$elemWeight.text = plusMinWeight + ' ' + totalWeight.toFixed(2);

	let totalWeightStr = `${totalWeight},${getDateStr()}`;
	fs.writeFileSync('wd.txt', totalWeightStr, 'ascii');

	sendMessage(totalCals, totalWeight);
}


/* Add/Subtract Calories */
function addSubtractCals(amount) {
    console.log(`In substract calls with amount ${amount}`);
    amount = parseInt(amount);

    if (plusMin === '+') {
        totalCals += amount;
    }
    else {
        totalCals = ( totalCals - amount < 0 ) ? 0 : totalCals - amount;
    }
	$elemCalories.text = plusMin + ' ' + totalCals;

	let totalCalStr = `${totalCals},${getDateStr()}`;
	fs.writeFileSync('cd.txt', totalCalStr, 'ascii');

	sendMessage(totalCals, totalWeight);
}


function getDateStr() {
	var datevar = new Date();
	let month = datevar.getMonth()+1;
	let date = datevar.getDate();
	let year = datevar.getYear()-100;
	
	return month + "/" + date + "/" + year;
}



function addSubtractMod(action) {
	vibration.start("bump");
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






function setupMessaging() {
	messaging.peerSocket.onopen = function() {
		console.log("Companion connection established, ready to send msg");
	}
	messaging.peerSocket.onerror = function(err) {
		console.log("Connection error: " + err.code + " - " + err.message);

	}
}

function sendMessage(data, weight) {
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		console.log("sending data: " + data);
		messaging.peerSocket.send('nick' + ',' + data + ',' + today.local.calories + ',' + weight);
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


function debugUser() {
	fs.writeFileSync("user.txt", "", "ascii");
}





		
main();
