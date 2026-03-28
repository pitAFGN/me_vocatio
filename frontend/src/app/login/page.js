'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function AuthContent() {
    const [mostrarOlvido, setMostrarOlvido] = useState(false);
    const [emailRecuperacion, setEmailRecuperacion] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    const [esRegistro, setEsRegistro] = useState(false);
    const [loading, setLoading] = useState(true); // <--- CONTROL DE ACCESO

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // --- PROTECCIÓN: SI YA HAY TOKEN, NO ENTRA AL LOGIN ---
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Si ya está logueado, lo mandamos al dashboard y NO quitamos el loading
            router.replace("/dashboard");
        } else {
            // Solo si NO hay token, permitimos ver el formulario
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const mode = searchParams.get('mode');
        setEsRegistro(mode === 'signup');
    }, [searchParams]);

    // --- BLOQUEO VISUAL ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-[0.3em]">
                Verificando...
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = esRegistro
            ? "http://localhost:3001/api/auth/register"
            : "http://localhost:3001/api/auth/login";

        const bodyData = esRegistro
            ? { name: nombre, email, password }
            : { email, password };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();

            if (res.ok) {
                if (!esRegistro) {
                    // 1. Guardamos el token en el navegador
                    localStorage.setItem("token", data.token);
                    // 2. Redirigimos al Dashboard
                    router.push("/dashboard");
                } else {
                    alert("Usuario registrado correctamente");
                    setEsRegistro(false);
                }
            } else {
                alert(data.message || "Ocurrió un error");
            }
        } catch (error) {
            console.error("Error en la autenticación:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">

            {/* LADO IZQUIERDO */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#1e293b] justify-center border-r border-white/10 pt-20">

                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[50rem] h-[50rem] border-[60px] border-white rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center px-12">

                    <div className="mb-6 italic font-black text-white">
                        <Image
                            src="/mevocatio.png"
                            alt="Logo MeVocatio"
                            width={650}
                            height={250}
                            priority
                            className="brightness-0 invert object-contain h-48 w-auto transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <h2 className="text-4xl font-black leading-[1.1] mb-4 tracking-tighter uppercase italic text-white max-w-md">
                            {esRegistro ? "El diamante eres tú, lúcelo" : "Sigue puliendo tu profesión"}
                        </h2>
                        <p className="text-base text-slate-400 font-light max-w-sm leading-snug">
                            {esRegistro
                                ? "Crea tu perfil ahora y accede a la red de talentos más exclusiva."
                                : "Bienvenido de nuevo al portal donde tu carrera toma un brillo superior."}
                        </p>
                    </div>
                </div>
            </div>

            {/* FORMULARIO */}
            <div className="flex-1 flex flex-col items-center justify-start pt-16 lg:pt-24 p-8 sm:p-12 bg-white relative overflow-y-auto">

                <Link href="/" className="absolute top-10 right-10 text-[#1e293b] hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] z-50 bg-white shadow-lg px-6 py-2.5 rounded-full border border-slate-200 hover:bg-[#1e293b] active:scale-95">
                    Cerrar ✕
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-8 text-center lg:text-left">
                        <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter uppercase">
                            {esRegistro ? "Registrate" : "Portal"}
                        </h3>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                            Accede a MeVocatio
                        </p>
                    </div>

                    <div className="flex border-b border-slate-100 mb-8">
                        <button type="button" onClick={() => setEsRegistro(false)} className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${!esRegistro ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-300'}`}>INICIAR SESIÓN</button>
                        <button type="button" onClick={() => setEsRegistro(true)} className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${esRegistro ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-300'}`}>REGISTRATE</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {esRegistro && (
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Nombre Completo
                                </label>
                                <input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
                                    placeholder="JESUS TORRES"
                                    type="text"
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
                                placeholder="NAME@COMPANY.COM"
                                type="email"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                Contraseña
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
                                placeholder="••••••••"
                                type="password"
                            />
                        </div>
                        {!esRegistro && (
                            <div className="flex justify-end pr-1">
                                <button
                                    type="button"
                                    onClick={() => setMostrarOlvido(true)}
                                    className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e293b] transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#1e293b] hover:bg-slate-800 text-white font-black rounded-xl shadow-xl transition-all transform active:scale-[0.97] mt-4 uppercase text-[11px] tracking-[0.3em]"
                        >
                            {esRegistro ? "Crear Cuenta" : "Entrar al Portal"}
                        </button>

                    </form>

                </div>
            </div>
            {/* MODAL TIPO EPIC: OLVIDÉ MI CONTRASEÑA */}
            {mostrarOlvido && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Fondo oscuro con desenfoque */}
                    <div
                        className="absolute inset-0 bg-[#1e293b]/80 backdrop-blur-sm"
                        onClick={() => setMostrarOlvido(false)}
                    ></div>

                    {/* La Tarjetica */}
                    <div className="relative bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-200 animate-in zoom-in duration-300">
                        <button
                            onClick={() => setMostrarOlvido(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">¿Olvidaste tu contraseña?</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
                                Introduce tu email para recuperar el acceso
                            </p>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            alert("Enlace enviado a: " + emailRecuperacion);
                            setMostrarOlvido(false);
                        }} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email de recuperación</label>
                                <input
                                    required
                                    type="email"
                                    value={emailRecuperacion}
                                    onChange={(e) => setEmailRecuperacion(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm"
                                    placeholder="TU-EMAIL@EJEMPLO.COM"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#1e293b] text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all uppercase text-[11px] tracking-[0.3em]"
                            >
                                Enviar Enlace
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-widest">MeVocatio...</div>}>
            <AuthContent />
        </Suspense>
    );
}