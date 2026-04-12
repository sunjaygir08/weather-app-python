import { WeatherData, getWeatherDescription } from "@/src/services/weatherService";
import { WeatherIcon } from "./WeatherIcons";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

interface ForecastProps {
  data: WeatherData;
}

export const Forecast = ({ data }: ForecastProps) => {
  const { daily } = data;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold text-blue-950 mb-6">7-Day Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {daily.time.map((date, idx) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-white/30 backdrop-blur-sm border-white/40 text-blue-950 h-full hover:bg-white/50 transition-colors cursor-default shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-between h-full gap-3">
                <p className="text-sm font-bold text-blue-900/70">
                  {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <WeatherIcon code={daily.weatherCode[idx]} className="h-10 w-10 drop-shadow-sm" />
                <div className="text-center">
                  <p className="text-lg font-black">{Math.round(daily.tempMax[idx])}°</p>
                  <p className="text-xs text-blue-900/50 font-bold">{Math.round(daily.tempMin[idx])}°</p>
                </div>
                <p className="text-[10px] text-center text-blue-900/60 font-bold leading-tight h-8 flex items-center">
                  {getWeatherDescription(daily.weatherCode[idx])}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
