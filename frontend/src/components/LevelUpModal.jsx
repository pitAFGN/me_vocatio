"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function LevelUpModal({ isOpen, level, onClose }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Generar partículas aleatorias para la explosión
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        angle: Math.random() * Math.PI * 2,
        distance: 100 + Math.random() * 150,
        size: 4 + Math.random() * 6,
        duration: 0.8 + Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Fondo oscuro con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
          />

          {/* Contenedor Principal del Modal */}
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-md bg-slate-900/90 border border-purple-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col items-center"
          >
            {/* Glows de fondo dentro del modal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-[40px] pointer-events-none" />

            {/* Partículas de explosión */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(p.angle) * p.distance,
                  y: Math.sin(p.angle) * p.distance,
                  scale: 1,
                  opacity: 0,
                }}
                transition={{ duration: p.duration, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.id % 2 === 0 ? "#22d3ee" : "#a855f7",
                  boxShadow: `0 0 10px ${p.id % 2 === 0 ? "#22d3ee" : "#a855f7"}`,
                }}
              />
            ))}

            {/* El Hexágono Central */}
            <motion.div
              initial={{ rotate: -90, scale: 0.5 }}
              animate={{ rotate: 45, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="relative w-28 h-28 bg-slate-950 border-2 border-cyan-400 flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.5)] z-10 mb-6"
            >
              <motion.div
                animate={{ rotate: -45 }}
                className="flex flex-col items-center justify-center"
              >
                <Zap className="w-8 h-8 text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {level}
                </span>
              </motion.div>
            </motion.div>

            {/* Textos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="z-10 w-full"
            >
              <h2 className="text-sm font-black text-purple-400 tracking-[0.3em] uppercase mb-2">
                ¡Felicitaciones!
              </h2>
              <h1 className="text-3xl font-bold text-white mb-4">
                ¡Has subido de nivel!
              </h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Has alcanzado el <span className="text-cyan-400 font-semibold">Nivel {level}</span>. Sigue completando actividades y explorando carreras para continuar creciendo.
              </p>

              {/* Botón de Volver / Continuar */}
              <button
                onClick={onClose}
                className="w-full relative group overflow-hidden rounded-xl bg-slate-800 p-[1px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-[shimmerPulse_2s_linear_infinite]" />
                <div className="relative bg-slate-900/90 backdrop-blur-md px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors group-hover:bg-slate-900/70">
                  <span className="font-bold text-white tracking-wider uppercase text-sm">
                    Continuar
                  </span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

