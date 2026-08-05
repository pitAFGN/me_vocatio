"use client";

import Image from "next/image";
import Link from "next/link";
import { usePublicRoute } from "@/hooks/useRouteGuard";
import { Search, BarChart3, Award, ArrowRight, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  const { loading } = usePublicRoute();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1329] text-white italic font-black uppercase tracking-[0.3em]">
        Cargando MeVocatio...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#080d1a] text-slate-100 flex flex-col items-center justify-between px-6 py-12 md:py-16 overflow-hidden">

      {/* 
        1. DIAMANTE DE FONDO: CON UN MÁXIMO BRILLO TENUE
      */}
      <div className="absolute inset-0 flex justify-center pointer-events-none z-0 top-[22vh] sm:top-[20vh]">
        <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] [perspective:1000px] opacity-35">
          <div
            className="w-full h-full relative drop-shadow-[0_0_60px_rgba(168,85,247,0.4)]"
            style={{ animation: "rotar 12s linear infinite" }}
          >
            <Image
              src="/diamante.png"
              alt="Diamante MeVocatio"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-6 mt-8 md:mt-12">
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight leading-[1.15]">
          Pulimos tu <span className="italic font-serif font-light text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">potencial</span> <br />
          <span className="italic font-serif font-light text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">profesional</span>
        </h1>

        <p className="text-slate-200 text-base sm:text-lg max-w-2xl leading-relaxed drop-shadow-md">
          Un entorno de alta precisión diseñado para líderes visionarios. Descubre la estrategia definitiva para escalar tu carrera hacia el nivel de élite global.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/login" className="w-full sm:w-auto">
            {/* BOTÓN CTA OPTIMIZADO: Pasa a tener un brillo de acento Violeta/Neón con texto nítido */}
            <button className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] active:scale-95 border border-purple-400/40">
              EMPIEZA A PULIR TU FUTURO
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* 3. TARJETAS INFERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-16 md:mt-24 text-left z-10">

        {/* TARJETA 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md hover:border-purple-500/50 transition-all group shadow-2xl hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          {/* Cajas de iconos con brillo y mejor visibilidad */}
          <div className="p-3 w-fit rounded-xl bg-purple-950/60 border border-purple-500/40 mb-4 text-purple-300 group-hover:text-white group-hover:bg-purple-900/80 group-hover:border-purple-400 transition-all shadow-inner">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif font-medium text-white mb-2">Descubre tu Vocación</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Análisis profundo de tus capacidades intrínsecas mediante psicometría avanzada y mentoría estratégica personalizada.
          </p>
        </div>

        {/* TARJETA 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md hover:border-purple-500/50 transition-all group shadow-2xl hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <div className="p-3 w-fit rounded-xl bg-purple-950/60 border border-purple-500/40 mb-4 text-purple-300 group-hover:text-white group-hover:bg-purple-900/80 group-hover:border-purple-400 transition-all shadow-inner">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif font-medium text-white mb-2">Evalúa tu Nivel</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Benchmark ejecutivo frente a los estándares de la industria global. Mapeo de brechas y oportunidades de alto impacto.
          </p>
        </div>

        {/* TARJETA 3 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md hover:border-purple-500/50 transition-all group shadow-2xl hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <div className="p-3 w-fit rounded-xl bg-purple-950/60 border border-purple-500/40 mb-4 text-purple-300 group-hover:text-white group-hover:bg-purple-900/80 group-hover:border-purple-400 transition-all shadow-inner">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif font-medium text-white mb-2">Forja tu Legado</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Diseño de un plan de carrera vitalicio que garantiza relevancia, influencia y un impacto duradero en tu sector.
          </p>
        </div>

      </div>

      {/* 4. DERECHOS DE AUTOR */}
      <footer className="w-full pt-12 pb-4 z-10">
        <p className="text-center text-slate-400 text-xs sm:text-sm">
          © 2026 MeVocatio. Elite Professional Development. Transformando el potencial en legado.
        </p>
      </footer>
    </main>
  );
}