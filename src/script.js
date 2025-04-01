const apiKey = 'eb610bb4197ccf958e25f5e51d599a4a'; 
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const placeName = document.getElementById("placeName");
const timeElement = document.getElementById("time");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const forecastContainer = document.getElementById("forecastContainer");
const head=document.getElementById("head");
const para=document.getElementById("para");
const rightUpperSection=document.getElementById("back-ground");
const imgElement=document.getElementById("imgElement");
const conditionElement=document.getElementById("condition");
async function fetchWeather(city,apiKey) {
    try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        if (!weatherRes.ok) throw new Error("City not found");
        const weatherData = await weatherRes.json();
        const name = weatherData.city.name;
        const temp = weatherData.list[0].main.temp; 
        const humidity = weatherData.list[0].main.humidity;
        const description = weatherData.list[0].weather[0].description;
        const icon =weatherData.list[0].weather[0].icon; 
        WeatherUI(name,temp,humidity,description,icon);
        ForecastUI(weatherData.list);
    } catch (error) {
        alert(error.message);
    }
}

function WeatherUI(city, temp, humidity, condition,icon) {
    head.textContent=""
    para.textContent=""
    rightUpperSection.className="bg-gradient-to-b from-blue-100 to-blue-300 w-full p-10 m-5"
    placeName.textContent = city;
    placeName.className="text-3xl font-bold text-gray-800 text-start";
    timeElement.textContent = new Date().toLocaleString();
    timeElement.className="text-xl font-bold text-gray-700 text-start";
    temperatureElement.textContent = `🌡️ Temperature: ${(temp - 273.15).toFixed(1)}°C`;
    temperatureElement.className="text-3xl font-bold text-blue-600 text-start";
    humidityElement.textContent = `💧 Humidity: ${humidity}%`;
    humidityElement.className="text-3xl font-bold text-green-600 text-start";
    imgElement.src=`https://openweathermap.org/img/wn/${icon}.png`;
    imgElement.alt=condition
    imgElement.className="mx-auto w-20 h-20"
    conditionElement.textContent=condition
    conditionElement.className="text-gray-700 capitalize font-medium font-bold text-2xl"

}

function ForecastUI(forecastList) {
    forecastContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {

        const dayData = forecastList[i];
        const date = new Date(dayData.dt_txt).toLocaleDateString();
         const temp = dayData.main.temp;
        const humidity = dayData.main.humidity;
        const condition = dayData.weather[0].description;
        const card = document.createElement("div");
        const icon = dayData.weather[0].icon; 
        card.className = "rounded shadow-md m-5";
        card.classList.add("card-style")
        card.innerHTML = `
                <div class="bg-gradient-to-b from-blue-100 to-blue-300 w-48 p-4 rounded-2xl shadow-lg text-center space-y-2">
                <p class="font-bold text-lg text-gray-800">Day ${i + 1}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${condition}" class="mx-auto w-12 h-12">
                <p class="text-gray-700 capitalize font-medium">${condition}</p>
                <p class="text-xl font-semibold text-blue-600"> ${(temp - 273.15).toFixed(1)}°C</p>
                <p class="text-lg text-green-600 font-medium"> ${humidity}% Humidity</p>
            </div>
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
