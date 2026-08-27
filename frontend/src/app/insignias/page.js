"use client";

import { useRouter } from "next/navigation";
import {
  Lock, Star, Flame, Target, Rocket, Trophy, BadgeCheck, Compass, ArrowLeft
} from "lucide-react";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import SidebarNav from "@/components/SidebarNav";
import { useAuth } from "@/hooks/useAuth";

const INSIGNIAS = [
  { id: 1, nombre: "Primer Paso", desc: "Completaste tu primer diagnóstico vocacional.", icon: <Star className="w-6 h-6 text-yellow-400" />, lograda: true },
  { id: 2, nombre: "Explorador", desc: "Revisaste 3 trayectorias profesionales distintas.", icon: <Compass className="w-6 h-6 text-indigo-400" />, lograda: true },
  { id: 3, nombre: "Racha Activa", desc: "Ingresaste al portal 5 días seguidos.", icon: <Flame className="w-6 h-6 text-orange-400" />, lograda: false },
  { id: 4, nombre: "Enfoque Total", desc: "Obtuviste más de 80% de compatibilidad en un diagnóstico.", icon: <Target className="w-6 h-6 text-emerald-400" />, lograda: false },
  { id: 5, nombre: "Despegue", desc: "Confirmaste tu primera vocación activa.", icon: <Rocket className="w-6 h-6 text-purple-400" />, lograda: true },
  { id: 6, nombre: "Perfil Pulido", desc: "Completaste el 100% de tu configuración de perfil.", icon: <BadgeCheck className="w-6 h-6 text-blue-400" />, lograda: false },
];

export default function Insignias() {
  const router = useRouter();
  const { loading } = useProtectedRoute();
  const { logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0b14] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm transition-colors duration-300">
        Verificando acceso...
      </div>
    );
  }

  const logradas = INSIGNIAS.filter((i) => i.lograda).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14] text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      {/* Barra lateral fija */}
      <SidebarNav logout={logout} />

      {/* Contenido Principal con el padding correcto para la sidebar */}
      <main className="md:pl-64 max-w-5xl mx-auto w-full p-6 md:p-10 pt-12">

        {/* Botón de retorno al Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </button>

        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-1">
              Reconocimientos
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Trophy className="w-7 h-7 text-indigo-500 dark:text-indigo-400" /> Mis Insignias
            </h1>
          </div>

          <div className="bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg">
            {logradas} / {INSIGNIAS.length} Logradas
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {INSIGNIAS.map((ins) => (
            <div
              key={ins.id}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between ${ins.lograda
                ? "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:border-indigo-500/40"
                : "bg-slate-100 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-60"
                }`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${ins.lograda
                  ? "bg-indigo-100 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
                  : "bg-slate-200 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600"
                  }`}>
                  {ins.lograda ? ins.icon : <Lock className="w-5 h-5" />}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{ins.nombre}</h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium mb-6">{ins.desc}</p>
              </div>

              <div className={`text-[10px] font-bold uppercase tracking-wider ${ins.lograda ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"
                }`}>
                {ins.lograda ? "Insignia Obtenida" : "Bloqueada"}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
