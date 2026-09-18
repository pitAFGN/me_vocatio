"use client";

import { useLocalFavorites } from "@/hooks/useLocalFavorites";

const FAVORITES_CONFIG = {
  storageKey: "me_vocatio_favorites",
  getId: (vocation) => vocation?.id,
  eventName: "favoritesUpdated",
};

export function useFavorites() {
  const { items, savedIds, toggleSave } = useLocalFavorites(FAVORITES_CONFIG);
  return { favorites: items, savedIds, toggleSave };
}

export default useFavorites;