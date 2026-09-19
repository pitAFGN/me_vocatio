import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";
import BackgroundStarsDiferidas from "@/components/BackgroundStarsDiferidas";
import LandingDiamante from "@/components/landing/LandingDiamante";
import { Search, BarChart3, Award, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Descubre tu vocación",
    description:
      "Una prueba corta analiza tu personalidad, tus gustos y tus talentos para mostrarte las carreras donde mejor encajas.",
  },
  {
    icon: BarChart3,
    title: "Mide tu nivel",
    description:
      "Compara tus habilidades con las que exige cada profesión y enfócate en lo que de verdad te falta para alcanzar tu meta.",
  },
  {
    icon: Award,
    title: "Construye tu futuro",
    description:
      "Sigue un plan claro y paso a paso para crecer en tu carrera y construir el futuro profesional que quieres.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 dark:bg-none dark:bg-gradient-to-b dark:from-[#0b1329] dark:via-[#0f172a] dark:to-[#080d1a] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-between px-4 sm:px-6 py-6 md:py-8 overflow-x-hidden transition-colors duration-500">

      {/* BRILLITOS / ESTRELLITAS EN TODO EL FONDO (Z-0) - Se montan de forma diferida */}
      <BackgroundStarsDiferidas />

      {/* DETALLES DECORATIVOS FONDO LIGHT MODE (Z-0) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px] dark:hidden pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-blue-200/30 blur-[100px] dark:hidden pointer-events-none -z-10" />

      {/* SECCIÓN HERO COMPACTA (Z-10) */}
      <div className="z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto mt-2 sm:mt-6">

        {/* 1. TÍTULO PRINCIPAL */}
        <h1 className="text-4xl sm:text-[3.5rem] font-medium tracking-tight leading-[1.05] text-[#0f172a] dark:text-white drop-shadow-sm dark:drop-shadow-sm">
          Pulimos tu{" "}
          <span className="italic font-serif font-light text-[#7e22ce] dark:text-white dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            potencial
          </span>{" "}
          <br className="hidden sm:block" />
          <span className="font-semibold text-[#0f172a] dark:italic dark:font-serif dark:font-light dark:text-white dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            profesional
          </span>
        </h1>

        {/* 2. DIAMANTE 3D */}
        <LandingDiamante />

        {/* 3. TEXTO DESCRIPTIVO */}
        <p className="text-slate-600 dark:text-slate-200 text-[13px] sm:text-sm md:text-[15px] max-w-lg leading-relaxed bg-white/40 dark:bg-slate-950/30 backdrop-blur-xl py-3 px-6 rounded-2xl dark:rounded-xl border border-white/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] dark:border-white/5 dark:shadow-sm mb-6 sm:mb-8">
          Un entorno de alta precisión diseñado para líderes visionarios. Descubre la estrategia definitiva para escalar tu carrera hacia el nivel de élite global.
        </p>

        {/* 4. BOTÓN CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto z-20">
          <Link
            href="/login"
            className="w-full sm:w-auto px-9 py-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 dark:from-purple-600 dark:via-indigo-600 dark:to-blue-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl dark:rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(109,40,217,0.4)] dark:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_12px_24px_-6px_rgba(109,40,217,0.5)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 dark:hover:scale-[1.02] active:scale-95 border border-purple-500/30 dark:border-purple-400/40"
          >
            EMPIEZA A PULIR TU FUTURO
            <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
          </Link>
        </div>
      </div>

      {/* 5. TARJETAS INFERIORES (Z-10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full max-w-5xl mt-12 md:mt-16 text-left z-10">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group relative p-6 sm:p-7 h-full flex flex-col bg-white/70 dark:bg-slate-900/80 rounded-[1.5rem] dark:rounded-2xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl hover:border-purple-200 dark:hover:border-purple-500/50 transition-all duration-300 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)] dark:shadow-2xl hover:shadow-[0_16px_40px_-8px_rgba(109,40,217,0.12)] dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-1 dark:hover:translate-y-0 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 dark:hidden transition-opacity duration-500" />

            <div className="p-3 w-fit rounded-xl bg-[#f5f3ff] dark:bg-purple-950/60 border border-[#ede9fe] dark:border-purple-500/40 mb-4 text-[#7e22ce] dark:text-purple-300 group-hover:text-white group-hover:bg-[#7e22ce] dark:group-hover:bg-purple-900/80 group-hover:border-purple-500 dark:group-hover:border-purple-400 transition-colors duration-300 shadow-sm dark:shadow-inner">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-[1.05rem] font-medium tracking-tight text-[#0f172a] dark:text-white mb-2 font-sans dark:font-serif">
              {title}
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-300 leading-relaxed flex-grow">
              {description}
            </p>
          </div>
        ))}
      </div>

      {/* 6. FOOTER (Z-10) */}
      <PublicFooter />
    </main>
  );
}