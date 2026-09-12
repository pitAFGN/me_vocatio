"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "me_vocatio_resource_favorites";

export function recursoId(recurso) {
  const base = recurso?.url || recurso?.titulo || recurso?.query_busqueda;
  return base ? encodeURIComponent(String(base)) : null;
}

export function useResourceFavorites() {
  const [resourceFavorites, setResourceFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setResourceFavorites(Array.isArray(stored) ? stored : []);
    } catch {
      setResourceFavorites([]);
    }
  }, []);

  useEffect(() => {
    const syncResourceFavorites = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setResourceFavorites(Array.isArray(stored) ? stored : []);
      } catch {
        setResourceFavorites([]);
      }
    };

    window.addEventListener("resourceFavoritesUpdated", syncResourceFavorites);
    window.addEventListener("storage", syncResourceFavorites);

    return () => {
      window.removeEventListener("resourceFavoritesUpdated", syncResourceFavorites);
      window.removeEventListener("storage", syncResourceFavorites);
    };
  }, []);

  const toggleResourceSave = useCallback((recurso) => {
    const id = recursoId(recurso);
    if (!id) return;

    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(current)) current = [];
    } catch {
      current = [];
    }

    const exists = current.some((fav) => recursoId(fav) === id);

    const updated = exists
      ? current.filter((fav) => recursoId(fav) !== id)
      : [...current, recurso];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setResourceFavorites(updated);
    window.dispatchEvent(new Event("resourceFavoritesUpdated"));
  }, []);

  const savedResourceIds = resourceFavorites.map((fav) => recursoId(fav));

  return { resourceFavorites, savedResourceIds, toggleResourceSave };
}