const weatherCodes = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 95: "Thunderstorm"
};

const elements = {
    cityInput: document.getElementById('cityInput'),
    suggestions: document.getElementById('suggestions'),
    weatherContent: document.getElementById('weatherContent'),
    loader: document.getElementById('loader'),
    cityName: document.getElementById('cityName'),
    countryName: document.getElementById('countryName'),
    currentTemp: document.getElementById('currentTemp'),
    weatherDesc: document.getElementById('weatherDesc'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    forecastGrid: document.getElementById('forecastGrid')
};

async function fetchWeather(lat, lon, name, country) {
    elements.loader.classList.remove('hidden');
    elements.weatherContent.classList.add('hidden');

    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();
        updateUI(data, name, country);
    } catch (err) {
        alert("Failed to fetch weather");
    } finally {
        elements.loader.classList.add('hidden');
        elements.weatherContent.classList.remove('hidden');
    }
}

function updateUI(data, name, country) {
    elements.cityName.innerText = name;
    elements.countryName.innerText = country;
    elements.currentTemp.innerText = Math.round(data.current.temperature_2m);
    elements.weatherDesc.innerText = weatherCodes[data.current.weather_code] || "Weathery";
    elements.feelsLike.innerText = Math.round(data.current.apparent_temperature) + "°";
    elements.humidity.innerText = data.current.relative_humidity_2m + "%";
    elements.windSpeed.innerText = data.current.wind_speed_10m + " km/h";

    elements.forecastGrid.innerHTML = data.daily.time.map((date, i) => `
        <div class="forecast-card">
            <p class="day">${new Date(date).toLocaleDateString('en-US', {weekday: 'short'})}</p>
            <p class="temp-max">${Math.round(data.daily.temperature_2m_max[i])}°</p>
            <p class="temp-min">${Math.round(data.daily.temperature_2m_min[i])}°</p>
        </div>
    `).join('');
}

// Search Logic
let searchTimeout;
elements.cityInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value;
    if (query.length < 2) {
        elements.suggestions.classList.add('hidden');
        return;
    }

    searchTimeout = setTimeout(async () => {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`);
        const data = await res.json();
        if (data.results) {
            elements.suggestions.innerHTML = data.results.map(city => `
                <div class="suggestion-item" onclick="selectCity(${city.latitude}, ${city.longitude}, '${city.name}', '${city.country}')">
                    <p>${city.name}</p>
                    <span>${city.admin1 ? city.admin1 + ', ' : ''}${city.country}</span>
                </div>
            `).join('');
            elements.suggestions.classList.remove('hidden');
        }
    }, 300);
});

window.selectCity = (lat, lon, name, country) => {
    elements.cityInput.value = "";
    elements.suggestions.classList.add('hidden');
    fetchWeather(lat, lon, name, country);
};

// Initial Load
fetchWeather(51.5074, -0.1278, "London", "United Kingdom");
