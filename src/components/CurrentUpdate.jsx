import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from "react";
import DataService from '../api/dataService';

// Import icons
import pinIcon from '../assets/icons/pin.png';
import dropIcon from '../assets/icons/drop.png';
import windIcon from '../assets/icons/wind.png';
import tempIcon from '../assets/icons/temperature.png';
import sunriseIcon from '../assets/icons/sunrise.png';
import sunsetIcon from '../assets/icons/sunset.png';
import visibilityIcon from '../assets/icons/visibility.png';
import barometerIcon from '../assets/icons/barometer.png';
import cloudsIcon from '../assets/icons/clouds.png';
import rainIcon from '../assets/icons/rain.png';

const CurrentUpdate = ({ data, dailydata, timings, miniview, name }) => {
  const [tempUnit] = useState('°c');
  const [windSpeedUnit] = useState('mt/s');
  const [windDirection, setWindDirection] = useState(null);
  const [tempData] = useState(dailydata.temp);
  const [rainChance] = useState(dailydata.rain);

  useEffect(() => {
    const direction = DataService.getCardinalDirection(data.wind_deg);
    setWindDirection(direction);
  }, [data]);

  const funFacts = useMemo(() => [
    "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, California!",
    "Snowflakes can take up to an hour to fall from the cloud to the ground!",
    "A bolt of lightning is five times hotter than the surface of the sun.",
    "The coldest temperature ever recorded was -89.2°C (-128.6°F) in Antarctica.",
    "Rain contains vitamin B12, which is vital for the human body (in tiny amounts)."
  ], []);

  const randomFact = useMemo(() => {
    return funFacts[Math.floor(Math.random() * funFacts.length)];
  }, [funFacts]);

  const darkIcons = ['01n', '13d', '13n', '50d', '50n'];

  const Icon = ({ iconUrl, alt, size = 30, className = '' }) => (
    <motion.img
      src={iconUrl}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block rounded-full ${className}`}
      style={{
        objectFit: 'contain',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(4px)'
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
  );

  return (
    <motion.div
      className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Weather Card - Left Column */}
      <motion.div
        className="glass-panel p-6 rounded-2xl flex flex-col justify-between lg:col-span-1"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Location and Temp */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Icon iconUrl={pinIcon} alt="Location Pin" size={24} />
              <span className="text-xl font-light tracking-wider text-white/80">{name}</span>
            </motion.div>

            <motion.div
              className="text-[100px] font-bold leading-none text-white drop-shadow-lg flex items-end"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              {data.temp}
              <sup className="text-[40px] opacity-60 align-super">{tempUnit}</sup>
            </motion.div>

            <motion.div
              className="mt-4 text-lg text-white/80 font-light tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {data.weather[0].main} ({data.weather[0].description})
            </motion.div>

            <motion.div
              className="mt-2 text-base text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Feels like {data.feels_like}{tempUnit}
              {data.rain && (
                <span className="ml-2">| Rain: {data.rain['1h']}mm</span>
              )}
            </motion.div>
          </div>

          {/* Weather Icon */}
          <motion.div
            className={`icon ${darkIcons.includes(data.weather[0]?.icon) ? 'inv filter invert' : ''}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
          >
            {data.weather && data.weather[0] && data.weather[0].icon ? (
              <img
                className="city-icon"
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                alt={data.weather[0].main}
                width={140}
                height={140}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <span>No icon</span>
            )}
          </motion.div>
        </div>

        {/* Hi/Lo Temp */}
        <motion.div
          className="flex justify-center gap-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <Icon iconUrl={tempIcon} alt="HI" size={32} />
            <span className="text-xs text-white/60">HI</span>
            <span className="text-lg text-white">{tempData.max}<sup>{tempUnit}</sup></span>
          </div>
          <div className="flex flex-col items-center">
            <Icon iconUrl={tempIcon} alt="LO" size={32} className="opacity-60" />
            <span className="text-xs text-white/60">LO</span>
            <span className="text-lg text-white">{tempData.min}<sup>{tempUnit}</sup></span>
          </div>
        </motion.div>
      </motion.div>

      {/* Info Panel - Middle Column */}
      <motion.div
        className="glass-panel p-6 rounded-2xl flex flex-col"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: dropIcon, label: 'Humidity', value: `${data.humidity}%` },
            { icon: windIcon, label: 'Wind', value: `${windDirection} ${data.wind_speed} ${windSpeedUnit}` },
            { icon: barometerIcon, label: 'Pressure', value: `${data.pressure} hPa` },
            { icon: cloudsIcon, label: 'Clouds', value: `${data.clouds}%` },
            { icon: rainIcon, label: 'Rain Chance', value: `${Math.round(rainChance * 100)}%` },
            { icon: visibilityIcon, label: 'Visibility', value: `${Math.round(data.visibility / 1000)} km` },
            ...(data.dt < data.sunrise ? [
              { icon: sunriseIcon, label: 'Sunrise', value: DataService.getDateTime(data.sunrise, 'time') }
            ] : []),
            ...(data.dt >= data.sunrise && data.dt < data.sunset ? [
              { icon: sunsetIcon, label: 'Sunset', value: DataService.getDateTime(data.sunset, 'time') }
            ] : []),
            ...(data.dt >= data.sunset ? [
              { icon: sunriseIcon, label: 'Sunrise', value: DataService.getDateTime(timings[2], 'time') }
            ] : [])
          ].map((item, index) => (
            <motion.div
              key={`${item.label}-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.05) }}
              whileHover={{ scale: 1.02 }}
            >
              <Icon iconUrl={item.icon} alt={item.label} size={28} />
              <div>
                <div className="text-sm font-light text-white/60">{item.label}</div>
                <div className="text-white">{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fun Fact Card - Right Column */}
      <motion.div
        className="glass-panel p-6 rounded-2xl flex flex-col justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-medium text-white/80 mb-2">Weather Fact</h3>
          <div className="w-16 h-1 bg-cyan-400/50 mx-auto mb-4 rounded-full"></div>
        </div>
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-cyan-400/10 to-blue-400/10 text-white/80 text-center shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-lg italic mb-2">"Did you know?"</p>
          <p className="text-sm md:text-base">{randomFact}</p>
        </motion.div>
        <div className="mt-auto pt-4 text-center text-white/40 text-xs">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CurrentUpdate;