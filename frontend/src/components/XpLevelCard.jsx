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
      <div className="flex justify-between items-end mb-3">
        <span className="text-xs text-slate-400 tracking-wider font-semibold uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          Progreso de Nivel
        </span>
        <span className="text-lg text-cyan-400 font-bold">
          {animatedXp} / {xpNeededForLevel} XP
        </span>
      </div>

      {/* Energy Core Bar */}
      <div className="relative h-4 w-full bg-slate-900 rounded-full overflow-visible mb-8 border border-slate-700/50 shadow-inner">
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
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] z-10 rotate-45 group">
          <span className="text-white font-black text-sm -rotate-45 group-hover:scale-110 transition-transform">
            L{level}
          </span>
        </div>

        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center z-10 rotate-45 opacity-60">
          <span className="text-slate-400 font-bold text-xs -rotate-45">
            L{level + 1}
          </span>
        </div>
      </div>
    </div>
  );
}

