// Weather Service - API calls to our backend
const weatherService = {
  searchCities: async (query) => {
    if (query.length < 2) return [];
    try {
      const response = await fetch(`/api/search-cities?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  },

  fetchWeather: async (lat, lon, name, country) => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
      if (!response.ok) throw new Error('Failed to fetch weather');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },

  getWeatherDescription: (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      90: 'Thunderstorm',
      91: 'Thunderstorm with slight hail',
      92: 'Thunderstorm with hail',
    };
    return descriptions[code] || 'Unknown';
  },

  getWeatherIcon: (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 86) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '❄️';
    if (code >= 90) return '⛈️';
    return '🌤️';
  },
};
