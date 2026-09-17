"use client";

import { useEffect, useState } from "react";
import { Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import CourseCard from "@/components/CourseCard";

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

    const refetchOnFocus = () => {
      if (document.visibilityState === "visible") fetchCourses();
    };
    window.addEventListener("focus", refetchOnFocus);
    document.addEventListener("visibilitychange", refetchOnFocus);
    return () => {
      window.removeEventListener("focus", refetchOnFocus);
      document.removeEventListener("visibilitychange", refetchOnFocus);
    };
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
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            curso={course}
            onClick={() => router.push(`/curso/${course.id}`)}
            className="snap-start shrink-0 w-[260px] sm:w-[280px]"
          />
        ))}
      </div>
      )}
    </section>
  );
}

