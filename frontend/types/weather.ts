export interface WeatherData {
    coord?: {
      lon: number;
      lat: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    base?: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level?: number;
      grnd_level?: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    rain?: {
      '1h': number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      type?: number;
      id?: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }
  


  export const SampleData:WeatherData = {
    coord: { lon: 7.367, lat: 45.133 },
    weather: [{ id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' }],
    main: {
      temp: 284.2,
      feels_like: 282.93,
      temp_min: 283.06,
      temp_max: 286.82,
      pressure: 1021,
      humidity: 60,
      sea_level: 1021,
      grnd_level: 910,
    },
    visibility: 10000,
    wind: { speed: 4.09, deg: 121, gust: 3.47 },
    rain: { '1h': 2.73 },
    clouds: { all: 83 },
    dt: 1726660758,
    sys: { country: 'IT', sunrise: 1726636384, sunset: 1726680975 },
    timezone: 7200,
    id: 3165523,
    name: 'Province of Turin',
    cod: 200,
  };


// WeatherData interface represents the individual weather data for each timestamp
export interface WeatherDataHour {
  dt: number; // UNIX timestamp
  dt_txt: string; // Date and time in the format "YYYY-MM-DD HH:mm:ss"
  main: {
    temp: number; // Temperature in Celsius
    feels_like: number; // "Feels like" temperature
    temp_min: number; // Minimum temperature
    temp_max: number; // Maximum temperature
    pressure: number; // Atmospheric pressure in hPa
    sea_level: number; // Atmospheric pressure at sea level
    grnd_level: number; // Atmospheric pressure at ground level
    humidity: number; // Humidity percentage
    temp_kf: number; // Temperature coefficient (unused in most cases)
  };
  weather: {
    id: number; // Weather condition id
    main: string; // Weather condition (e.g., "Rain")
    description: string; // Weather condition description (e.g., "moderate rain")
    icon: string; // Weather icon code
  }[];
  clouds: {
    all: number; // Cloudiness percentage
  };
  wind: {
    speed: number; // Wind speed in meters/second
    deg: number; // Wind direction in degrees
    gust?: number; // Wind gust speed (optional)
  };
  visibility: number; // Visibility in meters
  pop: number; // Probability of precipitation (0 to 1)
  rain?: {
    "3h": number; // Rain volume for the last 3 hours (optional)
  };
  sys: {
    pod: string; // Part of the day ("d" for day, "n" for night)
  };
}


export interface DailyWeatherData {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  speed: number;
  deg: number;
  gust: number;
  clouds: number;
  pop: number;
  rain: number;
}