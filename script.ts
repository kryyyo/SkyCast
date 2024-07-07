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
  datalist.textContent = "";

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
  datalist.textContent = "";
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
  infoDisplay.textContent = "";

  const descriptionDiv = document.createElement("div");
  descriptionDiv.className = "description";

  const locationElement = document.createElement("h4");
  locationElement.textContent = `${weatherData.name}, ${weatherData.country}`;
  descriptionDiv.appendChild(locationElement);

  const descriptionElement = document.createElement("h1");
  descriptionElement.textContent = capitalizedDescription;
  descriptionDiv.appendChild(descriptionElement);

  const temperatureElement = document.createElement("h2");
  temperatureElement.textContent = `${weatherData.temperature}°C`;
  descriptionDiv.appendChild(temperatureElement);

  const timeElement = document.createElement("h6");
  timeElement.textContent = formattedTime;
  descriptionDiv.appendChild(timeElement);

  infoDisplay.appendChild(descriptionDiv);

  const overviewHeader = document.createElement("h6");
  overviewHeader.textContent = "Today's Overview";
  infoDisplay.appendChild(overviewHeader);

  const overviewDiv = document.createElement("div");
  overviewDiv.className = "overview";

  overviewDiv.appendChild(
    createOverviewDetail(
      "./assets/wind.png",
      "wind-blowing",
      "Wind Speed:",
      `${weatherData.windspeed} m/s`
    )
  );
  overviewDiv.appendChild(
    createOverviewDetail(
      "./assets/mist.png",
      "mist",
      "Pressure:",
      `${weatherData.pressure} hpa`
    )
  );
  overviewDiv.appendChild(
    createOverviewDetail(
      "./assets/rainy.png",
      "cloud-with-rain",
      "Humidity:",
      `${weatherData.humidity}%`
    )
  );
  overviewDiv.appendChild(
    createOverviewDetail(
      "./assets/sun.png",
      "sun-shining",
      "Feels Like:",
      `${weatherData.feelsLike}°C`
    )
  );

  infoDisplay.appendChild(overviewDiv);
};

const createOverviewDetail = (
  imgSrc: string,
  imgAlt: string,
  label: string,
  value: string
) => {
  const overviewDetailDiv = document.createElement("div");
  overviewDetailDiv.className = "overviewDetails";

  const imgElement = document.createElement("img");
  imgElement.src = imgSrc;
  imgElement.alt = imgAlt;
  imgElement.className = "overviewImg";
  overviewDetailDiv.appendChild(imgElement);

  const detailsDiv = document.createElement("div");
  detailsDiv.className = "details";

  const labelElement = document.createElement("h6");
  const strongElement = document.createElement("strong");
  strongElement.textContent = label;
  labelElement.appendChild(strongElement);
  detailsDiv.appendChild(labelElement);

  const valueElement = document.createElement("p");
  valueElement.textContent = value;
  detailsDiv.appendChild(valueElement);

  overviewDetailDiv.appendChild(detailsDiv);
  return overviewDetailDiv;
};

const displayErrorMessage = (message: string) => {
  const infoDisplay = document.getElementById("infoDisplay");

  const pElement = document.createElement("p");
  pElement.style.color = "red";
  pElement.textContent = message;

  infoDisplay.textContent = "";

  infoDisplay.appendChild(pElement);
};

const capitalizeEachWord = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
// END FUNCTIONS
