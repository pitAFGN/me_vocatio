"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const BackgroundStars = dynamic(
  () => import("@/components/ThreeScene").then((m) => m.BackgroundStars),
  { ssr: false }
);

export default function AuthBanner({ esRegistro }) {
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStars(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#080d1a] justify-center border-r border-slate-300 dark:border-white/10 pt-[128px] overflow-hidden transition-colors duration-300">
      {showStars && <BackgroundStars />}

      <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-purple-600/20 via-indigo-500/15 to-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-0 animate-pulse" />

      <div className="relative z-20 w-full max-w-xl flex flex-col items-center text-center px-12">
        <div className="mb-6 italic font-black text-white">
          <Image
            src="/mevocatio.png"
            alt="Logo MeVocatio"
            width={650}
            height={250}
            priority
            className="brightness-0 invert object-contain h-48 w-auto transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-black leading-[1.1] mb-4 tracking-tighter uppercase italic text-white max-w-md drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {esRegistro ? "El diamante eres tú, lúcelo" : "Sigue puliendo tu profesión"}
          </h2>
          <p className="text-base text-slate-300 font-light max-w-sm leading-snug">
            {esRegistro
              ? "Crea tu perfil ahora y accede a la red de talentos más exclusiva."
              : "Bienvenido de nuevo al portal donde tu carrera toma un brillo superior."}
          </p>
        </div>
      </div>
    </div>
  );
}
