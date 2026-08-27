"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "me_vocatio_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setFavorites(stored);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const syncFavorites = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setFavorites(stored);
      } catch {
        setFavorites([]);
      }
    };

    window.addEventListener("favoritesUpdated", syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("favoritesUpdated", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  const toggleSave = useCallback((vocation) => {
    if (!vocation?.id) return;

    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const exists = current.some((fav) => fav.id === vocation.id);

    const updated = exists
      ? current.filter((fav) => fav.id !== vocation.id)
      : [...current, vocation];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new Event("favoritesUpdated"));
  }, []);

  const savedIds = favorites.map((fav) => fav.id);

  return { favorites, savedIds, toggleSave };
}
