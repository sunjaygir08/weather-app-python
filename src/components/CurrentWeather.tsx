import * as React from "react";
import { WeatherData, getWeatherDescription } from "@/src/services/weatherService";
import { WeatherIcon, Wind, Droplets, Thermometer } from "./WeatherIcons";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

interface CurrentWeatherProps {
  data: WeatherData;
}

export const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const { current, location } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between px-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-950 tracking-tight">
            {location.name}
          </h1>
          <p className="text-xl text-blue-900/70 font-semibold mt-1">
            {location.country}
          </p>
          <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
            <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="h-16 w-16 md:h-24 md:w-24 drop-shadow-sm" />
            <div>
              <span className="text-6xl md:text-8xl font-black text-blue-950">
                {Math.round(current.temp)}°
              </span>
              <p className="text-lg md:text-xl text-blue-900/80 font-bold">
                {getWeatherDescription(current.weatherCode)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
          <WeatherStatCard
            icon={<Thermometer className="h-5 w-5" />}
            label="Feels Like"
            value={`${Math.round(current.apparentTemp)}°`}
          />
          <WeatherStatCard
            icon={<Droplets className="h-5 w-5" />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <WeatherStatCard
            icon={<Wind className="h-5 w-5" />}
            label="Wind Speed"
            value={`${current.windSpeed} km/h`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const WeatherStatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Card className="bg-white/40 backdrop-blur-md border-white/40 text-blue-950 overflow-hidden shadow-sm">
    <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
      <div className="p-2 bg-blue-500/10 rounded-full text-blue-700">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-xs text-blue-900/60 uppercase tracking-wider font-bold">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </CardContent>
  </Card>
);
