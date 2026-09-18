"use client";

import { useLocalFavorites } from "@/hooks/useLocalFavorites";

export function recursoId(recurso) {
  const base = recurso?.url || recurso?.titulo || recurso?.query_busqueda;
  return base ? encodeURIComponent(String(base)) : null;
}

const RESOURCE_FAVORITES_CONFIG = {
  storageKey: "me_vocatio_resource_favorites",
  getId: recursoId,
  eventName: "resourceFavoritesUpdated",
};

export function useResourceFavorites() {
  const { items, savedIds, toggleSave } = useLocalFavorites(RESOURCE_FAVORITES_CONFIG);
  return { resourceFavorites: items, savedResourceIds: savedIds, toggleResourceSave: toggleSave };
}

export default useResourceFavorites;