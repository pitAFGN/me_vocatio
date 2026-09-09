"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Award, Sparkles, TrendingUp, AlertCircle, RefreshCw, BarChart3 } from "lucide-react";
import { API_URL } from "@/lib/constants";

export default function AnalyticsPanel({
  isPremium,
  onUpgrade,
  resources = [],
  metricCards: fallbackCards,
  funnelData: fallbackFunnel,
  recentStudents: fallbackStudents,
}) {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("dynamic"); // "dynamic" (basado en lecciones actuales) o "live" (datos reales del servidor)

  // Cargar analíticas reales si el usuario está autenticado
  useEffect(() => {
    if (!isPremium) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/courses/instructor/analytics`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setLiveData(data);
        }
      } catch (err) {
        console.error("Error al cargar analíticas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isPremium]);

  if (!isPremium) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="rounded-2xl border border-dashed border-violet-500/30 bg-violet-500/5 p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Premium requerido
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">Analíticas avanzadas</h2>
          <p className="mt-2 text-sm text-slate-300">
            Actualiza a Premium para ver el embudo de abandono en vivo, tiempo de estudio y retención por lección.
          </p>
          <button
            type="button"
            onClick={onUpgrade}
            className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:from-violet-500 hover:to-purple-500 transition-all cursor-pointer"
          >
            Mejorar a Premium
          </button>
        </div>
      </section>
    );
  }

  // Métricas calculadas o del servidor
  const hasRealStudents = liveData?.hasCourses && liveData.totalStudents > 0;
  
  const displayMetrics = [
    {
      label: "Estudiantes totales",
      value: hasRealStudents ? `${liveData.totalStudents}` : (fallbackCards?.[0]?.value || "0"),
      delta: hasRealStudents ? "+100% nuevos" : (fallbackCards?.[0]?.delta || "+12.4%"),
      icon: Users,
    },
    {
      label: "Tasa de finalización",
      value: hasRealStudents ? liveData.completionRate : (fallbackCards?.[1]?.value || "78%"),
      delta: hasRealStudents ? "Promedio real" : (fallbackCards?.[1]?.delta || "+6.1%"),
      icon: Award,
    },
    {
      label: "Tiempo de estudio",
      value: hasRealStudents ? liveData.totalStudyHours : (fallbackCards?.[2]?.value || "4h 32m"),
      delta: hasRealStudents ? "Acumulado" : (fallbackCards?.[2]?.delta || "+1h 10m"),
      icon: Clock,
    },
    {
      label: "Satisfacción Alumnos",
      value: liveData?.satisfactionRating ? `⭐ ${liveData.satisfactionRating}` : "⭐ 4.9",
      delta: liveData?.totalReviews ? `${liveData.totalReviews} opiniones` : "Opiniones",
      icon: Sparkles,
    },
  ];

  // Embudo dinámico adaptado a las lecciones que el creador está agregando
  const colors = ["bg-violet-500", "bg-purple-500", "bg-indigo-500", "bg-fuchsia-500", "bg-pink-500", "bg-cyan-500"];
  
  const dynamicFunnel = (() => {
    if (resources.length === 0) {
      return fallbackFunnel || [
        { step: "Inicio del curso", value: 100, color: "bg-violet-500" },
        { step: "Lección 1", value: 85, color: "bg-purple-500" },
        { step: "Lección 2", value: 70, color: "bg-indigo-500" },
        { step: "Finalización", value: 55, color: "bg-emerald-500" },
      ];
    }

    const steps = [{ step: "Inicio del curso", value: 100, color: "bg-violet-500" }];
    const stepDrop = Math.max(8, Math.floor(60 / (resources.length + 1)));

    resources.forEach((r, idx) => {
      const val = Math.max(15, 100 - (idx + 1) * stepDrop);
      steps.push({
        step: `${idx + 1}. ${r.title.slice(0, 18)}${r.title.length > 18 ? "..." : ""}`,
        value: val,
        color: colors[idx % colors.length],
      });
    });

    const finalVal = Math.max(10, 100 - (resources.length + 1) * stepDrop);
    steps.push({
      step: "Finalización del curso",
      value: finalVal,
      color: "bg-emerald-500",
    });

    return steps;
  })();

  const studentsList = (hasRealStudents && liveData?.recentStudents?.length > 0)
    ? liveData.recentStudents
    : fallbackStudents || [];

  return (
    <section className="rounded-3xl border border-violet-500/30 bg-slate-900/80 p-5 backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Analíticas de Rendimiento
          </p>
          <h2 className="mt-1 text-xl font-black text-white">Métricas de Alumnos</h2>
        </div>
        <div className="flex items-center gap-2">
          {hasRealStudents ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              En Vivo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300">
              <Sparkles className="w-3 h-3 text-violet-400" />
              Proyección
            </span>
          )}
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 xl:grid-cols-2">
        {displayMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 transition-all hover:border-violet-500/20">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 truncate">
                  {metric.label}
                </p>
                <Icon className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              </div>
              <div className="mt-2.5 flex items-end justify-between">
                <span className="text-xl font-black text-white">{metric.value}</span>
                <span className="text-[10px] font-bold text-emerald-400">{metric.delta}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actividad de los últimos 7 días */}
      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Actividad (Últimos 7 días)
          </h3>
          <span className="text-[9px] font-bold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
            Pico: Miércoles
          </span>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-16 pt-2 px-1">
          {[
            { day: "L", h: "40%" },
            { day: "M", h: "60%" },
            { day: "X", h: "95%", peak: true },
            { day: "J", h: "70%" },
            { day: "V", h: "80%" },
            { day: "S", h: "45%" },
            { day: "D", h: "55%" },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div 
                className={`w-full rounded-t-md transition-all ${
                  bar.peak ? 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-slate-800 hover:bg-violet-600'
                }`} 
                style={{ height: bar.h }} 
              />
              <span className={`text-[8px] font-bold ${bar.peak ? 'text-violet-300' : 'text-slate-500'}`}>{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Embudo de Abandono (Drop-off Funnel) */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-200">
              Embudo de retención
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {resources.length > 0 
                ? `Adaptado a tus ${resources.length} lecciones configuradas`
                : "Estimación paso a paso de deserción de alumnos"}
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
            Drop-off
          </span>
        </div>

        <div className="space-y-3">
          {dynamicFunnel.map((item) => (
            <div key={item.step}>
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span className="truncate max-w-[200px]">{item.step}</span>
                <span className="font-bold text-violet-300">{item.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`} 
                  style={{ width: `${item.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tip pedagógico de IA / Analítica */}
        <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-violet-200 font-semibold">Consejo pedagógico: </strong>
            Los cursos que combinan lecciones cortas con enlaces prácticos aumentan la retención final en más de un <span className="text-emerald-400 font-bold">25%</span>.
          </p>
        </div>
      </div>

      {/* Estudiantes Recientes */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-200">
              Estudiantes recientes
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Avance en tiempo real</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
            Feed
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="min-w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Alumno</th>
                <th className="px-3 py-2.5 font-semibold">Curso</th>
                <th className="px-3 py-2.5 font-semibold">Avance</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((student, idx) => (
                <tr key={`${student.name}-${idx}`} className="border-t border-slate-850 bg-slate-950/40 hover:bg-slate-900/50 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-white truncate max-w-[110px]">{student.name}</div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 truncate max-w-[110px]">{student.course}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300 font-bold">{student.progress}</span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-300">
                        {student.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
