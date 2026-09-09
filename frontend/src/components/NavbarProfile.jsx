'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, FolderHeart, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';

export default function NavbarProfile() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isCreatePage = pathname.startsWith('/creacion_recursos');
    const showCreateButton = pathname.startsWith('/dashboard') && !isCreatePage;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authService.me();
                setUser(response.user);
                setIsLoggedIn(true);
            } catch {
                setUser(null);
                setIsLoggedIn(false);
            }
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        window.addEventListener('local-storage-update', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('local-storage-update', checkAuth);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setIsMenuOpen(false);
    };

    const handleMisRecursos = () => {
        router.push('/dashboard');
        setIsMenuOpen(false);
    };

    const handleCrearRecurso = () => {
        router.push('/creacion_recursos');
        setIsMenuOpen(false);
    };

    if (!isLoggedIn) {
        const isAccessActive = pathname.startsWith("/login");
        const accesoStyle = isAccessActive
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:via-indigo-500 dark:to-blue-500 text-white border border-purple-700 dark:border-purple-300 shadow-md dark:shadow-[0_0_20px_rgba(168,85,247,0.4)] font-medium scale-105"
            : "bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:via-[#1e293b] dark:to-[#2e1065] text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-purple-500 hover:border-purple-200 dark:hover:border-purple-400 hover:text-purple-700 dark:hover:text-white hover:bg-slate-50 dark:hover:from-slate-800 dark:hover:to-[#3b0764] transition-all duration-300 hover:scale-[1.03] shadow-sm dark:shadow-md hover:shadow-[0_8px_15px_-3px_rgba(109,40,217,0.08)] dark:hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]";

        return (
            <Link
                href="/login"
                className={`${accesoStyle} px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider shrink-0`}
            >
                ACCESO
            </Link>
        );
    }

    return (
        <div className="relative flex items-center gap-3" ref={menuRef}>
            {showCreateButton && (
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
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-[0_0_16px_rgba(99,102,241,0.45)] hover:shadow-[0_0_24px_rgba(99,102,241,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
                aria-label="Menú de perfil"
            >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 top-14 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 flex flex-col overflow-hidden z-50">
                    {user && (
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 mb-1">
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={handleMisRecursos}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-sm font-semibold dark:text-slate-200 text-slate-700 transition-colors"
                    >
                        <FolderHeart className="w-5 h-5 text-indigo-500" />
                        Mis Recursos
                    </button>
                    <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50 my-1"></div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-left text-sm font-semibold text-red-600 dark:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
}
