// START INTERFACES
interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  description: string;
  windspeed: number;
  pressure: number;
  timezone: number;
  humidity: number;
  feelsLike: number;
}

interface LocationSuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
// END INTERFACES

// START CONSTANTS
// Enter your api key from https://openweathermap.org
const API_KEY = "api-key";
const WEATHER_API_URL = "https://api.openweathermap.org";
// END CONSTANTS

// START LISTENERS
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("locationForm") as HTMLFormElement;
  form.addEventListener("submit", handleSubmit);

  const locationInput = document.getElementById(
    "locationInput"
  ) as HTMLInputElement;
  locationInput.addEventListener("input", handleInput);
  locationInput.addEventListener("focus", handleInput);
});
// END LISTENERS

// START FUNCTIONS
const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const selectedLocation = getSelectedLocation();

  if (selectedLocation) {
    try {
      const weatherData = await fetchWeatherDataByCoords(
        selectedLocation.lat,
        selectedLocation.lon
      );
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      displayErrorMessage("Failed to fetch weather data.");
    }
  } else {
    displayErrorMessage("Please select a valid location suggestion.");
  }
};

const fetchWeatherDataByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const apiUrl = `${WEATHER_API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Weather data not found.");
    }
    const data = await response.json();
    const weatherData: WeatherData = {
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
    return weatherData;
  } catch (error) {
    throw new Error("Failed to fetch weather data.");
  }
};

const handleInput = async (event: Event) => {
  const locationInput = event.target as HTMLInputElement;
  const userInput = locationInput.value.trim();

  if (userInput.length === 0) {
    clearSuggestions();
    return;
  }

  try {
    const suggestions = await fetchLocationSuggestions(userInput);
    displaySuggestions(suggestions);
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
  }
};

const fetchLocationSuggestions = async (
  userInput: string
): Promise<LocationSuggestion[]> => {
  const apiUrl = `${WEATHER_API_URL}/geo/1.0/direct?q=${userInput}&limit=5&appid=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Location suggestions not found.");
    }
    const data = await response.json();
    const suggestions: LocationSuggestion[] = data.map((item: any) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
    return suggestions;
  } catch (error) {
    throw new Error("Failed to fetch location suggestions.");
  }
};

const displaySuggestions = (suggestions: LocationSuggestion[]) => {
  const datalist = document.getElementById("locationOptions")!;
  datalist.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const option = document.createElement("option");
    option.value = `${suggestion.name}, ${suggestion.country}`;
    option.dataset.lat = suggestion.lat.toString();
    option.dataset.lon = suggestion.lon.toString();
    datalist.appendChild(option);
  });
};

const clearSuggestions = () => {
  const datalist = document.getElementById("locationOptions")!;
  datalist.innerHTML = "";
};

const getSelectedLocation = (): LocationSuggestion | null => {
  const locationInput = document.getElementById(
    "locationInput"
  ) as HTMLInputElement;
  const selectedOption = locationInput.value;

  const datalist = document.getElementById("locationOptions")!.childNodes;
  for (let i = 0; i < datalist.length; i++) {
    const option = datalist[i] as HTMLOptionElement;
    if (option.value === selectedOption) {
      return {
        name: option.textContent!,
        country: "",
        lat: Number(option.dataset.lat),
        lon: Number(option.dataset.lon),
      };
    }
  }

  return null;
};

const getCurrentTimeInTimezone = (offsetInSeconds: number) => {
  const now = new Date();
  const localTime = now.getTime();
  const localOffset = now.getTimezoneOffset() * 60000;
  const utcTime = localTime + localOffset;
  const timezoneTime = utcTime + offsetInSeconds * 1000;

  return new Date(timezoneTime);
};

const formatTime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
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

const displayWeatherInfo = (weatherData: WeatherData) => {
  // Get current time adjusted for the weather data's timezone
  const currentTime = getCurrentTimeInTimezone(weatherData.timezone);
  const formattedTime = formatTime(currentTime);
  const capitalizedDescription = capitalizeEachWord(weatherData.description);

  const infoDisplay = document.getElementById("infoDisplay")!;
  infoDisplay.innerHTML = `
    <div class="description">
      <h4>${weatherData.name}, ${weatherData.country}</h4>
      <h1>${capitalizedDescription}</h1>
      <h2>${weatherData.temperature}°C</h2>
      <h6>${formattedTime}</h6>
    </div>

    <h6>Today's Overview</h6>
    <div class="overview">
      <div class="overviewDetails">
        <img src="./assets/wind.png" alt="wind-blowing" class="overviewImg" />
        <div class="details">
          <h6><strong>Wind Speed:</strong></h6>
          <p>${weatherData.windspeed} m/s</p>
        </div>
      </div>
      <div class="overviewDetails">
        <img src="./assets/mist.png" alt="mist" class="overviewImg" />
        <div class="details">
          <h6><strong>Pressure:</strong></h6>
          <p>${weatherData.pressure} hpa</p>
        </div>
      </div>
      <div class="overviewDetails">
        <img src="./assets/rainy.png" alt="cloud-with-rain" class="overviewImg" />
        <div class="details">
          <h6><strong>Humidity:</strong></h6>
          <p>${weatherData.humidity}%</p>
        </div>
      </div>
      <div class="overviewDetails">
        <img src="./assets/sun.png" alt="sun-shining" class="overviewImg" />
        <div class="details">
          <h6><strong>Feels Like:</strong></h6>
          <p>${weatherData.feelsLike}°C</p>
        </div>
      </div>
    </div>
  `;
};

const displayErrorMessage = (message: string) => {
  const infoDisplay = document.getElementById("infoDisplay")!;
  infoDisplay.innerHTML = `<p style="color: red;">${message}</p>`;
};

const capitalizeEachWord = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
// END FUNCTIONS
