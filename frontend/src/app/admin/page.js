"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminRoute } from "@/hooks/useRouteGuard";
import { useAuth } from "@/hooks/useAuth";
import SidebarNav from "@/components/SidebarNav";
import LoadingScreen from "@/components/LoadingScreen";
import { API_URL } from "@/lib/constants";

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { loading, user } = useAdminRoute();
  
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchStats();
    }
  }, [loading, user]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("mevocatio_access_token")}` // if applicable, although cookies might be used
        },
        credentials: "include"
      });
      if (!res.ok) throw new Error("No se pudieron cargar las estadísticas");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <SidebarNav logout={logout} />
      <main className="md:pl-64 pt-6 sm:pt-8 px-4 sm:px-6 md:px-10 pb-16 relative z-10 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Panel de Administrador
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Bienvenido, {user.name}. Aquí puedes ver las métricas de la plataforma.
            </p>
          </header>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">Total Usuarios</h3>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">Usuarios Premium</h3>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{stats.premiumUsers}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">Usuarios Verificados</h3>
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{stats.verifiedUsers}</p>
              </div>
            </div>
          ) : (
            !error && <p className="text-slate-600 dark:text-slate-400">Cargando métricas...</p>
          )}
        </div>
      </main>
    </>
  );
}
