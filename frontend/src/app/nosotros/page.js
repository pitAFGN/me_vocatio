"use client";

import Link from "next/link";
import OpinionesCarrusel from "@/components/OpinionesCarrusel";

const BENEFICIOS = [
    {
        num: "01",
        title: "Identidad Digital",
        description: "Crea una presencia profesional moderna que destaque tu verdadero talento.",
    },
    {
        num: "02",
        title: "Estructura de Perfil",
        description: "Organiza tu trayectoria bajo un diseño minimalista de alto impacto visual.",
    },
    {
        num: "03",
        title: "Claridad de Objetivos",
        description: "Centraliza tus logros y metas en un solo lugar para proyectar seguridad.",
    },
    {
        num: "04",
        title: "Enfoque Vocacional",
        description: "Herramientas diseñadas para profesionales que buscan dar el siguiente paso con orden.",
    },
];

const PASOS = [
    {
        step: "1",
        title: "Regístrate",
        description: "Crea tu perfil y cuéntanos sobre tus pasiones y experiencia.",
    },
    {
        step: "2",
        title: "Diagnóstico",
        description: "Realiza nuestras pruebas psicotécnicas de última generación.",
    },
    {
        step: "3",
        title: "Mejora",
        description: "Recibe recomendaciones exactas para pulir tu potencial.",
    },
];

export default function NosotrosPage() {
    return (
        <main className="relative min-h-screen bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#080d1a] text-slate-100 flex flex-col items-center py-6 sm:py-10 px-4 sm:px-6 overflow-x-hidden">

            {/* CONTENEDOR SUPERIOR CON BOTÓN DE CERRAR ALINEADO (RESPONSIVE) */}
            <div className="w-full max-w-6xl flex justify-end pt-2 pb-4 z-20">
                <Link
                    href="/"
                    className="text-slate-300 hover:text-white transition-all flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] bg-slate-900/80 backdrop-blur-md shadow-lg px-4 sm:px-5 py-2 rounded-full border border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800/90 active:scale-95"
                >
                    Cerrar ✕
                </Link>
            </div>

            {/* TÍTULO DE BIENVENIDA */}
            <div className="text-center z-10 mb-8 max-w-2xl">
                <h1 className="text-3xl sm:text-5xl font-normal tracking-tight leading-[1.12] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                    Nuestra{" "}
                    <span className="italic font-serif font-light text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        Esencia
                    </span>
                </h1>
                <p className="text-cyan-400/90 font-medium text-xs sm:text-sm uppercase tracking-[0.3em] mt-3">
                    Conoce el motor detrás de MeVocatio
                </p>
            </div>

            {/* CUADRO DE CRISTAL PRINCIPAL */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl max-w-6xl w-full p-6 sm:p-10 md:p-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* LADO IZQUIERDO: BENEFICIOS */}
                    <div className="flex flex-col gap-6 text-left">
                        <h2 className="text-white text-xl sm:text-2xl font-serif font-medium border-b-2 border-cyan-500/80 w-fit pb-2">
                            Beneficios
                        </h2>
                        <ul className="space-y-4">
                            {BENEFICIOS.map(({ num, title, description }) => (
                                <li key={num} className="flex gap-3.5 items-start">
                                    <span className="text-cyan-400 font-serif font-bold text-sm sm:text-base shrink-0 pt-0.5 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                                        {num}.
                                    </span>
                                    <div>
                                        <span className="font-semibold text-white text-xs sm:text-sm block mb-0.5">
                                            {title}:
                                        </span>
                                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                            {description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* LADO DERECHO: FUNCIONAMIENTO */}
                    <div className="flex flex-col gap-6 bg-slate-950/50 rounded-2xl p-6 border border-slate-800/80 text-left">
                        <h2 className="text-white text-xl sm:text-2xl font-serif font-medium border-b-2 border-indigo-500/60 w-fit pb-2">
                            Funcionamiento
                        </h2>
                        <div className="space-y-5">
                            {PASOS.map(({ step, title, description }) => (
                                <div key={step} className="flex items-start gap-4">
                                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                        {step}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white uppercase text-[11px] sm:text-xs tracking-wider block mb-0.5">
                                            {title}:
                                        </span>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* SECCIÓN DE OPINIONES */}
            <div className="mt-14 sm:mt-16 w-full max-w-5xl z-10">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-white">
                        Casos de{" "}
                        <span className="italic font-serif font-light text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                            Éxito
                        </span>
                    </h2>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500 mx-auto mt-3 rounded-full"></div>
                </div>

                <OpinionesCarrusel />
            </div>

            <div className="h-12"></div>
        </main>
    );
}