// Main React App
const { useState, useEffect } = React;

function SearchBar({ onCitySelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (value) => {
    setQuery(value);
    if (value.length >= 2) {
      const cities = await weatherService.searchCities(value);
      setSuggestions(cities);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city) => {
    onCitySelect(city);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((city, idx) => (
            <div
              key={idx}
              className="suggestion-item"
              onClick={() => handleSelectCity(city)}
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CurrentWeather({ weather }) {
  if (!weather) return null;

  const { current, location } = weather;
  const icon = weatherService.getWeatherIcon(current.weatherCode);
  const description = weatherService.getWeatherDescription(current.weatherCode);

  return (
    <div className="weather-card">
      <div className="location-info">
        <h1>{location.name}</h1>
        <p>{location.country}</p>
      </div>
      <div className="main-temp">
        <div className="weather-icon">{icon}</div>
        <div className="temp-display">
          <span className="temp">{Math.round(current.temp)}°</span>
          <p className="description">{description}</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <p className="label">Feels Like</p>
          <p className="value">{Math.round(current.apparentTemp)}°</p>
        </div>
        <div className="stat-card">
          <p className="label">Humidity</p>
          <p className="value">{current.humidity}%</p>
        </div>
        <div className="stat-card">
          <p className="label">Wind</p>
          <p className="value">{Math.round(current.windSpeed)} km/h</p>
        </div>
      </div>
    </div>
  );
}

function Forecast({ weather }) {
  if (!weather) return null;

  const { daily } = weather;
  const next7Days = daily.time.slice(0, 7);

  return (
    <div className="forecast-section">
      <h2>7-Day Forecast</h2>
      <div className="forecast-grid">
        {next7Days.map((date, idx) => {
          const d = new Date(date);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          const icon = weatherService.getWeatherIcon(daily.weatherCode[idx]);
          return (
            <div key={idx} className="forecast-item">
              <p className="day">{dayName}</p>
              <p className="icon">{icon}</p>
              <p className="temps">
                <span className="high">{Math.round(daily.tempMax[idx])}°</span>
                <span className="low">{Math.round(daily.tempMin[idx])}°</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = async (lat, lon, name, country) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await weatherService.fetchWeather(lat, lon, name, country);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    loadWeather(city.latitude, city.longitude, city.name, city.country);
  };

  // Load default location (London) on mount
  useEffect(() => {
    loadWeather(51.5074, -0.1278, 'London', 'United Kingdom');

    // Try to get user's geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        loadWeather(
          position.coords.latitude,
          position.coords.longitude,
          'Your Location',
          ''
        );
      });
    }
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="brand">SkyCast</h1>
        <SearchBar onCitySelect={handleCitySelect} />
      </header>

      <main className="main-content">
        {isLoading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Fetching weather...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!isLoading && !error && weather && (
          <>
            <CurrentWeather weather={weather} />
            <Forecast weather={weather} />
          </>
        )}
      </main>

      <footer className="footer">
        <p>SkyCast Weather • Powered by Open-Meteo API</p>
      </footer>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
