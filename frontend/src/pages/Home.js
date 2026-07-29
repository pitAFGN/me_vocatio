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
        =====================================================
        DIAMANTE DE FONDO: POSICIONADO DEBAJO DE "PROFESIONAL" + GIRO 360° 3D
        =====================================================
      */}
      <div className="absolute inset-0 flex justify-center pointer-events-none z-0 top-[22vh] sm:top-[20vh]">
        <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] [perspective:1000px] opacity-25">
          <div
            className="w-full h-full relative drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]"
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
          Pulimos tu <span className="italic font-serif font-light text-slate-200 hover:text-white transition-colors">potencial</span> <br />
          <span className="italic font-serif font-light text-slate-200 hover:text-white transition-colors">profesional</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed drop-shadow-md">
          Un entorno de alta precisión diseñado para líderes visionarios. Descubre la estrategia definitiva para escalar tu carrera hacia el nivel de élite global.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 text-slate-950 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg hover:shadow-slate-100/10 active:scale-95">
              EMPIEZA A PULIR TU FUTURO
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <button className="w-full sm:w-auto px-6 py-3.5 text-slate-300 text-sm font-medium flex items-center justify-center gap-1.5 hover:text-white transition-colors group">
            Ver metodología
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* 3. TARJETAS INFERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-16 md:mt-24 text-left z-10">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-all group shadow-xl">
          <div className="p-2.5 w-fit rounded-xl bg-slate-800 border border-slate-700 mb-4 text-slate-300 group-hover:text-white group-hover:border-slate-600 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif font-medium text-slate-100 mb-2">Descubre tu Vocación</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Análisis profundo de tus capacidades intrínsecas mediante psicometría avanzada y mentoría estratégica personalizada.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-all group shadow-xl">
          <div className="p-2.5 w-fit rounded-xl bg-slate-800 border border-slate-700 mb-4 text-slate-300 group-hover:text-white group-hover:border-slate-600 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif font-medium text-slate-100 mb-2">Evalúa tu Nivel</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Benchmark ejecutivo frente a los estándares de la industria global. Mapeo de brechas y oportunidades de alto impacto.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-all group shadow-xl">
          <div className="p-2.5 w-fit rounded-xl bg-slate-800 border border-slate-700 mb-4 text-slate-300 group-hover:text-white group-hover:border-slate-600 transition-colors">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif font-medium text-slate-100 mb-2">Forja tu Legado</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Diseño de un plan de carrera vitalicio que garantiza relevancia, influencia y un impacto duradero en tu sector.
          </p>
        </div>
      </div>

      {/* 4. DERECHOS DE AUTOR */}
      <footer className="w-full pt-12 pb-4 z-10">
        <p className="text-center text-slate-500 text-xs sm:text-sm">
          © 2026 MeVocatio. Elite Professional Development. Transformando el potencial en legado.
        </p>
      </footer>
    </main>
  );
}