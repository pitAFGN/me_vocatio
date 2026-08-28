"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFoundContent() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-200 to-slate-300 dark:from-[#b4b8c0] dark:to-[#e5e7eb] text-center px-6 transition-colors duration-300">
      <div className="w-20 h-20 rounded-2xl bg-slate-900 dark:bg-[#1e293b] text-white flex items-center justify-center mb-8 shadow-xl">
        <Compass className="w-10 h-10" />
      </div>

      <h1 className="text-7xl font-black text-slate-900 dark:text-[#1e293b] tracking-tighter mb-2">404</h1>
      <p className="text-slate-600 dark:text-slate-600 font-bold uppercase tracking-[0.3em] text-xs mb-10">
        Esta ruta se desvió de tu trayectoria
      </p>

      <Link
        href="/"
        className="bg-slate-900 dark:bg-[#1e293b] text-white px-10 py-3.5 rounded-md font-black shadow-[0_15px_30px_rgba(30,41,59,0.3)] hover:bg-slate-800 transition-all text-[11px] uppercase tracking-[0.3em] active:scale-95 border border-slate-700"
      >
        Volver al Inicio
      </Link>
    </main>
  );
}
