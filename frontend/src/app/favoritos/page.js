"use client";

import { useState } from "react";
import ProfessionCard from "@/components/ProfessionCard";
import ResourceCard from "@/components/ResourceCard";
import DashboardLayout from "@/components/DashboardLayout";
import { Bookmark, Layers, Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { useResourceFavorites, recursoId } from "@/hooks/useResourceFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import LoadingScreen from "@/components/LoadingScreen";

export default function FavoritosPage() {
    const { favorites, savedIds, toggleSave } = useFavorites();
    const { resourceFavorites, savedResourceIds, toggleResourceSave } = useResourceFavorites();
    const { logout } = useAuth();
    const { loading } = useProtectedRoute();
    const [tabActiva, setTabActiva] = useState("vocaciones");

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <DashboardLayout logout={logout} containerClassName="flex">
            {/* Cabecera de la Sección con Botón de Regreso */}
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-500 dark:text-violet-400">
                                <Bookmark className="w-6 h-6 fill-violet-500 dark:fill-violet-400" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Tus Favoritos
                            </h1>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Aquí tienes las vocaciones y recursos que marcaste para consultar después.
                        </p>
                    </div>

                    {/* Botón para volver al Dashboard */}
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all w-fit cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                        <span>Volver al Dashboard</span>
                    </Link>
                </div>

                {/* Pestañas de Favoritos */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        onClick={() => setTabActiva("vocaciones")}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            tabActiva === "vocaciones"
                                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25"
                                : "bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        }`}
                    >
                        <Bookmark className={`w-4 h-4 ${tabActiva === "vocaciones" ? "fill-white" : ""}`} />
                        <span>Vocaciones</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            tabActiva === "vocaciones"
                                ? "bg-white/20 text-white"
                                : "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300"
                        }`}>
                            {favorites.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setTabActiva("recursos")}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            tabActiva === "recursos"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                : "bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        }`}
                    >
                        <Layers className={`w-4 h-4 ${tabActiva === "recursos" ? "fill-white" : ""}`} />
                        <span>Recursos</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            tabActiva === "recursos"
                                ? "bg-white/20 text-white"
                                : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                        }`}>
                            {resourceFavorites.length}
                        </span>
                    </button>
                </div>

                {/* Listado dinámico de favoritos */}
                {tabActiva === "vocaciones" ? (
                    favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((vocacion) => (
                                <ProfessionCard key={vocacion.id} profession={vocacion} savedIds={savedIds} onToggleSave={toggleSave} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1222]/50 text-center mt-10">
                            <div className="p-4 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 mb-4">
                                <Compass className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tienes vocaciones favoritas aún</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                                Explora el panel principal y haz clic en el ícono de marcador para guardar tus vocaciones aquí.
                            </p>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/30"
                            >
                                Explorar Vocaciones
                            </Link>
                        </div>
                    )
                ) : resourceFavorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resourceFavorites.map((recurso) => (
                            <ResourceCard
                                key={recursoId(recurso)}
                                material={recurso}
                                isFavorite={savedResourceIds.includes(recursoId(recurso))}
                                onToggleSave={toggleResourceSave}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1222]/50 text-center mt-10">
                        <div className="p-4 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 mb-4">
                            <Layers className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tienes recursos favoritos aún</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                            Explora las rutas de aprendizaje y haz clic en el ícono de marcador de cada recurso para guardarlo aquí.
                        </p>
                        <Link
                            href="/recomendacion"
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30"
                        >
                            Explorar Rutas
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}