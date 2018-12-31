// Import the messaging module
import * as messaging from "messaging";
import { geolocation } from "geolocation";

var latitude;
var longitude;
var ENDPOINT;

geolocation.getCurrentPosition(function(position) {
	
	console.log("getting coordinates");
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	ENDPOINT = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude;
})

var API_KEY = "2e5f8a30167b5b71a8792cc9e09f94bc";

// Fetch the weather from OpenWeather
function queryOpenWeather() {
	if ((latitude !== undefined) && (longitude !== undefined)) {
		fetch(ENDPOINT + "&APPID=" + API_KEY)
		.then(function (response) {
			console.log(response);
			response.json()
			.then(function(data) {
				// We just want the current temperature
				var weather = {
					temperature: data["main"]["temp"],
					city: data["name"],
					condition: data["weather"]["main"]
				}
				// Send the weather data to the device
				returnWeatherData(weather);
			});
		})
		.catch(function (err) {
			console.log("Error fetching weather: " + err);
		});
	}
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
