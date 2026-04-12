import * as React from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchCities, CitySuggestion } from "@/src/services/weatherService";
import { motion, AnimatePresence } from "motion/react";

interface SearchBarProps {
  onSelectCity: (city: CitySuggestion) => void;
}

export const SearchBar = ({ onSelectCity }: SearchBarProps) => {
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length >= 2) {
      setIsLoading(true);
      const results = await searchCities(val);
      setSuggestions(results);
      setIsLoading(false);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-50" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a city..."
          className="pl-10 h-12 bg-white/40 backdrop-blur-md border-white/40 text-blue-950 placeholder:text-blue-900/50 focus-visible:ring-blue-500/30 rounded-2xl font-medium"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-white/50" />
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
          >
            {suggestions.map((city, idx) => (
              <button
                key={`${city.latitude}-${city.longitude}-${idx}`}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-white border-b border-white/5 last:border-0"
                onClick={() => {
                  onSelectCity(city);
                  setQuery("");
                  setShowSuggestions(false);
                }}
              >
                <MapPin className="h-4 w-4 text-white/60" />
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-white/60">
                    {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
