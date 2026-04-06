import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Все', 'Палатки', 'Рюкзаки', 'Спальники', 'Обувь', 'Палки', 'Фонари'];

export default function App() {
  const [gear, setGear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
      try {
        window.Telegram.WebApp.setHeaderColor('#f7f9fc');
        window.Telegram.WebApp.setBackgroundColor('#f7f9fc');
      } catch (e) {
        console.log("Could not set header color", e);
      }
    }
  }, []);

  useEffect(() => {
    fetchGear();
  }, [selectedCategory, searchQuery]);

  const fetchGear = async () => {
    setIsLoading(true);
    try {
      const url = new URL('http://localhost:8000/api/gear');
      if (selectedCategory && selectedCategory !== 'Все') {
        url.searchParams.append('category', selectedCategory);
      }
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }
      const response = await fetch(url);
      const data = await response.json();
      setGear(data);
    } catch (error) {
      console.error("Error fetching gear:", error);
      // Fallback data if backend is offline
      setGear([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (id) => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert('Переход на страницу товара #' + id);
    } else {
      alert('Переход на страницу товара #' + id);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,101,123,0.06)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-700" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
            <span className="text-lg font-bold tracking-widest uppercase text-sky-900 font-headline">Alpinist</span>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-sky-50/50 transition-all duration-300">
            <span className="material-symbols-outlined text-sky-700">shopping_bag</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Hero Search Section */}
        <section className="mt-6">
          <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-tight">
            Горное снаряжение <br />
            для ваших <span className="text-gradient">побед</span>
          </h1>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">search</span>
            </div>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-inverse-primary/20 transition-all duration-300 font-medium placeholder:text-slate-400"
              placeholder="Поиск снаряжения..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Categories Horizontal Scroll */}
        <section className="mt-8 -mx-4">
          <div className="flex overflow-x-auto px-4 gap-3 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-none px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-[0_8px_16px_rgba(0,101,123,0.2)]'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/10 hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Gear Grid */}
        <section className="mt-10 grid grid-cols-2 gap-4">
          {isLoading ? (
            // Skeleton Loading State
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-transparent p-4 animate-pulse">
                <div className="w-full h-32 bg-surface-variant rounded-2xl mb-4"></div>
                <div className="h-4 bg-surface-variant rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-variant rounded w-1/2"></div>
              </div>
            ))
          ) : gear.length === 0 ? (
            <div className="col-span-2 text-center text-on-surface-variant py-10">
              Ничего не найдено по вашему запросу.
            </div>
          ) : (
            gear.map((item) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item.id)}
                className="group flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-inverse-primary/10 cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.name}
                    src={item.image_url}
                  />
                  <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-[12px] font-bold text-sky-900">{item.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-headline font-bold text-on-surface text-[15px] leading-tight mb-2">
                    {item.name}
                  </h3>
                  <div className="mt-auto">
                    <p className="text-primary font-bold text-[16px]">
                      {item.price_per_day} сом<span className="text-[11px] font-normal text-on-surface-variant">/день</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] rounded-3xl z-50 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="flex justify-around items-center h-20 px-4">
          <div onClick={() => setActiveTab('catalog')} className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 ${activeTab === 'catalog' ? "text-sky-700 dark:text-sky-300 relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-sky-400 after:rounded-full after:shadow-[0_0_8px_#47d6ff]" : "text-slate-400 dark:text-slate-500 hover:opacity-80"}`}>
            <span className="material-symbols-outlined mb-1" style={activeTab === 'catalog' ? { fontVariationSettings: "'FILL' 1" } : {}}>grid_view</span>
            <span className="font-manrope text-[11px] font-semibold tracking-wide uppercase">Catalog</span>
          </div>
          
          <div onClick={() => setActiveTab('bookings')} className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 ${activeTab === 'bookings' ? "text-sky-700 dark:text-sky-300 relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-sky-400 after:rounded-full after:shadow-[0_0_8px_#47d6ff]" : "text-slate-400 dark:text-slate-500 hover:opacity-80"}`}>
            <span className="material-symbols-outlined mb-1" style={activeTab === 'bookings' ? { fontVariationSettings: "'FILL' 1" } : {}}>calendar_today</span>
            <span className="font-manrope text-[11px] font-semibold tracking-wide uppercase">Bookings</span>
          </div>
          
          <div onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 ${activeTab === 'profile' ? "text-sky-700 dark:text-sky-300 relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-sky-400 after:rounded-full after:shadow-[0_0_8px_#47d6ff]" : "text-slate-400 dark:text-slate-500 hover:opacity-80"}`}>
            <span className="material-symbols-outlined mb-1" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
            <span className="font-manrope text-[11px] font-semibold tracking-wide uppercase">Profile</span>
          </div>
        </div>
      </nav>
    </>
  );
}
