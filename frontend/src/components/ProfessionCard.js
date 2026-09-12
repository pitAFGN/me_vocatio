"use client";

import {
  Bookmark,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { obtenerTema, obtenerChipDemanda, obtenerChipNivel } from "@/lib/professionThemes";

export default function ProfessionCard({ profession, savedIds = [], onToggleSave }) {
  const id = profession?.id;
  const title = profession?.title || profession?.nombre || "Vocación";
  const desc = profession?.desc || profession?.descripcion || "";
  const detalle = profession?.detalle || "";
  const area = profession?.area || profession?.categoria || "Tecnología & Desarrollo";
  const slug = profession?.slug || id;

  const isFavorite = savedIds.includes(id);
  const tema = obtenerTema(area);
  const chipDemanda = obtenerChipDemanda(profession?.demanda);
  const chipNivel = obtenerChipNivel(profession?.nivelRecomendado);
  const TemaIcono = tema.icono;

  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1222] shadow-xl transition-all hover:-translate-y-1.5 hover:border-violet-500/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex flex-col justify-between backdrop-blur-xl overflow-hidden group">
      {/* Banner Temático por Área */}
      <div className={`relative h-28 p-4 overflow-hidden bg-gradient-to-br ${tema.clase}`}>
        {/* Marca de agua del área */}
        <TemaIcono className="absolute -right-5 -top-5 w-32 h-32 text-white opacity-15" />

        <div className="relative z-10 flex items-start justify-between gap-2 h-full">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0b14]/70 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider">
            <TemaIcono className={`w-3.5 h-3.5 ${tema.colorTexto}`} />
            <span>{area}</span>
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(profession);
            }}
            className={`p-2 rounded-full border transition-all active:scale-95 cursor-pointer ${
              isFavorite
                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/30"
                : "bg-[#0a0b14]/70 backdrop-blur-md border-white/15 text-slate-200 hover:bg-slate-900 hover:text-white hover:border-white/30"
            }`}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-violet-700 dark:group-hover:text-violet-200 transition-colors">
            {title}
          </h3>

          {desc && (
            <p className={`text-xs font-semibold ${tema.colorTexto} dark:${tema.colorTexto}`}>
              {desc}
            </p>
          )}

          {detalle && (
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
              {detalle}
            </p>
          )}

          {/* Chips de Demanda y Nivel */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${chipDemanda.clase}`}>
              <TrendingUp className="w-3 h-3" />
              {chipDemanda.texto}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${chipNivel.clase}`}>
              <Award className="w-3 h-3" />
              {chipNivel.texto}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2.5">
          <Link
            href={slug ? `/diagnostico/${slug}` : "#"}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-2.5 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Iniciar Test con IA</span>
          </Link>

          <Link
            href={slug ? `/vocacion/${slug}` : "#"}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-violet-100 dark:hover:bg-violet-600/20 hover:border-violet-500/60 hover:text-violet-900 dark:hover:text-violet-100 dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
          >
            <span>Ver Módulo / Ruta</span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}