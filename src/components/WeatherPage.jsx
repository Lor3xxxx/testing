import React, { useState, useEffect } from 'react';

const LOCATIONS = [
  { id: 'ala-archa', name: 'Ала-Арча', lat: 42.65, lon: 74.60 },
  { id: 'ratsek', name: 'Рацека', lat: 42.50, lon: 74.53 },
  { id: 'komsomolets', name: 'Комсомолец', lat: 42.53, lon: 74.56 },
  { id: 'chunkurchak', name: 'Чункурчак', lat: 42.62, lon: 74.12 },
  { id: 'alamudun', name: 'Аламединское', lat: 42.71, lon: 74.52 },
  { id: 'adygène', name: 'Адыгене', lat: 42.38, lon: 74.55 },
  { id: 'adygène-peak', name: 'Пик Адыгене', lat: 42.40, lon: 74.58 },
  { id: 'uchitel-peak', name: 'Пик Учитель', lat: 42.42, lon: 74.60 },
];

const WEATHER_CODES = {
  0: { icon: 'wb_sunny', label: 'Ясно' },
  1: { icon: 'partly_cloudy_day', label: 'Малооблачно' },
  2: { icon: 'partly_cloudy_day', label: 'Облачно' },
  3: { icon: 'cloud', label: 'Пасмурно' },
  45: { icon: 'foggy', label: 'Туман' },
  48: { icon: 'foggy', label: 'Изморозь' },
  51: { icon: 'grain', label: 'Морось' },
  53: { icon: 'grain', label: 'Морось' },
  55: { icon: 'grain', label: 'Морось' },
  56: { icon: 'grain', label: 'Ледяная морось' },
  57: { icon: 'grain', label: 'Ледяная морось' },
  61: { icon: 'rainy', label: 'Дождь' },
  63: { icon: 'rainy', label: 'Дождь' },
  65: { icon: 'rainy', label: 'Ливень' },
  66: { icon: 'rainy', label: 'Ледяной дождь' },
  67: { icon: 'rainy', label: 'Ледяной дождь' },
  71: { icon: 'ac_unit', label: 'Снег' },
  73: { icon: 'ac_unit', label: 'Снег' },
  75: { icon: 'ac_unit', label: 'Снегопад' },
  77: { icon: 'ac_unit', label: 'Снежные зёрна' },
  80: { icon: 'rainy', label: 'Ливни' },
  81: { icon: 'rainy', label: 'Сильные ливни' },
  82: { icon: 'rainy', label: 'Шквал' },
  85: { icon: 'ac_unit', label: 'Снегопады' },
  86: { icon: 'ac_unit', label: 'Сильные снегопады' },
  95: { icon: 'thunderstorm', label: 'Гроза' },
  96: { icon: 'thunderstorm', label: 'Гроза с градом' },
  99: { icon: 'thunderstorm', label: 'Гроза с градом' },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { icon: 'cloud', label: 'Облачно' };
}

function formatDateLocal(d) {
  return d.toISOString().split('T')[0];
}

function pad(n) {
  return n < 10 ? '0' + n : n;
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
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedLoc.lat}&longitude=${selectedLoc.lon}&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&start_date=${selectedDate}&end_date=${selectedDate}&timezone=Asia/Bishkek`;
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

  // Build hourly list (06:00 - 22:00)
  let hourly = [];
  if (data?.hourly) {
    const h = data.hourly;
    for (let i = 0; i < h.time.length; i++) {
      const t = new Date(h.time[i]);
      const hour = t.getHours();
      if (hour >= 5 && hour <= 23) {
        hourly.push({
          time: `${pad(hour)}:00`,
          temp: Math.round(h.temperature_2m[i]),
          code: h.weather_code[i],
          rainProb: h.precipitation_probability[i],
          rainMm: h.precipitation[i],
          wind: Math.round(h.wind_speed_10m[i]),
        });
      }
    }
  }

  // Current / daily summary
  let currentTemp, currentCode, currentWind, minTemp, maxTemp, sunrise, sunset;
  if (data?.daily) {
    const d = data.daily;
    maxTemp = Math.round(d.temperature_2m_max?.[0]);
    minTemp = Math.round(d.temperature_2m_min?.[0]);
    currentCode = d.weather_code?.[0];
    sunrise = d.sunrise?.[0] ? new Date(d.sunrise[0]).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : null;
    sunset = d.sunset?.[0] ? new Date(d.sunset[0]).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : null;
  }
  if (data?.hourly?.temperature_2m) {
    const nowHour = new Date().getHours();
    const idx = data.hourly.time.findIndex(t => new Date(t).getHours() === nowHour);
    if (idx >= 0) {
      currentTemp = Math.round(data.hourly.temperature_2m[idx]);
      currentWind = Math.round(data.hourly.wind_speed_10m[idx]);
      if (isToday) currentCode = data.hourly.weather_code[idx];
    }
  }

  const info = getWeatherInfo(currentCode);

  // Precipitation windows
  const rainWindows = hourly.filter(h => h.rainProb > 30 || h.rainMm > 0.1);

  return (
    <div className="pt-2 px-1 animate-slide-up pb-28">
      {/* Compact header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold font-headline tracking-tight text-on-surface leading-tight">
          Погода
        </h1>
        <input
          type="date"
          min={todayStr}
          max={maxDateStr}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-transparent text-on-surface font-bold text-sm outline-none border-b border-outline-variant pb-0.5 w-[110px]"
        />
      </div>

      {/* Location chips */}
      <section className="mb-4 -mx-4">
        <div className="flex overflow-x-auto px-4 gap-2 no-scrollbar">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLoc(loc)}
              className={`flex-none px-3 py-2 rounded-xl font-semibold text-xs transition-all transform active:scale-95 ${
                selectedLoc.id === loc.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/10'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main compact card */}
      {loading ? (
        <div className="bg-surface-container-low rounded-2xl p-5 mb-4 border border-outline-variant/10 animate-pulse">
          <div className="h-6 bg-surface-variant rounded w-1/3 mb-2"></div>
          <div className="h-12 bg-surface-variant rounded w-20"></div>
        </div>
      ) : !data ? (
        <div className="bg-surface-container-low rounded-2xl p-5 mb-4 text-center text-on-surface-variant border border-outline-variant/10 text-sm">
          Не удалось загрузить
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-2xl p-5 mb-4 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-on-surface text-sm">{selectedLoc.name}</h2>
              <p className="text-[10px] text-on-surface-variant font-medium">
                {isToday ? 'Сегодня' : new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div className="text-right">
              {sunrise && sunset && (
                <div className="text-[10px] text-on-surface-variant font-medium">
                  <span className="inline-flex items-center gap-0.5 mr-2"><span className="material-symbols-outlined text-[12px]">wb_twilight</span>{sunrise}</span>
                  <span className="inline-flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">dark_mode</span>{sunset}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{info.icon}</span>
              <div>
                <div className="text-[42px] font-extrabold text-on-surface leading-none">{currentTemp !== undefined ? `${currentTemp}°` : `${maxTemp}°`}</div>
                <div className="text-xs text-on-surface-variant font-medium mt-0.5">{info.label}</div>
              </div>
            </div>
            <div className="flex-1"></div>
            <div className="flex flex-col gap-1 text-[11px] font-bold text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary">air</span>{currentWind ?? '--'} м/с</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary">thermometer_gain</span>{maxTemp}°</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary">thermometer_loss</span>{minTemp}°</span>
            </div>
          </div>

          {/* Precipitation warning */}
          {rainWindows.length > 0 && (
            <div className="bg-primary-container/30 rounded-xl p-3 mb-3 border border-primary/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1.5">
                <span className="material-symbols-outlined text-[16px]">water_drop</span>
                Ожидаются осадки
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rainWindows.map((w, i) => (
                  <span key={i} className="text-[10px] font-bold text-on-surface bg-surface-container-lowest px-2 py-1 rounded-lg border border-outline-variant/10">
                    {w.time} — {w.rainProb}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hourly scroll */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar -mx-1 px-1">
            {hourly.map((h, i) => {
              const hInfo = getWeatherInfo(h.code);
              const isNow = isToday && h.time === `${pad(new Date().getHours())}:00`;
              return (
                <div key={i} className={`flex-none w-[52px] rounded-xl py-2 px-1 text-center border ${isNow ? 'bg-primary-container/20 border-primary/20' : 'bg-surface-container-lowest border-outline-variant/10'}`}>
                  <div className={`text-[10px] font-bold mb-1 ${isNow ? 'text-primary' : 'text-on-surface-variant'}`}>{h.time}</div>
                  <span className="material-symbols-outlined text-[20px] text-primary block mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>{hInfo.icon}</span>
                  <div className="text-xs font-extrabold text-on-surface">{h.temp}°</div>
                  {h.rainProb > 0 && (
                    <div className="text-[9px] font-bold text-primary mt-0.5">{h.rainProb}%</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[10px] text-on-surface-variant/50 text-center font-medium">
        Данные Open-Meteo. Прогноз приблизительный.
      </p>
    </div>
  );
}
