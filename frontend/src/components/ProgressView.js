"use client";

export default function ProgressView({ savedCount }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 text-center">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Progreso General</h4>
                <p className="text-4xl font-extrabold text-indigo-400 mb-2">85%</p>
                <p className="text-xs text-slate-500">Módulos avanzados completados</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 text-center">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Rutas Guardadas</h4>
                <p className="text-4xl font-extrabold text-indigo-400 mb-2">{savedCount}</p>
                <p className="text-xs text-slate-500">Especialidades marcadas</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 text-center">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Nivel de Acceso</h4>
                <p className="text-2xl font-extrabold text-purple-400 mb-2">Elite Tier</p>
                <p className="text-xs text-slate-500">Workspace Activo</p>
            </div>
        </div>
    );
}