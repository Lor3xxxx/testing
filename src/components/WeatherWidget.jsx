import React, { useState, useEffect } from 'react';

const WEATHER_CODES = {
  0: { icon: 'wb_sunny', label: 'Ясно' },
  1: { icon: 'partly_cloudy_day', label: 'Малооблачно' },
  2: { icon: 'partly_cloudy_day', label: 'Переменная облачность' },
  3: { icon: 'cloud', label: 'Пасмурно' },
  45: { icon: 'foggy', label: 'Туман' },
  48: { icon: 'foggy', label: 'Туман с изморозью' },
  51: { icon: 'grain', label: 'Морось' },
  53: { icon: 'grain', label: 'Морось' },
  55: { icon: 'grain', label: 'Морось' },
  61: { icon: 'rainy', label: 'Дождь' },
  63: { icon: 'rainy', label: 'Дождь' },
  65: { icon: 'rainy', label: 'Дождь' },
  71: { icon: 'ac_unit', label: 'Снег' },
  73: { icon: 'ac_unit', label: 'Снег' },
  75: { icon: 'ac_unit', label: 'Снег' },
  95: { icon: 'thunderstorm', label: 'Гроза' },
  96: { icon: 'thunderstorm', label: 'Гроза с градом' },
  99: { icon: 'thunderstorm', label: 'Гроза с градом' },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { icon: 'cloud', label: 'Облачно' };
}

export default function WeatherWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=42.65&longitude=74.60&current=temperature_2m,wind_speed_10m,weather_code&timezone=Asia/Bishkek'
      );
      const json = await res.json();
      setData(json.current);
    } catch (e) {
      setError('Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-4 mb-6 animate-pulse">
        <div className="h-4 bg-surface-variant rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-surface-variant rounded w-1/3"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-4 mb-6 text-on-surface-variant text-sm font-medium">
        {error || 'Нет данных'} <button onClick={fetchWeather} className="text-primary underline ml-2">Обновить</button>
      </div>
    );
  }

  const info = getWeatherInfo(data.weather_code);

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 mb-6 border border-outline-variant/10">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <span className="font-bold text-on-surface text-sm">Ала-Арча</span>
        </div>
        <button onClick={fetchWeather} className="text-on-surface-variant hover:text-primary transition">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[28px] text-primary">{info.icon}</span>
          <span className="text-2xl font-extrabold text-on-surface">{Math.round(data.temperature_2m)}°</span>
        </div>
        <div className="flex flex-col text-xs text-on-surface-variant font-medium">
          <span>{info.label}</span>
          <span>Ветер {Math.round(data.wind_speed_10m)} м/с</span>
        </div>
      </div>
    </div>
  );
}
