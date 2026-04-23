import React, { useMemo, useState, useEffect } from 'react';
import { API_BASE } from '../api';

const ACHIEVEMENTS = [
  {
    id: 'first_order',
    title: 'Первый восход',
    desc: 'Оформите первую аренду',
    icon: 'hiking',
    condition: ({ orders }) => orders.length >= 1,
    progress: ({ orders }) => Math.min(orders.length, 1),
    max: 1,
  },
  {
    id: 'season_open',
    title: 'Сезон открыт',
    desc: '5 успешных аренд',
    icon: 'counter_5',
    condition: ({ orders }) => orders.length >= 5,
    progress: ({ orders }) => Math.min(orders.length, 5),
    max: 5,
  },
  {
    id: 'pro_renter',
    title: 'Профессионал',
    desc: '10 успешных аренд',
    icon: 'workspace_premium',
    condition: ({ orders }) => orders.length >= 10,
    progress: ({ orders }) => Math.min(orders.length, 10),
    max: 10,
  },
  {
    id: 'reviewer',
    title: 'Отзывчивый',
    desc: 'Оставьте первый отзыв',
    icon: 'rate_review',
    condition: ({ reviews }) => reviews.length >= 1,
    progress: ({ reviews }) => Math.min(reviews.length, 1),
    max: 1,
  },
  {
    id: 'collector',
    title: 'Коллекционер',
    desc: '5 товаров в избранном',
    icon: 'collections_bookmark',
    condition: ({ favorites }) => favorites.length >= 5,
    progress: ({ favorites }) => Math.min(favorites.length, 5),
    max: 5,
  },
  {
    id: 'explorer',
    title: 'Исследователь',
    desc: 'Посмотрите прогноз погоды',
    icon: 'travel_explore',
    condition: () => false,
    progress: () => 0,
    max: 1,
  },
];

export default function Achievements({ orders, favorites }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
        const res = await fetch(`${API_BASE}/api/reviews?user_id=${user_id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (e) {}
    };
    fetchReviews();
  }, []);

  const stats = useMemo(() => ({ orders, reviews, favorites }), [orders, reviews, favorites]);
  const unlockedCount = ACHIEVEMENTS.filter(a => a.condition(stats)).length;

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-5 border border-outline-variant/10 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-extrabold text-on-surface text-[17px]">Достижения</h3>
        <span className="text-[12px] font-bold text-primary bg-primary-container px-3 py-1 rounded-full">
          {unlockedCount}/{ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = ach.condition(stats);
          const pct = Math.round((ach.progress(stats) / ach.max) * 100);
          return (
            <div
              key={ach.id}
              className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                unlocked
                  ? 'bg-primary-container/20 border-primary/20'
                  : 'bg-surface-container border-outline-variant/10 opacity-60'
              }`}
            >
              <span className={`material-symbols-outlined text-[28px] mb-1.5 ${unlocked ? 'text-primary' : 'text-on-surface-variant'}`}>
                {ach.icon}
              </span>
              <span className={`text-[11px] font-bold leading-tight mb-0.5 ${unlocked ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {ach.title}
              </span>
              <span className="text-[9px] text-on-surface-variant/70 font-medium leading-tight">{ach.desc}</span>
              {!unlocked && (
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
