
'use client'
import { WeatherData } from '@/types/weather';
import { Thermometer } from 'lucide-react';
import React from 'react';


const WeatherComponent: React.FC<{ weatherData: WeatherData }> = ({ weatherData }) => {
  weatherData;

  console.log("weatherdata from daily page",weatherData);
 
  const getCurrentDate = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(undefined, options as any);
  };

  // Function to convert UNIX timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <>
    <div className=" flex items-center justify-between p-2">
    {/* Day and Date */}
    

    <div className="flex justify-center flex-col items-center">
    <h2 className="text-xl mb-2">{getCurrentDate()}</h2>

     
    {/* Temperature */}
    <div className="text-2xl mt-2 flex items-center space-x-2"> <Thermometer className="h-6 w-6 " /> <span>{weatherData?.main?.temp}°C</span></div>
    </div>
    <div className="flex items-center flex-col">
    {/* Weather Icon, Main, and Description */}
    <img
        src={`http://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
        alt="Weather Icon"
        />
      <div className="ml-2">
        <p className="text-lg">{weatherData?.weather[0].main}</p>
        <p className="text-sm">{weatherData?.weather[0].description}</p>
      </div>

    </div>

    {/* Sunrise and Sunset */}
    <div className="flex justify-between flex-col gap-5 mt-4">
      <div>
        <p className="text-sm">🌅 Sunrise</p>
        <p>{formatTime(weatherData?.sys.sunrise)}</p>
      </div>
      <div>
        <p className="text-sm">🌇 Sunset</p>
        <p>{formatTime(weatherData?.sys.sunset)}</p>
      </div>
    </div>
  </div>

  <div className="overflow-x-auto flex-wrap items-center justify-center mx-auto space-y-2 flex py-4 space-x-2">
      {/* Humidity */}
      <div className="text-center p-4 border rounded-md">
        <p>💧 Humidity</p>
        <p>{weatherData?.main.humidity}%</p>
      </div>

      {/* Pressure */}
      <div className="text-center p-4 border rounded-md">
        <p>🌡️ Pressure</p>
        <p>{weatherData?.main.pressure} hPa</p>
      </div>

      {/* Wind Speed */}
      <div className="text-center p-4 border rounded-md">
        <p>🌬️ Wind</p>
        <p>{weatherData?.wind.speed} m/s</p>
      </div>

      {/* Visibility */}
      <div className="text-center p-4 border rounded-md">
        <p>👁️ Visibility</p>
        <p>{weatherData?.visibility / 1000} km</p>
      </div>

      {/* Rain */}
      {weatherData?.rain && (
        <div className="text-center p-4 border rounded-md">
          <p>🌧️ Rain</p>
          <p>{weatherData?.rain['1h']} mm</p>
        </div>
      )}

      {/* Clouds */}
      <div className="text-center p-4 border rounded-md">
        <p>☁️ Clouds</p>
        <p>{weatherData?.clouds.all}%</p>
      </div>
    </div>

     
        </>
  );
};

export default WeatherComponent;
