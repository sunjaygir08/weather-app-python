/**
 * Weather Service using Open-Meteo API (Free, no key required)
 */

export interface WeatherData {
  current: {
    temp: number;
    weatherCode: number;
    isDay: boolean;
    windSpeed: number;
    humidity: number;
    apparentTemp: number;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    tempMax: number[];
    tempMin: number[];
  };
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

export interface CitySuggestion {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export const searchCities = async (query: string): Promise<CitySuggestion[]> => {
  if (query.length < 2) return [];
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
};

export const fetchWeather = async (lat: number, lon: number, cityName: string, country: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const data = await response.json();

    return {
      current: {
        temp: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        windSpeed: data.current.wind_speed_10m,
        humidity: data.current.relative_humidity_2m,
        apparentTemp: data.current.apparent_temperature,
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min,
      },
      location: {
        name: cityName,
        country: country,
        latitude: lat,
        longitude: lon,
      },
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

export const getWeatherDescription = (code: number): string => {
  const weatherCodes: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown";
};
