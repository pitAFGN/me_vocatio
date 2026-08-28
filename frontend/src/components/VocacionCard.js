"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import { Bookmark } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VocacionCard({ vocacion }) {
    const router = useRouter();
    const { savedIds, toggleSave } = useFavorites();
    const isFavorite = savedIds.includes(vocacion?.id);

    const title = vocacion?.title || vocacion?.nombre || "Vocación";
    const desc = vocacion?.desc || vocacion?.descripcion || "";
    const area = vocacion?.area || vocacion?.categoria || "Tecnología & Desarrollo";
    const slug = vocacion?.slug || vocacion?.id;

    const handleIniciarTest = (e) => {
        e.preventDefault();
        if (slug) {
            router.push(`/diagnostico/${slug}`);
        }
    };

    return (
        <div className="relative rounded-2xl border border-white/10 bg-[#0c1222] p-5 shadow-xl transition-all hover:border-violet-500/40 flex flex-col justify-between">

            <div>
                {/* Cabecera de la tarjeta: Categoría y Botón del marcador */}
                <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                        {area}
                    </span>

                    {/* Botón de Guardar en Favoritos */}
                    <button
                        onClick={() => toggleSave(vocacion)}
                        className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${isFavorite
                                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/30"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                            }`}
                        title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                        {/* El ícono de marcador se rellena si ya está guardado */}
                        <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
                    </button>
                </div>

                {/* Información principal de la tarjeta */}
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    {title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {desc}
                </p>
            </div>

            {/* Bloque de Acciones Inferiores */}
            <div className="space-y-2.5">
                {/* Botón de Iniciar Test con IA */}
                <button
                    onClick={handleIniciarTest}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-2.5 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>Iniciar Test con IA</span>
                </button>

                {/* Botón de Ver Módulo */}
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