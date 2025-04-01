const apiKey = 'eb610bb4197ccf958e25f5e51d599a4a'; 
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const placeName = document.getElementById("placeName");
const timeElement = document.getElementById("time");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const forecastContainer = document.getElementById("forecastContainer");
const head = document.getElementById("head");
const para = document.getElementById("para");
const rightUpperSection = document.getElementById("back-ground");
const imgElement = document.getElementById("imgElement");
const conditionElement = document.getElementById("condition");
const Dropdown = document.getElementById('dropdown');
const windElement = document.getElementById("wind");

// Fetch weather data based on  city name
async function fetchWeather(city, apiKey) {
    try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        if (!weatherRes.ok) {
            let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
            cities = cities.filter(c => c !== city);
            localStorage.setItem('recentCities', JSON.stringify(cities));
            updateDropdown();
            throw new Error("City not found");
        }
            
        const weatherData = await weatherRes.json();
        const name = weatherData.city.name;
        const temp = weatherData.list[0].main.temp;
        const humidity = weatherData.list[0].main.humidity;
        const description = weatherData.list[0].weather[0].description;
        const icon = weatherData.list[0].weather[0].icon;
        const wind = weatherData.list[0].wind.speed;
        WeatherUI(name, temp, humidity, description, icon,wind);
        ForecastUI(weatherData.list);
    } catch (error) {

        alert(error.message);
    }
}


function WeatherUI(city, temp, humidity, condition, icon,wind) {
    head.textContent = ""
    para.textContent = ""
    rightUpperSection.className = "bg-gradient-to-b from-blue-100 to-blue-300 w-full p-10 m-5"
    placeName.textContent = city;
    placeName.className = "text-3xl font-bold text-gray-800 text-start";
    timeElement.textContent = new Date().toLocaleString();
    timeElement.className = "text-xl font-bold text-gray-700 text-start";
    temperatureElement.textContent = `Temperature: ${(temp - 273.15).toFixed(1)}°C`;
    temperatureElement.className = "text-3xl font-bold text-blue-600 text-start";
    humidityElement.textContent = `💧 Humidity: ${humidity}%`;
    humidityElement.className = "text-3xl font-bold text-green-600 text-start";
    imgElement.src = `https://openweathermap.org/img/wn/${icon}.png`;
    imgElement.alt = condition
    imgElement.className = "mx-auto w-20 h-20 hover:brightness-[1.75]"
    conditionElement.textContent = condition
    conditionElement.className = "text-gray-700 capitalize font-medium font-bold text-2xl"
    windElement.textContent = `Wind Speed: ${wind} m/s`; 
    windElement.className = "text-3xl font-bold text-yellow-600 text-start";
}

// Update UI for 5-day forecast
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
         const windSpeed = dayData.wind.speed;
        card.className = "rounded shadow-md m-5 hover:brightness-[1.75]";
         card.classList.add("card-style")
        card.innerHTML = `
                <div class="bg-gradient-to-b from-blue-100 to-blue-300 w-48 p-4 rounded-2xl shadow-lg text-center space-y-2">
                 <p class="font-bold text-lg text-gray-800">Day ${i + 1}</p>
                 <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${condition}" class="mx-auto w-12 h-12">
                <p class="text-gray-700 capitalize font-medium">${condition}</p>
                  <p class="text-xl font-semibold text-blue-600"> ${(temp - 273.15).toFixed(1)}°C</p>
                   <p class="text-lg text-yellow-600 font-medium">  Wind: ${windSpeed} m/s</p>
                <p class="text-lg text-green-600 font-medium"> ${humidity}% Humidity</p>
            </div>
            `;
        forecastContainer.appendChild(card);
    }
}

// Add city to localStorage
function addCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) {
         cities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(cities));
    }
}

// Update the dropdown with recently searched cities
function updateDropdown() {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
      Dropdown.innerHTML = '<option value="">Select a recently searched city</option>';
         cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        Dropdown.appendChild(option);
    });
    
    Dropdown.classList.toggle('hidden', cities.length === 0);
}

// search button handling to get data of particular city
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }
    fetchWeather(city, apiKey);
    addCityToLocalStorage(city);
    updateDropdown();
    cityInput.value = '';  
});

//  get weather data based on geolocation
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const Res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
            const Data = await Res.json();
            fetchWeather(Data.name, apiKey);
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// dropdown selection
Dropdown.addEventListener('change', (event) => {
    const selectedCity = event.target.value;
    if (selectedCity) {
        fetchWeather(selectedCity, apiKey);
    }
});

// Initialize  dropdown with searched cities
updateDropdown();
