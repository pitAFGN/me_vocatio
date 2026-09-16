"use client";

import { useEffect, useState } from "react";
import { Sparkles, PlayCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";

const COURSE_THEME_CLASSES = {
  "bg-slate-950": "bg-slate-100 dark:bg-slate-950",
  "bg-violet-900/80": "bg-violet-100 dark:bg-violet-900/80",
  "bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-950":
    "bg-gradient-to-br from-sky-100 via-indigo-100 to-slate-100 dark:bg-gradient-to-br dark:from-sky-900 dark:via-indigo-950 dark:to-slate-950",
  "bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950":
    "bg-gradient-to-br from-slate-100 via-violet-100 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-violet-950 dark:to-indigo-950",
};

export default function CommunityCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`);
        if (!res.ok) throw new Error("Error fetching courses");
        const data = await res.json();
        // Filtrar solo los cursos que tienen background_style, lo que asume que son de la comunidad creados con el UI nuevo
        const communityCourses = data.filter(c => c.background_style);
        setCourses(communityCourses);
      } catch (error) {
        console.error("Failed to load community courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return null;

  return (
    <section className="mt-8 mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            Comunidad
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Recursos Destacados
            <Sparkles className="w-5 h-5 text-violet-400" />
          </h2>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-2">Aún no hay recursos de la comunidad</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            ¡Sé el primero en compartir tu conocimiento! Ve a la sección Creador y publica tu primer curso o recurso para que aparezca aquí.
          </p>
        </div>
      ) : (
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 w-full snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {courses.map((course) => {
          const badges = (() => {
            try { return typeof course.badges === 'string' ? JSON.parse(course.badges) : course.badges; }
            catch(e) { return []; }
          })();

          return (
            <div
              key={course.id}
              onClick={() => router.push(`/curso/${course.id}`)}
              className={`snap-start shrink-0 w-[260px] sm:w-[280px] rounded-2xl ${COURSE_THEME_CLASSES[course.background_style] || "bg-white dark:bg-slate-900"} border border-slate-200 dark:border-white/10 p-5 shadow-lg flex flex-col gap-3 relative overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer`}
            >
              {badges && badges.length > 0 && (
                <div className="absolute top-0 right-0 p-3 flex gap-1">
                  {badges.map(b => (
                    <span key={b} className="bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 border border-violet-300 dark:border-violet-500/40 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {b}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-white/10 border border-violet-200 dark:border-white/20 flex items-center justify-center text-violet-700 dark:text-white mb-2 shadow-inner">
                <PlayCircle className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed opacity-90">{course.description}</p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[9px] text-slate-700 dark:text-white font-bold border border-slate-300 dark:border-white/20">
                    {(course.instructor_name || "U").substring(0,2).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">Por {course.instructor_name || "Usuario"}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                  <Users className="w-3 h-3" />
                  {course.lessons_count || 0} lecciones
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
}

