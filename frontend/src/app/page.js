"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePublicRoute } from "@/hooks/useRouteGuard";
import { Search, BarChart3, Award, ArrowRight } from "lucide-react";

// 1. Carga dinámica del diamante
const DiamanteCanvas = dynamic(() => import("@/components/DiamanteCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-purple-500/15 animate-ping" />
    </div>
  ),
});

// 2. Carga dinámica de los brillitos de fondo
const BackgroundStars = dynamic(() => import("@/components/BackgroundStars"), {
  ssr: false,
});

const FEATURES = [
  {
    icon: Search,
    title: "Descubre tu Vocación",
    description:
      "Análisis profundo de tus capacidades intrínsecas mediante psicometría avanzada y mentoría estratégica personalizada.",
  },
  {
    icon: BarChart3,
    title: "Evalúa tu Nivel",
    description:
      "Benchmark ejecutivo frente a los estándares de la industria global. Mapeo de brechas y oportunidades de alto impacto.",
  },
  {
    icon: Award,
    title: "Forja tu Legado",
    description:
      "Diseño de un plan de carrera vitalicio que garantiza relevancia, influencia y un impacto duradero en tu sector.",
  },
];

export default function LandingPage() {
  const { loading } = usePublicRoute();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground italic font-black uppercase tracking-[0.3em]">
        Cargando MeVocatio...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-white dark:from-[#0b1329] dark:via-[#0f172a] dark:to-[#080d1a] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-between px-4 sm:px-6 py-6 md:py-8 overflow-x-hidden transition-colors duration-300">

      {/* BRILLITOS / ESTRELLITAS EN TODO EL FONDO (Z-0) - Se ocultan o adaptan sutilmente si quieres */}
      <BackgroundStars />

      {/* SECCIÓN HERO COMPACTA (Z-10) */}
      <div className="z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-2 mt-4">

        {/* 1. TÍTULO PRINCIPAL */}
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight leading-[1.12] text-slate-900 dark:text-white drop-shadow-sm">
          Pulimos tu{" "}
          <span className="italic font-serif font-light text-purple-700 dark:text-white dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            potencial
          </span>{" "}
          <br />
          <span className="italic font-serif font-light text-purple-700 dark:text-white dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            profesional
          </span>
        </h1>

        {/* 2. DIAMANTE 3D */}
        <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[290px] md:h-[290px] flex items-center justify-center pointer-events-none -my-2">
          {/* Halo difuso de fondo */}
          <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-purple-600/20 via-indigo-500/15 to-blue-500/10 rounded-full blur-[90px] -z-10 animate-pulse" />
          <DiamanteCanvas />
        </div>

        {/* 3. TEXTO DESCRIPTIVO */}
        <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed bg-white/70 dark:bg-slate-950/30 backdrop-blur-sm py-2 px-5 rounded-xl border border-slate-300 dark:border-white/5 shadow-sm">
          Un entorno de alta precisión diseñado para líderes visionarios. Descubre la estrategia definitiva para escalar tu carrera hacia el nivel de élite global.
        </p>

        {/* 4. BOTÓN CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-95 border border-purple-400/40"
          >
            EMPIEZA A PULIR TU FUTURO
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5. TARJETAS INFERIORES (Z-10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mt-8 md:mt-10 text-left z-10">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 backdrop-blur-md hover:border-purple-500/50 transition-all group shadow-lg dark:shadow-2xl hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          >
            <div className="p-2.5 w-fit rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 mb-3 text-purple-700 dark:text-purple-300 group-hover:text-white group-hover:bg-purple-600 dark:group-hover:bg-purple-900/80 group-hover:border-purple-400 transition-all shadow-inner">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-medium text-slate-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>

      {/* 6. FOOTER (Z-10) */}
      <footer className="w-full pt-6 pb-2 z-10">
        <p className="text-center text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
          © 2026 MeVocatio. Elite Professional Development. Transformando el potencial en legado.
        </p>
      </footer>
    </main>
  );
}