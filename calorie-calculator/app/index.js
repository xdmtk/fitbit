import * as fs from "fs";

import document from "document";
import clock from "clock";
import * as messaging from "messaging";
import { today } from "user-activity";
import { vibration } from "haptics";

const $elemCalories = document.getElementById('calorieDisplay');
const $pushButtons = document.getElementsByClassName('pbtn');
const $nonPushButtons = document.getElementsByClassName('no-pbtn');
const $plusMinus = document.getElementById('plusMinus');

let totalCals;
let inputDate;
let datevar;



function main() {
    console.log($pushButtons);
	clock.granularity = 'hours';
	clock.ontick = function (evt) {
		datevar = evt.date;
	}
    setupEvents();
	loadCaloricData();
	
}


function setupEvents() {
    
    for (let i = 0; i < $pushButtons.length; ++i) {
        $pushButtons[i].onactivate = function(evt) { 
            addSubtractCals($pushButtons[i].text);
            vibrateBump(); 
        }
    }

    $plusMinus.onactivate = function(evt) {
         if ($plusMinus.text === '+') {
             $plusMinus.text = '-';
         }
         else {
             $plusMinus.text = '+';
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
	$elemCalories.text = totalCals;
}





/* Add/Subtract Calories */
function addSubtractCals(amount) {
    console.log(`In substract calls with amount ${amount}`);
    amount = parseInt(amount);

    if ($plusMinus.text === '+') {
        totalCals += amount;
    }
    else {
        totalCals = ( totalCals - amount < 0 ) ? 0 : totalCals - amount;
    }
	$elemCalories.text = totalCals;

	let totalCalStr = `${totalCals},${getDateStr()}`;
	fs.writeFileSync('cd.txt', totalCalStr, 'ascii');

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

function sendMessage(data) {
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		console.log("sending data: " + data);
		messaging.peerSocket.send('nick' + ',' + data + ',' + today.local.calories);
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
