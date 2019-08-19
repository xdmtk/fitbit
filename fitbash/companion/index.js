// Import the messaging module
import * as messaging from "messaging";
import { geolocation } from "geolocation";
import API_KEY from "api.key";

var latitude;
var longitude;
var ENDPOINT;

function queryOpenWeather() {
	console.log("in query open weather");
	geolocation.getCurrentPosition(geolocSuccess, geolocFail)
}



function geolocSuccess(position) {

		console.log("getting coordinates");
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		console.log("latitude: " + latitude + " - longitute " + longitude);
		
		ENDPOINT = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude;

		console.log("endpoint: " + ENDPOINT);
		queryOpenWeatherFollow();

}

function geolocFail(error) {
	console.log("geolocation failed: " + error.code + " " + error.message);
	queryOpenWeather();
}



// Fetch the weather from OpenWeather
function queryOpenWeatherFollow() {
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
					condition: data["weather"][0]["main"]
				}
				// Send the weather data to the device
				returnWeatherData(weather);
			});
		})
		.catch(function (err) {
			console.log("Error fetching weather: " + err);
		});
	}
	else {
		console.log("geoloc was undefined");
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
