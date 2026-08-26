"use client";

import { Bookmark, ExternalLink } from "lucide-react";
import { PROFESSIONS } from "@/app/data/professions";

export default function SavedView({ savedIds, toggleSave, setActiveTab, router }) {
    const savedProfessions = PROFESSIONS.filter(job => savedIds.includes(job.id));

    return (
        <section className="mb-10">
            {savedProfessions.length === 0 ? (
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
                    <Bookmark className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No tienes rutas guardadas aún</h3>
                    <p className="text-sm text-slate-400 mb-6">Explora las vocaciones en el dashboard y haz clic en el ícono de marcador para guardarlas aquí.</p>
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className="py-3 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer"
                    >
                        Explorar Vocaciones
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProfessions.map((job) => (
                        <div
                            key={job.id}
                            style={{
                                border: "2px solid #a855f7",
                                boxShadow: "0 0 25px rgba(168, 85, 247, 0.8)"
                            }}
                            className="bg-[#0a0b14] rounded-2xl p-6 relative flex flex-col justify-between h-full transition-all duration-300"
                        >
                            <button
                                onClick={(e) => toggleSave(job.id, e)}
                                className="absolute top-6 right-6 p-2 rounded-xl border bg-indigo-600 border-indigo-500 text-white transition-all cursor-pointer hover:scale-105"
                            >
                                <Bookmark className="w-4 h-4 fill-current" />
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
                                className="w-full py-2.5 px-4 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-semibold hover:bg-indigo-600/20 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                Ver Módulo <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}