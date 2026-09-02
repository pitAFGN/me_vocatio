'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, FolderHeart, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';

export default function NavbarProfile() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isCreatePage = pathname.startsWith('/creacion_recursos');
    const showCreateButton = pathname.startsWith('/dashboard') && !isCreatePage;

    const isPrivateZone =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/vocacion') ||
        pathname.startsWith('/diagnostico') ||
        pathname.startsWith('/configuracion') ||
        pathname.startsWith('/insignias') ||
        pathname.startsWith('/recomendacion') ||
        pathname.startsWith('/creacion_recursos');

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
        return () => window.removeEventListener('storage', checkAuth);
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
        return null;
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
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-purple-500/30 bg-gradient-to-r from-slate-800 to-[#2e1065] text-white shadow-md hover:scale-105 transition-all"
                aria-label="Menú de perfil"
            >
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
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
