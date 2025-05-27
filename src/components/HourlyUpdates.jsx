import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataService from '../api/dataService';

const HourlyUpdates = ({ data, timings }) => {
  const [nextHours, setNextHours] = useState([]);
  const [tempUnit] = useState('°c');
  const [sunTimings, setSunTimings] = useState([]);
  const [activeHour, setActiveHour] = useState(null);

  useEffect(() => {
    const formatted = data.map((hour) => ({
      dateTime: DataService.getDateTime(hour.dt),
      ...hour,
    }));
    setNextHours(formatted);
    const t = timings.map((t) => ({
      d: new Date(t * 1000).toLocaleDateString('en-US'),
      t: new Date(t * 1000).toLocaleTimeString('en-US'),
    }));
    setSunTimings(t);
  }, [data, timings]);

  const isDarkHour = (dt) => {
    const d = new Date(dt * 1000).toLocaleDateString('en-US');
    const day = sunTimings.filter((t) => t.d === d);
    if (day.length === 2) {
      const min = new Date(`${d} ${day[0].t}`);
      const max = new Date(`${d} ${day[1].t}`);
      return dt * 1000 > min && dt * 1000 < max ? false : true;
    }
    return false;
  };

  // Calculate temperature extremes for the gradient
  const temps = data.map(h => h.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);

  return (
    <div className="relative p-6 rounded-3xl mb-6 bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-white/10 shadow-lg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>

      <h3 className="relative text-white text-2xl font-medium mb-6 tracking-tight">
        Hourly Forecast
        <span className="block text-sm font-light text-white/60 mt-1">Next 48 hours</span>
      </h3>

      {/* Timeline indicator */}
      <div className="relative h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${(100 / 48) * Math.min(data.length, 48)}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="relative flex overflow-x-auto pb-6 -mx-4 scrollbar-hide">
        <div className="flex space-x-4 px-4">
          {nextHours.map((hour, i) => {
            const isDark = isDarkHour(hour.dt);
            const tempPercentage = ((hour.temp - minTemp) / (maxTemp - minTemp)) * 100;
            const bgColor = isDark 
              ? `rgba(79, 70, 229, ${0.3 + (tempPercentage/200)})` 
              : `rgba(56, 182, 255, ${0.2 + (tempPercentage/200)})`;

            return (
              <motion.div
                key={`hr${i + 1}`}
                className={`flex-shrink-0 w-24 p-4 rounded-2xl flex flex-col items-center cursor-pointer transition-all ${activeHour === i ? 'scale-105' : ''}`}
                style={{ 
                  background: bgColor,
                  border: isDark ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(56, 182, 255, 0.3)',
                  backdropFilter: 'blur(8px)'
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveHour(i === activeHour ? null : i)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <div className={`text-center text-sm mb-2 font-medium ${
                  isDark ? 'text-indigo-100' : 'text-cyan-50'
                }`}>
                  {hour.dateTime.time.split(':')[0]}h
                </div>
                
                <div className="relative w-12 h-12 mb-2">
                  <img
                    className="w-full h-full object-contain"
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].main}
                  />
                </div>
                
                <div className={`text-center text-lg font-bold ${
                  isDark ? 'text-white' : 'text-white'
                }`}>
                  {Math.round(hour.temp)}{tempUnit}
                </div>
                
                {/* Expanded details */}
                {activeHour === i && (
                  <motion.div 
                    className="mt-3 pt-3 border-t border-white/20 w-full text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="text-xs text-white/80 mb-1">{hour.weather[0].description}</div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>💧 {hour.humidity}%</span>
                      <span>🌬️ {hour.wind_speed}m/s</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Temperature scale legend */}
      <div className="relative flex justify-between items-center mt-4 text-xs text-white/60">
        <span>Low: {Math.round(minTemp)}{tempUnit}</span>
        <div className="flex-1 mx-4 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
        <span>High: {Math.round(maxTemp)}{tempUnit}</span>
      </div>
    </div>
  );
};

export default HourlyUpdates;