var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// END INTERFACES
// START CONSTANTS
// Enter your api key from https://openweathermap.org
var API_KEY = "api-key";
var WEATHER_API_URL = "https://api.openweathermap.org";
// END CONSTANTS
// START LISTENERS
document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("locationForm");
    form.addEventListener("submit", handleSubmit);
    var locationInput = document.getElementById("locationInput");
    locationInput.addEventListener("input", handleInput);
    locationInput.addEventListener("focus", handleInput);
});
// END LISTENERS
// START FUNCTIONS
var handleSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var selectedLocation, weatherData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                selectedLocation = getSelectedLocation();
                if (!selectedLocation) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetchWeatherDataByCoords(selectedLocation.lat, selectedLocation.lon)];
            case 2:
                weatherData = _a.sent();
                displayWeatherInfo(weatherData);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching weather data:", error_1);
                displayErrorMessage("Failed to fetch weather data.");
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                displayErrorMessage("Please select a valid location suggestion.");
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
var fetchWeatherDataByCoords = function (lat, lon) { return __awaiter(_this, void 0, void 0, function () {
    var apiUrl, response, data, weatherData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                apiUrl = "".concat(WEATHER_API_URL, "/data/2.5/weather?lat=").concat(lat, "&lon=").concat(lon, "&appid=").concat(API_KEY, "&units=metric");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(apiUrl)];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Weather data not found.");
                }
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                weatherData = {
                    temperature: data.main.temp,
                    description: data.weather[0].description,
                    name: data.name,
                    country: data.sys.country,
                    windspeed: data.wind.speed,
                    pressure: data.main.pressure,
                    timezone: data.timezone,
                    humidity: data.main.humidity,
                    feelsLike: data.main.feels_like,
                };
                return [2 /*return*/, weatherData];
            case 4:
                error_2 = _a.sent();
                throw new Error("Failed to fetch weather data.");
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleInput = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var locationInput, userInput, suggestions, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                locationInput = event.target;
                userInput = locationInput.value.trim();
                if (userInput.length === 0) {
                    clearSuggestions();
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetchLocationSuggestions(userInput)];
            case 2:
                suggestions = _a.sent();
                displaySuggestions(suggestions);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error fetching location suggestions:", error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fetchLocationSuggestions = function (userInput) { return __awaiter(_this, void 0, void 0, function () {
    var apiUrl, response, data, suggestions, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                apiUrl = "".concat(WEATHER_API_URL, "/geo/1.0/direct?q=").concat(userInput, "&limit=5&appid=").concat(API_KEY);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(apiUrl)];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Location suggestions not found.");
                }
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                suggestions = data.map(function (item) { return ({
                    name: item.name,
                    country: item.country,
                    lat: item.lat,
                    lon: item.lon,
                }); });
                return [2 /*return*/, suggestions];
            case 4:
                error_4 = _a.sent();
                throw new Error("Failed to fetch location suggestions.");
            case 5: return [2 /*return*/];
        }
    });
}); };
var displaySuggestions = function (suggestions) {
    var datalist = document.getElementById("locationOptions");
    datalist.innerHTML = "";
    suggestions.forEach(function (suggestion) {
        var option = document.createElement("option");
        option.value = "".concat(suggestion.name, ", ").concat(suggestion.country);
        option.dataset.lat = suggestion.lat.toString();
        option.dataset.lon = suggestion.lon.toString();
        datalist.appendChild(option);
    });
};
var clearSuggestions = function () {
    var datalist = document.getElementById("locationOptions");
    datalist.innerHTML = "";
};
var getSelectedLocation = function () {
    var locationInput = document.getElementById("locationInput");
    var selectedOption = locationInput.value;
    var datalist = document.getElementById("locationOptions").childNodes;
    for (var i = 0; i < datalist.length; i++) {
        var option = datalist[i];
        if (option.value === selectedOption) {
            return {
                name: option.textContent,
                country: "",
                lat: Number(option.dataset.lat),
                lon: Number(option.dataset.lon),
            };
        }
    }
    return null;
};
var getCurrentTimeInTimezone = function (offsetInSeconds) {
    var now = new Date();
    var localTime = now.getTime();
    var localOffset = now.getTimezoneOffset() * 60000;
    var utcTime = localTime + localOffset;
    var timezoneTime = utcTime + offsetInSeconds * 1000;
    return new Date(timezoneTime);
};
var formatTime = function (date) {
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
};
var displayWeatherInfo = function (weatherData) {
    // Get current time adjusted for the weather data's timezone
    var currentTime = getCurrentTimeInTimezone(weatherData.timezone);
    var formattedTime = formatTime(currentTime);
    var capitalizedDescription = capitalizeEachWord(weatherData.description);
    var infoDisplay = document.getElementById("infoDisplay");
    infoDisplay.innerHTML = "\n    <div class=\"description\">\n      <h4>".concat(weatherData.name, ", ").concat(weatherData.country, "</h4>\n      <h1>").concat(capitalizedDescription, "</h1>\n      <h2>").concat(weatherData.temperature, "\u00B0C</h2>\n      <h6>").concat(formattedTime, "</h6>\n    </div>\n\n    <h6>Today's Overview</h6>\n    <div class=\"overview\">\n      <div class=\"overviewDetails\">\n        <img src=\"./assets/wind.png\" alt=\"wind-blowing\" class=\"overviewImg\" />\n        <div class=\"details\">\n          <h6><strong>Wind Speed:</strong></h6>\n          <p>").concat(weatherData.windspeed, " m/s</p>\n        </div>\n      </div>\n      <div class=\"overviewDetails\">\n        <img src=\"./assets/mist.png\" alt=\"mist\" class=\"overviewImg\" />\n        <div class=\"details\">\n          <h6><strong>Pressure:</strong></h6>\n          <p>").concat(weatherData.pressure, " hpa</p>\n        </div>\n      </div>\n      <div class=\"overviewDetails\">\n        <img src=\"./assets/rainy.png\" alt=\"cloud-with-rain\" class=\"overviewImg\" />\n        <div class=\"details\">\n          <h6><strong>Humidity:</strong></h6>\n          <p>").concat(weatherData.humidity, "%</p>\n        </div>\n      </div>\n      <div class=\"overviewDetails\">\n        <img src=\"./assets/sun.png\" alt=\"sun-shining\" class=\"overviewImg\" />\n        <div class=\"details\">\n          <h6><strong>Feels Like:</strong></h6>\n          <p>").concat(weatherData.feelsLike, "\u00B0C</p>\n        </div>\n      </div>\n    </div>\n  ");
};
var displayErrorMessage = function (message) {
    var infoDisplay = document.getElementById("infoDisplay");
    infoDisplay.innerHTML = "<p style=\"color: red;\">".concat(message, "</p>");
};
var capitalizeEachWord = function (str) {
    return str.replace(/\b\w/g, function (char) { return char.toUpperCase(); });
};
// END FUNCTIONS
