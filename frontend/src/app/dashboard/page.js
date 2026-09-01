"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import { useFavorites } from "@/hooks/useFavorites";
import { PROFESSIONS } from "@/app/data/professions";

import LoadingScreen from "@/components/LoadingScreen";
import SidebarNav from "@/components/SidebarNav";
import DashboardHome from "@/components/DashboardHome";
import PlanSelectionModal from "@/components/PlanSelectionModal";

export default function ExecutiveDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { loading } = useProtectedRoute();

  const [mostrarPlanModal, setMostrarPlanModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const { savedIds, toggleSave } = useFavorites();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const plan = localStorage.getItem("mevocatio_plan");
      if (!plan) {
        setMostrarPlanModal(true);
      }
    }
  }, []);

  const handlePlanSelect = (plan) => {
    localStorage.setItem("mevocatio_plan", plan);
    setMostrarPlanModal(false);
  };

  // Datos del perfil
  const [profileData, setProfileData] = useState({
    name: "",
    tier: "Full Stack Developer",
    location: "Medellín, Colombia"
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authService } = await import("@/services/auth.service");
        const res = await authService.me();
        if (res?.user) {
          setProfileData(prev => ({
            ...prev,
            name: res.user.name || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching user for dashboard:", error);
      }
    };
    if (!loading) {
      fetchUser();
    }
  }, [loading]);

  // Filtrado de profesiones según la barra de búsqueda
  const filteredProfessions = PROFESSIONS.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingScreen />;

  return (
    <>
      <SidebarNav logout={logout} />

      <main className="md:pl-64 pt-6 sm:pt-8 px-4 sm:px-6 md:px-10 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">

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

      {mostrarPlanModal && (
        <PlanSelectionModal onSelect={handlePlanSelect} />
      )}
    </>
  );
}