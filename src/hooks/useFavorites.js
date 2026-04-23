import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'alpinist-favorites';
const CLOUD_KEY = 'favorites';

function getInitialFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(getInitialFavorites);
  const [cloudReady, setCloudReady] = useState(false);

  // Load from Telegram CloudStorage if available
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.CloudStorage) return;
    tg.CloudStorage.getItem(CLOUD_KEY, (err, val) => {
      if (!err && val) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
            localStorage.setItem(STORAGE_KEY, val);
          }
        } catch (e) {}
      }
      setCloudReady(true);
    });
  }, []);

  // Persist to localStorage and CloudStorage
  useEffect(() => {
    const json = JSON.stringify(favorites);
    localStorage.setItem(STORAGE_KEY, json);
    if (cloudReady && window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(CLOUD_KEY, json);
    }
  }, [favorites, cloudReady]);

  const toggle = useCallback((id) => {
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(fid => fid !== id);
      return [...prev, id];
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
