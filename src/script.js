const apiKey = 'eb610bb4197ccf958e25f5e51d599a4a'; // Replace with OpenWeather API key
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const placeName = document.getElementById("placeName");
const timeElement = document.getElementById("time");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const forecastContainer = document.getElementById("forecastContainer");

async function fetchWeather(city,apiKey) {
    try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        if (!weatherRes.ok) throw new Error("City not found");
        const weatherData = await weatherRes.json();
        const name = weatherData.city.name;
        const temp = weatherData.list[0].main.temp; 
        const humidity = weatherData.list[0].main.humidity;
        const description = weatherData.list[0].weather[0].description;
        updateWeatherUI(name,temp,humidity,description);
        fetchForecast(city,apiKey);
    } catch (error) {
        alert(error.message);
    }
}

async function fetchForecast(city,apiKey) {
    try {
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        if (!forecastRes.ok) throw new Error("Forecast data unavailable");

        const forecastData = await forecastRes.json();
        updateForecastUI(forecastData.list);
    } catch (error) {
        alert(error.message);
    }
}

function updateWeatherUI(city, temp, humidity, condition) {
    placeName.textContent = city;
    timeElement.textContent = new Date().toLocaleString();
    temperatureElement.textContent = `Temperature: ${temp}°C`;
    humidityElement.textContent = `Humidity: ${humidity}%`;
}

function updateForecastUI(forecastList) {
    forecastContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {

        const dayData = forecastList[i];
        const date = new Date(dayData.dt_txt).toLocaleDateString();
         const temp = dayData.main.temp;
        const humidity = dayData.main.humidity;
        const condition = dayData.weather[0].description;
        const card = document.createElement("div");
        card.className = "bg-gray-100 p-4 rounded shadow-md";

        card.innerHTML = `
            <p class="font-semibold">${date}</p>
            <p>${condition}</p>
            <p>Temp: ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
        `;

        forecastContainer.appendChild(card);
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }
    fetchWeather(city,apiKey);
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const geoRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
            const geoData = await geoRes.json();
            fetchWeather(geoData.name,apiKey);
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
