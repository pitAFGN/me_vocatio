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
                await authService.me();
                setIsLoggedIn(true);
            } catch {
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

    if (!isLoggedIn || !isPrivateZone) {
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
        </div>
    );
}
