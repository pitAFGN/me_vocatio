'use client';

import Link from 'next/link';
import Image from 'next/image';
import OpinionesCarrusel from '../components/OpinionesCarrusel';

export default function NosotrosPage() {
    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#b4b8c0_0%,_#e5e7eb_100%)] flex flex-col items-center py-20 px-6 relative overflow-hidden">

            {/* BOTÓN CERRAR: FIXED PARA QUE NO SE MUEVA, PERO DEBAJO DEL NAV */}
            <Link
                href="/"
                className="fixed top-24 right-10 text-[#1e293b] hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] z-[40] bg-white/90 backdrop-blur-md shadow-2xl px-6 py-2.5 rounded-full border border-slate-200 hover:bg-[#1e293b] active:scale-95"
            >
                Cerrar ✕
            </Link>

            {/* TÍTULO DE BIENVENIDA */}
            <div className="text-center z-10 mb-4 mt-10">
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic">
                    Nuestra Esencia
                </h1>
                <p className="text-slate-600 font-bold text-xs uppercase tracking-[0.4em] mt-2">
                    Conoce el motor detrás de MeVocatio
                </p>
            </div>

            {/* CUADRO DE CRISTAL PRINCIPAL */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl max-w-6xl w-full p-8 md:p-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* LADO IZQUIERDO: LOS 4 BENEFICIOS */}
                    <div className="flex flex-col gap-6 text-left">
                        <h2 className="text-slate-900 text-2xl font-black uppercase tracking-widest border-b-4 border-cyan-500 w-fit pb-2">
                            Beneficios
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">01.</span>
                                <p className="text-slate-800 font-medium italic">Identidad Digital: Crea una presencia profesional moderna que destaque tu verdadero talento.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">02.</span>
                                <p className="text-slate-800 font-medium italic">Estructura de Perfil: Organiza tu trayectoria bajo un diseño minimalista de alto impacto visual.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">03.</span>
                                <p className="text-slate-800 font-medium italic">Claridad de Objetivos: Centraliza tus logros y metas en un solo lugar para proyectar seguridad.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">04.</span>
                                <p className="text-slate-800 font-medium italic">Enfoque Vocacional: Herramientas diseñadas para profesionales que buscan dar el siguiente paso con orden.</p>
                            </li>
                        </ul>
                    </div>

                    {/* LADO DERECHO: LOS 3 PASOS DE FUNCIONAMIENTO */}
                    <div className="flex flex-col gap-6 bg-slate-800/10 rounded-3xl p-6 border border-white/20 text-left">
                        <h2 className="text-slate-900 text-2xl font-black uppercase tracking-widest border-b-4 border-slate-800 w-fit pb-2">
                            Funcionamiento
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold shadow-lg">1</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <span className="font-bold text-slate-900 uppercase text-[11px] block">Regístrate:</span>
                                    Crea tu perfil y cuéntanos sobre tus pasiones y experiencia.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold shadow-lg">2</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <span className="font-bold text-slate-900 uppercase text-[11px] block">Diagnóstico:</span>
                                    Realiza nuestras pruebas psicotécnicas de última generación.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold shadow-lg">3</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <span className="font-bold text-slate-900 uppercase text-[11px] block">Mejora:</span>
                                    Recibe recomendaciones exactas para pulir tu potencial.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE OPINIONES */}
            <div className="mt-20 w-full max-w-5xl z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Casos de Éxito</h2>
                    <div className="h-1 w-20 bg-cyan-500 mx-auto mt-2"></div>
                </div>
                <OpinionesCarrusel />
            </div>

            <div className="h-20"></div>
        </main>
    );
}