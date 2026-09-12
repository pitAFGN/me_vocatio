"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  PlayCircle, 
  Clock, 
  BookOpen, 
  User, 
  Sparkles, 
  ExternalLink,
  CheckCircle2,
  Star,
  MessageSquare,
  Send,
  Check
} from "lucide-react";
import { API_URL } from "@/lib/constants";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados de progreso del alumno
  const [visitedLessons, setVisitedLessons] = useState([]);
  
  // Estados de Reseñas / Calificación
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 5.0, totalReviews: 0 });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const ratingLabels = {
    1: "Necesita mejorar (1.0)",
    2: "Regular (2.0)",
    3: "Bueno (3.0)",
    4: "Muy bueno (4.0)",
    5: "¡Excelente! (5.0)"
  };

  const availableTags = [
    "🚀 Muy práctico",
    "💡 Recursos de calidad",
    "🎯 Explicación clara",
    "⏱️ Buen ritmo",
    "💻 Excelente código",
  ];

  // Cargar progreso previo del almacenamiento local
  // Cargar progreso previo del almacenamiento local y asegurar inscripción
  useEffect(() => {
    if (!params.id) return;
    try {
      const saved = localStorage.getItem(`mevocatio_course_progress_${params.id}`);
      if (saved) {
        setVisitedLessons(JSON.parse(saved));
      }
      
      // Registrar inscripción en backend silenciosamente
      fetch(`${API_URL}/api/courses/${params.id}/enroll`, {
        method: "POST",
        credentials: "include"
      }).catch(e => console.error(e));
      
    } catch (e) {
      console.error(e);
    }
  }, [params.id]);

  // Cargar datos del curso y sus reseñas
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/${params.id}`);
        if (!res.ok) throw new Error("No se pudo cargar el curso");
        const data = await res.json();
        
        // Filtrar lecciones ocultas para el estudiante
        if (data.lessons) {
          data.lessons = data.lessons.filter(l => l.is_active !== false);
        }
        setCourse(data);

        // Cargar reseñas
        const revRes = await fetch(`${API_URL}/api/courses/${params.id}/reviews`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviewsData(revData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCourseData();
  }, [params.id]);

  const markLessonAsVisited = (lessonId, lessonUrl) => {
    setVisitedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      try {
        localStorage.setItem(`mevocatio_course_progress_${params.id}`, JSON.stringify(updated));
        
        // Sincronizar progreso con el backend
        fetch(`${API_URL}/api/courses/${params.id}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
          credentials: "include"
        }).catch(e => console.error(e));
        
      } catch (e) {}
      return updated;
    });

    if (lessonUrl) {
      window.open(lessonUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = async () => {
    if (!rating) return;
    setIsSubmittingReview(true);
    setReviewError("");

    const fullComment = selectedTags.length > 0
      ? `${selectedTags.join(" · ")}${comment.trim() ? ` — ${comment.trim()}` : ""}`
      : comment.trim();

    try {
      const res = await fetch(`${API_URL}/api/courses/${params.id}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: fullComment || "Curso completado",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || "Inicia sesión para publicar tu valoración");
      }

      setReviewSubmitted(true);

      // Recargar lista de reseñas
      const revRes = await fetch(`${API_URL}/api/courses/${params.id}/reviews`);
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviewsData(revData);
      }
    } catch (err) {
      setReviewError(err.message || "Error al enviar reseña");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b17] flex items-center justify-center">
        <div className="animate-pulse text-violet-400 font-bold">Cargando curso...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#070b17] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
        <button onClick={() => router.push("/dashboard")} className="px-6 py-2 bg-violet-600 rounded-xl font-bold cursor-pointer">
          Volver al Inicio
        </button>
      </div>
    );
  }

  const badges = (() => {
    try { return typeof course.badges === 'string' ? JSON.parse(course.badges) : course.badges; }
    catch(e) { return []; }
  })();

  const totalLessons = course.lessons?.length || 0;
  const completedLessonsCount = course.lessons?.filter(l => visitedLessons.includes(l.id)).length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  const isCourseCompleted = totalLessons > 0 && completedLessonsCount >= totalLessons;

  // Encontrar la primera lección no vista para el botón "Continuar"
  const nextLesson = course.lessons?.find(l => !visitedLessons.includes(l.id));

  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100 pb-20">
      {/* Hero Section */}
      <section className={`relative pt-24 pb-20 px-4 ${course.background_style || 'bg-slate-900'} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        <div className="relative mx-auto max-w-4xl z-10 flex flex-col items-center text-center">
          <button 
            onClick={() => router.push("/dashboard")}
            className="absolute -top-12 left-0 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          {badges && badges.length > 0 && (
            <div className="flex gap-2 justify-center mb-6">
              {badges.map((b) => (
                <span key={b} className="bg-white/20 border border-white/40 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg">
                  {b}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-xl tracking-tight">
            {course.title}
          </h1>
          
          <p className="text-lg text-slate-200 mb-8 max-w-2xl drop-shadow-md">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-300 bg-black/30 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" />
              <span>Creado por <strong className="text-white">{course.instructor_name || "Comunidad"}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>{course.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>{course.duration_hours ? `${course.duration_hours} horas` : 'A tu propio ritmo'}</span>
            </div>
            {reviewsData.totalReviews > 0 && (
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{reviewsData.averageRating} ({reviewsData.totalReviews} reseñas)</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenido / Temario y Barra de Progreso */}
      <section className="mx-auto max-w-4xl px-4 mt-10">
        
        {/* Barra de Progreso del Alumno */}
        <div className="mb-8 rounded-3xl border border-violet-500/30 bg-slate-900/80 p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Tu Progreso de Aprendizaje</span>
              <h3 className="text-lg font-black text-white">
                {completedLessonsCount} de {totalLessons} recursos vistos
              </h3>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xl font-black text-violet-300">{progressPercent}%</span>
              {isCourseCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
                  <Check className="w-3.5 h-3.5" /> Completado
                </span>
              )}
            </div>
          </div>

          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Siguiente recurso recomendado */}
          {nextLesson && (
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 truncate max-w-[280px] sm:max-w-md">
                Siguiente: <strong className="text-white">{nextLesson.title}</strong>
              </span>
              <button
                onClick={() => markLessonAsVisited(nextLesson.id, nextLesson.video_url)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
              >
                <span>Continuar</span>
                <PlayCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Lista de Lecciones */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Estructura del Curso</h2>
            <p className="text-slate-400 text-sm mt-0.5">{totalLessons} recursos disponibles</p>
          </div>
        </div>

        <div className="space-y-3">
          {(!course.lessons || course.lessons.length === 0) ? (
            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center">
              <p className="text-slate-400">Este curso aún no tiene lecciones publicadas.</p>
            </div>
          ) : (
            course.lessons.map((lesson, index) => {
              const isVisited = visitedLessons.includes(lesson.id);
              const lessonUrl = lesson.video_url 
                ? (lesson.video_url.startsWith("http") ? lesson.video_url : `https://${lesson.video_url}`) 
                : null;
              const isCurrent = nextLesson?.id === lesson.id;

              return (
                <div 
                  key={lesson.id} 
                  onClick={() => markLessonAsVisited(lesson.id, lessonUrl)}
                  className={`border p-4 sm:p-5 rounded-2xl flex items-center justify-between transition-all group cursor-pointer ${
                    isVisited
                      ? 'border-emerald-500/30 bg-emerald-950/10 hover:bg-emerald-950/20'
                      : isCurrent
                      ? 'border-violet-500/50 bg-violet-950/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                      : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black transition-all ${
                      isVisited 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : isCurrent
                        ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:text-white'
                    }`}>
                      {isVisited ? "✓" : index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-bold truncate text-sm sm:text-base ${isVisited ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400 font-medium">
                          {lesson.content || "Recurso"}
                        </span>
                        {isVisited ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            ✓ Visto
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[10px] font-bold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded border border-violet-500/30">
                            Siguiente
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {lessonUrl ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markLessonAsVisited(lesson.id, lessonUrl);
                        }}
                        className={`font-bold text-xs px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isVisited 
                            ? 'text-slate-300 bg-slate-800 hover:bg-slate-700 border-slate-700' 
                            : 'text-white bg-violet-600 hover:bg-violet-500 border-violet-500 shadow-md shadow-violet-600/20'
                        }`}
                      >
                        <span>{isVisited ? "Volver a ver" : "Abrir recurso"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-slate-500 text-xs">Sin enlace</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SECCIÓN DE VALORACIÓN Y COMENTARIOS AL FINAL DEL FLUJO */}
        <div className="mt-10 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-md">
          {reviewSubmitted ? (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
              <span className="text-4xl">🎉</span>
              <h3 className="text-lg font-black text-emerald-300 mt-2">¡Gracias por tu valoración!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Tu opinión se ha publicado y ayudará tanto a otros estudiantes como a que el instructor mejore su contenido.
              </p>
              <button
                onClick={() => setReviewSubmitted(false)}
                className="mt-4 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Editar mi valoración
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <span>🎓</span> Calificación del Curso
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">¿Qué te pareció este curso?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Comparte tu experiencia para enriquecer la comunidad y dar feedback al instructor.
                  </p>
                </div>
              </div>

              {/* Selector de Estrellas */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-all cursor-pointer px-1 ${
                        star <= rating ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-700 hover:text-slate-500'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-300">{ratingLabels[rating]}</span>
              </div>

              {/* Tags de feedback rápido */}
              <div className="mt-3 flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-sm'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Textarea de Comentario */}
              <div className="mt-4">
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe tu opinión sobre el contenido, la claridad o qué fue lo que más te gustó..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
                />
              </div>

              {reviewError && (
                <p className="mt-2 text-xs font-bold text-rose-400">{reviewError}</p>
              )}

              {/* Botón Enviar */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Tu reseña se registrará en las analíticas públicas del curso
                </span>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? "Publicando..." : "Publicar valoración ⭐"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reseñas de la Comunidad */}
        {reviewsData.reviews?.length > 0 && (
          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Opiniones de la Comunidad</h3>
                <p className="text-xs text-slate-400">{reviewsData.totalReviews} estudiantes han valorado este curso</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-300 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{reviewsData.averageRating} / 5.0</span>
              </div>
            </div>

            <div className="space-y-3">
              {reviewsData.reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-white">{rev.user_name || "Estudiante"}</span>
                    <div className="flex items-center text-amber-400 text-xs">
                      {"★".repeat(rev.rating || 5)}
                    </div>
                  </div>
                  {rev.comment && (
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  )}
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}

