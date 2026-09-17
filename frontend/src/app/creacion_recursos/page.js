"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import PlanSelector from "@/components/creacion_recursos/PlanSelector";
import CourseBasicForm from "@/components/creacion_recursos/CourseBasicForm";
import CourseCustomizationPanel from "@/components/creacion_recursos/CourseCustomizationPanel";
import ResourceStructurePanel from "@/components/creacion_recursos/ResourceStructurePanel";
import AnalyticsPanel from "@/components/creacion_recursos/AnalyticsPanel";
import PlanSelectionModal from "@/components/PlanSelectionModal";
import Toast from "@/components/Toast";
import ResourceModal from "@/components/creacion_recursos/ResourceModal";
import ConfirmModal from "@/components/ConfirmModal";

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

const estadoCursoParsed = (status) => {
  switch (status) {
    case "activo":
    case "published":
      return { texto: "Aprobado", clase: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400" };
    case "revision":
      return { texto: "En revisión", clase: "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400" };
    case "rechazado":
      return { texto: "Rechazado", clase: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-400" };
    case "borrador":
    case "draft":
      return { texto: "Borrador", clase: "bg-slate-200 dark:bg-slate-700/40 border-slate-400/60 dark:border-slate-600 text-slate-600 dark:text-slate-300" };
    case "inactivo":
      return { texto: "Inactivo (oculto)", clase: "bg-slate-200 dark:bg-slate-700/40 border-slate-400/60 dark:border-slate-600 text-slate-600 dark:text-slate-300" };
    default:
      return { texto: "En revisión", clase: "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400" };
  }
};

export default function CreacionRecursosPage() {
  const { user } = useProtectedRoute();
  const isPremium = user?.plan === "premium";

  // UI States
  const [mostrarPlanModal, setMostrarPlanModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Edit State
  const [myCourses, setMyCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const guardandoRef = useRef(false);
  const [cursoEstado, setCursoEstado] = useState("revision");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, courseId: null });
  const [ocultando, setOcultando] = useState(false);

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
    categoria: "Desarrollo",
  });

  const fetchMisCursos = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses/mios`,
        {
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        setMyCourses(data);
      }
    } catch (e) {
      console.error("Error fetching courses", e);
    }
  };

  // Cargar mis cursos para poder editarlos
  useEffect(() => {
    fetchMisCursos();
  }, []);

  const handleCargarCursoParaEditar = async (courseId) => {
      if (!courseId) {
        setEditingCourseId(null);
        setCurso({ nombre: "", url: "", descripcion: "" });
        setRecursos([]);
        setSelectedBackground(
          "bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950"
        );
        setSelectedBadges(["Elite"]);
        setCursoEstado("revision");
        return;
      }

      try {
        setToast({ message: "Cargando curso...", type: "success" });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses/${courseId}`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();

          setEditingCourseId(data.id);
          
          setCursoEstado(data.status || "revision");

          setCurso({
            nombre: data.title || "",
            url: "",
            descripcion: data.description || "",
          });

          setSelectedBackground(
            data.background_style || "bg-slate-950"
          );

          try {
            setSelectedBadges(
              typeof data.badges === "string"
                ? JSON.parse(data.badges)
                : data.badges || []
            );
          } catch (e) {
            setSelectedBadges([]);
          }

          if (data.lessons && Array.isArray(data.lessons)) {
            setRecursos(
              data.lessons.map((l) => ({
                id: l.id,
                title: l.title,
                type: l.content || "Video",
                url: l.video_url || "",
                isActive:
                  l.is_active !== undefined ? l.is_active : true,
              }))
            );
          } else {
            setRecursos([]);
          }

          setToast({
            message: "Curso cargado para editar",
            type: "success",
          });
        }
      } catch (e) {
        console.error("Error loading course:", e);
        setToast({
          message: "Error al cargar el curso",
          type: "error",
        });
      }
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
          isActive: true
        },
      ]);
    };

    const handleEditResourceSubmit = (id, title, type, url) => {
      setRecursos((prev) => prev.map(r => r.id === id ? { ...r, title, type, url } : r));
      setEditingResource(null);
    };

    const handleToggleResourceActive = (id) => {
      setRecursos((prev) => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
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
      if (guardandoRef.current) return;
      guardandoRef.current = true;

      if (!curso.nombre || !curso.descripcion) {
        setToast({ message: "Llena el nombre y descripción del curso.", type: "error" });
        guardandoRef.current = false;
        return;
      }

      if (recursos.length === 0) {
        setToast({ message: "No puedes publicar un curso vacío. Agrega al menos un recurso.", type: "error" });
        guardandoRef.current = false;
        return;
      }

      const payload = {
        title: curso.nombre,
        description: curso.descripcion,
        category: curso.categoria || "Desarrollo",
        background_style: selectedBackground,
        badges: selectedBadges,
        lessons_list: recursos.map((r) => ({
          id: typeof r.id === 'number' ? r.id : undefined, // Enviar ID solo si es número (lección existente)
          title: r.title,
          content: r.type,
          video_url: r.url || "",
          is_active: r.isActive
        })),
        ...(editingCourseId && cursoEstado === "rechazado" ? { status: "revision" } : {}),
      };

      try {
        setGuardando(true);

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
          if (errData.code === "PREMIUM_REQUIRED") {
            setToast({ message: errData.message || "Esta función es exclusiva del plan premium.", type: "error" });
            setMostrarPlanModal(true);
          } else {
            setToast({ message: `Error: ${errData.error || errData.message || "Datos inválidos"}`, type: "error" });
          }
          return;
        }

        const esNuevo = !editingCourseId;
        setCursoEstado(esNuevo || cursoEstado === "rechazado" ? "revision" : cursoEstado);

        if (esNuevo) {
          const creado = await res.json();
          setEditingCourseId(creado.id);
          setToast({ message: "Tu curso quedó en revisión ⏳ Ya estás editándolo: cada cambio que guardes actualiza este mismo curso (no se duplica). Te avisaremos por correo cuando sea aprobado.", type: "success" });
        } else if (cursoEstado === "rechazado") {
          setToast({ message: "Curso reenviado a revisión ⏳ Te avisaremos por correo cuando sea aprobado.", type: "success" });
        } else {
          setToast({ message: "Curso actualizado correctamente", type: "success" });
        }

        fetchMisCursos();

      } catch (error) {
        console.error("Fetch error:", error);
        setToast({ message: "Hubo un error de conexión.", type: "error" });
      } finally {
        guardandoRef.current = false;
        setGuardando(false);
      }
    };

    const handleEliminarCurso = async (courseIdToDelete) => {
      const id = courseIdToDelete || editingCourseId;
      if (!id) return;

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses/${id}`;
        const res = await fetch(url, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) {
          const errData = await res.json();
          setToast({ message: `Error: ${errData.error || errData.message || "No se pudo eliminar"}`, type: "error" });
          return;
        }

        setToast({ message: "Curso eliminado correctamente", type: "success" });
        setMyCourses((prev) => prev.filter(c => c.id !== id));
        if (editingCourseId === id) {
          handleCargarCursoParaEditar("");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setToast({ message: "Hubo un error de conexión al eliminar.", type: "error" });
      }
    };

    const estadoActual = estadoCursoParsed(cursoEstado);

    // Borrado lógico: el autor solo puede ocultar/mostrar cursos que YA fueron
    // aprobados por el admin (approved_at). Nunca antes de la aprobación.
    const cursoEnEdicion = myCourses.find((c) => c.id === editingCourseId);
    const aprobadoPreviamente = !!cursoEnEdicion?.approved_at;
    const esVisible = cursoEstado === "activo" || cursoEstado === "published";
    const puedeAlternarVisibilidad =
      editingCourseId && aprobadoPreviamente && (esVisible || cursoEstado === "inactivo");

    const handleAlternarVisibilidad = async () => {
      if (!editingCourseId || !aprobadoPreviamente || ocultando) return;

      const objetivo = esVisible ? "inactivo" : "activo";
      setOcultando(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/courses/${editingCourseId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: objetivo }),
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          setToast({ message: `Error: ${errData.error || errData.message || "No se pudo cambiar la visibilidad"}`, type: "error" });
          return;
        }

        const data = await res.json();
        setCursoEstado(data.status || objetivo);
        await fetchMisCursos();
        setToast({
          message: objetivo === "activo"
            ? "Curso visible en el catálogo ✅"
            : "Curso oculto del catálogo (borrado lógico) 🙈",
          type: "success",
        });
      } catch (e) {
        console.error("Error toggling visibility:", e);
        setToast({ message: "Hubo un error de conexión.", type: "error" });
      } finally {
        setOcultando(false);
      }
    };

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070b17] dark:text-slate-100 relative transition-colors duration-300">
        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, courseId: null })}
          onConfirm={() => handleEliminarCurso(confirmModal.courseId)}
          title="Eliminar curso"
          message="¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer y borrará todo el progreso de los alumnos inscritos."
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
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-300/80">
                Creador / Recursos
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Gestión de recursos y cursos
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row shrink-0 sm:items-center gap-3">
              {myCourses.length > 0 && (
                <div className="relative group">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 hover:border-violet-400/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-slate-900/10 dark:shadow-black/20 w-full sm:w-[180px]"
                  >
                    <span className="truncate">
                      {editingCourseId ? "Editando..." : "+ Nuevo Curso"}
                    </span>
                    <svg className={`fill-current h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute top-full mt-2 w-full sm:w-[220px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/20 dark:shadow-black overflow-hidden z-50">
                        <button
                          onClick={() => {
                            handleCargarCursoParaEditar("");
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-xs font-bold text-violet-700 dark:text-violet-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider border-b border-slate-200 dark:border-slate-800"
                        >
                          + Crear nuevo curso
                        </button>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          <div className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                            Mis Cursos
                          </div>
                          {myCourses.map(course => (
                            <div key={course.id} className={`group flex items-center w-full transition-colors border-l-2 ${editingCourseId === course.id ? "bg-violet-600/20 border-violet-500" : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                              <button
                                onClick={() => {
                                  handleCargarCursoParaEditar(course.id);
                                  setIsDropdownOpen(false);
                                }}
                                className={`flex-1 text-left px-4 py-2.5 text-xs truncate ${editingCourseId === course.id ? "text-violet-700 dark:text-violet-300" : "text-slate-700 dark:text-slate-300"}`}
                              >
                                {course.title}
                                {(() => { const e = estadoCursoParsed(course.status); return <span className={`ml-2 inline-block px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${e.clase}`}>{e.texto}</span>; })()}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDropdownOpen(false);
                                  setConfirmModal({ isOpen: true, courseId: course.id });
                                }}
                                className="mr-2 p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                                title="Eliminar curso"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200 transition-colors hover:border-violet-400/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Volver</span>
              </Link>

              <span
                className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] border text-center ${estadoActual.clase}`}
                title="Tu curso pasa por revisión editorial antes de publicarse"
              >
                Estado: {estadoActual.texto}
              </span>

              {puedeAlternarVisibilidad && (
                <label
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-1.5 cursor-pointer select-none"
                  title={esVisible ? "Ocultar del catálogo (borrado lógico)" : "Volver a mostrar en el catálogo"}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={esVisible}
                    onChange={handleAlternarVisibilidad}
                    disabled={ocultando}
                  />
                  <span className="relative h-4 w-7 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors peer-checked:bg-emerald-500 after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-3" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {ocultando ? "Guardando..." : esVisible ? "Visible" : "Oculto"}
                  </span>
                </label>
              )}

              {editingCourseId && (
                <button
                  onClick={() => handleCargarCursoParaEditar(null)}
                  className="rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600 dark:text-slate-300 hover:border-violet-400/60 hover:text-violet-500 transition-colors text-center"
                >
                  Nuevo Curso
                </button>
              )}

              <button
                onClick={() => handleGuardarCurso()}
                className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 active:scale-95 transition-all text-center"
              >
                {editingCourseId ? "Actualizar Curso" : "Guardar Curso"}
              </button>
            </div>
          </div>

          <PlanSelector isPremium={isPremium} onUpgrade={() => setMostrarPlanModal(true)} />

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
                onToggleResourceActive={handleToggleResourceActive}
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
              setMostrarPlanModal(false);
              if (selectedPlan === "premium") {
                window.location.reload();
              }
            }}
          />
        )}
      </main>
    );
}
