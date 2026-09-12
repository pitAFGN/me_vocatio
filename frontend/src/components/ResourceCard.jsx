"use client";

import {
  Bookmark,
  Compass,
  Video,
  GraduationCap,
  Terminal,
  BookOpen,
  Wrench,
  Sparkles,
  Lock,
  ExternalLink
} from "lucide-react";
import "@/app/recomendacion/RecomendacionPage.css";

const obtenerIconoTipo = (tipo) => {
  const t = (tipo || "").toLowerCase();
  if (t.includes("video")) return <Video className="w-4 h-4 text-red-400" />;
  if (t.includes("doc") || t.includes("guia")) return <Terminal className="w-4 h-4 text-emerald-400" />;
  if (t.includes("curso")) return <GraduationCap className="w-4 h-4 text-sky-400" />;
  if (t.includes("libro")) return <BookOpen className="w-4 h-4 text-amber-400" />;
  if (t.includes("herramienta") || t.includes("practica")) return <Wrench className="w-4 h-4 text-purple-400" />;
  return <Compass className="w-4 h-4 text-slate-400" />;
};

const obtenerTextoBoton = (tipo, plataforma) => {
  const t = (tipo || "").toLowerCase();
  if (t.includes("video")) return "▶ Ver en YouTube";
  if (t.includes("doc") || t.includes("guia") || t.includes("guía")) return "📖 Leer documentación";
  if (t.includes("curso")) return plataforma ? `🎓 Explorar (${plataforma})` : "🎓 Explorar curso";
  if (t.includes("libro")) return "📚 Ver libro / guía";
  if (t.includes("herramienta") || t.includes("práctica") || t.includes("practica")) return "🛠️ Ir a la herramienta";
  return "🔗 Ir al recurso";
};

export default function ResourceCard({ material, isFavorite = false, onToggleSave, onOpenAi, isPremium = false }) {
  const tipoKey = (material.tipo || "recurso").toLowerCase().replace(/\s+/g, "");

  return (
    <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/40 hover:bg-slate-50 dark:hover:bg-white/[0.07] backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 group">
      {/* Banner Temático Superior */}
      <div className={`h-24 p-3.5 flex items-start justify-between gap-2 relative overflow-hidden rec-banner-${tipoKey}`}>
        {/* Badge de Categoría */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0b14]/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider z-10">
          {obtenerIconoTipo(material.tipo)}
          <span>{material.tipo || "Recurso"}</span>
        </span>

        {/* Acciones del Banner: Guardar favorito + Gemini AI */}
        <div className="flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(material);
            }}
            className={`p-2 rounded-full border transition-all active:scale-95 cursor-pointer ${
              isFavorite
                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/30"
                : "bg-[#0a0b14]/80 backdrop-blur-md border-white/15 text-slate-200 hover:bg-slate-900 hover:text-white hover:border-white/30"
            }`}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? "fill-white" : ""}`} />
          </button>

          {onOpenAi && (
            <button
              onClick={() => onOpenAi(material)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/50 text-[10px] font-black text-violet-200 uppercase tracking-wider transition-colors cursor-pointer"
              title="Analizar con Gemini Copilot"
            >
              <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
              <span>Gemini AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          {material.plataforma && (
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
              📍 {material.plataforma}
            </span>
          )}

          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-violet-700 dark:group-hover:text-violet-200 transition-colors">
            {material.titulo}
          </h4>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {material.descripcion}
          </p>
        </div>

        {/* Acciones de la Tarjeta */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
          {/* Botón Secundario: Analizar con Gemini Copilot */}
          {onOpenAi && (
            <button
              onClick={() => onOpenAi(material)}
              className="w-full py-2 px-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 hover:bg-violet-200 dark:hover:bg-violet-500/20 border border-violet-300 dark:border-violet-500/30 hover:border-violet-400 text-violet-700 dark:text-violet-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isPremium ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  <span>✨ Analizar con Gemini</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>✨ Resumen con Gemini (Premium)</span>
                </>
              )}
            </button>
          )}

          {/* Botón Primario: Ir al Recurso Canónico/Verificado */}
          <a
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/15"
          >
            <span>{obtenerTextoBoton(material.tipo, material.plataforma)}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}