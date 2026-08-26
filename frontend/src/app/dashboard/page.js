"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import { PROFESSIONS } from "@/app/data/professions";

import SidebarNav from "@/components/SidebarNav";
import DashboardHome from "@/components/DashboardHome";

export default function ExecutiveDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { loading } = useProtectedRoute();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [savedIds, setSavedIds] = useState([]);

  // Datos del perfil
  const [profileData] = useState({
    name: "Samuel Moreno",
    tier: "Full Stack Developer",
    location: "Medellín, Colombia"
  });

  // Filtrado de profesiones según la barra de búsqueda
  const filteredProfessions = PROFESSIONS.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (loading) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#040613] text-slate-900 dark:text-slate-100 min-h-screen relative overflow-x-hidden transition-colors duration-300">

      {/* Elementos decorativos de luz ambiental (Glow effects) de fondo */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Barra lateral fija */}
      <SidebarNav logout={logout} />

      {/* Contenedor principal adaptado para celulares y escritorios */}
      <main className="md:pl-64 pt-6 sm:pt-8 px-4 sm:px-6 md:px-10 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Header con respiro y protección contra desbordamiento */}
          <header className="flex justify-between items-start gap-4 mb-8 sm:mb-10">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                Welcome,
              </h1>
              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-200 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent truncate">
                {profileData.name}
              </p>
            </div>

            <button className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/15 transition-all cursor-pointer shadow-md dark:shadow-md hover:border-indigo-500/40 shrink-0 text-slate-700 dark:text-slate-300">
              <Bell className="w-4 h-4" />
            </button>
          </header>

          {/* Componente principal del Dashboard */}
          <DashboardHome
            profileData={profileData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            page={page}
            setPage={setPage}
            filteredProfessions={filteredProfessions}
            savedIds={savedIds}
            toggleSave={toggleSave}
            router={router}
          />

        </div>
      </main>
    </div>
  );
}