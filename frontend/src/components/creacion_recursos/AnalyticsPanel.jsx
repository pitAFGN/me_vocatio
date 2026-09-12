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
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Cargar analíticas reales si el usuario está autenticado
  useEffect(() => {
    if (!isPremium) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const url = selectedCourseId 
          ? `${API_URL}/api/courses/instructor/analytics?courseId=${selectedCourseId}`
          : `${API_URL}/api/courses/instructor/analytics`;
          
        const res = await fetch(url, {
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
  }, [isPremium, selectedCourseId]);

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

  // Siempre mostramos datos reales si el backend responde (incluso si son 0)
  const isRealData = liveData !== null;
  
  const displayMetrics = [
    {
      label: "Estudiantes totales",
      value: isRealData ? `${liveData.totalStudents}` : "0",
      delta: isRealData && liveData.totalStudents > 0 ? "Nuevos inscritos" : "",
      icon: Users,
    },
    {
      label: "Tasa de finalización",
      value: isRealData ? liveData.completionRate : "0%",
      delta: isRealData ? "Promedio real" : "",
      icon: Award,
    },
    {
      label: "Tiempo de estudio",
      value: isRealData ? liveData.totalStudyHours : "0h",
      delta: isRealData ? "Acumulado" : "",
      icon: Clock,
    },
    {
      label: "Satisfacción Alumnos",
      value: isRealData && liveData.totalReviews > 0 ? `★ ${liveData.satisfactionRating}` : "★ 0",
      delta: isRealData ? `${liveData.totalReviews} opiniones` : "0 opiniones",
      icon: Sparkles,
    },
  ];

  const studentsList = isRealData && liveData.recentStudents.length > 0 
    ? liveData.recentStudents 
    : [];

  // Configurar el embudo (funnel) dinámicamente
  const colors = ["bg-violet-500", "bg-purple-500", "bg-indigo-500", "bg-fuchsia-500", "bg-pink-500", "bg-cyan-500"];
  let dynamicFunnel = [];
  
  if (isRealData && liveData.funnel && liveData.funnel.length > 0) {
    dynamicFunnel = liveData.funnel.map((item, idx) => ({
      ...item,
      color: colors[idx % colors.length]
    }));
  } else if (resources.length > 0) {
    dynamicFunnel = [
      { step: "Inicio del curso", value: 100, color: colors[0] }
    ];
    let currentValue = 100;
    resources.forEach((res, idx) => {
      currentValue = Math.max(10, currentValue - Math.floor(Math.random() * 20 + 5));
      dynamicFunnel.push({
        step: res.title || `Lección ${idx + 1}`,
        value: currentValue,
        color: colors[(idx + 1) % colors.length]
      });
    });
  } else {
    dynamicFunnel = fallbackFunnel || [
      { step: "Inicio del curso", value: 100, color: "bg-violet-500" },
      { step: "Lección 1", value: 85, color: "bg-purple-500" },
      { step: "Lección 2", value: 70, color: "bg-indigo-500" },
      { step: "Finalización", value: 55, color: "bg-emerald-500" },
    ];
  }

  const weeklyActivity = isRealData && liveData.weeklyActivity 
    ? liveData.weeklyActivity 
    : [
      { day: "L", h: "10%" }, { day: "M", h: "10%" }, { day: "X", h: "10%" },
      { day: "J", h: "10%" }, { day: "V", h: "10%" }, { day: "S", h: "10%" }, { day: "D", h: "10%" }
    ];

  const peakDay = weeklyActivity.find(d => d.peak)?.day;
  const daysFull = { "L": "Lunes", "M": "Martes", "X": "Miércoles", "J": "Jueves", "V": "Viernes", "S": "Sábado", "D": "Domingo" };
  const peakText = peakDay ? `Pico: ${daysFull[peakDay]}` : "Sin actividad";

  return (
    <section className="rounded-3xl border border-violet-500/30 bg-slate-900/80 p-5 backdrop-blur-sm relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/10 blur-[50px]"></div>
      
      {/* Encabezado Analíticas */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Analíticas de Rendimiento
          </p>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-xl font-black text-white">Métricas de Alumnos</h2>
            {isRealData && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Datos Reales
              </span>
            )}
          </div>
        </div>
        
        {/* Selector de Cursos */}
        {isRealData && liveData.courses && liveData.courses.length > 0 && (
          <select 
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="">Todos mis cursos</option>
            {liveData.courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 xl:grid-cols-2 relative z-10">
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
      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Actividad (Últimos 7 días)
          </h3>
          <span className="text-[9px] font-bold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
            {peakText}
          </span>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-16 pt-2 px-1">
          {weeklyActivity.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <div 
                className={`w-full rounded-t-md transition-all duration-500 ${
                  bar.peak ? 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-slate-800 group-hover:bg-violet-600/50'
                }`} 
                style={{ height: bar.h }} 
              />
              <span className={`text-[8px] font-bold ${bar.peak ? 'text-violet-300' : 'text-slate-500'}`}>{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Embudo de Abandono (Drop-off Funnel) */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-200">
              Embudo de retención
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isRealData
                ? (selectedCourseId ? "Deserción por lección de este curso" : "Tasa general de tus cursos")
                : (resources.length > 0 
                  ? `Adaptado a tus ${resources.length} lecciones configuradas`
                  : "Estimación paso a paso de deserción de alumnos")
              }
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
          {isRealData && (!liveData.totalStudents || liveData.totalStudents === 0) && (
            <p className="text-[10px] text-slate-500 italic text-center mt-4">
              Aún no hay inscripciones para medir retención.
            </p>
          )}
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
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 relative z-10">
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
              {studentsList.length > 0 ? (
                studentsList.map((student, idx) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-3 py-6 text-center border-t border-slate-850">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-6 h-6 text-slate-600" />
                      <span className="text-slate-500 font-medium">Aún no hay estudiantes inscritos</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
