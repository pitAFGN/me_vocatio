"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NavbarProfile from "../components/NavbarProfile";
import { authService } from "@/services/auth.service";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAccessActive = pathname.startsWith("/login");
  const isPrivateZone =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/vocacion") ||
    pathname.startsWith("/configuracion") ||
    pathname.startsWith("/insignias") ||
    pathname.startsWith("/diagnostico") ||
    pathname.startsWith("/recomendacion") ||
    pathname.startsWith("/creacion_recursos");

  // Verificar la sesión para saber si pintar ACCESO
  useEffect(() => {
    localStorage.removeItem("token");

    const checkAuth = async () => {
      try {
        await authService.me();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const getButtonStyle = (path) => {
    const isActive = path === "/login" ? isAccessActive : pathname === path;
    return isActive
      ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white border border-purple-300/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold scale-105"
      : "bg-gradient-to-r from-slate-800/90 via-[#1e293b]/80 to-[#2e1065]/60 text-slate-100 border border-purple-500/30 hover:border-purple-400/70 hover:from-slate-800 hover:to-[#3b0764] transition-all hover:scale-105 shadow-md hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]";
  };

  return (
    <html lang="es">
      <body className="antialiased bg-[#0b1329] font-sans text-slate-100" suppressHydrationWarning>

        {/* NAVBAR SUPERIOR RESPONSIVO (Protegido contra choques en inspector) */}
        <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 md:px-10 py-3 flex justify-between items-center bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#0b1329] border-b border-slate-800/80 shadow-2xl backdrop-blur-md">

          {/* LOGO Y DIAMANTE RESPONSIVO */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-900/90 border border-slate-700/70 rounded-xl relative overflow-hidden transition-all group-hover:scale-105 active:scale-95 shadow-lg group-hover:border-purple-500/50 shrink-0">
                <Image
                  src="/layout3.png"
                  alt="Me Vocatio Diamond"
                  width={120}
                  height={120}
                  priority
                  className="object-contain scale-[2.3] transition-transform group-hover:scale-[2.4] translate-y-[0.5px]"
                />
              </div>

              <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 group-hover:to-purple-300 transition-colors truncate">
                MeVocatio
              </span>
            </Link>
          </div>

          {/* BOTONES DE NAVEGACIÓN SUPERIOR (Con flex-wrap y gaps seguros) */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <Link
              href="/nosotros"
              className={`${getButtonStyle("/nosotros")} px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] transition-all active:scale-95 uppercase tracking-widest font-semibold shrink-0`}
            >
              NOSOTROS
            </Link>

            {(!isLoggedIn || !isPrivateZone) ? (
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

        {/* Contenedor principal */}
        <main className="mt-[72px] bg-[#0b1329] min-h-[calc(100vh-72px)]">{children}</main>
      </body>
    </html>
  );
}