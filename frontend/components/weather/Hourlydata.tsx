'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WeatherDataHour } from '@/types/weather';




const HourlyWeatherData: React.FC<{HourlyWeatherData:WeatherDataHour[]}> = ({HourlyWeatherData}) => {
  console.log('hourly data is ',HourlyWeatherData)
    const weatherData = HourlyWeatherData;
    

  return (
   
    <div className="p-2 pt-4 border-t rounded-lg shadow-md max-w-5xl mx-auto">
    <h2 className="text-xl font-semibold mb-4 ">4-Day Hourly Forecast</h2>
    {/* {error && <p className="text-red-500">{error}</p>} */}
    <div className="overflow-x-auto space-y-4 scrollbar-hide ">
      <div className="flex flex-row space-x-4">
        {weatherData && weatherData.map((data, index) => (
          <div
            key={index}
            className="min-w-[180px] p-4 bg rounded-lg shadow text-center"
          >
            {/* Date and Time */}
            <p className="">
              {new Date(data.dt_txt).toLocaleDateString([], {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </p>
            <p className="">
              {new Date(data.dt_txt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            {/* Weather Icon */}
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
              alt={data.weather[0].description}
              className="mx-auto my-2 w-12 h-12"
            />

            {/* Temperature */}
            <p className="text-lg font-bold">{Math.round(data.main.temp)}°C</p>

            {/* Description */}
            <p className="text-sm ">{data.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  );
};

export default HourlyWeatherData;