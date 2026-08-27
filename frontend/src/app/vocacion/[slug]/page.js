"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, TrendingUp, Award, BookOpen, Sparkles } from "lucide-react";
import { PROFESSIONS, getProfessionById } from "@/app/data/professions";

export default function VocationDetail({ params }) {
    const resolvedParams = use(params);
    const router = useRouter();

    const profession = getProfessionById(resolvedParams.slug);

    if (!profession) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center text-slate-900 dark:text-white font-sans transition-colors duration-300">
                <h1 className="text-2xl font-bold mb-2">Vocación no encontrada</h1>
                <p className="text-indigo-600 dark:text-indigo-200/70 text-sm mb-6">La ruta o profesión que buscas no existe o fue movida.</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                    Volver al Dashboard
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-8 pt-32 relative overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* Luces decorativas sutiles de fondo */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Botón de retorno */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 px-4 py-2.5 mb-8 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-950 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    Volver a elecciones
                </button>

                {/* Tarjeta Principal de la Vocación */}
                <div className="bg-white dark:bg-[linear-gradient(135deg,_#1e1b4b_0%,_#0f172a_100%)] border border-slate-200 dark:border-indigo-900/60 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Sparkles className="w-32 h-32 text-indigo-400" />
                    </div>

                    <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800/50 px-3.5 py-1.5 rounded-full inline-block">
                                {profession.area}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3 mb-2">
                                {profession.title}
                            </h1>
                        </div>
                    </div>

                    <p className="text-slate-600 dark:text-indigo-100/90 text-base leading-relaxed font-medium mb-8 max-w-2xl">
                        {profession.desc}
                    </p>

                    <button
                        onClick={() => router.push(`/diagnostico/${profession.slug}`)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                    >
                        Comenzar diagnóstico con IA
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-indigo-900/40">
                        <div className="flex items-start gap-3 bg-slate-900/40 p-4 rounded-2xl border border-indigo-950">
                            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-indigo-500 dark:text-indigo-300/60 uppercase tracking-wider">Demanda Laboral</h4>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{profession.demanda}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-slate-100 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-indigo-950">
                            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-indigo-500 dark:text-indigo-300/60 uppercase tracking-wider">Nivel Recomendado</h4>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{profession.nivelRecomendado}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competencias y Proyección */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-indigo-950 rounded-2xl p-6 shadow-md backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-sm">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <h3>Competencias Clave</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-indigo-200/80 leading-relaxed font-medium">
                            {profession.competencias}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-indigo-950 rounded-2xl p-6 shadow-md backdrop-blur-sm">
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
