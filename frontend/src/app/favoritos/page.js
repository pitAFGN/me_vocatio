"use client";

import { useState, useEffect } from "react";
import VocacionCard from "@/components/VocacionCard";
import SidebarNav from "@/components/SidebarNav";
import { Bookmark, Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FavoritosPage() {
    const [favoritos, setFavoritos] = useState([]);

    // Al cargar la página, leemos los favoritos guardados en el navegador
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("me_vocatio_favorites") || "[]");
        setFavoritos(storedFavorites);
    }, []);

    // Función opcional para manejar la simulación de cierre de sesión si tu SidebarNav lo requiere
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-[#040613] text-slate-100 flex">
            {/* Menú de Navegación Lateral / Inferior */}
            <SidebarNav logout={handleLogout} />

            {/* Contenido Principal */}
            <main className="flex-1 md:pl-64 p-6 md:p-10 pb-24 md:pb-10">
                <div className="max-w-6xl mx-auto">

                    {/* Cabecera de la Sección con Botón de Regreso */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                    <Bookmark className="w-6 h-6 fill-violet-400" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                                    Tus Vocaciones Guardadas
                                </h1>
                            </div>
                            <p className="text-sm text-slate-400">
                                Aquí tienes el listado de las rutas y áreas profesionales que marcaste como favoritas para consultar después.
                            </p>
                        </div>

                        {/* Botón para volver al Dashboard */}
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-all w-fit cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4 text-violet-400" />
                            <span>Volver al Dashboard</span>
                        </Link>
                    </div>

                    {/* Listado dinámico de favoritos */}
                    {favoritos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoritos.map((vocacion) => (
                                <VocacionCard key={vocacion.id} vocacion={vocacion} />
                            ))}
                        </div>
                    ) : (
                        /* Estado vacío si no hay nada guardado */
                        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-white/10 bg-[#0c1222]/50 text-center mt-10">
                            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-slate-500 mb-4">
                                <Compass className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No tienes favoritos aún</h3>
                            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                                Explora las rutas de aprendizaje o el panel principal y haz clic en el ícono de marcador para guardar tus opciones favoritas aquí.
                            </p>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/30"
                            >
                                Explorar Rutas
                            </Link>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}