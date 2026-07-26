"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, BrainCircuit, CheckCircle2, Sparkles,
  LayoutDashboard, Compass, Award, Settings, RotateCcw, Trophy
} from "lucide-react";
import { useProtectedRoute } from "@/hooks/useRouteGuard";

const PROFESSIONS = [
  { id: 1, title: "Ingeniería de Software", area: "Tecnología & Desarrollo" },
  { id: 2, title: "Diseño de Producto", area: "Diseño & UX" },
  { id: 3, title: "Ciencia de Datos", area: "Ciencia de Datos" },
  { id: 4, title: "Arquitectura Cloud", area: "Infraestructura IT" },
  { id: 5, title: "Ciberseguridad", area: "Seguridad Digital" },
  { id: 6, title: "Desarrollo de IA", area: "Inteligencia Artificial" },
  { id: 7, title: "Desarrollo Backend", area: "Tecnología" },
  { id: 8, title: "Especialista Frontend", area: "Desarrollo Web" },
  { id: 9, title: "Desarrollo Móvil", area: "Apps Móviles" },
  { id: 10, title: "Administración DB", area: "Datos" },
  { id: 11, title: "DevOps Engineer", area: "Infraestructura" },
  { id: 12, title: "Ingeniería de Redes", area: "Sistemas" },
];

const PREGUNTAS = [
  { id: 1, texto: "¿Disfrutas resolver problemas complejos paso a paso?" },
  { id: 2, texto: "¿Te sientes cómodo aprendiendo herramientas nuevas todo el tiempo?" },
  { id: 3, texto: "¿Prefieres trabajar en equipo más que de forma individual?" },
  { id: 4, texto: "¿Te interesa entender cómo funcionan las cosas por dentro?" },
  { id: 5, texto: "¿Te consideras una persona organizada con tus tareas?" },
  { id: 6, texto: "¿Te gusta tomar decisiones basadas en datos y evidencia?" },
  { id: 7, texto: "¿Disfrutas comunicar ideas técnicas de forma sencilla?" },
  { id: 8, texto: "¿Te motiva ver resultados rápidos de tu trabajo?" },
  { id: 9, texto: "¿Te adaptas con facilidad a entornos cambiantes?" },
  { id: 10, texto: "¿Sientes que esta área refleja tu vocación real?" },
];

const OPCIONES = [
  { valor: 1, label: "Nada" },
  { valor: 2, label: "Poco" },
  { valor: 3, label: "Algo" },
  { valor: 4, label: "Bastante" },
  { valor: 5, label: "Mucho" },
];

export default function Diagnostico() {
  const { id } = useParams();
  const router = useRouter();
  const { loading } = useProtectedRoute();

  const vocacion = useMemo(
    () => PROFESSIONS.find((item) => item.id === parseInt(id)),
    [id]
  );

  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-widest">
        Verificando acceso...
      </div>
    );
  }

  if (!vocacion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e5e7eb] text-[#1e293b] font-sans">
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Vocación no encontrada</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-6 py-2.5 bg-[#1e293b] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const preguntaActual = PREGUNTAS[paso];
  const progreso = Math.round((paso / PREGUNTAS.length) * 100);

  const handleResponder = (valor) => {
    const nuevasRespuestas = { ...respuestas, [preguntaActual.id]: valor };
    setRespuestas(nuevasRespuestas);

    if (paso + 1 < PREGUNTAS.length) {
      setPaso(paso + 1);
    } else {
      setFinalizado(true);
    }
  };

  const reiniciar = () => {
    setRespuestas({});
    setPaso(0);
    setFinalizado(false);
  };

  const valores = Object.values(respuestas);
  const puntajeTotal = valores.reduce((acc, v) => acc + v, 0);
  const puntajeMaximo = PREGUNTAS.length * 5;
  const compatibilidad = valores.length
    ? Math.round((puntajeTotal / puntajeMaximo) * 100)
    : 0;

  const nivelSugerido =
    compatibilidad >= 80 ? "Avanzado" :
      compatibilidad >= 50 ? "Intermedio" :
        "Principiante";

  return (
    <div className="min-h-screen bg-[#e5e7eb] text-slate-800 font-sans flex">

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto w-full p-6 md:p-10 pt-32">

        <header className="mb-8 border-b border-slate-300 pb-6">

          <button
            onClick={() => router.push(`/vocacion/${vocacion.id}`)}
            className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1e293b] uppercase tracking-widest transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a la vocación
          </button>

          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
            {vocacion.area}
          </span>
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-7 h-7" />
            Diagnóstico: {vocacion.title}
          </h1>
        </header>

        {!finalizado ? (
          <section className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">

            {/* Barra de progreso */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Pregunta {paso + 1} de {PREGUNTAS.length}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]">
                  {progreso}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1e293b] rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-8 leading-snug">
              {preguntaActual.texto}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {OPCIONES.map((op) => (
                <button
                  key={op.valor}
                  onClick={() => handleResponder(op.valor)}
                  className="px-3 py-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#1e293b] hover:text-white hover:border-[#1e293b] transition-all text-xs font-black uppercase tracking-wider active:scale-95"
                >
                  {op.label}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1e293b] text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
              Resultado del Diagnóstico
            </p>
            <h2 className="text-5xl font-black text-[#1e293b] tracking-tighter mb-2">
              {compatibilidad}%
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">
              {nivelTexto} con {vocacion.title}
            </p>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-10">
              <div
                className="h-full bg-[linear-gradient(90deg,_#334155_0%,_#1e293b_100%)] rounded-full transition-all duration-700"
                style={{ width: `${compatibilidad}%` }}
              ></div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 text-left flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-[#1e293b] shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Tus respuestas muestran afinidad con las competencias clave de
                <span className="font-bold text-slate-900"> {vocacion.title}</span>.
                Sigue puliendo tu perfil completando más diagnósticos y revisando
                tu trayectoria en el dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reiniciar}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Repetir Diagnóstico
              </button>
              <button
                onClick={() => router.push(`/recomendacion?vocacion=${encodeURIComponent(vocacion.title)}&nivel=${nivelSugerido}`)}
                className="px-8 py-3.5 bg-[#1e293b] hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <Sparkles className="w-4 h-4" /> Ver Ruta de Aprendizaje
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" /> Volver al Dashboard
              </button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
