"use client";

import { Bookmark } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteVocationButton({ vocacion }) {
  const { savedIds, toggleSave } = useFavorites();
  
  if (!vocacion?.id) return null;
  
  const isFavorite = savedIds.includes(vocacion.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(vocacion);
      }}
      className={`p-2 rounded-full border transition-all active:scale-95 cursor-pointer flex-shrink-0 ${
        isFavorite
          ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/30"
          : "bg-slate-100 dark:bg-[#0a0b14]/70 dark:backdrop-blur-md border-slate-300 dark:border-white/15 text-slate-400 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white dark:hover:border-white/30"
      }`}
      title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
    </button>
  );
}

