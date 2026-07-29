"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  LayoutDashboard,
  Award,
  Settings,
  BrainCircuit,
  Compass
} from "lucide-react";
import NavbarProfile from "../components/NavbarProfile";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDiagnostico = pathname.startsWith("/diagnostico");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const isAccessActive = pathname.startsWith("/login");
  const isPrivateZone =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/vocacion") ||
    pathname.startsWith("/configuracion") ||
    pathname.startsWith("/insignias") ||
    pathname.startsWith("/diagnostico") ||
    pathname.startsWith("/recomendacion");

  const sideMenuLinks = [
    { href: "/dashboard", label: "Panel Principal", icon: LayoutDashboard },
    { href: "/recomendacion", label: "Rutas de Aprendizaje", icon: Compass },

    ...(isDiagnostico
      ? [
        {
          href: pathname,
          label: "Diagnóstico",
          icon: BrainCircuit,
        },
      ]
      : []),

    { href: "/insignias", label: "Insignias", icon: Award },
    { href: "/configuracion", label: "Configuración", icon: Settings },
  ];

  useEffect(() => {
    setIsSideMenuOpen(false);
  }, [pathname]);

  // Verificar la sesión para saber si pintar ACCESO o el Perfil
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  // Estilos de botones ajustados para contrastar bien sobre el nav oscuro
  const getButtonStyle = (path) => {
    const isActive = path === "/login" ? isAccessActive : pathname === path;
    return isActive
      ? "bg-slate-100 text-[#0b1329] border border-white shadow-lg scale-105 font-bold"
      : "bg-slate-900/60 text-slate-200 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all hover:scale-105";
  };

  return (
    <html lang="es">
      {/* Cambiamos el fondo general a la base oscura de la app (#0b1329) */}
      <body className="antialiased bg-[#0b1329] font-sans text-slate-100" suppressHydrationWarning>

        {/* 
          NAVBAR: Degradado fluido que pasa de un gris/azul medio en la izquierda
          hacia el azul rey profundo y morado noche en el lado derecho
        */}
        <nav className="fixed top-0 w-full z-50 px-10 py-3 flex justify-between items-center bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#0b1329] border-b border-slate-800/80 shadow-2xl backdrop-blur-md">

          {/* Bloque Izquierda: Menú hamburguesa + Logo Diamante */}
          <div className="flex items-center gap-3">

            {isLoggedIn && isPrivateZone && (
              <button
                onClick={() => setIsSideMenuOpen(true)}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 text-white transition-all active:scale-95 cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            <Link href="/" className="flex items-center justify-center group">
              <div className="w-14 h-14 flex items-center justify-center bg-slate-900/80 border border-slate-700/50 rounded-xl relative overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-md">
                <Image
                  src="/layout3.png"
                  alt="Me Vocatio Diamond"
                  width={120}
                  height={120}
                  priority
                  className="object-contain scale-[2.2] translate-y-[1px]"
                />
              </div>
            </Link>
          </div>

          {/* Bloque de Acciones Derecha */}
          <div className="flex gap-4 items-center">

            <Link
              href="/nosotros"
              className={`${getButtonStyle("/nosotros")} px-7 py-2.5 rounded-full text-[11px] transition-all active:scale-95 uppercase tracking-widest`}
            >
              NOSOTROS
            </Link>

            {!isLoggedIn || !isPrivateZone ? (
              <Link
                href="/login"
                className={`${getButtonStyle("/login")} px-6 py-2.5 rounded-full text-[11px] transition-all active:scale-95 uppercase tracking-widest`}
              >
                ACCESO
              </Link>
            ) : (
              <NavbarProfile />
            )}

          </div>

        </nav>

        {/* Overlay de navegación lateral */}
        {isSideMenuOpen && (
          <div className="fixed inset-0 z-[60] flex">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSideMenuOpen(false)}
            ></div>

            <div className="relative w-64 h-full bg-[#0f172a] border-r border-slate-800 shadow-2xl p-4 flex flex-col gap-2 text-slate-200">
              {sideMenuLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsSideMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold uppercase tracking-wide transition-all ${pathname === href
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Contenedor principal sin el gris claro feo */}
        <main className="mt-[72px] bg-[#0b1329] min-h-[calc(100vh-72px)]">{children}</main>
      </body>
    </html>
  );
}