import { useState, useCallback } from 'react';

const STORAGE_KEY = 'alpinist-cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {}
}

export function useCart() {
  const [items, setItems] = useState(loadCart);

  const addItem = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev; // Already in cart
      const next = [...prev, product];
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  const isInCart = useCallback((id) => {
    return items.some(i => i.id === id);
  }, [items]);

  const count = items.length;
  const total = items.reduce((s, i) => s + (i.total || 0), 0);

  return { items, count, total, addItem, removeItem, clearCart, isInCart };
}
