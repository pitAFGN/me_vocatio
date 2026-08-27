"use client";

import { Trophy, X } from "lucide-react";

const achievementNames = {
  first_diagnostic: "Diagnóstico Completado",
  first_resource: "Creador de Recursos",
  explorer: "Explorador Vocacional",
  email_verified: "Primer Paso",
  premium_member: "Impulso Premium",
  focused: "Enfoque Total",
};

export default function AchievementToast({ achievementCodes, onClose }) {
  if (!achievementCodes.length) return null;

  return (
    <aside
      role="status"
      className="fixed bottom-6 right-6 z-50 flex w-[min(20rem,calc(100vw-3rem))] max-w-sm items-start gap-3 rounded-2xl border border-amber-400/40 bg-slate-900 p-4 text-white shadow-2xl"
    >
      <Trophy className="mt-0.5 h-6 w-6 shrink-0 text-amber-300" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
          ¡Nuevo logro desbloqueado!
        </p>
        <p className="mt-1 text-sm font-bold">
          {achievementCodes.map((code) => achievementNames[code] || code).join(", ")}
        </p>
        <p className="mt-1 text-xs text-slate-400">Revisa tu progreso en Insignias.</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
