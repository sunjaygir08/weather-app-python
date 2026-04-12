/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeather } from "./components/CurrentWeather";
import { Forecast } from "./components/Forecast";
import { fetchWeather, WeatherData, CitySuggestion } from "./services/weatherService";
import { Loader2, CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadWeather = async (lat: number, lon: number, name: string, country: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon, name, country);
      setWeather(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city: CitySuggestion) => {
    loadWeather(city.latitude, city.longitude, city.name, city.country);
  };

  React.useEffect(() => {
    // Default to London on first load
    loadWeather(51.5074, -0.1278, "London", "United Kingdom");

    // Try to get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode to get city name (optional, but nice)
            // For now, just use coordinates and label as "Your Location"
            loadWeather(position.coords.latitude, position.coords.longitude, "Your Location", "");
          } catch (err) {
            console.error("Geolocation error:", err);
          }
        },
        (err) => {
          console.warn("Geolocation denied:", err);
        }
      );
    }
  }, []);

  const getBackgroundClass = () => {
    if (!weather) return "from-sky-400 to-blue-500";
    const code = weather.current.weatherCode;
    // Using a consistent light blue theme as requested, with subtle variations for weather
    if (code === 0) return "from-sky-300 to-blue-400"; // Clear
    if (code >= 1 && code <= 3) return "from-sky-400 to-blue-500"; // Partly cloudy
    if (code >= 45 && code <= 48) return "from-blue-200 to-sky-400"; // Fog
    if (code >= 51 && code <= 65) return "from-sky-500 to-blue-600"; // Rain
    if (code >= 71 && code <= 86) return "from-blue-100 to-sky-300"; // Snow
    if (code >= 95) return "from-sky-600 to-blue-800"; // Thunderstorm
    return "from-sky-400 to-blue-500";
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${getBackgroundClass()} transition-colors duration-1000 flex flex-col items-center py-8 md:py-12 px-4 overflow-x-hidden`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col items-center gap-8"
      >
        <div className="text-center mb-4">
          <h2 className="text-white/60 text-sm font-bold uppercase tracking-[0.3em] mb-2">SkyCast</h2>
          <div className="h-1 w-12 bg-white/30 mx-auto rounded-full" />
        </div>

        <SearchBar onSelectCity={handleCitySelect} />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <Loader2 className="h-12 w-12 text-white/50 animate-spin" />
              <p className="text-white/60 font-medium animate-pulse">Fetching latest weather...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4 text-center"
            >
              <div className="p-4 bg-white/10 rounded-full">
                <CloudOff className="h-12 w-12 text-white/50" />
              </div>
              <p className="text-white/80 font-medium max-w-xs">{error}</p>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => loadWeather(51.5074, -0.1278, "London", "United Kingdom")}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </motion.div>
          ) : weather ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <CurrentWeather data={weather} />
              <Forecast data={weather} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <footer className="mt-auto pt-12 text-blue-900/40 text-xs font-bold tracking-widest uppercase">
        Website working on OPEN-METEO API KEY
      </footer>
    </div>
  );
}
