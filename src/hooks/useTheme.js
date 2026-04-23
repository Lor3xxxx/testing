import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'alpinist-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {}
    return 'dark';
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
      localStorage.setItem(THEME_KEY, theme);

      if (window.Telegram?.WebApp) {
        const bg = theme === 'dark' ? '#0E1117' : '#f7f9fc';
        try {
          window.Telegram.WebApp.setHeaderColor(bg);
          window.Telegram.WebApp.setBackgroundColor(bg);
        } catch (e) {}
      }
    } catch (e) {
      console.error('Theme error', e);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
}
