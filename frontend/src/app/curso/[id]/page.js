"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PlayCircle, Clock, BookOpen, User, Sparkles } from "lucide-react";
import { API_URL } from "@/lib/constants";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/${params.id}`);
        if (!res.ok) throw new Error("No se pudo cargar el curso");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCourseData();
  }, [params.id]);

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
        <button onClick={() => router.push("/dashboard")} className="px-6 py-2 bg-violet-600 rounded-xl font-bold">
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Parsear las badges si vienen como string
  const badges = (() => {
    try { return typeof course.badges === 'string' ? JSON.parse(course.badges) : course.badges; }
    catch(e) { return []; }
  })();

  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100 pb-20">
      {/* Hero Section */}
      <section className={`relative pt-24 pb-20 px-4 ${course.background_style || 'bg-slate-900'} overflow-hidden`}>
        {/* Overlay oscuro para que el texto sea siempre legible */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        <div className="relative mx-auto max-w-4xl z-10 flex flex-col items-center text-center">
          <button 
            onClick={() => router.push("/dashboard")}
            className="absolute -top-12 left-0 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          {badges && badges.length > 0 && (
            <div className="flex gap-2 justify-center mb-6">
              {badges.map(b => (
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
          </div>
        </div>
      </section>

      {/* Contenido / Temario */}
      <section className="mx-auto max-w-4xl px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Estructura del Curso</h2>
            <p className="text-slate-400 text-sm mt-1">{course.lessons?.length || 0} recursos disponibles</p>
          </div>
          <button className="bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-2">
            <PlayCircle className="w-5 h-5" /> Comenzar Curso
          </button>
        </div>

        <div className="space-y-4">
          {(!course.lessons || course.lessons.length === 0) ? (
            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center">
              <p className="text-slate-400">Este curso aún no tiene lecciones publicadas.</p>
            </div>
          ) : (
            course.lessons.map((lesson, index) => (
              <div 
                key={lesson.id} 
                className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-800/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-black border border-violet-500/20 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{lesson.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      {lesson.content || "Contenido audiovisual"}
                    </p>
                  </div>
                </div>
                <button className="text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm bg-violet-500/10 px-4 py-2 rounded-lg">
                  Ver recurso
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

