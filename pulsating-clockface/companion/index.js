// Import the messaging module
import * as messaging from "messaging";

var API_KEY = "2e5f8a30167b5b71a8792cc9e09f94bc";
var ENDPOINT = "https://api.openweathermap.org/data/2.5/weather" +
"?q=San%20Francisco,USA&units=imperial";

// Fetch the weather from OpenWeather
function queryOpenWeather() {
	fetch(ENDPOINT + "&APPID=" + API_KEY)
	.then(function (response) {
		response.json()
		.then(function(data) {
			// We just want the current temperature
			var weather = {
				temperature: data["main"]["temp"]
			}
			// Send the weather data to the device
			returnWeatherData(weather);
		});
	})
	.catch(function (err) {
		console.log("Error fetching weather: " + err);
	});
}

// Send the weather data to the device
function returnWeatherData(data) {
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		// Send a command to the device
		messaging.peerSocket.send(data);
	} else {
		console.log("Error: Connection is not open");
	}
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
	if (evt.data && evt.data.command == "weather") {
		// The device requested weather data
		queryOpenWeather();
	}
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
	// Handle any errors
	console.log("Connection error: " + err.code + " - " + err.message);
}
