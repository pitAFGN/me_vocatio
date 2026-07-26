"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft, LayoutDashboard, Compass, Award, Settings,
  Lock, Star, Flame, Target, Rocket, Trophy, BadgeCheck
} from "lucide-react";
import { useProtectedRoute } from "@/hooks/useRouteGuard";

const INSIGNIAS = [
  { id: 1, nombre: "Primer Paso", desc: "Completaste tu primer diagnóstico vocacional.", icon: <Star className="w-6 h-6" />, lograda: true },
  { id: 2, nombre: "Explorador", desc: "Revisaste 3 trayectorias profesionales distintas.", icon: <Compass className="w-6 h-6" />, lograda: true },
  { id: 3, nombre: "Racha Activa", desc: "Ingresaste al portal 5 días seguidos.", icon: <Flame className="w-6 h-6" />, lograda: false },
  { id: 4, nombre: "Enfoque Total", desc: "Obtuviste más de 80% de compatibilidad en un diagnóstico.", icon: <Target className="w-6 h-6" />, lograda: false },
  { id: 5, nombre: "Despegue", desc: "Confirmaste tu primera vocación activa.", icon: <Rocket className="w-6 h-6" />, lograda: true },
  { id: 6, nombre: "Perfil Pulido", desc: "Completaste el 100% de tu configuración de perfil.", icon: <BadgeCheck className="w-6 h-6" />, lograda: false },
];

export default function Insignias() {
  const router = useRouter();
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-widest">
        Verificando acceso...
      </div>
    );
  }

  const logradas = INSIGNIAS.filter((i) => i.lograda).length;

  return (
    <div className="min-h-screen bg-[#e5e7eb] text-slate-800 font-sans flex">

      <main className="max-w-3xl mx-auto w-full p-6 md:p-10 pt-32">

        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-300 pb-6">
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
              Reconocimientos
            </span>
            <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight flex items-center gap-3">
              <Trophy className="w-7 h-7" /> Mis Insignias
            </h1>
          </div>

          <div className="bg-[#1e293b] border border-slate-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md">
            {logradas} / {INSIGNIAS.length} Logradas
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {INSIGNIAS.map((ins) => (
            <div
              key={ins.id}
              className={`p-6 rounded-2xl border shadow-sm transition-all ${
                ins.lograda
                  ? "bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md"
                  : "bg-slate-100 border-slate-200 opacity-70"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                ins.lograda ? "bg-[#1e293b] text-white" : "bg-slate-200 text-slate-400"
              }`}>
                {ins.lograda ? ins.icon : <Lock className="w-5 h-5" />}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{ins.nombre}</h3>
              <p className="text-xs leading-relaxed text-slate-500 font-medium mb-4">{ins.desc}</p>
              <div className={`text-[10px] font-black uppercase tracking-wider ${
                ins.lograda ? "text-[#1e293b]" : "text-slate-400"
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
