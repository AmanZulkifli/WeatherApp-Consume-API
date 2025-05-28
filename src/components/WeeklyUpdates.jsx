import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataService from '../api/dataService';

const WeeklyUpdates = ({ data }) => {
  const [upcomingDays, setUpcomingDays] = useState([]);
  const [tempUnit] = useState('°c');

  useEffect(() => {
    // Don't mutate props directly
    const days = data.slice(1); // skip today
    const formatted = days.map((day) => ({
      ...day,
      sunrise: DataService.getDateTime(day.sunrise, 'time'),
      sunset: DataService.getDateTime(day.sunset, 'time'),
      date: DataService.getDateTime(day.dt, 'date'),
      weekday: DataService.getWeekDay(day.dt),
    }));
    setUpcomingDays(formatted);
  }, [data]);

  return (
    upcomingDays.length > 0 && (
      <motion.div
        className="glass-panel p-6 rounded-2xl mb-8 flex flex-col"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="flex items-end gap-6">
          {/* Title */}
          <div className="flex flex-col justify-between h-full mr-4">
            <h3 className="text-white/90 text-2xl font-semibold mb-2 tracking-tight">
              7-Day Forecast
            </h3>
          {/* Cards */}
          <div className="flex items-end gap-4 flex-1">
            {upcomingDays.map((day, i) => {
              // Example: make it "dark" at night, "light" at day (simple logic, you can adjust)
              const hour = parseInt(day.sunrise.split(':')[0], 10);
              const dark = hour > 18 || hour < 6;

              return (
                <motion.div
                  key={`day${i + 1}`}
                  className={`flex flex-col items-center w-36 p-5 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm transition-all duration-200 cursor-pointer
                    ${dark ? 'bg-black/30 hover:bg-black/40' : 'bg-white/10 hover:bg-white/20'}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <div className="mb-2 text-center">
                    <div className="font-semibold text-lg text-white">{day.weekday}</div>
                    <div className="text-xs text-white/60">{day.date}</div>
                  </div>
                  <div className="flex justify-center mb-2">
                    <img
                      className="w-14 h-14 drop-shadow-lg"
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].main}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between text-white text-sm">
                      <span className="opacity-70">High</span>
                      <span className="font-semibold">{Math.round(day.temp.max)}{tempUnit}</span>
                    </div>
                    <div className="flex justify-between text-white text-sm">
                      <span className="opacity-70">Low</span>
                      <span className="font-semibold">{Math.round(day.temp.min)}{tempUnit}</span>
                    </div>
                    <div className="flex justify-between text-white/80 text-xs">
                      <span>💧 {day.humidity}%</span>
                      <span>🌧️ {day.pop ? `${Math.round(day.pop * 100)}%` : '0%'}</span>
                    </div>
                    <div className="flex justify-between text-white/60 text-xs mt-1">
                      <span>🌅 {day.sunrise}</span>
                      <span>🌇 {day.sunset}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </div>
          </div>
        </div>
      </motion.div>
    )
  );
};

export default WeeklyUpdates;