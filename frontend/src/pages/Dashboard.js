"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Code, Palette, BarChart3, Globe, ShieldCheck, Cpu,
  ArrowRight, ArrowLeft, CheckCircle2, LogOut, Search, SlidersHorizontal,
  Database, Layout, Smartphone, Server, Terminal, Cloud
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useRouteGuard";

const PROFESSIONS = [
  { id: 1, title: "Ingeniería de Software", area: "Tecnología & Desarrollo", icon: <Code className="w-5 h-5" />, desc: "Crea soluciones digitales complejas y arquitectura de sistemas innovadores." },
  { id: 2, title: "Diseño de Producto", area: "Diseño & UX", icon: <Palette className="w-5 h-5" />, desc: "Diseña experiencias intuitivas que resuelven problemas reales de usuarios." },
  { id: 3, title: "Ciencia de Datos", area: "Análisis de Datos", icon: <BarChart3 className="w-5 h-5" />, desc: "Analiza patrones complejos para predecir tendencias y decisiones." },
  { id: 4, title: "Arquitectura Cloud", area: "Infraestructura IT", icon: <Globe className="w-5 h-5" />, desc: "Diseña y gestiona soluciones escalables y seguras en la nube." },
  { id: 5, title: "Ciberseguridad", area: "Seguridad Digital", icon: <ShieldCheck className="w-5 h-5" />, desc: "Protege activos digitales contra amenazas y vulnerabilidades críticas." },
  { id: 6, title: "Desarrollo de IA", area: "Inteligencia Artificial", icon: <Cpu className="w-5 h-5" />, desc: "Desarrolla modelos de aprendizaje automático y redes neuronales avanzadas." },
  { id: 7, title: "Desarrollo Backend", area: "Tecnología", icon: <Database className="w-5 h-5" />, desc: "Domina la lógica del servidor y la gestión de bases de datos robustas." },
  { id: 8, title: "Especialista Frontend", area: "Desarrollo Web", icon: <Layout className="w-5 h-5" />, desc: "Crea interfaces visuales impactantes, dinámicas y de alto rendimiento." },
  { id: 9, title: "Desarrollo Móvil", area: "Apps Móviles", icon: <Smartphone className="w-5 h-5" />, desc: "Construye experiencias nativas fluidas para iOS y Android." },
  { id: 10, title: "Administración DB", area: "Datos", icon: <Server className="w-5 h-5" />, desc: "Optimiza y asegura la integridad de grandes volúmenes de información." },
  { id: 11, title: "DevOps Engineer", area: "Infraestructura", icon: <Terminal className="w-5 h-5" />, desc: "Automatiza procesos de despliegue y mejora la entrega de software." },
  { id: 12, title: "Ingeniería de Redes", area: "Sistemas", icon: <Cloud className="w-5 h-5" />, desc: "Diseña y mantiene infraestructuras de comunicación empresarial." },
];

const ITEMS_PER_PAGE = 6;

export default function Dashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { loading } = useProtectedRoute();
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-widest">
        Verificando acceso...
      </div>
    );
  }

  const handleConfirmSelection = () => {
    if (selectedId) {
      localStorage.setItem("mevocatio_active_vocation", selectedId);
      router.push(`/vocacion/${selectedId}`);
    }
  };

  // BUSCADOR FUNCIONAL: Filtrado en tiempo real por título o área
  const filteredProfessions = PROFESSIONS.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProfessions = filteredProfessions.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-[#f8fafc] p-8 pt-32 relative overflow-hidden font-sans">

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header estilo image_4faa20.png */}
        <header className="mb-8 flex justify-between items-end px-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight">
              Elige tu camino profesional
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">
              Descubre la carrera que mejor se adapta a tus talentos y pasiones.
            </p>
          </div>

          {/* Paginación minimalista */}
          <div className="flex gap-2">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className={`p-2.5 rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95 ${page === 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white text-slate-700 hover:bg-slate-50"}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(1)}
              disabled={page === 1 || filteredProfessions.length <= ITEMS_PER_PAGE}
              className={`p-2.5 rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95 ${page === 1 || filteredProfessions.length <= ITEMS_PER_PAGE ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white text-slate-700 hover:bg-slate-50"}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Barra de Búsqueda y Filtros */}
        <div className="flex gap-4 mb-8 px-2">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar profesiones o áreas de interés..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:border-slate-400 transition-colors shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            Filtros
          </button>
        </div>

        {/* Grilla de profesiones con iluminación azul oscuro original y elevación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {currentProfessions.map((job) => {
            const isSelected = selectedId === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedId(isSelected ? null : job.id)}
                className={`p-6 rounded-2xl border text-left transition-all duration-300 ease-out transform cursor-pointer ${isSelected
                    ? "bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fafc_100%)] border-[#1e293b] ring-4 ring-[#1e293b]/10 shadow-xl -translate-y-1.5"
                    : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5"
                  }`}
              >
                {/* Contenedor del icono reactivo al azul oscuro de la selección */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? "bg-[#1e293b] text-white" : "bg-slate-50 text-slate-600"}`}>
                  {job.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-0.5">
                  {job.title}
                </h3>

                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {job.area}
                </p>

                <p className="text-xs leading-relaxed text-slate-500 font-medium">
                  {job.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Si la búsqueda no arroja resultados */}
        {filteredProfessions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm mb-10">
            <p className="text-slate-400 font-medium text-sm">No encontramos profesiones que coincidan con tu búsqueda.</p>
          </div>
        )}

        {/* 🛠️ Banner Oscuro Inferior Premium */}
        <div className="rounded-2xl bg-[linear-gradient(135deg,_#1e293b_0%,_#0f172a_100%)] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl mb-12">

          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tight mb-1">
              ¿Listo para dar el siguiente paso?
            </h3>
            <p className="text-slate-400 text-xs font-medium max-w-xl">
              Confirma la profesión seleccionada arriba para generar tu diagnóstico personalizado de IA o sal de tu sesión si deseas continuar más tarde.
            </p>
          </div>

          {/* Botonera integrada interactiva */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

            {/* Confirmar: El botón de acción prioritario */}
            <button
              disabled={!selectedId}
              onClick={handleConfirmSelection}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${selectedId
                  ? "bg-white text-slate-900 hover:bg-slate-100 scale-105 active:scale-95 shadow-md"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                }`}
            >
              Confirmar Selección
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {/* Salir: Integrado discretamente pero accesible */}
            <button
              onClick={logout}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/60 hover:bg-red-950/40 text-slate-300 hover:text-red-400 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700/50 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}