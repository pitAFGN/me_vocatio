"use client";

import React, { useEffect, useState } from "react";
import { Zap, Flame, Award } from "lucide-react";

// Helpers de progresión progresiva (+200 XP por cada nivel)
const BASE_XP = 1000;
const INCREMENT_PER_LEVEL = 200;

const getXpNeededForLevel = (lvl) => BASE_XP + (lvl - 1) * INCREMENT_PER_LEVEL;

const getCumulativeXpForLevel = (lvl) => {
  let total = 0;
  for (let i = 1; i < lvl; i++) {
    total += getXpNeededForLevel(i);
  }
  return total;
};

export default function XpLevelCard({ xp = 0, level = 1 }) {
  const [animatedXp, setAnimatedXp] = useState(0);

  const baseXP = getCumulativeXpForLevel(level);
  const xpNeededForLevel = getXpNeededForLevel(level);
  const currentLevelProgressXP = Math.max(0, xp - baseXP);
  const remainingXP = Math.max(0, xpNeededForLevel - currentLevelProgressXP);
  const progressPercent = Math.min(100, Math.max(0, (currentLevelProgressXP / xpNeededForLevel) * 100));

  // Animación suave de la barra al cargar
  const [fillPercent, setFillPercent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFillPercent(progressPercent);
      setAnimatedXp(currentLevelProgressXP);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercent, currentLevelProgressXP]);

  return (
    <div className="mt-8">
      {/* Encabezado: etiqueta + progreso numérico */}
      <div className="flex items-center justify-between gap-3 mb-7">
        <span className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 tracking-wider font-semibold uppercase">
          <span className="w-7 h-7 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 dark:border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.25)]">
            <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </span>
          Progreso de Nivel
        </span>

        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-300 text-[11px] font-black">
            {Math.round(fillPercent)}%
          </span>
          <span className="text-lg text-cyan-600 dark:text-cyan-400 font-bold leading-none">
            {animatedXp} <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">/ {xpNeededForLevel} XP</span>
          </span>
        </div>
      </div>

      {/* Energy Core Bar */}
      <div className="relative h-5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-visible mb-4 border border-slate-300 dark:border-slate-700/50 shadow-inner">
        {/* Glow effect container */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${fillPercent}%` }}>
          {/* Inner particle shimmer */}
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmerPulse_2s_infinite]"></div>

          {/* Glow shadow */}
          <div className="absolute inset-0 blur-md bg-purple-500/40 rounded-full"></div>
        </div>

        {/* Level Badges */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border-2 border-cyan-500 dark:border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] z-10 rotate-45 group">
          <span className="text-slate-900 dark:text-white font-black text-sm -rotate-45 group-hover:scale-110 transition-transform">
            L{level}
          </span>
        </div>

        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center z-10 rotate-45 opacity-60">
          <span className="text-slate-600 dark:text-slate-400 font-bold text-xs -rotate-45">
            L{level + 1}
          </span>
        </div>
      </div>

      {/* Fila informativa */}
      <div className="flex items-center justify-between mt-4 pl-12">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          Te faltan <strong className="text-cyan-600 dark:text-cyan-300">{remainingXP} XP</strong> para subir de nivel
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <Award className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
          Nivel {level + 1}
        </span>
      </div>
    </div>
  );
}