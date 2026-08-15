'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, FolderHeart, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function NavbarProfile() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const userName = "Samuel Moreno";
    const userRole = "Estudiante ADSO";
    const isCreatePage = pathname.startsWith("/creacion_recursos");

    const isPrivateZone =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/vocacion") ||
        pathname.startsWith("/diagnostico") ||
        pathname.startsWith("/configuracion") ||
        pathname.startsWith("/insignias") ||
        pathname.startsWith("/recomendacion") ||
        pathname.startsWith("/creacion_recursos");

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setIsMenuOpen(false);
    };

    const handleMisRecursos = () => {
        router.push("/dashboard");
        setIsMenuOpen(false);
    };

    const handleCrearRecurso = () => {
        router.push("/creacion_recursos");
        setIsMenuOpen(false);
    };

    if (!isLoggedIn || !isPrivateZone) {
        return null;
    }

    return (
        <div className="relative flex items-center gap-3" ref={menuRef}>
            {!isCreatePage && (
                <button
                    type="button"
                    onClick={handleCrearRecurso}
                    aria-label="Crear recurso"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/40 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                </button>
            )}

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-12 h-12 rounded-full bg-[#1e293b] border-2 border-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-white overflow-hidden cursor-pointer"
            >
                <User className="w-6 h-6 opacity-90" />
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 top-full z-[60] mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/80 p-5 animate-in fade-in slide-in-from-top-3 duration-200 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center text-white shadow-inner mb-3">
                        <User className="w-8 h-8 opacity-90" />
                    </div>

                    <h4 className="text-[#1e293b] font-black text-base tracking-tight">{userName}</h4>
                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-4">{userRole}</p>

                    <div className="w-full h-[1px] bg-slate-100 mb-4"></div>

                    <button
                        onClick={handleMisRecursos}
                        className="w-full bg-[#1e293b] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 mb-2 border border-slate-700 cursor-pointer"
                    >
                        <FolderHeart className="w-3.5 h-3.5" /> Mis Recursos
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Salir
                    </button>
                </div>
            )}
        </div>
    );
}