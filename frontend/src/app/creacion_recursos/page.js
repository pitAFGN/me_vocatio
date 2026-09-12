"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PlanSelector from "@/components/creacion_recursos/PlanSelector";
import CourseBasicForm from "@/components/creacion_recursos/CourseBasicForm";
import CourseCustomizationPanel from "@/components/creacion_recursos/CourseCustomizationPanel";
import ResourceStructurePanel from "@/components/creacion_recursos/ResourceStructurePanel";
import AnalyticsPanel from "@/components/creacion_recursos/AnalyticsPanel";
import PlanSelectionModal from "@/components/PlanSelectionModal";
import Toast from "@/components/Toast";
import ResourceModal from "@/components/creacion_recursos/ResourceModal";

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
  
  // UI States
  const [mostrarPlanModal, setMostrarPlanModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  
  // Edit State
  const [myCourses, setMyCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  // Form States
  const [recursos, setRecursos] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(
    "bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950"
  );
  const [selectedBadges, setSelectedBadges] = useState(["Elite"]);
  const [curso, setCurso] = useState({
    nombre: "",
    url: "",
    descripcion: "",
  });

  const isPremium = plan === "premium";

  // Cargar mis cursos para poder editarlos
  useEffect(() => {
    const fetchMisCursos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses/mios`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setMyCourses(data);
        }
      } catch (e) {
        console.error("Error fetching courses", e);
      }
    };
    fetchMisCursos();
  }, []);

  const handleCargarCursoParaEditar = async (courseId) => {
    if (!courseId) {
      setEditingCourseId(null);
      setCurso({ nombre: "", url: "", descripcion: "" });
      setRecursos([]);
      setSelectedBackground("bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950");
      setSelectedBadges(["Elite"]);
      return;
    }

    try {
      setToast({ message: "Cargando curso...", type: "success" });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setEditingCourseId(data.id);
        setCurso({
          nombre: data.title || "",
          url: "",
          descripcion: data.description || "",
        });
        setSelectedBackground(data.background_style || "bg-slate-950");
        
        try {
          setSelectedBadges(typeof data.badges === 'string' ? JSON.parse(data.badges) : (data.badges || []));
        } catch(e) {
          setSelectedBadges([]);
        }

        if (data.lessons && Array.isArray(data.lessons)) {
          setRecursos(data.lessons.map(l => ({
            id: l.id, // Mantener el ID original
            title: l.title,
            type: l.content || "Video",
            url: l.video_url || ""
          })));
        } else {
          setRecursos([]);
        }
        
        setToast({ message: "Curso cargado para editar", type: "success" });
      }
    } catch (e) {
      setToast({ message: "Error al cargar el curso", type: "error" });
    }
  };

  const cambiarPlan = (nextPlan) => {
    setPlan(nextPlan);
    window.localStorage.setItem("mevocatio_plan", nextPlan);
  };

  const openResourceModal = () => {
    if (!isPremium && recursos.length >= FREE_RESOURCE_LIMIT) {
      setMostrarPlanModal(true);
      return;
    }
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleEditResourceOpen = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleAddResource = (title, type, url) => {
    setRecursos((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        title: title,
        type: type || "Video",
        url: url || "",
      },
    ]);
  };

  const handleEditResourceSubmit = (id, title, type, url) => {
    setRecursos((prev) => prev.map(r => r.id === id ? { ...r, title, type, url } : r));
    setEditingResource(null);
  };

  const handleRemoveResource = (id) => {
    setRecursos((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleBadge = (badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((item) => item !== badge) : [...prev, badge]
    );
  };

  const handleGuardarCurso = async () => {
    if (!curso.nombre || !curso.descripcion) {
      setToast({ message: "Llena el nombre y descripción del curso.", type: "error" });
      return;
    }

    const payload = {
      title: curso.nombre,
      description: curso.descripcion,
      category: "Desarrollo",
      background_style: selectedBackground,
      badges: selectedBadges,
      lessons_list: recursos.map((r) => ({
        id: typeof r.id === 'number' ? r.id : undefined, // Enviar ID solo si es número (lección existente)
        title: r.title,
        content: r.type,
        video_url: r.url || ""
      })),
      status: "published"
    };

    try {
      const url = editingCourseId 
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses/${editingCourseId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses`;
        
      const res = await fetch(url, {
        method: editingCourseId ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        setToast({ message: `Error: ${errData.error || errData.message || "Datos inválidos"}`, type: "error" });
        return;
      }
      
      setToast({ message: editingCourseId ? "¡Curso actualizado exitosamente!" : "¡Curso publicado exitosamente!", type: "success" });
      
    } catch (error) {
      console.error("Fetch error:", error);
      setToast({ message: "Hubo un error de conexión.", type: "error" });
    }
  };

  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100 relative">
      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "success" })} 
      />

      {/* Resource Creation Modal */}
      <ResourceModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingResource(null); }}
        onAdd={handleAddResource}
        onEdit={handleEditResourceSubmit}
        editingResource={editingResource}
        lessonNumber={editingResource ? recursos.findIndex(r => r.id === editingResource.id) + 1 : recursos.length + 1}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
              Creador / Recursos
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Gestión de recursos y cursos
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row shrink-0 sm:items-center gap-3">
            {myCourses.length > 0 && (
              <div className="relative group">
                <select 
                  value={editingCourseId || ""}
                  onChange={(e) => handleCargarCursoParaEditar(e.target.value)}
                  className="appearance-none bg-slate-900/80 border border-slate-700 text-slate-200 text-[11px] font-bold uppercase tracking-wider rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-violet-500 hover:border-violet-400/60 hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-black/20 w-full sm:w-auto"
                >
                  <option value="">+ Nuevo Curso</option>
                  <optgroup label="Mis Cursos">
                    {myCourses.map(course => (
                      <option key={course.id} value={course.id} className="bg-slate-900 text-sm normal-case tracking-normal">
                        Editar: {course.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-violet-400 transition-colors">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            )}

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200 transition-colors hover:border-violet-400/60 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Volver</span>
            </Link>

            <button 
              onClick={handleGuardarCurso}
              className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 active:scale-95 transition-all text-center"
            >
              {editingCourseId ? "Actualizar Curso" : "Publicar Curso"}
            </button>
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
              onCreateResource={openResourceModal}
              onRemoveResource={handleRemoveResource}
              onEditResource={handleEditResourceOpen}
              onUpgrade={() => setMostrarPlanModal(true)}
            />
          </div>

          <div className="space-y-6">
            <AnalyticsPanel
              isPremium={isPremium}
              onUpgrade={() => setMostrarPlanModal(true)}
              resources={recursos}
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
