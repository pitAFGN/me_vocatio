'use client';

import { useState } from 'react';
import { Search, Filter, Code, Palette, BarChart3, Globe, ShieldCheck, Cpu, ArrowRight, ArrowLeft, CheckCircle2, Database, Layout, Smartphone, Server, Terminal, Cloud } from 'lucide-react';

export default function Dashboard() {
    const userName = "Usuario";
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(0);

    const professions = [
        // PÁGINA 1 (Índices 0-5)
        { id: 1, title: "Ingeniería de Software", area: "Tecnología", icon: <Code />, desc: "Crea soluciones digitales complejas y arquitectura de sistemas innovadores." },
        { id: 2, title: "Diseño de Producto", area: "Diseño & UX", icon: <Palette />, desc: "Diseña experiencias intuitivas que resuelven problemas reales de usuarios." },
        { id: 3, title: "Ciencia de Datos", area: "Análisis & Big Data", icon: <BarChart3 />, desc: "Analiza patrones complejos para predecir tendencias y decisiones." },
        { id: 4, title: "Arquitectura Cloud", area: "Infraestructura IT", icon: <Globe />, desc: "Diseña y gestiona soluciones escalables y seguras en la nube." },
        { id: 5, title: "Ciberseguridad", area: "Seguridad Digital", icon: <ShieldCheck />, desc: "Protege activos digitales contra amenazas y vulnerabilidades críticas." },
        { id: 6, title: "Desarrollo de IA", area: "Inteligencia Artificial", icon: <Cpu />, desc: "Desarrolla modelos de aprendizaje automático y redes neuronales avanzadas." },
        // PÁGINA 2 (Índices 6-11)
        { id: 7, title: "Desarrollo Backend", area: "Tecnología", icon: <Database />, desc: "Domina la lógica del servidor y la gestión de bases de datos robustas." },
        { id: 8, title: "Especialista Frontend", area: "Desarrollo Web", icon: <Layout />, desc: "Crea interfaces visuales impactantes, dinámicas y de alto rendimiento." },
        { id: 9, title: "Desarrollo Móvil", area: "Apps Móviles", icon: <Smartphone />, desc: "Construye experiencias nativas fluidas para iOS y Android." },
        { id: 10, title: "Administración DB", area: "Datos", icon: <Server />, desc: "Optimiza y asegura la integridad de grandes volúmenes de información." },
        { id: 11, title: "DevOps Engineer", area: "Infraestructura", icon: <Terminal />, desc: "Automatiza procesos de despliegue y mejora la entrega de software." },
        { id: 12, title: "Ingeniería de Redes", area: "Sistemas", icon: <Cloud />, desc: "Diseña y mantiene infraestructuras de comunicación empresarial." },
    ];

    const itemsPerPage = 6;
    const totalPages = Math.ceil(professions.length / itemsPerPage);
    const currentProfessions = professions.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#b4b8c0_0%,_#e5e7eb_100%)] p-8 pt-32 relative overflow-hidden">

            {/* FONDO ROMBOS */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none z-0">
                <div className="absolute w-[60rem] h-[60rem] border-[80px] border-slate-400 rotate-45 shadow-2xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                <header className="mb-12 flex justify-between items-end px-2">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] tracking-tight italic">
                            Bienvenid@, <span className="opacity-70">{userName}</span>
                        </h1>
                        <p className="text-slate-600 font-black mt-2 uppercase text-[11px] tracking-[0.4em]">
                            Selecciona tu área de interés para el diagnóstico
                        </p>
                    </div>

                    {/* BOTONES DE NAVEGACIÓN CON ESTADO DE COLOR */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setPage(0)}
                            className={`p-4 rounded-full border border-slate-300 transition-all shadow-lg active:scale-90
                                ${page === 0
                                    ? "bg-[#1e293b] text-white border-[#1e293b]"
                                    : "bg-white text-[#1e293b] hover:bg-slate-50"
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setPage(1)}
                            className={`p-4 rounded-full border border-slate-300 transition-all shadow-lg active:scale-90
                                ${page === 1
                                    ? "bg-[#1e293b] text-white border-[#1e293b]"
                                    : "bg-white text-[#1e293b] hover:bg-slate-50"
                                }`}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* GRID DE PROFESIONES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-in fade-in duration-500">
                    {currentProfessions.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => setSelectedId(job.id)}
                            className={`p-8 rounded-2xl border transition-all duration-300 group cursor-pointer hover:-translate-y-1
                                ${selectedId === job.id
                                    ? "bg-[#1e293b] border-[#1e293b] shadow-2xl scale-[1.02]"
                                    : "bg-white/90 border-white/50 shadow-md hover:shadow-xl hover:border-slate-400"
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-colors
                                ${selectedId === job.id ? "bg-white/20 text-white" : "bg-slate-100 text-[#1e293b] group-hover:bg-[#1e293b] group-hover:text-white"}`}>
                                {job.icon}
                            </div>

                            <h3 className={`text-xl font-black mb-1 ${selectedId === job.id ? "text-white" : "text-[#1e293b]"}`}>
                                {job.title}
                            </h3>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-4 
                                ${selectedId === job.id ? "text-white/60" : "text-slate-400 font-bold"}`}>
                                {job.area}
                            </p>
                            <p className={`text-sm leading-relaxed font-bold italic 
                                ${selectedId === job.id ? "text-white/80" : "text-slate-600 opacity-80"}`}>
                                {job.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* BOTÓN DE CONFIRMACIÓN */}
                <div className="flex justify-center mb-16">
                    <button
                        disabled={!selectedId}
                        className={`px-16 py-4 rounded-md font-black text-[12px] uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center gap-4
                        ${selectedId
                                ? "bg-[#1e293b] text-white hover:bg-slate-800 scale-105 active:scale-95"
                                : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-50"}`}
                    >
                        Confirmar Selección
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                </div>

                {/* TARJETA IA */}
                <div className="bg-[#1e293b] rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between shadow-[0_30px_60px_rgba(30,41,59,0.4)] relative overflow-hidden border border-slate-700 mx-2">
                    <div className="z-10 text-center md:text-left">
                        <h2 className="text-white text-3xl font-black mb-2 tracking-tight">¿No sabes qué elegir?</h2>
                        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em]">
                            Usa nuestra IA para descubrir tu vocación ideal
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