"use client";

import { useEffect, useState, useRef } from "react";
import { Trophy, X, Sparkles } from "lucide-react";

const achievementNames = {
  first_diagnostic: "Diagnóstico Completado",
  first_resource: "Creador de Recursos",
  explorer: "Explorador Vocacional",
  email_verified: "Primer Paso",
  premium_member: "Impulso Premium",
  focused: "Enfoque Total",
  level_5: "Iniciado Vocacional (Nvl 5)",
  level_10: "Explorador Dedicado (Nvl 10)",
  level_25: "Estratega de Carrera (Nvl 25)",
  level_50: "Maestro de Vocación (Nvl 50)",
};

export default function AchievementToast({ achievementCodes, onClose, duration = 4500 }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
      setIsExiting(false);
    }, 450); // Tiempo para la animación de salida
  };

  useEffect(() => {
    if (achievementCodes && achievementCodes.length > 0) {
      setIsExiting(false);
      // Pequeño delay para activar la animación de entrada suave
      const mountTimer = setTimeout(() => setIsMounted(true), 50);

      // Temporizador para auto-desaparecer
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(mountTimer);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else {
      setIsMounted(false);
    }
  }, [achievementCodes, duration]);

  if (!achievementCodes || !achievementCodes.length) return null;

  return (
    <aside
      role="status"
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        timerRef.current = setTimeout(handleClose, 2500);
      }}
      className={`fixed bottom-6 right-6 z-50 flex w-[min(22rem,calc(100vw-3rem))] max-w-sm flex-col rounded-2xl border border-amber-400/40 bg-[#0c1222]/95 backdrop-blur-2xl text-white shadow-2xl shadow-amber-500/10 overflow-hidden transition-all duration-500 ease-out transform ${
        isMounted && !isExiting
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-[120%] opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex items-start gap-3.5 p-4">
        {/* Icono con resplandor */}
        <div className="relative shrink-0 mt-0.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
            <Trophy className="h-5 w-5 text-amber-300 animate-bounce" aria-hidden="true" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        </div>

        {/* Textos del Logro */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
              ¡Logro desbloqueado!
            </span>
          </div>
          <h4 className="text-sm font-bold text-white truncate leading-tight">
            {achievementCodes.map((code) => achievementNames[code] || code).join(", ")}
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Revisa tu nuevo progreso en <span className="text-amber-300 font-semibold">Insignias</span>.
          </p>
        </div>

        {/* Botón Cerrar Manual */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar notificación"
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer shrink-0"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Barra de progreso de tiempo restante */}
      <div className="h-1 w-full bg-amber-950/40 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"
          style={{
            animation: `toastCountdown ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes toastCountdown {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </aside>
  );
}
