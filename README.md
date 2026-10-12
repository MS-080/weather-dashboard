# Assignment 4 — Weather Dashboard App

A responsive weather dashboard built with HTML, CSS and JavaScript. It uses live data from the free [Open-Meteo](https://open-meteo.com/) API.

## How to run

1. Download and unzip the project folder.
2. Open the folder in Visual Studio Code.
3. Open `index.html` using the **Live Server** extension (right-click → **Open with Live Server**), or open it in a modern browser.
4. Enter a city such as **Beirut**, **Paris**, or **London** and click **Search**.
5. An internet connection is required to load live weather data.

## API key setup

**No API key is required.** Open-Meteo provides free non-commercial API endpoints without an API key. No secrets are stored in the source code.

## API requests

1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search` converts the city name to coordinates.
2. Forecast: `https://api.open-meteo.com/v1/forecast` returns current temperature, apparent temperature, weather code, humidity, wind speed, precipitation, and daily high/low.

## JavaScript concepts from class

- DOM access using `document.getElementById()` and `.textContent`
- Form event listener and `event.preventDefault()`
- Functions, arrays and conditionals
- `async`/`await` and `fetch()`
- `response.ok`, `response.json()`, and JSON object properties
- `try` / `catch` / `finally` for loading and errors
- Dynamic UI updates without page reload

