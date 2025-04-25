import React from 'react'

interface DailyWeather {
  date: string
  avgTemp: number
  minTemp: number
  maxTemp: number
  weather: string
  avgWindSpeed: number
  avgCloudiness: number
  totalRain: number
}

interface DailyWeatherProps {
  dailyWeatherData: DailyWeather[]
}

const DailyWeatherComponent: React.FC<DailyWeatherProps> = ({ dailyWeatherData }) => {
  return (
    <div className="p-4 pt-6  rounded-lg shadow-md min-w-5xl  mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">6 Day Forecast</h2>
      <div className="space-y-6">
        {dailyWeatherData.map((day) => (
          <div
            key={day.date}
            className="rounded-lg shadow-lg p-6  w-full flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0 justify-between "
          >
            <div className="flex flex-col items-center md:items-start ">
              <span className="text-xl font-semibold ">{day.date}</span>
              <span className="text-sm ">{day.weather}</span>
            </div>
            <div className="text-center flex flex-col items-center md:items-start">
              <span className="text-3xl font-semibold text-blue-600">{day.avgTemp.toFixed(1)}°C</span>
              <div className="text-sm ">
                <span className="mr-2">Min: {day.minTemp}°C</span>
                <span>Max: {day.maxTemp}°C</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start text-sm ">
              <div className="mb-1">Wind Speed: {day.avgWindSpeed.toFixed(1)} m/s</div>
              <div className="mb-1">Cloudiness: {day.avgCloudiness}%</div>
              {day.totalRain > 0 && <div>Rain: {day.totalRain} mm</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DailyWeatherComponent
