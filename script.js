const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");

// Translate the weather codes returned by Open-Meteo into descriptions and icons.
function getWeatherInfo(code, isDay) {
  if (code === 0) return { description: "Clear sky", icon: isDay ? "☀️" : "🌙" };
  if ([1, 2].includes(code)) return { description: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { description: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { description: "Foggy", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { description: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { description: "Rainy", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { description: "Snowy", icon: "❄️" };
  if ([95, 96, 99].includes(code)) return { description: "Thunderstorm", icon: "⛈️" };
  return { description: "Weather unavailable", icon: "🌡️" };
}

// Update the HTML with live API data, not hardcoded values.
function displayWeather(place, data) {
  const current = data.current;
  const daily = data.daily;
  const info = getWeatherInfo(current.weather_code, current.is_day === 1);
  document.getElementById("cityName").textContent = `${place.name}, ${place.country}`;
  document.getElementById("updatedAt").textContent = `Local observation time: ${current.time.replace("T", " ")}`;
  document.getElementById("weatherIcon").textContent = info.icon;
  document.getElementById("temperature").textContent = `${Math.round(current.temperature_2m)}°C`;
  document.getElementById("description").textContent = info.description;
  document.getElementById("feelsLike").textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;
  document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`;
  document.getElementById("wind").textContent = `${current.wind_speed_10m} km/h`;
  document.getElementById("precipitation").textContent = `${current.precipitation} mm`;
  document.getElementById("highLow").textContent = `${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°C`;
  weatherCard.hidden = false;
}

// Primary fetch logic uses async/await and checks non-200 HTTP responses.
async function fetchWeather(city) {
  loading.hidden = false;
  errorMessage.hidden = true;
  weatherCard.hidden = true;
  searchButton.disabled = true;

  try {
    // First request: convert city name to latitude and longitude.
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) throw new Error(`City lookup failed (HTTP ${geoResponse.status}). Please try again.`);
    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please check the spelling and try again.");
    }
    const place = geoData.results[0];

    // Second request: retrieve the actual current weather and today's high/low.
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error(`Weather request failed (HTTP ${weatherResponse.status}). Please try again.`);
    const weatherData = await weatherResponse.json();
    if (!weatherData.current || !weatherData.daily) throw new Error("Weather data is incomplete. Please try again later.");
    displayWeather(place, weatherData);
  } catch (error) {
    // Show a user-friendly message instead of an unhandled console error.
    errorMessage.textContent = error instanceof TypeError
      ? "Network error. Please check your internet connection and try again."
      : error.message;
    errorMessage.hidden = false;
  } finally {
    // This executes whether the request succeeds or fails.
    loading.hidden = true;
    searchButton.disabled = false;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the page from reloading.
  const city = cityInput.value.trim();
  if (city === "") {
    weatherCard.hidden = true;
    errorMessage.textContent = "Please enter a city name.";
    errorMessage.hidden = false;
    return;
  }
  fetchWeather(city);
});
