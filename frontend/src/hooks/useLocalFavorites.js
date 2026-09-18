"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * useLocalFavorites
 * ------------------------------------------------------------------
 * Factory de favoritos persistidos en localStorage.
 *
 * Centraliza la lógica compartida entre los favoritos de vocaciones y
 * de recursos: carga inicial, sincronización entre pestañas/eventos,
 * toggle de guardado con dedupe y derivación de ids guardados.
 *
 * @param {object} config
 * @param {string} config.storageKey  Clave en localStorage.
 * @param {(item: object) => string | null} config.getId  Extractora del id único de cada item.
 * @param {string} config.eventName   Nombre del evento custom que notifica cambios.
 */
export function useLocalFavorites({ storageKey, getId, eventName }) {
  const [items, setItems] = useState([]);

  const leerStorage = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }, [storageKey]);

  useEffect(() => {
    setItems(leerStorage());
  }, [leerStorage]);

  useEffect(() => {
    const sync = () => setItems(leerStorage());
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, [eventName, leerStorage]);

  const toggleSave = useCallback(
    (item) => {
      const id = getId(item);
      if (!id) return;

      const current = leerStorage();
      const exists = current.some((fav) => getId(fav) === id);
      const updated = exists
        ? current.filter((fav) => getId(fav) !== id)
        : [...current, item];

      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
      window.dispatchEvent(new Event(eventName));
    },
    [getId, leerStorage, storageKey, eventName]
  );

  const savedIds = items.map((item) => getId(item));

  return { items, savedIds, toggleSave };
}

export default useLocalFavorites;