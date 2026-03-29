'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // --- ESCUDO DE PROTECCIÓN ---
    useEffect(() => {
        // Si no hay token en la URL, rebota al login de una
        if (!token) {
            router.push('/login');
        }
    }, [token, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            // Petición al backend de Andres
            const res = await fetch("http://localhost:3001/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            if (res.ok) {
                alert("¡Contraseña actualizada con éxito!");
                router.push("/login");
            } else {
                alert("El enlace expiró o es inválido. Solicita uno nuevo.");
                router.push("/login");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    // Si no hay token, no renderizamos la interfaz (evita flasheos visuales)
    if (!token) return null;

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#1e293b] relative overflow-hidden p-6">

            {/* EL ROMBO DE FONDO: Sutil y decorativo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
                <div className="w-[50rem] h-[50rem] border-[70px] border-white rotate-45 shadow-2xl"></div>
            </div>

            {/* LA TARJETA CENTRAL: Compacta y limpia */}
            <div className="relative z-10 w-full max-w-sm bg-white p-10 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-50 duration-500 mx-4">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-tight">
                        Nueva Contraseña
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">
                        Accede a tu cuenta para seguir puliendo tu profesion
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Contraseña</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmar contraseña</label>
                        <input
                            required
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-[#1e293b] text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all uppercase text-[11px] tracking-[0.3em] active:scale-95 disabled:opacity-50 mt-4 border border-slate-700"
                    >
                        {loading ? "Actualizando..." : "Guardar Cambios"}
                    </button>
                </form>

                {/* Botón sutil para cancelar/volver al login */}
                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        Cancelar y Volver al Login
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#1e293b] flex items-center justify-center text-white font-black italic uppercase tracking-widest text-xs">Cargando Portal...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}