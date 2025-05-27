import { useState } from 'react';
import { fetchWeather } from '../api/fetchWeather';

const Sidebar = ({ klass, onPlaceClicked, onCloseClicked }) => {
  const [tempUnit] = useState('°c');
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);

  function inputChange(e) {
    setQuery(e.target.value);
  }

  const search = async (e) => {
    if (e.key === 'Enter') {
      setSearching(true);
      try {
        const data = await fetchWeather(query);
        setSearchCompleted(true);
        setSearching(false);
        setWeather(data);
        setQuery('');
      } catch (error) {
        setSearchCompleted(true);
        setWeather(null);
        setSearching(false);
      }
    }
  };

  const selectPlace = (e) => {
    onCloseClicked(true);
    onPlaceClicked(e);
  };

  return (
    <>
      {/* Glass background layer */}
      <div 
        className={`glass min-w-[400px] absolute -left-[40px] -right-[40px] -top-[40px] -bottom-[40px] blur-[20px] ${klass}`}
        style={{
          backgroundSize: 'calc(100% + 80px)',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Glass content container */}
      <div 
        className={`glass-contents absolute left-0 right-0 top-0 bottom-0 z-[1] p-[4rem_2rem] overflow-auto bg-[rgba(0,0,0,0.4)] ${
          klass.includes('night') ? 'night bg-[rgba(0,0,0,0.75)]' : ''
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Close button */}
        <div 
          className="close absolute right-0 w-[50px] h-[60px] top-0 rounded-[4px] m-[30px] bg-[rgba(255,255,255,0.25)] transition-all duration-200 ease-in cursor-pointer text-white text-center pt-[10px] text-[30px] leading-none hover:bg-[rgba(255,255,255,0.75)] hover:text-[#333]"
          onClick={(e) => onCloseClicked(true)}
        >
          &times;
        </div>
        
        {/* Search box */}
        <div className="searchbox my-[20px]">
          <input
            type="text"
            className="w-full p-[1rem_0] bg-transparent border-none border-b-[2px] border-solid border-[rgba(255,255,255,0.15)] rounded-none text-white leading-none text-[1rem] placeholder-[rgba(255,255,255,0.4)] focus:outline-none"
            placeholder="Search place..."
            value={query}
            onChange={inputChange}
            onKeyPress={search}
            autoComplete="off"
          />
        </div>
        
        {/* Searching indicator */}
        {searching && (
          <div className="searching p-0 text-[rgba(255,255,255,0.5)] transition-all duration-200 ease-in rounded-[4px] leading-none cursor-default">
            Searching...
          </div>
        )}
        
        {/* Search results */}
        {searchCompleted && (
          <div className="locations p-0">
            {weather ? (
              <>
                <div className="results">
                  <div 
                    className="place big p-[1rem] text-[rgba(255,255,255,0.5)] cursor-pointer transition-all duration-200 ease-in rounded-[4px] leading-none bg-[rgba(255,255,255,0.05)] mb-[0.5rem] grid grid-cols-[1fr_140px] items-center hover:bg-[rgba(255,255,255,0.15)]"
                    onClick={(e) => selectPlace(weather)}
                  >
                    <div className="place-info">
                      <p className="text-[1rem] my-[6px_0] text-[#eee]">
                        {weather.name}, {weather.sys.country}
                      </p>
                      <span className="block text-[14px] text-[#bbb]">
                        Currently {weather.weather[0].description}
                      </span>
                    </div>
                    <div className="condition">
                      <div className="w flex items-center justify-end">
                        <div className="temp text-[24px] mr-2">
                          {Math.round(weather.main.temp)} {tempUnit}
                        </div>
                        <div className="icon text-[24px]">
                          <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              !searching && (
                <div className="noplace p-[0.5rem_0] text-[rgba(255,255,255,0.5)]">
                  No result found
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;