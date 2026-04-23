import React, { useState, useEffect } from 'react';

const LOCATIONS = [
  { id: 'ala-archa', name: 'Ала-Арча', lat: 42.65, lon: 74.60 },
  { id: 'alplager', name: 'Альплагерь', lat: 42.62, lon: 74.58 },
  { id: 'ratsek', name: 'Хижина Рацека', lat: 42.50, lon: 74.53 },
  { id: 'komsomolets', name: 'Пик Комсомолец', lat: 42.53, lon: 74.56 },
  { id: 'chunkurchak', name: 'Чункурчак ущелье', lat: 42.62, lon: 74.12 },
  { id: 'alamudun', name: 'Ущелье Аламединское', lat: 42.71, lon: 74.52 },
];

const WEATHER_CODES = {
  0: { icon: 'wb_sunny', label: 'Ясно', color: 'text-amber-400' },
  1: { icon: 'partly_cloudy_day', label: 'Малооблачно', color: 'text-amber-300' },
  2: { icon: 'partly_cloudy_day', label: 'Переменная облачность', color: 'text-surface-variant' },
  3: { icon: 'cloud', label: 'Пасмурно', color: 'text-surface-variant' },
  45: { icon: 'foggy', label: 'Туман', color: 'text-surface-variant' },
  48: { icon: 'foggy', label: 'Туман с изморозью', color: 'text-surface-variant' },
  51: { icon: 'grain', label: 'Морось', color: 'text-primary' },
  53: { icon: 'grain', label: 'Морось', color: 'text-primary' },
  55: { icon: 'grain', label: 'Морось', color: 'text-primary' },
  61: { icon: 'rainy', label: 'Дождь', color: 'text-primary' },
  63: { icon: 'rainy', label: 'Дождь', color: 'text-primary' },
  65: { icon: 'rainy', label: 'Дождь', color: 'text-primary' },
  71: { icon: 'ac_unit', label: 'Снег', color: 'text-sky-300' },
  73: { icon: 'ac_unit', label: 'Снег', color: 'text-sky-300' },
  75: { icon: 'ac_unit', label: 'Снег', color: 'text-sky-300' },
  95: { icon: 'thunderstorm', label: 'Гроза', color: 'text-purple-400' },
  96: { icon: 'thunderstorm', label: 'Гроза с градом', color: 'text-purple-400' },
  99: { icon: 'thunderstorm', label: 'Гроза с градом', color: 'text-purple-400' },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { icon: 'cloud', label: 'Облачно', color: 'text-surface-variant' };
}

function formatDateLocal(d) {
  return d.toISOString().split('T')[0];
}

export default function WeatherPage() {
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [selectedDate, setSelectedDate] = useState(formatDateLocal(new Date()));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const todayStr = formatDateLocal(new Date());
  const maxDateStr = formatDateLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const isToday = selectedDate === todayStr;
      let url;
      if (isToday) {
        url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedLoc.lat}&longitude=${selectedLoc.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Bishkek&start_date=${selectedDate}&end_date=${selectedDate}`;
      } else {
        url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedLoc.lat}&longitude=${selectedLoc.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=Asia/Bishkek&start_date=${selectedDate}&end_date=${selectedDate}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [selectedLoc, selectedDate]);

  const isToday = selectedDate === todayStr;

  let temp, code, wind, minTemp, maxTemp;
  if (data) {
    if (isToday && data.current) {
      temp = Math.round(data.current.temperature_2m);
      code = data.current.weather_code;
      wind = Math.round(data.current.wind_speed_10m);
      if (data.daily) {
        minTemp = Math.round(data.daily.temperature_2m_min?.[0] ?? temp);
        maxTemp = Math.round(data.daily.temperature_2m_max?.[0] ?? temp);
      }
    } else if (data.daily) {
      temp = Math.round((data.daily.temperature_2m_max?.[0] + data.daily.temperature_2m_min?.[0]) / 2);
      code = data.daily.weather_code?.[0];
      wind = Math.round(data.daily.wind_speed_10m_max?.[0] ?? 0);
      minTemp = Math.round(data.daily.temperature_2m_min?.[0]);
      maxTemp = Math.round(data.daily.temperature_2m_max?.[0]);
    }
  }

  const info = getWeatherInfo(code);

  return (
    <div className="pt-2 px-1 animate-slide-up pb-28">
      <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-tight">
        Погода в <span className="text-gradient">горах</span>
      </h1>

      {/* Location Chips */}
      <section className="mb-6 -mx-4">
        <div className="flex overflow-x-auto px-4 gap-3 no-scrollbar">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLoc(loc)}
              className={`flex-none px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform active:scale-[0.94] ${
                selectedLoc.id === loc.id
                  ? 'bg-primary text-on-primary shadow-[0_8px_16px_rgba(59,130,246,0.3)]'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/10 hover:bg-surface-container-high shadow-sm'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </section>

      {/* Date Picker */}
      <section className="mb-6">
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Дата прогноза</label>
              <input
                type="date"
                min={todayStr}
                max={maxDateStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-on-surface font-bold text-[15px] outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Weather Card */}
      {loading ? (
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 mb-6 border border-outline-variant/10 animate-pulse">
          <div className="h-8 bg-surface-variant rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-20 bg-surface-variant rounded w-20 mx-auto mb-4"></div>
          <div className="h-6 bg-surface-variant rounded w-1/3 mx-auto"></div>
        </div>
      ) : !data ? (
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 mb-6 text-center text-on-surface-variant border border-outline-variant/10">
          <span className="material-symbols-outlined text-5xl mb-3 block">cloud_off</span>
          <p className="font-bold">Не удалось загрузить прогноз</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 mb-6 border border-outline-variant/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="font-headline font-bold text-lg text-on-surface-variant mb-1">{selectedLoc.name}</h2>
            <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-6">
              {isToday ? 'Сегодня' : new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </p>

            <div className="flex justify-center mb-4">
              <span className={`material-symbols-outlined text-[80px] ${info.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{info.icon}</span>
            </div>

            <div className="text-[56px] font-extrabold text-on-surface leading-none mb-2">
              {temp !== undefined ? `${temp}°` : '--'}
            </div>
            <div className="text-[15px] font-bold text-on-surface-variant mb-8">{info.label}</div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-container rounded-2xl p-4">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1 block">thermometer_gain</span>
                <div className="text-[13px] font-bold text-on-surface-variant">Макс</div>
                <div className="text-[18px] font-extrabold text-on-surface">{maxTemp !== undefined ? `${maxTemp}°` : '--'}</div>
              </div>
              <div className="bg-surface-container rounded-2xl p-4">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1 block">thermometer_loss</span>
                <div className="text-[13px] font-bold text-on-surface-variant">Мин</div>
                <div className="text-[18px] font-extrabold text-on-surface">{minTemp !== undefined ? `${minTemp}°` : '--'}</div>
              </div>
              <div className="bg-surface-container rounded-2xl p-4">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1 block">air</span>
                <div className="text-[13px] font-bold text-on-surface-variant">Ветер</div>
                <div className="text-[18px] font-extrabold text-on-surface">{wind !== undefined ? `${wind} м/с` : '--'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-on-surface-variant/50 text-center font-medium">
        Данные предоставлены Open-Meteo. Прогноз может отличаться от фактической погоды в горах.
      </p>
    </div>
  );
}
