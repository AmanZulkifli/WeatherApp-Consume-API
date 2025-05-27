import { useEffect, useState } from 'react';
import DataService from '../api/dataService';

const WeeklyUpdates = ({ data }) => {
  const [upcomingDays, setUpcomingDays] = useState([]);
  const [tempUnit] = useState('°c');

  useEffect(() => {
    data.shift();
    const formatted = data.map((day) => {
      day.sunrise = DataService.getDateTime(day.sunrise, 'time');
      day.sunset = DataService.getDateTime(day.sunset, 'time');
      day.date = DataService.getDateTime(day.dt, 'date');
      day.weekday = DataService.getWeekDay(day.dt);
      return day;
    });
    setUpcomingDays(formatted);
  }, [data]);

  return (
    upcomingDays.length > 0 && (
      <div className="glass-panel p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
        <h3 className="text-white/80 text-xl font-light mb-4 tracking-wider">7-DAY FORECAST</h3>
        <div className="scroll-container flex overflow-x-auto pb-4 -mx-2 scrollbar-hide ">
          {upcomingDays.map((day, i) => (
            <div
              key={`day${i + 1}`}
              className="flex-shrink-0 w-40 mx-2 p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br from-blue-400/15 to-cyan-400/15 hover:from-blue-400/25 hover:to-cyan-400/25 transition-all duration-300 border border-white/10"
            >
              <div className="text-white mb-3">
                <div className="font-medium text-lg tracking-tight">{day.weekday}</div>
                <div className="text-xs text-white/60">{day.date}</div>
              </div>
              <div className="flex justify-center mb-3">
                <img
                  className="w-12 h-12 drop-shadow-lg"
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].main}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-white text-sm">
                <div className="bg-white/5 rounded p-1">
                  <div className="text-xs text-white/60">High</div>
                  <div className="font-medium">{Math.round(day.temp.max)}{tempUnit}</div>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <div className="text-xs text-white/60">Low</div>
                  <div className="font-medium">{Math.round(day.temp.min)}{tempUnit}</div>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <div className="text-xs text-white/60">Humidity</div>
                  <div className="font-medium">{day.humidity}%</div>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <div className="text-xs text-white/60">Rain</div>
                  <div className="font-medium">{day.pop ? `${Math.round(day.pop * 100)}%` : '0%'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default WeeklyUpdates;