import Image from "next/image";
import { PlayCircle, Users } from "lucide-react";
import { resolveCourseBackground } from "@/lib/courseThemes";

function parseBadges(badges) {
  try {
    const b = typeof badges === "string" ? JSON.parse(badges) : badges;
    return Array.isArray(b) ? b : [];
  } catch {
    return [];
  }
}

export default function CourseCard({ curso, onClick, className = "" }) {
  const bg = resolveCourseBackground(curso.background_style);
  const badges = parseBadges(curso.badges);
  const lessonsCount = curso.lessons?.length || curso.lessons_count || 0;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-lg flex flex-col gap-3 relative overflow-hidden ${bg.className} ${className} ${
        onClick ? "transition-transform hover:-translate-y-1 cursor-pointer" : ""
      }`}
    >
      {bg.isImage && (
        <>
          <Image
            src={bg.url}
            alt=""
            fill
            unoptimized
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/55"></div>
        </>
      )}

      {badges.length > 0 && (
        <div className="absolute top-0 right-0 p-3 flex gap-1 z-10">
          {badges.map((b) => (
            <span
              key={b}
              className="bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 border border-violet-300 dark:border-violet-500/40 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      <div className={`w-10 h-10 rounded-xl bg-violet-100 dark:bg-white/10 border border-violet-200 dark:border-white/20 flex items-center justify-center text-violet-700 dark:text-white shadow-inner z-10 ${bg.isImage ? "" : "mb-2"}`}>
        <PlayCircle className="w-5 h-5" />
      </div>

      <div className="z-10">
        <h3 className={`text-sm font-bold line-clamp-1 ${bg.isImage ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {curso.title}
        </h3>
        <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed opacity-90 ${bg.isImage ? "text-slate-200" : "text-slate-600 dark:text-slate-300"}`}>
          {curso.description}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[9px] text-slate-700 dark:text-white font-bold border border-slate-300 dark:border-white/20">
            {(curso.instructor_name || "U").substring(0, 2).toUpperCase()}
          </div>
          <span className={`text-[10px] font-medium ${bg.isImage ? "text-slate-200" : "text-slate-600 dark:text-slate-300"}`}>
            Por {curso.instructor_name || "Usuario"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
          <Users className="w-3 h-3" />
          {lessonsCount} lecciones
        </div>
      </div>
    </div>
  );
}