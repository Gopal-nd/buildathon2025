export interface WeatherDataHour {
    dt_txt: string
    main: {
      temp: number
      temp_min: number
      temp_max: number
    }
    weather: {
      main: string
    }[]
    wind: {
      speed: number
    }
    clouds: {
      all: number
    }
    rain?: {
      "3h": number
    }
  }
  
  export const aggregateDailyWeather = (hourlyData: WeatherDataHour[]): any  => {
    const groupedData = hourlyData.reduce((acc: Record<string, WeatherDataHour[]>, current: WeatherDataHour) => {
      const date = current.dt_txt.split(' ')[0] // Extract date from the dt_txt (YYYY-MM-DD)
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(current)
      return acc
    }, {})
  
    // Aggregate data for each day
    return Object.keys(groupedData).map((date) => {
      const dayData = groupedData[date]
  
      // Calculate the average temperature
      const avgTemp = dayData.reduce((sum, current) => sum + current.main.temp, 0) / dayData.length
      const minTemp = Math.min(...dayData.map((item) => item.main.temp_min))
      const maxTemp = Math.max(...dayData.map((item) => item.main.temp_max))
  
      // Determine the main weather condition for the day
      const weatherCondition = dayData
        .map((item) => item.weather[0].main)
        .reduce((acc, weather) => {
          acc[weather] = (acc[weather] || 0) + 1
          return acc
        }, {} as Record<string, number>)
  
      const mainWeather = Object.keys(weatherCondition).reduce((a, b) =>
        weatherCondition[a] > weatherCondition[b] ? a : b
      )
  
      // Calculate the average wind speed and cloudiness
      const avgWindSpeed = dayData.reduce((sum, current) => sum + current.wind.speed, 0) / dayData.length
      const avgCloudiness = dayData.reduce((sum, current) => sum + current.clouds.all, 0) / dayData.length
  
      // Calculate total rainfall
      const totalRain = dayData.reduce((sum, current) => sum + (current.rain?.['3h'] || 0), 0)
  
      return {
        date,
        avgTemp,
        minTemp,
        maxTemp,
        weather: mainWeather,
        avgWindSpeed,
        avgCloudiness,
        totalRain,
      }
    })
  }
  