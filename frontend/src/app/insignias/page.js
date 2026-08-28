"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock, Star, Flame, Target, Rocket, Trophy, BadgeCheck, Compass, ArrowLeft
} from "lucide-react";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import SidebarNav from "@/components/SidebarNav";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/lib/constants";

const ICONS = { "badge-check": BadgeCheck, star: Star, flame: Flame, target: Target, rocket: Rocket, compass: Compass };

export default function Insignias() {
  const router = useRouter();
  const { loading } = useProtectedRoute();
  const { logout } = useAuth();
  const [insignias, setInsignias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.removeItem("mevocatio_new_achievements");
    if (loading) return;
    fetch(`${API_URL}/api/achievements`, {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.dispatchEvent(new Event("local-storage-update"));
          }
          throw new Error(data.message || data.error || "No se pudieron cargar las insignias");
        }
        setInsignias(data);
      })
      .catch((requestError) => setError(requestError.message));
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b14] text-indigo-400 font-bold uppercase tracking-widest text-sm">
        Verificando acceso...
      </div>
    );
  }

  const logradas = insignias.filter((insignia) => insignia.earned).length;

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100 flex">
      {/* Barra lateral fija */}
      <SidebarNav logout={logout} />

      {/* Contenido Principal con el padding correcto para la sidebar */}
      <main className="md:pl-64 max-w-5xl mx-auto w-full p-6 md:p-10 pt-12">

        {/* Botón de retorno al Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </button>

        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
              Reconocimientos
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Trophy className="w-7 h-7 text-indigo-400" /> Mis Insignias
            </h1>
          </div>

          <div className="bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg">
            {logradas} / {insignias.length} Logradas
          </div>
        </header>

        {error && <p className="mb-6 text-sm text-red-300">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {insignias.map((ins) => {
            const Icon = ICONS[ins.icon] || Trophy;
            return (
            <div
              key={ins.code}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between ${ins.earned
                ? "bg-white/5 border-white/10 hover:-translate-y-1 hover:border-indigo-500/40"
                : "bg-white/[0.02] border-white/5 opacity-60"
                }`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${ins.earned
                  ? "bg-indigo-950/80 border-indigo-500/30 text-indigo-300"
                  : "bg-slate-900/50 border-slate-800 text-slate-600"
                  }`}>
                  {ins.earned ? <Icon className="w-6 h-6 text-indigo-400" /> : <Lock className="w-5 h-5" />}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{ins.name}</h3>
                <p className="text-xs leading-relaxed text-slate-400 font-medium mb-6">{ins.description}</p>
              </div>

              <div className={`text-[10px] font-bold uppercase tracking-wider ${ins.earned ? "text-indigo-400" : "text-slate-600"
                }`}>
                {ins.earned ? "Insignia Obtenida" : "Bloqueada"}
              </div>
            </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}