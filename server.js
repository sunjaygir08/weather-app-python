const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for weather
app.get('/api/weather', async (req, res) => {
  const { lat, lon, name, country } = req.query;
  
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,wind_speed_10m,relative_humidity_2m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const data = await response.json();
    
    const current = data.current;
    const daily = data.daily;
    
    res.json({
      current: {
        temp: current.temperature_2m,
        weatherCode: current.weather_code,
        isDay: current.is_day,
        windSpeed: current.wind_speed_10m,
        humidity: current.relative_humidity_2m,
        apparentTemp: current.apparent_temperature,
      },
      daily: {
        time: daily.time,
        weatherCode: daily.weather_code,
        tempMax: daily.temperature_2m_max,
        tempMin: daily.temperature_2m_min,
      },
      location: {
        name: name || 'Unknown',
        country: country || '',
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// API endpoint for city search
app.get('/api/search-cities', async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    res.json([]);
    return;
  }
  
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json([]);
  }
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Open your browser and navigate to http://localhost:${PORT}`);
});
