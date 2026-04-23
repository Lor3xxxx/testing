import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'alpinist-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  
  const tgScheme = window.Telegram?.WebApp?.colorScheme;
  if (tgScheme === 'light' || tgScheme === 'dark') return tgScheme;
  
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);

    if (window.Telegram?.WebApp) {
      const bg = theme === 'dark' ? '#0E1117' : '#f7f9fc';
      try {
        window.Telegram.WebApp.setHeaderColor(bg);
        window.Telegram.WebApp.setBackgroundColor(bg);
      } catch (e) {
        // ignore
      }
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
}
