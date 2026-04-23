import React, { useState, useEffect } from 'react';
import { API_BASE } from './api';
import { useTheme } from './hooks/useTheme';
import WeatherWidget from './components/WeatherWidget';

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

function CheckoutPage({ checkoutData, onBack, onConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = ['MBank', 'O!Bank', 'Наличные при получении'];

  const handleSubmit = async () => {
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch(e) {}
    setIsSubmitting(true);
    try {
      const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
      
      const payload = {
        user_id: user_id,
        item_id: checkoutData.id,
        start_date: checkoutData.startDate,
        end_date: checkoutData.endDate,
        total_price: checkoutData.total,
        payment_method: paymentMethod
      };

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
         throw new Error("Failed to create order");
      }
      
      const data = await response.json();
      onConfirm(data);
    } catch (error) {
      console.error(error);
      onConfirm({
        user_id: "test_user_123",
        item_id: checkoutData.id,
        start_date: checkoutData.startDate,
        end_date: checkoutData.endDate,
        total_price: checkoutData.total,
        payment_method: paymentMethod,
        status: 'active',
        id: Math.random().toString(36).substring(7)
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface pb-28 animate-slide-up">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(59,130,246,0.06)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-lg mx-auto">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low transition-all duration-300 transform active:scale-90 text-on-surface">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-headline font-extrabold text-on-surface text-lg">Оформление</span>
          <div className="w-10 h-10"></div>
        </div>
      </header>

      <div className="pt-24 px-5 max-w-lg mx-auto">
         <h2 className="font-headline font-extrabold text-2xl text-on-surface mb-6">Ваш заказ</h2>
         
         <div className="bg-surface-container-lowest rounded-[2rem] p-5 shadow-sm border border-outline-variant/10 mb-8 flex flex-col gap-4">
            <div className="flex gap-4">
               <img src={checkoutData.image_url} alt={checkoutData.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
               <div>
                  <h3 className="font-headline font-bold text-[15px] text-on-surface mb-1 leading-tight">{checkoutData.name}</h3>
                  <p className="text-on-surface-variant text-[13px]">{checkoutData.days} дней аренда</p>
               </div>
            </div>
            
            <div className="flex justify-between items-center py-4 border-y border-outline-variant/10">
               <div className="text-[13px] font-semibold text-on-surface-variant">
                  {new Date(checkoutData.startDate).toLocaleDateString()} — {new Date(checkoutData.endDate).toLocaleDateString()}
               </div>
               <div className="text-[16px] font-extrabold text-primary">
                  {checkoutData.total} сом
               </div>
            </div>
            
            <div className="flex justify-between items-center">
               <span className="font-bold text-on-surface">Итого к оплате:</span>
               <span className="text-2xl font-extrabold text-primary">{checkoutData.total} <span className="text-sm">сом</span></span>
            </div>
         </div>

         <h2 className="font-headline font-extrabold text-xl text-on-surface mb-4">Способ оплаты</h2>
         <div className="flex flex-col gap-3">
            {methods.map(method => (
               <label key={method} className={`relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer transform active:scale-[0.98] duration-300 ${paymentMethod === method ? 'border-primary bg-primary-container/10' : 'border-outline-variant/20 bg-surface-container-lowest'}`}>
                  <input type="radio" className="sr-only" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <div className={`w-5 h-5 rounded-full border-[2.5px] flex items-center justify-center mr-4 transition-colors ${paymentMethod === method ? 'border-primary' : 'border-outline-variant'}`}>
                     {paymentMethod === method && <div className="w-2.5 h-2.5 bg-primary rounded-full animate-zoom-in" />}
                  </div>
                  <span className="font-bold text-[15px] text-on-surface flex-1">{method}</span>
                  {method.includes('Bank') && <span className="material-symbols-outlined text-primary">account_balance</span>}
                  {method.includes('Наличные') && <span className="material-symbols-outlined text-primary">payments</span>}
               </label>
            ))}
         </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-lg pt-4 pb-6 border-t border-surface-container z-40">
         <div className="max-w-lg mx-auto px-5">
            <button 
              onClick={handleSubmit}
              disabled={!paymentMethod || isSubmitting}
              className={`w-full py-4 rounded-full font-bold text-[16px] transition-all duration-300 transform active:scale-[0.96] flex justify-center items-center gap-2 ${paymentMethod && !isSubmitting ? "bg-primary text-on-primary shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:bg-primary/80" : "bg-surface-variant/70 text-on-surface-variant/50 cursor-not-allowed shadow-none"}`}
            >
              {isSubmitting ? (
                <><span className="material-symbols-outlined animate-spin text-[20px]" style={{ animation: "spin 1s linear infinite" }}>refresh</span> Обработка...</>
              ) : (
                "Подтвердить заказ"
              )}
            </button>
         </div>
      </div>
    </div>
  );
}


function ReviewFormModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
      await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: order.item_id,
          user_id: user_id,
          rating: rating,
          text: text
        })
      });
      onSubmit();
    } catch (e) {
      console.error(e);
      alert('Ошибка при отправке отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose}></div>
       <div className="bg-surface-container-lowest w-full max-w-sm rounded-[2rem] p-6 relative z-10 animate-slide-up shadow-2xl">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[20px] font-extrabold text-on-surface">Оцените аренду</h3>
             <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container flex justify-center items-center text-on-surface-variant hover:bg-surface-variant">
                <span className="material-symbols-outlined text-[18px]">close</span>
             </button>
          </div>
          <div className="flex justify-center gap-2 mb-6">
             {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} className="focus:outline-none transform transition active:scale-90">
                   <span className={`material-symbols-outlined text-[40px] ${star <= rating ? 'text-amber-400' : 'text-surface-variant'}`} style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                </button>
             ))}
          </div>
          <textarea 
             value={text}
             onChange={e => setText(e.target.value)}
             placeholder="Что вам понравилось, а что стоит улучшить?"
             className="w-full bg-surface-container border border-outline-variant rounded-2xl p-4 text-[15px] font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-32 mb-6"
          />
          <button onClick={handleSubmit} disabled={isSubmitting || text.trim() === ''} className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed text-[15px]">
             {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </button>
       </div>
    </div>
  );
}

function BookingsView({ orders, isLoading, filter, setFilter, gearList, fallbackGear }) {
  const [reviewOrder, setReviewOrder] = useState(null);
  const displayedOrders = orders.filter(o => o.status === filter);

  return (
    <div className="pt-2 px-1 animate-slide-up pb-28">
      <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-tight">
        Мои <span className="text-gradient">брони</span>
      </h1>
      
      {/* Segmented Control */}
      <div className="flex bg-surface-container-low rounded-2xl p-1 mb-8 shadow-sm">
         <button onClick={() => setFilter('active')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] ${filter === 'active' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface border border-transparent'}`}>
           Активные
         </button>
         <button onClick={() => setFilter('completed')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] ${filter === 'completed' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface border border-transparent'}`}>
           Завершенные
         </button>
      </div>

      {isLoading ? (
         <div className="flex justify-center p-10"><span className="material-symbols-outlined animate-spin text-primary text-3xl" style={{ animation: "spin 1s linear infinite" }}>refresh</span></div>
      ) : displayedOrders.length === 0 ? (
         <div className="text-center bg-surface-container-lowest border border-outline-variant/10 rounded-[2rem] p-10">
            <span className="material-symbols-outlined text-5xl text-primary/30 mb-4 block">event_busy</span>
            <h3 className="font-headline font-bold text-lg text-on-surface mb-2">Пусто</h3>
            <p className="text-on-surface-variant text-sm">У вас пока нет {filter === 'active' ? 'активных' : 'завершенных'} бронирований</p>
         </div>
      ) : (
         <div className="flex flex-col gap-4">
            {displayedOrders.map(order => {
               const product = gearList.find(g => g.id === order.item_id) || fallbackGear.find(g => g.id === order.item_id) || {};
               return (
                 <div key={order.id} className="bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm border border-outline-variant/10 flex flex-col gap-4 transition-all duration-300 transform active:scale-[0.98]">
                    <div className="flex gap-4">
                       <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-none">
                         <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex flex-col justify-center flex-1 min-w-0">
                          <h3 className="font-headline font-bold text-[14px] text-on-surface truncate leading-tight mb-1" title={product.name}>{product.name || "Снаряжение"}</h3>
                          <div className="flex items-center justify-between">
                             <p className="text-primary font-extrabold text-[15px]">{order.total_price} <span className="text-[11px]">сом</span></p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="bg-surface-container-low rounded-xl p-3 flex justify-between items-center border border-outline-variant/5">
                       <div className="flex items-center gap-2 text-on-surface-variant">
                         <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                         <span className="text-[12px] font-bold tracking-wide">
                            {new Date(order.start_date).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'})} — {new Date(order.end_date).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'})}
                         </span>
                       </div>
                       
                       {order.status === 'active' ? (
                          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-extrabold uppercase tracking-wider">Активен</div>
                       ) : (
                          <div className="px-3 py-1 rounded-full bg-on-surface-variant/10 text-on-surface-variant border border-on-surface-variant/20 text-[11px] font-extrabold uppercase tracking-wider">Завершен</div>
                       )}
                    </div>
                    {order.status === 'completed' && (
                        <button onClick={() => setReviewOrder(order)} className="w-full py-2.5 mt-1 bg-surface-container hover:bg-surface-container-high text-secondary font-bold rounded-xl text-[13px] border border-outline-variant transition-colors">
                            Оставить отзыв
                        </button>
                    )}
                 </div>
               )
            })}
         </div>
      )}
    </div>
  )
}

function formatDatePill(dateStr) {
  if (!dateStr) return "Выберите";
  const d = new Date(dateStr);
  const months = ['Янв', 'Фев', 'Марта', 'Апр', 'Мая', 'Июня', 'Июля', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function ProductPage({ product, onBack, onBook }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/reviews?item_id=${product.id}`).then(r => r.json()).then(d => setReviews(d)).catch(e => console.error(e));
  }, [product.id]);
  
  const description = product.description || {
    1: "Легкие и прочные карбоновые палки для самых сложных маршрутов. Система быстрой регулировки FlickLock и эргономичные рукоятки из натуральной пробки обеспечат комфорт на любом рельефе Тянь-Шаня.",
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
    <div className="min-h-[100dvh] bg-surface animate-slide-up pb-32">
      {/* Header Image and Close button */}
      <div className="relative h-64 bg-surface-variant">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 transition-all duration-300 transform active:scale-90 flex items-center justify-center text-white backdrop-blur-sm z-50">
           <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Main Content Modal overlapping image slightly */}
      <div className="bg-surface-container-lowest rounded-t-[2.5rem] px-7 pt-8 relative -mt-8 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20">
        
        {/* Pill and Price */}
        <div className="flex justify-between items-start mb-6">
           <div className="flex flex-col gap-2 mt-1">
              <div className="bg-primary-container text-secondary font-bold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full self-start">
                 {product.category} SERIES
              </div>
              <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full self-start flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 В наличии: {product.stock !== undefined ? product.stock : 5} шт.
              </div>
           </div>
           
           <div className="flex flex-col items-end">
              <span className="text-[34px] font-extrabold text-primary leading-none mb-1">{product.price_per_day}</span>
              <span className="text-[12px] font-extrabold text-primary uppercase tracking-widest leading-none mb-1">СОМ</span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">за сутки</span>
           </div>
        </div>

        {/* Title */}
        <h1 className="text-[32px] font-bold text-on-surface leading-[1.1] mb-6 tracking-tight pr-6">
          {product.name}
        </h1>

        {/* Description */}
        <p className="text-on-surface-variant text-[15px] leading-[1.6] mb-8 font-medium">
          {description}
        </p>

        {/* Weight & Length secondary buttons */}
        <div className="flex gap-3 mb-8">
          <button onClick={() => setActiveModal('weight')} className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-2xl py-3 px-3 flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all duration-300 transform active:scale-95 shadow-sm">
             <span className="material-symbols-outlined text-primary text-[20px]">scale</span>
             <span className="font-bold text-[13px] text-on-surface-variant">Вес</span>
          </button>
          <button onClick={() => setActiveModal('length')} className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-2xl py-3 px-3 flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all duration-300 transform active:scale-95 shadow-sm">
             <span className="material-symbols-outlined text-primary text-[20px]">straighten</span>
             <span className="font-bold text-[13px] text-on-surface-variant">Длина</span>
          </button>
        </div>

        {/* Rental Period Box */}
        <div className="bg-surface-container rounded-[2rem] p-6 mb-8">
           <div className="flex items-center gap-2.5 mb-5 text-on-surface">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">calendar_month</span>
              <span className="font-extrabold text-[12px] uppercase tracking-widest">Период аренды</span>
           </div>
           
           <div className="grid grid-cols-2 gap-5">
              <div>
                 <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">Начало</span>
                 <div className="relative">
                    <input 
                      type="date" 
                      min={todayStr}
                      value={startDate} 
                      onChange={e => {
                        setStartDate(e.target.value);
                        if (endDate && e.target.value > endDate) setEndDate('');
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="bg-surface-container-lowest rounded-[1.25rem] py-3.5 px-4 flex justify-between items-center shadow-sm relative z-0">
                       <span className="text-on-surface font-bold text-[14px]">
                          {formatDatePill(startDate)}
                       </span>
                       <span className="material-symbols-outlined text-primary text-[20px]">keyboard_arrow_down</span>
                    </div>
                 </div>
              </div>
              <div>
                 <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">Конец</span>
                 <div className="relative">
                    <input 
                      type="date" 
                      min={startDate ? (() => {
                        let d = new Date(startDate);
                        d.setDate(d.getDate() + 1);
                        return d.toISOString().split('T')[0];
                      })() : todayStr}
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="bg-surface-container-lowest rounded-[1.25rem] py-3.5 px-4 flex justify-between items-center shadow-sm relative z-0">
                       <span className="text-on-surface font-bold text-[14px]">
                          {formatDatePill(endDate)}
                       </span>
                       <span className="material-symbols-outlined text-primary text-[20px]">keyboard_arrow_down</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Totals Block */}
        <div className="grid grid-cols-2 gap-5 pt-2 pb-6">
           <div className="relative">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Дни</div>
              <div className="text-[22px] font-extrabold text-on-surface leading-none">{days} <span className="text-[16px] font-bold">суток</span></div>
           </div>
           <div className="relative">
              <div className="absolute -left-2.5 top-0 bottom-0 w-[1px] bg-surface-variant"></div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Итого к оплате</div>
              <div className="text-[24px] font-extrabold text-primary leading-none">{days * product.price_per_day} <span className="text-[15px] font-extrabold uppercase">сом</span></div>
           </div>
        </div>

      </div>

      {/* Sticky Book Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-xl pt-3 pb-6 z-40">
         <div className="max-w-lg mx-auto px-6">
            <button 
              onClick={() => {
                try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch(e) {}
                onBook({...product, startDate, endDate, days, total: days * product.price_per_day});
              }}
              disabled={days <= 0}
              className={`w-full py-4.5 rounded-[1.5rem] font-bold text-[16px] transition-all duration-300 transform active:scale-[0.96] ${days > 0 ? "bg-primary-container text-primary hover:bg-primary-container/40" : "bg-surface-container text-on-surface-variant/60 cursor-not-allowed"}`}
              style={{ padding: "18px" }}
            >
              Забронировать
            </button>
         </div>
      </div>

      {/* Solid Clear Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" onClick={() => setActiveModal(null)}>
          {/* Darkened Backdrop */}
          <div className="absolute inset-0 bg-black/60 transition-opacity animate-fade-in"></div>
          
          {/* Solid White Card Modal */}
          <div 
            className="relative w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-6 transition-all animate-zoom-in shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-[19px] text-on-surface flex items-center gap-2">
                 {activeModal === 'weight' ? (
                   <><span className="material-symbols-outlined text-primary">scale</span>Вес</>
                 ) : (
                   <><span className="material-symbols-outlined text-primary">straighten</span>Длина</>
                 )}
              </h3>
              <button onClick={() => setActiveModal(null)} className="w-9 h-9 flex items-center justify-center bg-surface-container hover:bg-surface-variant rounded-full transition-all duration-300 transform active:scale-90 active:rotate-90 text-on-surface-variant">
                 <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-[16px] text-on-surface-variant mb-8 leading-relaxed font-medium">
               {activeModal === 'weight' ? (product.weight || "Параметр устанавливается...") : (product.length || "Параметр устанавливается...")}
            </p>
            <button onClick={() => setActiveModal(null)} className="w-full bg-primary text-white font-bold py-3.5 rounded-full hover:bg-primary/80 transition-all duration-300 transform active:scale-95 shadow-md">
               Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileView({ orders, setTab }) {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || { first_name: 'Пользователь', last_name: '', photo_url: '' };
  
  return (
    <div className="pt-2 px-1 animate-slide-up pb-28">
      <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-tight">Профиль</h1>
      <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6 flex items-center gap-5 border border-outline-variant">
         <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-container flex-shrink-0 flex items-center justify-center">
             {tgUser.photo_url ? (
                 <img src={tgUser.photo_url} alt="Аватар" className="w-full h-full object-cover" />
             ) : (
                 <span className="material-symbols-outlined text-3xl text-secondary">person</span>
             )}
         </div>
         <div className="min-w-0">
            <h2 className="text-[20px] font-extrabold text-on-surface truncate">{tgUser.first_name} {tgUser.last_name || ''}</h2>
            <p className="text-[13px] font-bold text-on-surface-variant mt-0.5">{orders.length} {orders.length === 1 ? 'заказ' : (orders.length > 1 && orders.length < 5) ? 'заказа' : 'заказов'}</p>
         </div>
      </div>
      
      <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col border border-outline-variant mb-8">
         <button onClick={() => setTab('bookings')} className="w-full flex items-center justify-between p-5 border-b border-outline-variant hover:bg-surface-container-low transition-colors transform active:bg-surface-container">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined text-[20px]">inventory_2</span>
               </div>
               <span className="font-extrabold text-on-surface text-[15px]">Мои брони</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
         </button>
         <button onClick={() => setTab('my_reviews')} className="w-full flex items-center justify-between p-5 border-b border-outline-variant hover:bg-surface-container-low transition-colors transform active:bg-surface-container">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined text-[20px]">star</span>
               </div>
               <span className="font-extrabold text-on-surface text-[15px]">Отзывы</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
         </button>
         <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors transform active:bg-surface-container">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined text-[20px]">gavel</span>
               </div>
               <span className="font-extrabold text-on-surface text-[15px]">Правила аренды</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
         </button>
      </div>
    </div>
  )
}


function MyReviewsView({ setTab, gear }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
        const res = await fetch(`${API_BASE}/api/reviews?user_id=${user_id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyReviews();
  }, []);

  return (
    <div className="pt-2 px-1 animate-slide-up pb-28">
      <div className="flex items-center gap-3 mb-6 w-full">
          <button onClick={() => setTab('profile')} className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition transform active:scale-90">
             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Мои отзывы</h1>
      </div>

      {isLoading ? (
         <div className="text-center text-on-surface-variant/60 mt-10 font-bold">Ожидайте, загружаем...</div>
      ) : reviews.length === 0 ? (
         <div className="bg-surface-container-lowest rounded-[2rem] p-8 text-center text-on-surface-variant shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-5xl opacity-30 mb-3 text-on-surface-variant/60">star_rate</span>
            <p className="font-bold text-[15px]">Вы еще не писали отзывы.</p>
         </div>
      ) : (
         <div className="flex flex-col gap-4">
            {reviews.map(r => {
               const product = gear.find(g => g.id === r.item_id) || { name: 'Неизвестный товар', image_url: '' };
               return (
                 <div key={r.id} className="bg-surface-container-lowest rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant relative">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-outline-variant/50">
                       <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-[14px] object-cover bg-surface-container" />
                       <div>
                          <h4 className="font-extrabold text-[14px] text-on-surface leading-tight mb-1">{product.name}</h4>
                          <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString('ru-RU')}</div>
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center gap-1 mb-2">
                          {[1,2,3,4,5].map(star => (
                             <span key={star} className={`material-symbols-outlined text-[15px] ${star <= r.rating ? 'text-amber-400' : 'text-surface-variant'}`} style={{ fontVariationSettings: star <= r.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                          ))}
                       </div>
                       <p className="text-[14px] text-on-surface-variant leading-relaxed font-medium">{r.text}</p>
                    </div>
                 </div>
               );
            })}
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
  const [checkoutData, setCheckoutData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState('active');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  // Telegram BackButton
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const canGoBack = selectedProductId !== null || checkoutData !== null || activeTab !== 'catalog';

    if (canGoBack) {
      tg.BackButton.show();
      const handleBack = () => {
        if (checkoutData) {
          setCheckoutData(null);
        } else if (selectedProductId) {
          setSelectedProductId(null);
        } else {
          setActiveTab('catalog');
        }
      };
      tg.BackButton.onClick(handleBack);
      return () => {
        tg.BackButton.offClick(handleBack);
        tg.BackButton.hide();
      };
    } else {
      tg.BackButton.hide();
    }
  }, [selectedProductId, checkoutData, activeTab]);

  // Telegram Haptic on tab switch
  const haptic = (type = 'light') => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type);
    } catch (e) {}
  };

  useEffect(() => {
    fetchGear();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (activeTab === 'bookings' || activeTab === 'profile') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
      const response = await fetch(`${API_BASE}/api/orders?user_id=${user_id}`);
      if (response.ok) {
        let data = await response.json();
        data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const fetchGear = async () => {
    setIsLoading(true);
    try {
      const url = new URL(`${API_BASE}/api/gear`);
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
    setCheckoutData(bookingData);
  };

  const handleConfirmOrder = (orderResponse) => {
    setCheckoutData(null);
    setSelectedProductId(null);
    
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert(`Заказ оформлен! Статус: ${orderResponse.status}`);
    } else {
      alert(`Заказ оформлен! Статус: ${orderResponse.status}`);
    }
    
    // Add dynamically to local state so user immediately sees their order if backend is slow
    setOrders(prev => [orderResponse, ...prev]);
    setActiveTab('bookings');
  };

  if (checkoutData) {
    return <CheckoutPage checkoutData={checkoutData} onBack={() => setCheckoutData(null)} onConfirm={handleConfirmOrder} />;
  }

  if (selectedProductId) {
    const product = gear.find(g => g.id === selectedProductId) || FALLBACK_GEAR.find(g => g.id === selectedProductId);
    if (product) {
      return <ProductPage product={product} onBack={() => setSelectedProductId(null)} onBook={handleBook} />;
    }
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(59,130,246,0.06)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
            <span className="text-lg font-bold tracking-widest uppercase text-primary font-headline">Alpinist</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low transition-all duration-300 transform active:scale-90 hover:bg-primary-container/20"
              title="Сменить тему"
            >
              <span className="material-symbols-outlined text-primary">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low transition-all duration-300 transform active:scale-90 hover:bg-primary-container/20">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-lg mx-auto pb-6">
        {activeTab === 'catalog' ? (
          <>
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Hero Search Section */}
            <section className="mt-6 animate-fade-in">
              <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-tight">
                Горное снаряжение <br />
                для ваших <span className="text-gradient">побед</span>
              </h1>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">search</span>
                </div>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-inverse-primary/20 transition-all duration-300 font-medium placeholder:text-on-surface-variant/60"
                  placeholder="Поиск снаряжения..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </section>

            {/* Categories Horizontal Scroll */}
            <section className="mt-8 -mx-4 animate-fade-in">
              <div className="flex overflow-x-auto px-4 gap-3 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-none px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform active:scale-[0.94] ${
                      selectedCategory === cat
                        ? 'bg-primary text-on-primary shadow-[0_8px_16px_rgba(59,130,246,0.3)]'
                        : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/10 hover:bg-surface-container-high shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Gear Grid */}
            <section className="mt-10 grid grid-cols-2 gap-4 pb-28 animate-slide-up">
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
                <div className="col-span-2 text-center text-on-surface-variant py-10 font-medium">
                  Ничего не найдено по вашему запросу.
                </div>
              ) : (
                gear.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="group flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform active:scale-[0.97] border border-transparent hover:border-inverse-primary/10 cursor-pointer"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={item.name}
                        src={item.image_url}
                      />
                      <div className="absolute top-3 right-3 bg-surface-container-lowest/50 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-snow/30">
                        <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[12px] font-extrabold text-primary">{item.rating.toFixed(1)}</span>
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
          </>
        ) : activeTab === 'bookings' ? (
          <BookingsView 
             orders={orders} 
             isLoading={isOrdersLoading} 
             filter={orderFilter} 
             setFilter={setOrderFilter} 
             gearList={gear} 
             fallbackGear={FALLBACK_GEAR} 
          />
        ) : activeTab === 'profile' ? (
          <ProfileView orders={orders} setTab={setActiveTab} />
        ) : activeTab === 'my_reviews' ? (
          <MyReviewsView setTab={setActiveTab} gear={gear.length > 0 ? gear : FALLBACK_GEAR} />
        ) : null}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] rounded-3xl z-50 bg-surface/70 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-surface-variant/20">
        <div className="flex justify-around items-center h-20 px-4">
          <div onClick={() => { haptic('light'); setActiveTab('catalog'); }} className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-90 ${activeTab === 'catalog' ? "text-primary relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full after:shadow-[0_0_8px_#60A5FA]" : "text-on-surface-variant/60 hover:opacity-80"}`}>
            <span className="material-symbols-outlined mb-1" style={activeTab === 'catalog' ? { fontVariationSettings: "'FILL' 1" } : {}}>grid_view</span>
            <span className="font-label text-[11px] font-semibold tracking-wide uppercase">Catalog</span>
          </div>
          
          <div onClick={() => { haptic('light'); setActiveTab('bookings'); }} className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-90 ${activeTab === 'bookings' ? "text-primary relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full after:shadow-[0_0_8px_#60A5FA]" : "text-on-surface-variant/60 hover:opacity-80"}`}>
            <span className="material-symbols-outlined mb-1" style={activeTab === 'bookings' ? { fontVariationSettings: "'FILL' 1" } : {}}>calendar_today</span>
            <span className="font-label text-[11px] font-semibold tracking-wide uppercase">Bookings</span>
          </div>
          
          <div onClick={() => { haptic('light'); setActiveTab('profile'); }} className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-90 ${activeTab === 'profile' ? "text-primary relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full after:shadow-[0_0_8px_#60A5FA]" : "text-on-surface-variant/60 hover:opacity-80"}`}>
            <span className="material-symbols-outlined mb-1" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
            <span className="font-label text-[11px] font-semibold tracking-wide uppercase">Profile</span>
          </div>
        </div>
      </nav>
    </>
  );
}
