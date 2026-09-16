"use client";

import Link from "next/link";
import { VOCATION_GROUPS, getVocationsForGroup } from "@/lib/vocationGroups";
import { ArrowRight } from "lucide-react";

export default function VocationGroupCard({ groupId }) {
  const group = VOCATION_GROUPS.find((g) => g.id === groupId);
  const vocaciones = getVocationsForGroup(groupId);

  if (!group || vocaciones.length === 0) return null;

  const IconoGrupo = group.icon;

  return (
    <Link
      href={`/vocaciones/${group.id}`}
      className="group block relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1222] shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]"
    >
      {/* Banner gradiente */}
      <div className={`relative h-28 sm:h-32 p-5 overflow-hidden bg-gradient-to-br ${group.gradient}`}>
        <IconoGrupo className="absolute -right-5 -top-5 w-32 h-32 text-white opacity-15 pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0b14]/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider w-fit">
            <IconoGrupo className={`w-3.5 h-3.5 ${group.colorTexto}`} />
            <span>{group.label}</span>
          </span>

          <div className="flex items-end justify-between">
            {group.subtitle && (
              <span className="text-[10px] text-white/70 font-medium max-w-[160px]">
                {group.subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div>
          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-200 transition-colors">
            {vocaciones.length} {vocaciones.length === 1 ? "vocación" : "vocaciones"}
          </span>
          <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {vocaciones.map((v) => v.title).join(" · ")}
          </span>
        </div>

        <span className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 dark:group-hover:bg-violet-600/20 group-hover:text-white group-hover:border-violet-500 transition-all">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}