"use client";

import { Bookmark, ExternalLink, Sparkles } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfessionCard({ profession, showTest = false }) {
  const router = useRouter();
  const { savedIds, toggleSave } = useFavorites();

  const id = profession?.id;
  const title = profession?.title || profession?.nombre || "Vocación";
  const desc = profession?.desc || profession?.descripcion || "";
  const area = profession?.area || profession?.categoria || "Tecnología & Desarrollo";
  const slug = profession?.slug || id;

  const isFavorite = savedIds.includes(id);

  const handleIniciarTest = (e) => {
    e.preventDefault();
    if (slug) {
      router.push(`/diagnostico/${slug}`);
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0c1222] p-6 shadow-xl transition-all hover:-translate-y-1.5 hover:border-violet-500/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex flex-col justify-between backdrop-blur-xl">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300">
            {area}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(profession);
            }}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${isFavorite
                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/30"
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
          </button>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight mb-2">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">{desc}</p>
      </div>

      <div className="space-y-2.5">
        {showTest && (
          <button
            onClick={handleIniciarTest}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-2.5 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Iniciar Test con IA</span>
          </button>
        )}

        <Link
          href={slug ? `/vocacion/${slug}` : "#"}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-white/10 hover:text-white"
        >
          <span>Ver Módulo / Ruta</span>
          <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
        </Link>
      </div>
    </div>
  );
}