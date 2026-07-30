"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, BrainCircuit, Target, Lightbulb,
  Briefcase, Compass, Award, Settings, LayoutDashboard
} from "lucide-react";

const PROFESSIONS = [
  { id: 1, title: "Ingeniería de Software", area: "Tecnología & Desarrollo", desc: "Crea soluciones digitales complejas y arquitectura de sistemas innovadores." },
  { id: 2, title: "Diseño de Producto", area: "Diseño & UX", desc: "Diseña experiencias intuitivas que resuelven problemas reales de usuarios." },
  { id: 3, title: "Ciencia de Datos", area: "Ciencia de Datos", desc: "Analiza patrones complejos para predecir tendencias y decisiones." },
  { id: 4, title: "Arquitectura Cloud", area: "Infraestructura IT", desc: "Diseña y gestiona soluciones escalables y seguras en la nube." },
  { id: 5, title: "Ciberseguridad", area: "Seguridad Digital", desc: "Protege activos digitales contra amenazas y vulnerabilidades críticas." },
  { id: 6, title: "Desarrollo de IA", area: "Inteligencia Artificial", desc: "Desarrolla modelos de aprendizaje automático y redes neuronales avanzadas." },
  { id: 7, title: "Desarrollo Backend", area: "Tecnología", desc: "Domina la lógica del servidor y la gestión de bases de datos robustas." },
  { id: 8, title: "Especialista Frontend", area: "Desarrollo Web", desc: "Crea interfaces visuales impactantes, dinámicas y de alto rendimiento." },
  { id: 9, title: "Desarrollo Móvil", area: "Apps Móviles", desc: "Construye experiencias nativas fluidas para iOS y Android." },
  { id: 10, title: "Administración DB", area: "Datos", desc: "Optimiza y asegura la integridad de grandes volúmenes de información." },
  { id: 11, title: "DevOps Engineer", area: "Infraestructura", desc: "Automatiza procesos de despliegue y mejora la entrega de software." },
  { id: 12, title: "Ingeniería de Redes", area: "Sistemas", desc: "Diseña y mantiene infraestructuras de comunicación empresarial." },
];

export default function VocacionDetalle() {
  const { id } = useParams();
  const router = useRouter();

  const vocacion = PROFESSIONS.find((item) => item.id === parseInt(id));

  if (!vocacion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e5e7eb] text-[#1e293b] font-sans">
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Vocación no encontrada</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-6 py-2.5 bg-[#1e293b] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e7eb] text-slate-800 font-sans flex">

      {/* Contenedor Principal de la Vista (Fondo gris premium) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto w-full pt-32">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1e293b] uppercase tracking-widest transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </button>
        {/* Header Superior Dinámico */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-300 pb-6">
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
              {vocacion.area}
            </span>
            <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">
              {vocacion.title}
            </h1>
          </div>

          <div className="bg-[#1e293b] border border-slate-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md">
            Ruta Activa
          </div>
        </header>

        {/* Bloque Principal del Enfoque Vocacional (Tarjeta blanca limpia) */}
        <section className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mb-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Definición Estratégica</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium mb-0">
            {vocacion.desc} Este ecosistema demanda un perfil analítico capaz de estructurar flujos lógicos complejos, resolver problemas con alta eficiencia y adaptarse a los retos modernos del sector.
          </p>
        </section>

        {/* Grid de Paneles Informativos (Tarjetas blancas limpias) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Panel Izquierdo: Competencias Clave */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 text-[#1e293b] rounded-xl border border-slate-200">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Núcleo de Competencias</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">
                Evaluación especializada enfocada en la madurez técnica, adaptabilidad al cambio y optimización de recursos globales de manera profesional.
              </p>
            </div>
            <div className="text-[10px] font-bold text-[#1e293b] uppercase tracking-wider">Perfil Recomendado • Nivel 4</div>
          </div>

          {/* Panel Derecho: Proyección de Impacto */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 text-[#1e293b] rounded-xl border border-slate-200">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Proyección Global</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">
                Inserción prioritaria en industrias de alta escalabilidad, optimización de sistemas distribuidos y liderazgo técnico de proyectos innovadores.
              </p>
            </div>
            <div className="text-[10px] font-bold text-[#334155] uppercase tracking-wider">Alta Demanda • Ecosistema ADSO</div>
          </div>

        </section>

        {/* Bloque Destacado de IA Inferior (NUESTRO LLAMADO A LA ACCIÓN AZUL OSCURO) */}
        <footer className="rounded-2xl bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_45%,_#1e293b_100%)] p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mx-auto sm:mx-0 shadow-inner">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white tracking-tight">Evaluación Diagnóstica con Inteligencia Artificial</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Habilita el test dinámico de 10 ítems contextualizados a esta especialidad.</p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/diagnostico/${vocacion.id}`)}
            className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#1e293b] hover:bg-slate-100 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            Iniciar Diagnóstico
            <Briefcase className="w-3.5 h-3.5" />
          </button>
        </footer>

      </main>
    </div>
  );
}