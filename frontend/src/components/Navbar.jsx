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
      ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white border border-purple-300/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold scale-105"
      : "bg-gradient-to-r from-slate-800/90 via-[#1e293b]/80 to-[#2e1065]/60 dark:text-slate-100 text-slate-800 border border-purple-500/30 hover:border-purple-400/70 hover:from-slate-800 hover:to-[#3b0764] transition-all hover:scale-105 shadow-md hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]";
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 md:px-10 py-3 flex justify-between items-center border-b shadow-2xl backdrop-blur-md bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#0b1329] border-slate-800/80 transition-colors duration-300">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center border rounded-xl relative overflow-hidden bg-slate-900/90 border-slate-700/70 shadow-lg shrink-0">
              <Image
                src="/layout3.png"
                alt="Me Vocatio Diamond"
                width={120}
                height={120}
                className="object-contain scale-[2.3] translate-y-[0.5px]"
              />
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight bg-clip-text bg-gradient-to-r text-transparent from-white via-slate-100 to-slate-300 transition-colors truncate">
              MeVocatio
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-4 sm:px-6 md:px-10 py-3 flex justify-between items-center border-b shadow-2xl backdrop-blur-md transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#0b1329] border-slate-800/80"
          : "bg-gradient-to-r from-white via-slate-50 to-slate-100 border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div
            className={`w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center border rounded-xl relative overflow-hidden transition-all group-hover:scale-105 active:scale-95 shadow-lg shrink-0 ${
              isDarkMode
                ? "bg-slate-900/90 border-slate-700/70 group-hover:border-purple-500/50"
                : "bg-white border-slate-300 group-hover:border-purple-500"
            }`}
          >
            <Image
              src="/layout3.png"
              alt="Me Vocatio Diamond"
              width={120}
              height={120}
              className="object-contain scale-[2.3] transition-transform group-hover:scale-[2.4] translate-y-[0.5px]"
            />
          </div>

          <span
            className={`text-base sm:text-lg md:text-xl font-bold tracking-tight bg-clip-text bg-gradient-to-r transition-colors truncate ${
              isDarkMode
                ? "text-transparent from-white via-slate-100 to-slate-300"
                : "text-slate-900"
            }`}
          >
            MeVocatio
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        <button
          onClick={toggleTheme}
          className={`p-2 sm:p-2.5 rounded-full border transition-all active:scale-95 shadow-md cursor-pointer ${
            isDarkMode
              ? "bg-slate-800/80 border-purple-500/30 text-slate-300 hover:text-white hover:border-purple-400"
              : "bg-white border-slate-300 text-slate-700 hover:text-black hover:border-purple-500"
          }`}
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          )}
        </button>

        <Link
          href="/nosotros"
          className={`${getButtonStyle("/nosotros")} px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] transition-all active:scale-95 uppercase tracking-widest font-semibold shrink-0`}
        >
          NOSOTROS
        </Link>

        {!isLoggedIn || !pathname.startsWith("/dashboard") ? (
          <Link
            href="/login"
            className={`${getButtonStyle("/login")} px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] transition-all active:scale-95 uppercase tracking-widest font-semibold shrink-0`}
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
