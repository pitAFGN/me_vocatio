"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import { VOCATION_GROUPS, getVocationsForGroup } from "@/lib/vocationGroups";
import { API_URL } from "@/lib/constants";
import { authService } from "@/services/auth.service";

import LoadingScreen from "@/components/LoadingScreen";
import SidebarNav from "@/components/SidebarNav";
import DashboardHome from "@/components/DashboardHome";
import LevelUpModal from "@/components/LevelUpModal";

const PlanSelectionModal = dynamic(
  () => import("@/components/PlanSelectionModal"),
  { ssr: false }
);

export default function ExecutiveDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { user, loading } = useProtectedRoute();

  const [mostrarPlanModal, setMostrarPlanModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user && user.plan !== 'premium') {
      const modalVisto = localStorage.getItem("mevocatio_plan_modal_seen");
      if (!modalVisto) {
        setMostrarPlanModal(true);
      }
    }
  }, [user]);

  const handlePlanSelect = () => {
    localStorage.setItem("mevocatio_plan_modal_seen", "true");
    setMostrarPlanModal(false);
  };

  const [profileData, setProfileData] = useState({
    name: "Cargando...",
    tier: "Full Stack Developer", // Dummy por ahora
    location: "Medellín, Colombia",
    xp: 0,
    level: 1,
    current_streak: 0,
    role: null
  });

  const fetchUser = async () => {
    try {
      const userData = await authService.me();
      if (userData && userData.user) {
        setProfileData(prev => ({
          ...prev,
          name: userData.user.name,
          xp: userData.user.xp || 0,
          level: userData.user.level || 1,
          current_streak: userData.user.current_streak || 0,
          role: userData.user.role || null
        }));
      }
    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };

  useEffect(() => {
    if (!loading) fetchUser();
  }, [loading]);

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(1);

  const handleAddXp = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/add-xp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ xpToAdd: 500 })
      });
      
      const data = await res.json();
      if (data.success) {
        setProfileData(prev => ({
          ...prev,
          xp: data.xp,
          level: data.level
        }));

        if (data.leveledUp) {
          setLevelUpData(data.level);
          setIsLevelUpModalOpen(true);
        }

        if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
          window.dispatchEvent(
            new CustomEvent("achievement-unlocked", { detail: data.unlockedAchievements })
          );
        }
      }
    } catch (err) {
      console.error("Error adding XP", err);
    }
  };

  // Grupos visibles según la barra de búsqueda
  const visibleGroups = (() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return VOCATION_GROUPS.map((g) => g.id);

    return VOCATION_GROUPS.filter((group) =>
      getVocationsForGroup(group.id).some((v) =>
        [v.title, v.area, v.desc, v.detalle, v.competencias]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q))
      )
    ).map((group) => group.id);
  })();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <SidebarNav logout={logout} />

      <main className="md:pl-64 pt-6 sm:pt-8 px-4 sm:px-6 md:px-10 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">

          <header className="flex justify-between items-start gap-4 mb-8 sm:mb-10">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                Bienvenido,
              </h1>
              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-200 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent truncate">
                {profileData.name}
              </p>
            </div>

          </header>

          <DashboardHome
            profileData={profileData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            groups={visibleGroups}
            router={router}
            handleAddXp={handleAddXp}
          />

          <LevelUpModal 
            isOpen={isLevelUpModalOpen} 
            level={levelUpData} 
            onClose={() => setIsLevelUpModalOpen(false)} 
          />



        </div>
      </main>

      {mostrarPlanModal && (
        <PlanSelectionModal onSelect={handlePlanSelect} />
      )}
    </>
  );
}