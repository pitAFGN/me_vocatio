"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Compass, ExternalLink, Activity, BookOpen } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";
import { API_URL } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export default function MisRutasPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/evaluations`, {
          credentials: "include"
        });
        
        if (!response.ok) throw new Error("Error al obtener las rutas desbloqueadas");
        
        const json = await response.json();
        if (json.success && json.data) {
          setEvaluations(json.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvaluations();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 min-h-screen relative overflow-x-hidden">
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full pointer-events-none bg-indigo-500/10 blur-[100px]" />
      <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full pointer-events-none bg-purple-500/10 blur-[100px]" />

      <SidebarNav logout={logout} />

      <main className="md:pl-64 pt-6 sm:pt-8 px-4 sm:px-6 md:px-10 pb-16 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <Compass className="w-8 h-8 text-indigo-500" />
              Mis Rutas de Aprendizaje
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Elige una de las vocaciones que ya has explorado en tus tests diagnósticos para continuar tu ruta de aprendizaje.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20">
              {error}
            </div>
          ) : evaluations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-center">
              <Activity className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tienes rutas desbloqueadas</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                Realiza un test diagnóstico primero para que la inteligencia artificial pueda crear una ruta personalizada para ti.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
              >
                Ir al Panel Principal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluations.map((evalData) => (
                <div 
                  key={evalData.id}
                  onClick={() => router.push(`/recomendacion?profesion=${encodeURIComponent(evalData.profession_title)}&nivel=${encodeURIComponent(evalData.level)}&evaluation_id=${evalData.id}`)}
                  className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                      {evalData.profession_title}
                    </h3>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-4 border border-slate-200 dark:border-slate-700">
                      Nivel: {evalData.level}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                    <span>Continuar Ruta</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

