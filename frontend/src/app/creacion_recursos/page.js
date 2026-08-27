"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PlanSelector from "@/components/creacion_recursos/PlanSelector";
import CourseBasicForm from "@/components/creacion_recursos/CourseBasicForm";
import CourseCustomizationPanel from "@/components/creacion_recursos/CourseCustomizationPanel";
import ResourceStructurePanel from "@/components/creacion_recursos/ResourceStructurePanel";
import AnalyticsPanel from "@/components/creacion_recursos/AnalyticsPanel";
import PlanSelectionModal from "@/components/PlanSelectionModal";

const FREE_RESOURCE_LIMIT = 3;

const metricCards = [
  { label: "Estudiantes totales", value: "2.4K", delta: "+12.4%" },
  { label: "Tasa de finalización", value: "78%", delta: "+6.1%" },
  { label: "Tiempo de estudio", value: "4h 32m", delta: "+1h 10m" },
];

const funnelData = [
  { step: "Inicio del curso", value: 100, color: "bg-violet-500" },
  { step: "Lección 1", value: 82, color: "bg-purple-500" },
  { step: "Lección 2", value: 68, color: "bg-indigo-500" },
  { step: "Lección 3", value: 57, color: "bg-fuchsia-500" },
  { step: "Lección 4", value: 39, color: "bg-violet-400" },
  { step: "Finalización", value: 24, color: "bg-slate-500" },
];

const recentStudents = [
  { name: "Ana García", course: "UX Research", progress: "91%", status: "Activa" },
  { name: "Mateo Ruiz", course: "Product Design", progress: "74%", status: "En curso" },
  { name: "Sofía López", course: "Marketing Digital", progress: "88%", status: "Activa" },
  { name: "Daniel Cruz", course: "Data Storytelling", progress: "63%", status: "En curso" },
];

const backgroundOptions = [
  { name: "Oscuro", className: "bg-slate-950" },
  { name: "Violeta", className: "bg-violet-900/80" },
  { name: "Azul", className: "bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-950" },
  { name: "Luna", className: "bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950" },
];

const badgeOptions = ["Elite", "Top 10%", "Nuevo", "Bestseller", "En tendencia"];

export default function CreacionRecursosPage() {
  const [plan, setPlan] = useState(() => {
    if (typeof window === "undefined") return "free";
    const savedPlan = window.localStorage.getItem("mevocatio_plan");
    return savedPlan === "premium" ? "premium" : "free";
  });
  const [mostrarPlanModal, setMostrarPlanModal] = useState(false);
  const [recursos, setRecursos] = useState([
    { id: 1, title: "Introducción al diseño UX", type: "Video + guía práctica" },
    { id: 2, title: "Investigación de usuarios", type: "Video + guía práctica" },
    { id: 3, title: "Prototipado de soluciones", type: "Video + guía práctica" },
    { id: 4, title: "Presentación del proyecto", type: "Video + guía práctica" },
  ]);
  const [selectedBackground, setSelectedBackground] = useState(
    "bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950"
  );
  const [selectedBadges, setSelectedBadges] = useState(["Elite"]);
  const [curso, setCurso] = useState({
    nombre: "Curso de Diseño UX",
    url: "https://mevocatio.com/cursos/diseno-ux",
    descripcion: "Aprende a crear experiencias digitales claras, funcionales y estratégicas.",
  });

  const isPremium = plan === "premium";

  const cambiarPlan = (nextPlan) => {
    setPlan(nextPlan);
    window.localStorage.setItem("mevocatio_plan", nextPlan);
  };

  const crearRecurso = () => {
    if (!isPremium) {
      setMostrarPlanModal(true);
      return;
    }

    setRecursos((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: `Nuevo recurso ${prev.length + 1}`,
        type: "Video + guía práctica",
      },
    ]);
  };

  const toggleBadge = (badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((item) => item !== badge) : [...prev, badge]
    );
  };

  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Cabecera: Título a la izquierda y Botón + Vista previa a la derecha */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
              Creador / Recursos
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Gestión de recursos y cursos
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200 transition-colors hover:border-violet-400/60 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Volver</span>
            </Link>

            <div className="hidden rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-violet-100 md:block">
              Vista previa
            </div>
          </div>
        </div>

        <PlanSelector plan={plan} setPlan={cambiarPlan} />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <CourseBasicForm
              curso={curso}
              setCurso={setCurso}
              isPremium={isPremium}
              onUpgrade={() => setMostrarPlanModal(true)}
            />

            <CourseCustomizationPanel
              isPremium={isPremium}
              backgroundOptions={backgroundOptions}
              badgeOptions={badgeOptions}
              selectedBackground={selectedBackground}
              selectedBadges={selectedBadges}
              setSelectedBackground={setSelectedBackground}
              toggleBadge={toggleBadge}
              curso={curso}
            />

            <ResourceStructurePanel
              isPremium={isPremium}
              resources={recursos}
              freeResourceLimit={FREE_RESOURCE_LIMIT}
              onCreateResource={crearRecurso}
              onUpgrade={() => setMostrarPlanModal(true)}
            />
          </div>

          <div className="space-y-6 min-w-0">
            <AnalyticsPanel
              isPremium={isPremium}
              onUpgrade={() => setMostrarPlanModal(true)}
              metricCards={metricCards}
              funnelData={funnelData}
              recentStudents={recentStudents}
            />
          </div>
        </div>
      </div>

      {mostrarPlanModal && (
        <PlanSelectionModal
          onSelect={(selectedPlan) => {
            cambiarPlan(selectedPlan);
            setMostrarPlanModal(false);
          }}
        />
      )}
    </main>
  );
}