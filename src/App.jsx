import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Все', 'Палатки', 'Рюкзаки', 'Спальники', 'Обувь', 'Палки', 'Фонари'];

const FALLBACK_GEAR = [
  {
      id: 1,
      name: "Треккинговые палки Carbon-X",
      category: "Палки",
      price_per_day: 500,
      rating: 4.9,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_EOHBkfxurxpUyVccPQuokZDg5rw6LWpiHTCuwL6vQ5GQy5rw1OGUJcr0o0A0RHVASZnLip05Jq177B8W3UCAW6ZKxW9ctyP61mxtZuupWvuduZ7BnArQFbq921H7rtWY-x9fitFeCqt2ckfv361rBeD888lbq7h0VBEGDAc873_CTH3JXFdEdWRiXwe-Xhxn9TBCNGXdqGIrp0VlWRylAKQ93BxFCiVZoCXMIKFDHEs6bjOQtuPvQYTtoGRAqg2qtRStBdJ4jQ",
      weight: "260 г (одна палка)",
      length: "100-130 см в разложенном виде, 62 см в сложенном."
  },
  {
      id: 2,
      name: "Палатка Summit 2-Person",
      category: "Палатки",
      price_per_day: 1200,
      rating: 5.0,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQYkd020CmaW0tAAPtNq_kCmUFXCtqYQCBwpXfAS3nLwn_fNC_dScv2wGu-Y-30TcBZ5yQtqUu-L-vpXGcpolaN7Ach5E8xMhZGvF92SuHBL-jHELiYGMrgKeY6fcdfM4QVrcA03OlfG0evVbAAoEQDq8uOu3ISu3QBIZDvkCqHWrjeqXYiva8VusFDaOeqYLCcgopk32sE8dY2AmAow-4KDDo4h5D9BXhSbrMHUHTd-rbl2h5r2lW8PxMQPI5zze9y0hWJ5mcqQ",
      weight: "1.85 кг",
      length: "Размеры: 215 x 135 x 110 см. В сложенном виде: 45 x 15 см."
  },
  {
      id: 3,
      name: "Рюкзак Alpinist 65L Pro",
      category: "Рюкзаки",
      price_per_day: 850,
      rating: 4.8,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApDTHrD44m1Vp4rEtoIiezcyXmHNjRDgKcT8wQXuzdPwVMp4K0JLNXLP9vkB_3HV2xi8qJ4A74gvcjRPs8EforJR-I_evwJaf45FQxWa6Nx6WdGsX1F411glzszUhT7rLfVMM_T4beZbm4OjYUQDwf8dmCkzF-Sr4DvOEVX6VcC_TSH3OZ2AX4QdD_RutIRO8bsrsnfOs1X-gtUydeyp2Mzb2jYo0fpOXIF7AupFI_Qz_oM-MEF26RfiIISWxNIlNKSQf4U9QzbA",
      weight: "2.1 кг",
      length: "Высота: 75 см, Ширина: 35 см, Глубина: 25 см."
  },
  {
      id: 4,
      name: "Ботинки Scarpa Phantom",
      category: "Обувь",
      price_per_day: 1500,
      rating: 4.7,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUMzczSdwI2bk96yWEqvqu-KS8NoBhMGig3JcXg52fM-3-GEKzGsvBWyQe7d5rAW6bdFS62XJIw_pnBiPdKEw0Ytq-euJy_HcqwyY0_O55WqUNs0xRREyW9IuZKR7fm3aKkXH9uL56N1V0LuTFIL0rJUmZuzF_Q2XdCsXpAnFnJtMIa2yIHwud7gQwCJgmcqXux__5WufrTnEipmFjjs3-2rrEOR4iwvs7M9shyiu6xIQJucswwZTmbLoLIpVHCIjBPlGSaGgqVw",
      weight: "1.2 кг (один ботинок, размер 42)",
      length: "Региональные размеры доступны: 40 — 46."
  },
  {
      id: 5,
      name: "Фонарь Petzl Swift RL",
      category: "Фонари",
      price_per_day: 300,
      rating: 4.9,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBH5iJ0asxzYZANtvFKyDRz4mtdpURE8phxpWYKNP3QCmJz0w-0TAhxZLH7x9EB-2-t-LxsbmM10w_DFG5dWJJjFyUvC6eJouWuuMIedfQRPKyqJZShun5_RzkHfiDquuFgOPc7MQ5ClNOH6P3FcO2NArXnQbaCzmLQ1wLvi6xvhdiUbc7v916oWTLSn68h7DHH0mGR8pn6hmp9qbnNqyreNkh8peUXN-1DC4gtgktnfQUk1oKr4l66iaCBLvFA3RsaJEtpsaa3Ag",
      weight: "100 г",
      length: "Универсальный размер ремешка. Габариты корпуса: 6 x 4 x 3.5 см."
  },
  {
      id: 6,
      name: "Спальник Down -20C",
      category: "Спальники",
      price_per_day: 950,
      rating: 5.0,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYspGKqudwjFD6286AW6dVZ-YX2ptZkQ_Up7E0IHRX3DOmPE5t4QZW_SoQ6UAqCvW83rjSs5ir3zLVmeiaKddvzyx3IFgtWbLHRBLjlgpDvBjZ5eWsYYojfiMGa7HH6U4O_RcS_7a1lJZCxMvWMoZpzt6tsycYUnzdt_v0wfAm8Roi1hwE7XA4pM7sojYGaGPMBmr74XH8cjtR3OB3re7G25yKt1shMm28AeysC4dw1erwB0c-4QqJlAIiELWpXnGz4SB2AdmazQ",
      weight: "1.45 кг",
      length: "Длина спальника: 210 см. Идеально подходит на рост до 195 см."
  }
];

function ProductPage({ product, onBack, onBook }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'weight' | 'length'
  
  const description = product.description || {
    1: "Легкие карбоновые палки для комфортного треккинга со сменными насадками и эргономичными ручками.",
    2: "Двухместная ультралегкая палатка для серьезных восхождений. Ветроустойчивая конструкция, простая установка.",
    3: "Профессиональный экспедиционный рюкзак объемом 65 литров с анатомической спинкой и водонепроницаемыми молниями.",
    4: "Теплые альпинистские ботинки для экстремальных условий и высотных восхождений. Совместимы с кошками.",
    5: "Мощный налобный фонарь с автоматической регулировкой яркости. Максимум 900 люмен. Отлично подходит для ночных переходов.",
    6: "Пуховый спальный мешок для экстремальных температур до -20°C. Компактный, легкий и очень теплый."
  }[product.id] || "Отличное качественное снаряжение для ваших горных приключений.";

  let days = 0;
  if (startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e - s;
    if (diffTime > 0) {
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header with image */}
      <div className="relative h-72 rounded-b-[2rem] overflow-hidden shadow-sm">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-white/30 transition-all text-white backdrop-blur-xl border border-white/20">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
        <div className="absolute bottom-4 right-4 glass-card px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/20 backdrop-blur-xl">
          <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="font-bold text-sky-900 text-sm">{product.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="px-5 mt-6 max-w-lg mx-auto">
        <div className="flex justify-between items-start mb-3">
           <h1 className="text-2xl font-headline font-extrabold text-on-surface leading-tight w-2/3">{product.name}</h1>
           <div className="text-right">
             <p className="text-primary font-extrabold text-2xl">{product.price_per_day}<span className="text-lg"> сом</span></p>
             <p className="text-[11px] text-on-surface-variant font-medium">в день</p>
           </div>
        </div>

        <p className="text-on-surface-variant mb-6 text-[15px] leading-relaxed font-body">
          {description}
        </p>

        {/* Buttons: Weight & Length */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveModal('weight')} className="flex-1 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-surface-container transition-all shadow-sm active:scale-95">
             <span className="material-symbols-outlined text-sky-700">scale</span>
             <span className="font-headline font-bold text-sm text-on-surface">Вес</span>
          </button>
          <button onClick={() => setActiveModal('length')} className="flex-1 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-surface-container transition-all shadow-sm active:scale-95">
             <span className="material-symbols-outlined text-sky-700">straighten</span>
             <span className="font-headline font-bold text-sm text-on-surface">Длина</span>
          </button>
        </div>

        {/* Booking settings */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-5 shadow-sm border border-outline-variant/10 mb-6">
          <h2 className="font-headline font-bold text-[17px] mb-4 text-on-surface">Параметры аренды</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-on-surface-variant mb-1.5 ml-2 uppercase tracking-wide">Начало</label>
              <input 
                type="date" 
                min={todayStr}
                value={startDate} 
                onChange={e => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) {
                    setEndDate('');
                  }
                }}
                className="w-full bg-surface-container-low py-3.5 px-4 rounded-xl border-none focus:ring-2 focus:ring-inverse-primary/30 text-on-surface text-sm font-semibold transition-all"
              />
            </div>
            <div>
               <label className="block text-[12px] font-bold text-on-surface-variant mb-1.5 ml-2 uppercase tracking-wide">Окончание</label>
              <input 
                type="date" 
                min={startDate ? (() => {
                  let d = new Date(startDate);
                  d.setDate(d.getDate() + 1);
                  return d.toISOString().split('T')[0];
                })() : todayStr}
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-surface-container-low py-3.5 px-4 rounded-xl border-none focus:ring-2 focus:ring-inverse-primary/30 text-on-surface text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <div className="mt-5 bg-primary-container/10 rounded-2xl p-4 flex justify-between items-center transition-all border border-primary/10">
             <div>
               <p className="text-sm font-bold text-on-surface">Итого за <span className="text-primary">{days} дней</span>:</p>
             </div>
             <div>
               <p className="text-xl font-extrabold text-primary">{days * product.price_per_day} <span className="text-sm">сом</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Book Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-lg pt-4 pb-6 border-t border-surface-container z-50">
         <div className="max-w-lg mx-auto px-5">
            <button 
              onClick={() => onBook({...product, startDate, endDate, days, total: days * product.price_per_day})}
              disabled={days <= 0}
              className={`w-full py-4 rounded-full font-bold text-[16px] transition-all duration-300 transform active:scale-[0.98] ${days > 0 ? "bg-primary text-on-primary hover:bg-sky-800 shadow-[0_8px_20px_rgba(0,101,123,0.25)]" : "bg-surface-variant/70 text-on-surface-variant/50 shadow-none cursor-not-allowed"}`}
            >
              Забронировать
            </button>
         </div>
      </div>

      {/* Glassmorphic Modal overlay (Водяное окно) */}
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" onClick={() => setActiveModal(null)}>
          {/* Glass background */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"></div>
          {/* Glass card modal */}
          <div 
            className="relative w-full max-w-sm glass-card border flex flex-col border-white/20 rounded-[2rem] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-extrabold text-xl text-sky-950 flex items-center gap-2">
                 {activeModal === 'weight' ? (
                   <><span className="material-symbols-outlined text-primary">scale</span>Вес</>
                 ) : (
                   <><span className="material-symbols-outlined text-primary">straighten</span>Длина</>
                 )}
              </h3>
              <button onClick={() => setActiveModal(null)} className="w-9 h-9 flex items-center justify-center glass-card hover:bg-white/70 rounded-full transition-all text-sky-950">
                 <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body text-[16px] text-sky-950/80 font-bold mb-8 leading-relaxed">
               {activeModal === 'weight' ? (product.weight || "Параметр устанавливается...") : (product.length || "Параметр устанавливается...")}
            </p>
            <button onClick={() => setActiveModal(null)} className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-full hover:bg-sky-800 transition-all shadow-md mt-auto">
               Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [gear, setGear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedProductId, setSelectedProductId] = useState(null);

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
      let filtered = FALLBACK_GEAR;
      if (selectedCategory && selectedCategory !== 'Все') {
        filtered = filtered.filter(g => g.category === selectedCategory);
      }
      if (searchQuery) {
        filtered = filtered.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      setGear(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (id) => {
    setSelectedProductId(id);
  };

  const handleBook = (bookingData) => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert('Успех! Вы забронировали товар на сумму ' + bookingData.total + ' сом.');
    } else {
      alert('Успех! Вы забронировали товар на сумму ' + bookingData.total + ' сом.');
    }
    // Здесь мог бы быть запрос на сервер для сохранения бронирования
    setSelectedProductId(null);
    setActiveTab('bookings');
  };

  if (selectedProductId) {
    const product = gear.find(g => g.id === selectedProductId) || FALLBACK_GEAR.find(g => g.id === selectedProductId);
    if (product) {
      return <ProductPage product={product} onBack={() => setSelectedProductId(null)} onBook={handleBook} />;
    }
  }

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
