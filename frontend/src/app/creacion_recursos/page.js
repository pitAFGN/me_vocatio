"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PlanSelector from "@/components/creacion_recursos/PlanSelector";
import CourseBasicForm from "@/components/creacion_recursos/CourseBasicForm";
import CourseCustomizationPanel from "@/components/creacion_recursos/CourseCustomizationPanel";
import ResourceStructurePanel from "@/components/creacion_recursos/ResourceStructurePanel";
import AnalyticsPanel from "@/components/creacion_recursos/AnalyticsPanel";
<<<<<<< HEAD
import { usePayment } from "@/hooks/usePayment";
=======
import PlanSelectionModal from "@/components/PlanSelectionModal";

const FREE_RESOURCE_LIMIT = 3;
>>>>>>> origin/dev

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
    category: "Diseño",
    level: "Principiante",
    modality: "Virtual",
    duration_hours: "",
    price: "",
  });

  const { pagarCurso, cargando, error } = usePayment();
  const [mensaje, setMensaje] = useState(null);

  const isPremium = plan === "premium";

<<<<<<< HEAD
  const handlePublicarYPagar = () => {
    setMensaje(null);
    pagarCurso(
      {
        title: curso.nombre,
        description: curso.descripcion,
        category: curso.category,
        level: curso.level,
        modality: curso.modality,
        duration_hours: curso.duration_hours ? Number(curso.duration_hours) : undefined,
        price: Number(curso.price),
      },
      {
        onExito: () => setMensaje({ tipo: "ok", texto: "¡Pago aprobado! Tu curso quedó activo." }),
        onError: (msg) => setMensaje({ tipo: "error", texto: msg }),
        onCerrado: () => setMensaje({ tipo: "info", texto: "Cerraste la ventana de pago sin terminar." }),
      }
    );
=======
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
>>>>>>> origin/dev
  };

  const toggleBadge = (badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((item) => item !== badge) : [...prev, badge]
    );
  };

  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
              Creador / Recursos
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
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

            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
              <button
                type="button"
                onClick={handlePublicarYPagar}
                disabled={cargando || !curso.price}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cargando ? "Abriendo pasarela de pago..." : "Publicar y pagar con Wompi"}
              </button>

              {mensaje && (
                <p
                  className={`mt-3 text-sm font-medium ${
                    mensaje.tipo === "ok"
                      ? "text-emerald-400"
                      : mensaje.tipo === "error"
                      ? "text-red-400"
                      : "text-slate-400"
                  }`}
                >
                  {mensaje.texto}
                </p>
              )}
              {error && !mensaje && <p className="mt-3 text-sm font-medium text-red-400">{error}</p>}
            </div>

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

          <div className="space-y-6">
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
