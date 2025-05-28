import { useEffect, useState } from 'react';
import DataService from '../api/dataService';


const HourlyUpdates = ({ data, timings, viewMode = 'grid' }) => {
  const [nextHours, setNextHours] = useState([]);
  const [sunTimings, setSunTimings] = useState([]);
  const [activeTab, setActiveTab] = useState('scroll');
  const tempUnit = '°c';

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

  // Group hours by date (only used for grid mode)
  const groupedByDate = nextHours.reduce((acc, hour) => {
    const date = hour.dateTime.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(hour);
    return acc;
  }, {});

  const renderScrollView = () => (
    <div className="relative">
      <div className="scroll-container flex overflow-x-auto pb-4 -mx-2 scrollbar-hide">
        <div className="flex space-x-3 px-2">
          {nextHours.map((hour) => {
            const dark = isDarkHour(hour.dt);
            const isCurrentHour = new Date(hour.dt * 1000).getHours() === new Date().getHours();
            
            return (
              <div
                key={hour.dt}
                className={`glass-card flex flex-col items-center w-28 p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 cursor-pointer
                  ${dark ? 'bg-black/30 hover:bg-black/40' : 'bg-white/10 hover:bg-white/20'}
                  ${isCurrentHour ? 'ring-2 ring-white/50' : ''}`}
                title={`${hour.dateTime.time} — ${hour.weather[0].description}`}
              >
                <div className="text-center text-white/80 text-sm mb-1 font-medium">
                  {hour.dateTime.time}
                </div>
                <div className="text-xs text-white/60 mb-2">
                  {hour.dateTime.date}
                </div>
                <div className="flex justify-center mb-2">
                  <img
                    className="w-12 h-12"
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].main}
                    loading="lazy"
                  />
                </div>
                <div className="text-center text-white font-semibold text-lg mb-1">
                  {Math.round(hour.temp)}{tempUnit}
                </div>
                <div className="text-xs text-white/60">
                  {hour.weather[0].main}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderGridView = () => (
    <>
      {Object.entries(groupedByDate).map(([date, hours]) => (
        <section key={date} className="mb-8 last:mb-0">
          <div className="flex items-center mb-4">
            <h4 className="text-white/80 text-lg font-medium">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
            </h4>
            <span className="text-white/50 text-sm ml-2">
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {hours.map((hour) => {
              const dark = isDarkHour(hour.dt);
              const isCurrentHour = new Date(hour.dt * 1000).getHours() === new Date().getHours();
              
              return (
                <div
                  key={hour.dt}
                  className={`glass-card p-4 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer
                    ${dark ? 'bg-black/30 hover:bg-black/40' : 'bg-white/10 hover:bg-white/20'}
                    ${isCurrentHour ? 'ring-2 ring-white/50' : ''}`}
                  title={`${hour.dateTime.time} — ${hour.weather[0].description}`}
                >
                  <div className="text-center text-white/80 text-sm mb-2 font-medium">
                    {hour.dateTime.time}
                  </div>
                  <div className="flex justify-center mb-2">
                    <img
                      className="w-12 h-12"
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                      alt={hour.weather[0].main}
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center text-white font-semibold text-lg mb-1">
                    {Math.round(hour.temp)}{tempUnit}
                  </div>
                  <div className="text-xs text-white/60 text-center">
                    {hour.weather[0].main}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );

  return (
    <div className="glass-section p-6 rounded-3xl mb-6 ">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white/80 text-2xl font-medium">Hourly Forecast</h3>
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'grid' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setActiveTab('scroll')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'scroll' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
          >
            Timeline
          </button>
        </div>
      </div>
      
      {activeTab === 'grid' ? renderGridView() : renderScrollView()}
    </div>
  );
};

export default HourlyUpdates;