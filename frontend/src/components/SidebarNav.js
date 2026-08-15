"use client";

import { LayoutDashboard, Compass, Award, Settings, Code2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav({ logout }) {
    const pathname = usePathname();

    return (
        <>
            {/* 1. SIDEBAR ORIGINAL PARA COMPUTADORAS (Intacto, oculto en móviles) */}
            <aside className="w-64 bg-[#010f1f]/40 backdrop-blur-3xl border-r border-white/10 flex flex-col justify-between p-6 h-screen fixed top-0 left-0 z-40 hidden md:flex">
                <div>
                    {/* Logo / Marca */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <Code2 className="w-7 h-7 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white tracking-wide">MeVocatio</h2>
                    </div>

                    {/* Menú de navegación lateral */}
                    <nav className="flex flex-col gap-2">
                        <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${pathname === "/dashboard" ? "bg-white/10 border border-white/10 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                            <span>PANEL PRINCIPAL</span>
                        </Link>

                        <Link href="/recomendacion?profesion=Desarrollo%20de%20Software&nivel=Principiante" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname.startsWith("/recomendacion") ? "bg-white/10 border border-white/10 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                            <Compass className={`w-5 h-5 ${pathname.startsWith("/recomendacion") ? "text-indigo-400" : ""}`} />
                            <span>RUTAS DE APRENDIZAJE</span>
                        </Link>

                        <Link href="/insignias" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === "/insignias" ? "bg-white/10 border border-white/10 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                            <Award className="w-5 h-5" />
                            <span>INSIGNIAS</span>
                        </Link>

                        <Link href="/configuracion" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${pathname === "/configuracion" ? "bg-white/10 border border-white/10 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                            <Settings className="w-5 h-5" />
                            <span>CONFIGURACIÓN</span>
                        </Link>
                    </nav>
                </div>

                {/* Botón de Cerrar Sesión */}
                <div className="pt-6 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/30 transition-all font-semibold text-sm cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* 2. BARRA DE NAVEGACIÓN INFERIOR PARA CELULARES (Exclusiva mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#040613]/90 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 z-50 flex items-center justify-around shadow-2xl">
                <Link href="/dashboard" className={`p-2 rounded-xl flex flex-col items-center gap-1 ${pathname === "/dashboard" ? "text-indigo-400 bg-white/5" : "text-slate-400"}`}>
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-[9px] font-medium">Panel</span>
                </Link>

                <Link href="/recomendacion?profesion=Desarrollo%20de%20Software&nivel=Principiante" className={`p-2 rounded-xl flex flex-col items-center gap-1 ${pathname.startsWith("/recomendacion") ? "text-indigo-400 bg-white/5" : "text-slate-400"}`}>
                    <Compass className="w-5 h-5" />
                    <span className="text-[9px] font-medium">Rutas</span>
                </Link>

                <Link href="/insignias" className={`p-2 rounded-xl flex flex-col items-center gap-1 ${pathname === "/insignias" ? "text-indigo-400 bg-white/5" : "text-slate-400"}`}>
                    <Award className="w-5 h-5" />
                    <span className="text-[9px] font-medium">Insignias</span>
                </Link>

                <Link href="/configuracion" className={`p-2 rounded-xl flex flex-col items-center gap-1 ${pathname === "/configuracion" ? "text-indigo-400 bg-white/5" : "text-slate-400"}`}>
                    <Settings className="w-5 h-5" />
                    <span className="text-[9px] font-medium">Ajustes</span>
                </Link>

                <button onClick={logout} className="p-2 rounded-xl flex flex-col items-center gap-1 text-red-400">
                    <LogOut className="w-5 h-5" />
                    <span className="text-[9px] font-medium">Salir</span>
                </button>
            </nav>
        </>
    );
}