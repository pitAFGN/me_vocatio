'use client';

import { Search, Filter, Code, Palette, BarChart3, Globe, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const userName = "Samuel";

    const professions = [
        { title: "Ingeniería de Software", area: "Tecnología & Desarrollo", icon: <Code />, desc: "Crea soluciones digitales complejas y arquitectura de sistemas innovadores." },
        { title: "Diseño de Producto", area: "Diseño & UX", icon: <Palette />, desc: "Diseña experiencias intuitivas que resuelven problemas reales de usuarios." },
        { title: "Ciencia de Datos", area: "Análisis & Big Data", icon: <BarChart3 />, desc: "Analiza patrones complejos para predecir tendencias y tomar decisiones." },
        { title: "Arquitectura Cloud", area: "Infraestructura IT", icon: <Globe />, desc: "Diseña y gestiona soluciones escalables y seguras en la nube." },
        { title: "Ciberseguridad", area: "Seguridad Digital", icon: <ShieldCheck />, desc: "Protege activos digitales contra amenazas y vulnerabilidades críticas." },
        { title: "Desarrollo de IA", area: "Inteligencia Artificial", icon: <Cpu />, desc: "Desarrolla modelos de aprendizaje automático y redes neuronales avanzadas." },
    ];

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#b4b8c0_0%,_#e5e7eb_100%)] p-8 pt-32 relative overflow-hidden">

            {/* CAPA DE FONDO: Rombos sutiles de MeVocatio */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none z-0">
                <div className="absolute w-[50rem] h-[50rem] border-[60px] border-slate-400 rotate-45 -translate-x-1/2 shadow-2xl"></div>
                <div className="absolute w-[50rem] h-[50rem] border-[60px] border-slate-400 rotate-45 translate-x-1/2 shadow-2xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Saludo Personalizado Traducido */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] tracking-tight italic">
                        Bienvenid@, <span className="opacity-70">{userName}</span>
                    </h1>
                    <p className="text-slate-600 font-black mt-2 uppercase text-[11px] tracking-[0.4em]">
                        Listo para empezar a pulir tu profesión
                    </p>
                </header>

                {/* Buscador y Filtros en Español */}
                <div className="flex gap-4 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar profesiones o áreas de interés..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20 transition-all text-sm font-bold text-[#1e293b]"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl font-black text-[#1e293b] shadow-sm hover:bg-white transition-all text-[11px] uppercase tracking-widest active:scale-95">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </button>
                </div>

                {/* Grid de Profesiones Traducido */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {professions.map((job, index) => (
                        <div key={index} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-white/50 shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all group cursor-pointer hover:-translate-y-2">
                            <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-[#1e293b] mb-6 group-hover:bg-[#1e293b] group-hover:text-white transition-all duration-300 shadow-inner">
                                {job.icon}
                            </div>
                            <h3 className="text-xl font-black text-[#1e293b] mb-1">{job.title}</h3>
                            <p className="text-[#1e293b] text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">{job.area}</p>
                            <p className="text-slate-600 text-sm leading-relaxed font-bold italic opacity-80">{job.desc}</p>
                        </div>
                    ))}
                </div>

                {/* TARJETA DE IA EN ESPAÑOL */}
                <div className="bg-[#1e293b] rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_50px_rgba(30,41,59,0.4)] relative overflow-hidden border border-slate-700">
                    <div className="z-10 text-center md:text-left">
                        <h2 className="text-white text-3xl font-black mb-2 tracking-tight">¿No sabes qué elegir?</h2>
                        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em]">
                            Aquí te ayudamos a encontrar tu perfil profesional ideal 
                        </p>
                    </div>

                    <button className="z-10 mt-8 md:mt-0 bg-white text-[#1e293b] px-12 py-4 rounded-md font-black flex items-center gap-3 hover:bg-slate-100 transition-all shadow-xl active:scale-95 text-[12px] uppercase tracking-[0.2em] border border-slate-200">
                        Iniciar test con IA
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl -mr-32 -mb-32"></div>
                </div>

            </div>
        </main>
    );
}