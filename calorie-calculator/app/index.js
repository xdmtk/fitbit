import * as fs from "fs";

function getCalorieData() {
	fs.writeFileSync("cd.txt", "fuck you");
	let data = fs.readFileSync("cd.txt", "ascii");
	console.log(data);
}


getCalorieData();





