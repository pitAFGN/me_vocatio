"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import NavbarProfile from "./NavbarProfile";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isAccessActive = pathname.startsWith("/login");

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const getButtonStyle = (path) => {
    const isActive = path === "/login" ? isAccessActive : pathname === path;
    return isActive
      ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:via-indigo-500 dark:to-blue-500 text-white border border-transparent dark:border-purple-300/50 shadow-md dark:shadow-[0_0_20px_rgba(168,85,247,0.4)] font-medium scale-105"
      : "bg-white dark:bg-gradient-to-r dark:from-slate-800/90 dark:via-[#1e293b]/80 dark:to-[#2e1065]/60 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-purple-500/30 hover:border-purple-200 dark:hover:border-purple-400/70 hover:text-purple-700 dark:hover:text-white hover:bg-slate-50 dark:hover:from-slate-800 dark:hover:to-[#3b0764] transition-all duration-300 hover:scale-[1.03] shadow-sm dark:shadow-md hover:shadow-[0_8px_15px_-3px_rgba(109,40,217,0.08)] dark:hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]";
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 md:px-10 py-2 sm:py-2.5 flex justify-between items-center border-b shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gradient-to-r dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#0b1329] border-slate-200/60 dark:border-slate-800/80 transition-colors duration-500">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
              <Image
                src="/Layout 4.png"
                alt="Me Vocatio Diamond"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text bg-gradient-to-r text-[#0f172a] dark:text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300 transition-colors truncate">
              MeVocatio
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-4 sm:px-6 md:px-10 py-2 sm:py-2.5 flex justify-between items-center border-b shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-2xl backdrop-blur-xl transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#0b1329] border-slate-800/80"
          : "bg-white/80 border-slate-200/60"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 active:scale-95 shrink-0">
            <Image
              src="/Layout 4.png"
              alt="Me Vocatio Diamond"
              width={52}
              height={52}
              className="object-contain transition-transform"
            />
          </div>

          <span
            className={`text-lg sm:text-xl font-bold tracking-tight bg-clip-text bg-gradient-to-r transition-colors truncate ${
              isDarkMode
                ? "text-transparent from-white via-slate-100 to-slate-300"
                : "text-[#0f172a]"
            }`}
          >
            MeVocatio
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          className={`p-1.5 sm:p-2 rounded-full border transition-all duration-300 active:scale-95 shadow-sm cursor-pointer ${
            isDarkMode
              ? "bg-slate-800/80 border-purple-500/30 text-slate-300 hover:text-white hover:border-purple-400"
              : "bg-white border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-200 hover:bg-slate-50 hover:shadow-[0_4px_12px_rgba(109,40,217,0.08)]"
          }`}
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          )}
        </button>

        <Link
          href="/nosotros"
          className={`${getButtonStyle("/nosotros")} px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider shrink-0`}
        >
          NOSOTROS
        </Link>

        {!isLoggedIn ? (
          <Link
            href="/login"
            className={`${getButtonStyle("/login")} px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider shrink-0`}
          >
            ACCESO
          </Link>
        ) : (
          <NavbarProfile />
        )}
      </div>
    </nav>
  );
}
