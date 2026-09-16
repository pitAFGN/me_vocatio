import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase
} from "lucide-react";
import { VOCATION_GROUPS, getVocationsForGroup } from "@/lib/vocationGroups";
import { obtenerChipDemanda, obtenerChipNivel } from "@/lib/professionThemes";
import FavoriteVocationButton from "@/components/FavoriteVocationButton";

export function generateStaticParams() {
  return VOCATION_GROUPS.map((group) => ({ grupo: group.id }));
}

export async function generateMetadata({ params }) {
  const { grupo } = await params;
  const group = VOCATION_GROUPS.find((g) => g.id === grupo);

  if (!group) {
    return {
      title: "Categoría no encontrada | MeVocatio",
      description: "La categoría de vocaciones que buscas no existe o fue movida."
    };
  }

  const vocaciones = getVocationsForGroup(group.id);
  const nombres = vocaciones.map((v) => v.title).join(", ");

  return {
    title: `${group.label} | MeVocatio`,
    description: `${group.subtitle || "Categoría de vocaciones."} ${nombres}.`
  };
}

export default async function VocacionesPorCategoria({ params }) {
  const { grupo } = await params;
  const group = VOCATION_GROUPS.find((g) => g.id === grupo);

  if (!group) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0b1329] flex flex-col items-center justify-center p-6 text-center text-slate-900 dark:text-white font-sans">
        <h1 className="text-2xl font-bold mb-2">Categoría no encontrada</h1>
        <p className="text-indigo-600 dark:text-indigo-200/70 text-sm mb-6">
          La categoría que buscas no existe o fue movida.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          Volver
        </Link>
      </main>
    );
  }

  const vocaciones = getVocationsForGroup(group.id);
  const IconoGrupo = group.icon;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1329] p-6 sm:p-8 pt-24 relative overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Luces decorativas */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Botón de retorno */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-950 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          Volver
        </Link>

        {/* Hero de la categoría */}
        <div className="rounded-3xl shadow-2xl mb-8 overflow-hidden border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900/60">
          {/* Banner gradiente */}
          <div className={`relative h-28 sm:h-36 p-6 sm:p-8 overflow-hidden bg-gradient-to-br ${group.gradient}`}>
            <IconoGrupo className="absolute -right-8 -top-8 w-44 h-44 text-white opacity-15 pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0a0b14]/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider w-fit">
                <IconoGrupo className={`w-3.5 h-3.5 ${group.colorTexto}`} />
                <span>{group.label}</span>
              </span>
              <div className="flex items-end justify-between gap-3">
                {group.subtitle && (
                  <span className="text-xs sm:text-sm text-white/80 font-medium max-w-xs">
                    {group.subtitle}
                  </span>
                )}
                <span className="px-3.5 py-1.5 rounded-full bg-[#0a0b14]/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold shrink-0">
                  {vocaciones.length} {vocaciones.length === 1 ? "vocación" : "vocaciones"}
                </span>
              </div>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {group.label}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-indigo-200/70 mt-1">
              {vocaciones.length} rutas de aprendizaje para explorar y conocer tu afinidad.
            </p>
          </div>
        </div>

        {/* Grid de vocaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vocaciones.map((vocacion) => {
            const chipDemanda = obtenerChipDemanda(vocacion.demanda);
            const chipNivel = obtenerChipNivel(vocacion.nivelRecomendado);
            const competencias = (vocacion.competencias || "")
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);
            const slug = vocacion.slug || vocacion.id;

            return (
              <div
                key={vocacion.id}
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-indigo-950 rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-violet-500/10 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {vocacion.title}
                      </h2>
                      <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                        {vocacion.area}
                      </span>
                    </div>
                    <FavoriteVocationButton vocacion={vocacion} />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {vocacion.desc}
                  </p>

                  {vocacion.detalle && (
                    <p className="text-xs text-slate-500 dark:text-indigo-100/80 leading-relaxed line-clamp-3">
                      {vocacion.detalle}
                    </p>
                  )}

                  {/* Chips de demanda y nivel */}
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

                  {/* Competencias */}
                  {competencias.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold text-xs">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <h3>Competencias Clave</h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {competencias.map((competencia, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold"
                          >
                            {competencia}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
                  <Link
                    href={`/diagnostico/${slug}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/25 cursor-pointer flex-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    Iniciar Test IA
                  </Link>
                  <Link
                    href={`/vocacion/${slug}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:bg-violet-100 dark:hover:bg-violet-600/20 hover:border-violet-500/60 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm cursor-pointer flex-1"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    Ver Módulo
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}