import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  CloudDrizzle,
  CloudSun,
  Wind,
  Droplets,
  Thermometer
} from "lucide-react";

export const WeatherIcon = ({ code, isDay = true, className = "" }: { code: number; isDay?: boolean; className?: string }) => {
  // Mapping Open-Meteo codes to Lucide icons
  if (code === 0) return <Sun className={`text-yellow-400 ${className}`} />;
  if (code >= 1 && code <= 3) return <CloudSun className={`text-gray-400 ${className}`} />;
  if (code >= 45 && code <= 48) return <CloudFog className={`text-gray-300 ${className}`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={`text-blue-300 ${className}`} />;
  if (code >= 61 && code <= 65) return <CloudRain className={`text-blue-500 ${className}`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`text-blue-100 ${className}`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`text-blue-600 ${className}`} />;
  if (code >= 85 && code <= 86) return <CloudSnow className={`text-blue-200 ${className}`} />;
  if (code >= 95) return <CloudLightning className={`text-purple-500 ${className}`} />;
  
  return <Cloud className={`text-gray-400 ${className}`} />;
};

export { Wind, Droplets, Thermometer };
