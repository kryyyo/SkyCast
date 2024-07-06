interface WeatherData {
  temperature: number;
  description: string;
}

interface LocationSuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("locationForm") as HTMLFormElement;
  form.addEventListener("submit", handleSubmit);

  const locationInput = document.getElementById(
    "locationInput"
  ) as HTMLInputElement;
  locationInput.addEventListener("input", handleInput);
  locationInput.addEventListener("focus", handleInput);
});

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
  const apiKey = "api-key";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Weather data not found.");
    }
    const data = await response.json();
    const weatherData: WeatherData = {
      temperature: data.main.temp,
      description: data.weather[0].description,
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
  const apiKey = "api-key";
  const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&appid=${apiKey}`;

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

const displayWeatherInfo = (weatherData: WeatherData) => {
  const infoDisplay = document.getElementById("infoDisplay")!;
  infoDisplay.innerHTML = `
    <p><strong>Temperature:</strong> ${weatherData.temperature}°C</p>
    <p><strong>Description:</strong> ${weatherData.description}</p>
  `;
};

const displayErrorMessage = (message: string) => {
  const infoDisplay = document.getElementById("infoDisplay")!;
  infoDisplay.innerHTML = `<p style="color: red;">${message}</p>`;
};
