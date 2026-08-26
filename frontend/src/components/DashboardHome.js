"use client";

import {
    CheckCircle2,
    Briefcase,
    Sparkles,
    ArrowLeft,
    ArrowRight,
    Search,
    Bookmark,
    ExternalLink
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

export default function DashboardHome({
    profileData,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    filteredProfessions,
    savedIds,
    toggleSave,
    router
}) {
    const currentProfessions = filteredProfessions.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    return (
        <>
            {/* Top Grid: Status Card & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

                {/* Status Card con los puntitos estáticos */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 lg:col-span-2 flex flex-col justify-between relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-950/80 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{profileData.tier}</h3>
                                <p className="text-xs text-slate-400">Ubicación: {profileData.location}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-xs text-slate-400 tracking-wider font-semibold uppercase">Roadmap Progress</span>
                                <span className="text-lg text-indigo-400 font-bold">85%</span>
                            </div>

                            {/* Barra con puntos/checkpoints estáticos limpios */}
                            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-visible mb-6">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full w-[85%] shadow-lg"></div>

                                <div className="absolute inset-0 flex justify-between items-center px-1">
                                    <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                                    <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                                    <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                                    <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-600 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400">15% restante para completar los hitos actuales de la plataforma.</p>
                        </div>
                    </div>
                </div>

                {/* Action Card */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-purple-950/40 flex items-center justify-center mb-6 border border-purple-500/30 text-purple-400">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Profile Analytics</h4>
                    <p className="text-sm text-slate-400 mb-6">Tu workspace cuenta con acceso ilimitado a las rutas de desarrollo.</p>
                    <button
                        onClick={() => router.push("/vocacion/analisis-y-desarrollo-de-software")}
                        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 font-semibold text-xs text-white uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                    >
                        Ver Carrera Principal
                    </button>
                </div>

            </div>

            {/* Search & Exploration Section */}
            <section id="explorar" className="mb-10 scroll-mt-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-2xl font-bold text-white">Explorar Vocaciones</h2>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(0)}
                            disabled={page === 0}
                            className={`p-2.5 rounded-xl border transition-all ${page === 0 ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed" : "bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 cursor-pointer"}`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(1)}
                            disabled={page === 1 || filteredProfessions.length <= ITEMS_PER_PAGE}
                            className={`p-2.5 rounded-xl border transition-all ${page === 1 || filteredProfessions.length <= ITEMS_PER_PAGE ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed" : "bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 cursor-pointer"}`}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="relative flex items-center mb-6">
                    <Search className="absolute left-4 text-indigo-300/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar profesiones o áreas de interés (ej. Desarrollo, Datos, Ciberseguridad)..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl text-sm placeholder-slate-400 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProfessions.map((job) => {
                        const isSaved = savedIds.includes(job.id);
                        return (
                            <div
                                key={job.id}
                                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 group hover:-translate-y-1.5 hover:bg-[#0a0b14] hover:border-purple-500/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 flex flex-col justify-between shadow-xl relative"
                            >
                                <button
                                    onClick={(e) => toggleSave(job.id, e)}
                                    className={`absolute top-6 right-6 p-2 rounded-xl border transition-all cursor-pointer ${isSaved ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"}`}
                                    title={isSaved ? "Quitar de guardados" : "Guardar profesión"}
                                >
                                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                                </button>

                                <div>
                                    <div className="flex justify-between items-start mb-6 pr-10">
                                        <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-[11px] font-semibold text-indigo-300 uppercase tracking-wide">
                                            {job.area}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2">{job.title}</h3>
                                    <p className="text-xs text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                                        {job.desc}
                                    </p>
                                </div>

                                <button
                                    onClick={() => router.push(`/vocacion/${job.slug}`)}
                                    className="w-full py-2.5 px-4 rounded-xl text-slate-300 hover:text-white text-xs font-semibold bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-500 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Ver Módulo / Ruta <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}