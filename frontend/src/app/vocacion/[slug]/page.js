import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";
import { PROFESSIONS, getProfessionById } from "@/app/data/professions";
import { obtenerTema, obtenerChipDemanda, obtenerChipNivel } from "@/lib/professionThemes";

export function generateStaticParams() {
    return PROFESSIONS.map((profession) => ({ slug: profession.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const profession = getProfessionById(slug);

    if (!profession) {
        return {
            title: "Vocación no encontrada | MeVocatio",
            description: "La ruta o profesión que buscas no existe o fue movida."
        };
    }

    return {
        title: `${profession.title} | MeVocatio`,
        description: `${profession.desc} ${profession.detalle || ""}`
    };
}

export default async function VocationDetail({ params }) {
    const { slug } = await params;
    const profession = getProfessionById(slug);

    if (!profession) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center text-slate-900 dark:text-white font-sans transition-colors duration-300">
                <h1 className="text-2xl font-bold mb-2">Vocación no encontrada</h1>
                <p className="text-indigo-600 dark:text-indigo-200/70 text-sm mb-6">La ruta o profesión que buscas no existe o fue movida.</p>
                <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                    Volver al Dashboard
                </Link>
            </main>
        );
    }

    const tema = obtenerTema(profession.area);
    const chipDemanda = obtenerChipDemanda(profession.demanda);
    const chipNivel = obtenerChipNivel(profession.nivelRecomendado);
    const TemaIcono = tema.icono;
    const competencias = (profession.competencias || "")
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-6 sm:p-8 pt-24 relative overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* Luces decorativas sutiles de fondo */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Botón de retorno */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-950 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    Volver a elecciones
                </Link>

                {/* Tarjeta Principal de la Vocación */}
                <div className="rounded-3xl shadow-2xl mb-6 overflow-hidden border border-slate-200 dark:border-indigo-900/60">
                    {/* Banner Temático por Área */}
                    <div className={`relative h-20 sm:h-24 p-5 sm:p-6 overflow-hidden bg-gradient-to-br ${tema.clase}`}>
                        <TemaIcono className="absolute -right-6 -top-6 w-36 h-36 text-white opacity-15 pointer-events-none" />
                        <div className="relative z-10 flex items-start justify-between gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0a0b14]/70 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider">
                                <TemaIcono className={`w-3.5 h-3.5 ${tema.colorTexto}`} />
                                <span>{profession.area}</span>
                            </span>
                        </div>
                    </div>

                    {/* Cuerpo del Hero */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 sm:p-6 space-y-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1.5">
                                {profession.title}
                            </h1>
                            <p className={`text-sm font-semibold ${tema.colorTexto} dark:${tema.colorTexto}`}>
                                {profession.desc}
                            </p>
                        </div>

                        {profession.detalle && (
                            <p className="text-[13px] text-slate-600 dark:text-indigo-100/90 leading-relaxed line-clamp-3">
                                {profession.detalle}
                            </p>
                        )}

                        {/* Chips de Demanda y Nivel */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${chipDemanda.clase}`}>
                                <TrendingUp className="w-3.5 h-3.5" />
                                Demanda: {chipDemanda.texto}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${chipNivel.clase}`}>
                                <Award className="w-3.5 h-3.5" />
                                Nivel: {chipNivel.texto}
                            </span>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <Link
                                href={`/recomendacion?profesion=${profession.slug}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 cursor-pointer flex-1"
                            >
                                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                                Ir a Ruta de Aprendizaje
                            </Link>

                            <Link
                                href={`/diagnostico/${profession.slug}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:bg-violet-100 dark:hover:bg-violet-600/20 hover:border-violet-500/60 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer flex-1"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                Comenzar diagnóstico con IA
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Competencias y Proyección */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-indigo-950 rounded-2xl p-5 shadow-md backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-sm">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <h3>Competencias Clave</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {competencias.map((competencia, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold"
                                >
                                    {competencia}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-indigo-950 rounded-2xl p-5 shadow-md backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-sm">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <h3>Proyección Profesional</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-indigo-200/80 leading-relaxed font-medium">
                            {profession.proyeccion}
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}