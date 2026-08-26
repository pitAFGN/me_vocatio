"use client";

import { useState } from "react";
import { User, CheckCircle2, Save } from "lucide-react";

export default function SettingsView({ profileData, setProfileData }) {
    const [tempProfile, setTempProfile] = useState(profileData);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleProfileSave = (e) => {
        e.preventDefault();
        setProfileData(tempProfile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <User className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Editar Información Personal</h3>
            </div>

            {saveSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> ¡Perfil actualizado correctamente!
                </div>
            )}

            <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nombre Completo</label>
                    <input
                        type="text"
                        value={tempProfile.name}
                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nivel / Rol Académico</label>
                    <input
                        type="text"
                        value={tempProfile.tier}
                        onChange={(e) => setTempProfile({ ...tempProfile, tier: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Ubicación</label>
                    <input
                        type="text"
                        value={tempProfile.location}
                        onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 font-semibold text-xs text-white uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                    >
                        <Save className="w-4 h-4" /> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}