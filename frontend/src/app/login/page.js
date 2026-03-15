'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function AuthContent() {
    const searchParams = useSearchParams();
    const [esRegistro, setEsRegistro] = useState(false);

    useEffect(() => {
        const mode = searchParams.get('mode');
        setEsRegistro(mode === 'signup');
    }, [searchParams]);

    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">

            {/* LADO IZQUIERDO: BRANDING (Subimos el contenido) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#1e293b] justify-center border-r border-white/10 pt-20">

                {/* Fondo decorativo */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[50rem] h-[50rem] border-[60px] border-white rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* CONTENEDOR: justify-start para que no baile */}
                <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center px-12">

                    {/* LOGO: Mantenemos la esencia */}
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

                    {/* TEXTO IZQUIERDO: Ajustado para mayor estabilidad */}
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

            {/* LADO DERECHO: FORMULARIO */}
            <div className="flex-1 flex flex-col items-center justify-start pt-16 lg:pt-24 p-8 sm:p-12 bg-white relative overflow-y-auto">

                <Link href="/" className="absolute top-10 right-10 text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] z-50">
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

                    {/* TABS */}
                    <div className="flex border-b border-slate-100 mb-8">
                        <button onClick={() => setEsRegistro(false)} className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${!esRegistro ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-300'}`}>LOGIN</button>
                        <button onClick={() => setEsRegistro(true)} className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${esRegistro ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-300'}`}>REGISTER</button>
                    </div>

                    <form className="space-y-4">
                        {esRegistro && (
                            <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-300">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                                <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm" placeholder="JESUS TORRES" type="text" />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                            <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm" placeholder="NAME@COMPANY.COM" type="email" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contraseña</label>
                                {!esRegistro && <a className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase" href="#">Recuperar</a>}
                            </div>
                            <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm" placeholder="••••••••" type="password" />
                        </div>

                        <button className="w-full py-4 bg-[#1e293b] hover:bg-slate-800 text-white font-black rounded-xl shadow-xl transition-all transform active:scale-[0.97] mt-4 uppercase text-[11px] tracking-[0.3em]">
                            {esRegistro ? "Crear Cuenta" : "Entrar al Portal"}
                        </button>
                    </form>

                    {/* SOCIAL: Agregamos mt-10 para separar del formulario */}
                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <button className="flex items-center justify-center px-4 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-black text-slate-700 text-[9px] uppercase tracking-widest shadow-sm">Google</button>
                        <button className="flex items-center justify-center px-4 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-black text-slate-700 text-[9px] uppercase tracking-widest shadow-sm">GitHub</button>
                    </div>
                </div>
            </div>
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