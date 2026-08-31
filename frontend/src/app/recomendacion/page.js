"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Sparkles,
  Compass,
  Layers,
  Video,
  GraduationCap,
  Terminal,
  BookOpen,
  Wrench,
  ExternalLink,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Search,
  PlusCircle,
  Clock,
  Target,
  ShieldCheck,
  Bot,
  Filter,
  Flame,
  Award,
  ChevronRight
} from "lucide-react";
import { API_URL } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import "./RecomendacionPage.css";

import SidebarNav from "@/components/SidebarNav";
import AchievementToast from "@/components/AchievementToast";
import ResourceAiModal from "@/components/ResourceAiModal";
import PlanSelectionModal from "@/components/PlanSelectionModal";

function RecomendacionContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const searchParams = useSearchParams();
  const peticionInicialRealizada = useRef(false);

  // 1. Parámetros de la URL
  const profesionURL = searchParams.get("profesion") || searchParams.get("vocacion") || "Desarrollo de Software";
  const nivelURL = searchParams.get("nivel") || "Principiante";
  const evaluationIdURL = searchParams.get("evaluation_id") || null;

  // Estado del Plan (free vs premium)
  const [plan, setPlan] = useState(() => {
    if (typeof window === "undefined") return "free";
    return window.localStorage.getItem("mevocatio_plan") === "premium" ? "premium" : "free";
  });
  const isPremium = plan === "premium";

  const [cargando, setCargando] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);

  const [paginasRecursos, setPaginasRecursos] = useState([]);
  const [urlsVistas, setUrlsVistas] = useState([]);
  const [paginaActualIndex, setPaginaActualIndex] = useState(0);

  // Filtros interactivos
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Modales
  const [selectedResourceForAi, setSelectedResourceForAi] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    const savedAchievements = localStorage.getItem("mevocatio_new_achievements");
    if (!savedAchievements) return;

    try {
      setNewAchievements(JSON.parse(savedAchievements));
    } catch {
      localStorage.removeItem("mevocatio_new_achievements");
    }
  }, []);

  // Animación de pasos mientras carga la IA
  useEffect(() => {
    if (!cargando) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [cargando]);

  const cambiarPlan = (nuevoPlan) => {
    setPlan(nuevoPlan);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mevocatio_plan", nuevoPlan);
    }
    setIsPlanModalOpen(false);
  };

  // Función temporal de prueba para simular el desbloqueo de una insignia
  const activarLogroPrueba = () => {
    const logrosPrueba = ["explorer"]; // "Explorador Vocacional"
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mevocatio_new_achievements", JSON.stringify(logrosPrueba));
      window.dispatchEvent(new Event("local-storage-update"));
    }
    setNewAchievements(logrosPrueba);
  };

  const obtenerIconoTipo = (tipo) => {
    const t = (tipo || "").toLowerCase();
    if (t.includes("video")) return <Video className="w-4 h-4 text-red-400" />;
    if (t.includes("doc") || t.includes("guia")) return <Terminal className="w-4 h-4 text-emerald-400" />;
    if (t.includes("curso")) return <GraduationCap className="w-4 h-4 text-sky-400" />;
    if (t.includes("libro")) return <BookOpen className="w-4 h-4 text-amber-400" />;
    if (t.includes("herramienta") || t.includes("practica")) return <Wrench className="w-4 h-4 text-purple-400" />;
    return <Compass className="w-4 h-4 text-slate-400" />;
  };

  const obtenerTextoBoton = (tipo, plataforma) => {
    const t = (tipo || "").toLowerCase();
    if (t.includes("video")) return "▶ Ver en YouTube";
    if (t.includes("doc") || t.includes("guia") || t.includes("guía")) return "📖 Leer documentación";
    if (t.includes("curso")) return plataforma ? `🎓 Explorar (${plataforma})` : "🎓 Explorar curso";
    if (t.includes("libro")) return "📚 Ver libro / guía";
    if (t.includes("herramienta") || t.includes("práctica") || t.includes("practica")) return "🛠️ Ir a la herramienta";
    return "🔗 Ir al recurso";
  };

  const handleOpenAiAssistant = (material) => {
    setSelectedResourceForAi(material);
    setIsAiModalOpen(true);
  };

  // Petición a la API
  const ejecutarPeticion = useCallback(
    async (vocacionQuery, nivelQuery, urlsActuales = []) => {
      if (!vocacionQuery) return;

      setCargando(true);
      setError(null);
      setLoadingStep(0);

      try {
        const response = await fetch(`${API_URL}/api/recomendar`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            evaluation_id: evaluationIdURL,
            vocation: vocacionQuery,
            nivel: nivelQuery,
            evitarUrls: urlsActuales,
          }),
        });

        if (!response.ok) {
          const textoError = await response.text();
          console.error("Error crudo del backend:", textoError);
          throw new Error(`Error en el servidor (${response.status}).`);
        }

        const data = await response.json();

        if (data.materiales && Array.isArray(data.materiales)) {
          const nuevasUrls = data.materiales.map((m) => m.url);
          setUrlsVistas((prev) => [...prev, ...nuevasUrls]);
          setPaginasRecursos((prev) => {
            const nuevoHistorial = [...prev, data];
            setPaginaActualIndex(nuevoHistorial.length - 1);
            return nuevoHistorial;
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    },
    [evaluationIdURL]
  );

  useEffect(() => {
    if (profesionURL && !peticionInicialRealizada.current) {
      peticionInicialRealizada.current = true;
      ejecutarPeticion(profesionURL, nivelURL, []);
    }
  }, [profesionURL, nivelURL, ejecutarPeticion]);

  const manejarCargarMas = () => {
    ejecutarPeticion(profesionURL, nivelURL, urlsVistas);
  };

  // Filtrado de materiales en la página activa
  const materialesActuales = paginasRecursos[paginaActualIndex]?.materiales || [];
  const materialesFiltrados = materialesActuales.filter((material) => {
    const coincideTipo =
      tipoFiltro === "todos" ||
      (material.tipo || "").toLowerCase().includes(tipoFiltro.toLowerCase());

    const coincideBusqueda =
      !filtroBusqueda.trim() ||
      material.titulo.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      material.descripcion.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      (material.plataforma && material.plataforma.toLowerCase().includes(filtroBusqueda.toLowerCase()));

    return coincideTipo && coincideBusqueda;
  });

  return (
    <div className="bg-[#040613] text-slate-100 min-h-screen relative overflow-x-hidden">
      {/* Ambient Glows a juego con el Dashboard */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar Nav Fijo del Dashboard */}
      <SidebarNav logout={logout} />

      {/* Toast de Logros */}
      <AchievementToast
        achievementCodes={newAchievements}
        onClose={() => {
          setNewAchievements([]);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("mevocatio_new_achievements");
            window.dispatchEvent(new Event("local-storage-update"));
          }
        }}
      />

      {/* Modal de Copiloto IA */}
      <ResourceAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        resource={selectedResourceForAi}
        vocation={profesionURL}
        nivel={nivelURL}
        isPremium={isPremium}
        onUpgrade={() => {
          setIsAiModalOpen(false);
          setIsPlanModalOpen(true);
        }}
      />

      {/* Modal de Planes */}
      {isPlanModalOpen && <PlanSelectionModal onSelect={cambiarPlan} />}

      {/* Contenedor Principal con margen para la Sidebar */}
      <main className="md:pl-64 pt-6 sm:pt-8 px-4 sm:px-6 md:px-10 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Superior del Dashboard */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">
                  Plan de Estudio Personalizado
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-bold text-indigo-300">
                  IA Curated
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Rutas de Aprendizaje
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Recursos estratégicos y mentoría con Gemini para{" "}
                <strong className="text-white">{profesionURL}</strong>
              </p>
            </div>

            {/* Acciones de Cabecera */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Botón de Prueba de Insignias (Temporal para testing) */}
              <button
                onClick={activarLogroPrueba}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Haz clic para probar la notificación y el '!' rojo en el sidebar"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>🏆 Probar Insignia</span>
              </button>

              <button
                onClick={() => setIsPlanModalOpen(true)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-md ${
                  isPremium
                    ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border-violet-500/50 text-violet-200 hover:border-violet-400 hover:shadow-violet-500/20"
                    : "bg-white/5 border-white/10 text-slate-300 hover:border-slate-400 hover:text-white"
                }`}
              >
                {isPremium ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                    <span>PLAN PREMIUM ACTIVO</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>PLAN GRATUITO (MEJORAR)</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Top Hero Banner: AI Mentor Capsule (Opción 2) */}
          <div className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-r from-[#0a0d22]/90 via-[#0e122b]/90 to-[#080a1a]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Glow Decorativo */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Fila 1: Título Vocación, Nivel y Botón de Copiloto */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400">
                      Misión de Aprendizaje • Bloque {paginasRecursos.length > 0 ? paginaActualIndex + 1 : 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-[9px] font-bold text-violet-300 uppercase tracking-wider">
                      Nivel {nivelURL}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {profesionURL}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    if (materialesActuales.length > 0) {
                      handleOpenAiAssistant(materialesActuales[0]);
                    } else {
                      setIsPlanModalOpen(true);
                    }
                  }}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-violet-200 animate-pulse" />
                  <span>CONSULTAR COPILOTO IA</span>
                </button>
              </div>

              {/* Fila 2: Enfoque Pedagógico / Misión con comillas y estilo mentor */}
              {paginasRecursos.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Enfoque Pedagógico de Gemini:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    "{paginasRecursos[paginaActualIndex].resumen_enfoque}"
                  </p>
                </div>
              )}

              {/* Fila 3: Inventario Dinámico de Recursos en este Bloque */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inventario del Bloque:</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  {(() => {
                    const conteo = {
                      video: materialesActuales.filter((m) => (m.tipo || "").toLowerCase().includes("video")).length,
                      curso: materialesActuales.filter((m) => (m.tipo || "").toLowerCase().includes("curso")).length,
                      doc: materialesActuales.filter((m) => (m.tipo || "").toLowerCase().includes("doc") || (m.tipo || "").toLowerCase().includes("guia")).length,
                      libro: materialesActuales.filter((m) => (m.tipo || "").toLowerCase().includes("libro")).length,
                      herramienta: materialesActuales.filter((m) => (m.tipo || "").toLowerCase().includes("herramienta") || (m.tipo || "").toLowerCase().includes("practica")).length,
                    };
                    return (
                      <>
                        <span className="px-3 py-1 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-[11px] font-bold shrink-0 flex items-center gap-1">
                          <Video className="w-3 h-3" /> {conteo.video || 1} Video
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-300 text-[11px] font-bold shrink-0 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> {conteo.curso || 1} Curso
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold shrink-0 flex items-center gap-1">
                          <Terminal className="w-3 h-3" /> {conteo.doc || 1} Doc Oficial
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-bold shrink-0 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {conteo.libro || 1} Libro
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[11px] font-bold shrink-0 flex items-center gap-1">
                          <Wrench className="w-3 h-3" /> {conteo.herramienta || 1} Lab/Herramienta
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar de Navegación de Bloques & Filtros */}
          <div className="space-y-4 pt-2">
            
            {/* Fila 1: Píldoras de Bloques y Botón Generar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> Bloques de Estudio:
                </span>
                {paginasRecursos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPaginaActualIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                      paginaActualIndex === idx
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-400/60 text-white shadow-lg shadow-violet-500/25"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    Bloque {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={manejarCargarMas}
                disabled={cargando}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-violet-300 hover:text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{cargando ? "Generando..." : "Generar Siguiente Bloque (IA)"}</span>
              </button>
            </div>

            {/* Fila 2: Filtros por Categoría y Buscador */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Pills de Categoría */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: "todos", label: `Todos (${materialesActuales.length})` },
                  { id: "video", label: "▶ Videos" },
                  { id: "curso", label: "🎓 Cursos" },
                  { id: "doc", label: "📖 Documentación" },
                  { id: "libro", label: "📚 Libros" },
                  { id: "herramienta", label: "🛠️ Herramientas" },
                ].map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setTipoFiltro(categoria.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                      tipoFiltro === categoria.id
                        ? "bg-indigo-600/30 border-indigo-400/60 text-white"
                        : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {categoria.label}
                  </button>
                ))}
              </div>

              {/* Buscador de Recursos */}
              <div className="relative w-full md:w-64 shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  placeholder="Buscar en este bloque..."
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs sm:text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          {/* ESTADO DE CARGA: Futuristic AI Generation HUD */}
          {cargando && (
            <div className="space-y-8 my-10">
              
              {/* Radar Card HUD */}
              <div className="bg-gradient-to-br from-slate-900/90 via-[#0a0f26]/90 to-slate-900/90 border border-violet-500/30 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 mx-auto mb-4 ai-radar-glow">
                  <Sparkles className="w-8 h-8 animate-pulse text-violet-400" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Gemini está estructurando tu Ruta de Recursos
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Curando contenido sin enlaces rotos, ordenado para <span className="text-sky-400 font-bold">{profesionURL}</span> ({nivelURL}).
                </p>

                {/* Pasos animados del proceso */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      loadingStep >= 0
                        ? "bg-violet-950/40 border-violet-500/40 text-violet-200"
                        : "bg-white/5 border-white/5 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Paso 1
                    </div>
                    <p className="text-[11px]">Validando fuentes y enlaces canónicos</p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      loadingStep >= 1
                        ? "bg-violet-950/40 border-violet-500/40 text-violet-200"
                        : "bg-white/5 border-white/5 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold mb-1">
                      <Video className="w-3.5 h-3.5 text-sky-400" /> Paso 2
                    </div>
                    <p className="text-[11px]">Seleccionando mejores cursos & videos</p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      loadingStep >= 2
                        ? "bg-violet-950/40 border-violet-500/40 text-violet-200"
                        : "bg-white/5 border-white/5 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Paso 3
                    </div>
                    <p className="text-[11px]">Generando enfoque y resumen pedagógico</p>
                  </div>
                </div>
              </div>

              {/* Skeleton Cards Shimmer a juego con el Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 overflow-hidden"
                  >
                    <div className="h-28 rounded-xl rec-skeleton-shimmer" />
                    <div className="h-4 w-3/4 rounded rec-skeleton-shimmer" />
                    <div className="h-3 w-full rounded rec-skeleton-shimmer" />
                    <div className="h-3 w-5/6 rounded rec-skeleton-shimmer" />
                    <div className="h-9 rounded-xl rec-skeleton-shimmer" />
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* CUADRÍCULA DE TARJETAS DE RECURSOS */}
          {!cargando && paginasRecursos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialesFiltrados.map((material, index) => {
                const tipoKey = (material.tipo || "recurso").toLowerCase().replace(/\s+/g, "");
                return (
                  <div
                    key={index}
                    className="bg-white/[0.04] border border-white/10 hover:border-violet-500/40 hover:bg-white/[0.07] backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 group"
                  >
                    {/* Banner Temático Superior */}
                    <div className={`h-24 p-3.5 flex items-start justify-between relative overflow-hidden rec-banner-${tipoKey}`}>
                      {/* Badge de Categoría */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0b14]/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider z-10">
                        {obtenerIconoTipo(material.tipo)}
                        <span>{material.tipo || "Recurso"}</span>
                      </span>

                      {/* Chip de Gemini AI */}
                      <button
                        onClick={() => handleOpenAiAssistant(material)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/50 text-[10px] font-black text-violet-200 uppercase tracking-wider transition-colors cursor-pointer z-10"
                        title="Analizar con Gemini Copilot"
                      >
                        <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
                        <span>Gemini AI</span>
                      </button>
                    </div>

                    {/* Cuerpo de la Tarjeta */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div className="space-y-2">
                        {material.plataforma && (
                          <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                            📍 {material.plataforma}
                          </span>
                        )}

                        <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-violet-200 transition-colors">
                          {material.titulo}
                        </h4>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {material.descripcion}
                        </p>
                      </div>

                      {/* Acciones de la Tarjeta */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        {/* Botón Secundario: Analizar con Gemini Copilot */}
                        <button
                          onClick={() => handleOpenAiAssistant(material)}
                          className="w-full py-2 px-3 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 hover:border-violet-400 text-violet-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isPremium ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                              <span>✨ Analizar con Gemini</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>✨ Resumen con Gemini (Premium)</span>
                            </>
                          )}
                        </button>

                        {/* Botón Primario: Ir al Recurso Canónico/Verificado */}
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/15"
                        >
                          <span>{obtenerTextoBoton(material.tipo, material.plataforma)}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sin resultados tras filtrar */}
          {!cargando && materialesFiltrados.length === 0 && paginasRecursos.length > 0 && (
            <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <Compass className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">
                No se encontraron recursos con este filtro
              </h3>
              <p className="text-xs text-slate-400">
                Prueba cambiando la categoría o borrando el texto del buscador.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function RecomendacionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#040613] text-white flex items-center justify-center text-sm font-bold">
          Cargando rutas de aprendizaje...
        </div>
      }
    >
      <RecomendacionContent />
    </Suspense>
  );
}