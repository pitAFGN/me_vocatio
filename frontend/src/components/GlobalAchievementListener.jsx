"use client";

import { useEffect, useState } from "react";
import AchievementToast from "./AchievementToast";

export default function GlobalAchievementListener() {
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    // 1. Escuchar eventos globales
    const handleAchievementEvent = (e) => {
      const achievements = e.detail;
      if (achievements && achievements.length > 0) {
        setNewAchievements((prev) => {
           const combined = [...new Set([...prev, ...achievements])];
           return combined;
        });
      }
    };

    window.addEventListener("achievement-unlocked", handleAchievementEvent);
    
    // 2. Revisar si hay algo en localStorage (para cuando se recarga la página o se vuelve del verify-email)
    const checkLocalStorage = () => {
      const savedAchievements = localStorage.getItem("mevocatio_new_achievements");
      if (savedAchievements) {
        try {
          const parsed = JSON.parse(savedAchievements);
          if (parsed && parsed.length > 0) {
             setNewAchievements((prev) => [...new Set([...prev, ...parsed])]);
          }
        } catch(e) {}
        localStorage.removeItem("mevocatio_new_achievements");
      }
    };
    
    // Check initial state
    checkLocalStorage();
    
    // Escuchar cambios en local storage desde otras pestañas o eventos de la misma app
    window.addEventListener("local-storage-update", checkLocalStorage);

    return () => {
      window.removeEventListener("achievement-unlocked", handleAchievementEvent);
      window.removeEventListener("local-storage-update", checkLocalStorage);
    };
  }, []);

  return (
    <AchievementToast 
       achievementCodes={newAchievements} 
       onClose={() => setNewAchievements([])}
    />
  );
}

