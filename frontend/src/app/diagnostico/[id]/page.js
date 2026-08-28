"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProfessionById } from '@/app/data/professions';
import { API_URL } from '@/lib/constants';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function DiagnosticoPage() {
  const router = useRouter();
  const params = useParams();
  const profession = getProfessionById(params?.id);
  const [preguntas, setPreguntas] = useState([]);
  const [testId, setTestId] = useState(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [cargandoTest, setCargandoTest] = useState(true);
  const [cargandoEnvio, setCargandoEnvio] = useState(false);
  const [error, setError] = useState(null);
  const peticionInicialRealizada = useRef(false);

  useEffect(() => {
    if (peticionInicialRealizada.current) return;
    peticionInicialRealizada.current = true;

    const generarTest = async () => {
      try {
        const response = await fetch(`${API_URL}/api/generar`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profesion_title: profession?.title,
            profesion_area: profession?.area
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/login');
            return;
          }
          throw new Error(data.error || data.message || `Error del servidor (${response.status})`);
        }

        if (data.exito && data.data?.test_id && data.data.preguntas) {
          setTestId(data.data.test_id);
          setPreguntas(data.data.preguntas);
        } else {
          setError(data.error || "El servidor no devolvió un test válido.");
        }
      } catch (err) {
        setError(err.message || "Error de conexión al generar el test.");
        console.error(err);
      } finally {
        setCargandoTest(false);
      }
    };

    generarTest();
  }, [profession?.area, profession?.title, router]);

  const manejarCambioRespuesta = (preguntaId, opcionIndex) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [preguntaId]: opcionIndex
    }));
  };

  const finalizarDiagnostico = async () => {
    const totalRespondidas = Object.keys(respuestasUsuario).length;
    if (totalRespondidas < preguntas.length) {
      const confirmed = window.confirm(
        `Has respondido ${totalRespondidas} de ${preguntas.length} preguntas. ¿Deseas finalizar de todas formas?`
      );
      if (!confirmed) return;
    }

    if (!testId) {
      alert("No se encontró un test válido. Recarga la página e inténtalo de nuevo.");
      return;
    }

    setCargandoEnvio(true);
    try {
      const response = await fetch(`${API_URL}/api/evaluar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_id: testId,
          respuestas: Object.entries(respuestasUsuario).map(([pregunta_id, opcion_idx]) => ({
            pregunta_id,
            opcion_idx
          }))
        })
      });

      const data = await response.json();

      if (data.exito && data.evaluation_id) {
        if (Array.isArray(data.unlocked) && data.unlocked.length > 0) {
          localStorage.setItem("mevocatio_new_achievements", JSON.stringify(data.unlocked));
        }
        router.push(
          `/recomendacion?profesion=${encodeURIComponent(profession.title)}&nivel=${encodeURIComponent(data.nivel)}&evaluation_id=${data.evaluation_id}`
        );
      } else {
        alert("Hubo un error al registrar la evaluación: " + (data.error || data.mensaje || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error al finalizar el test:", err);
      alert("Error de conexión con el servidor.");
    } finally {
      setCargandoEnvio(false);
    }
  };

  if (!profession) {
    return <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>Vocación no encontrada.</div>;
  }

  if (cargandoTest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-sm font-semibold">Cargando preguntas del test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-red-500 dark:text-red-400 transition-colors duration-300">
        <p className="text-sm font-semibold">Error: {error}</p>
      </div>
    );
  }

  const respondidas = Object.keys(respuestasUsuario).length;
  const total = preguntas.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white p-6 pt-24 max-w-3xl mx-auto font-sans transition-colors duration-300">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 px-4 py-2.5 mb-8 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-950 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        Volver al Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-2">Cuestionario de Diagnóstico</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Responde las siguientes preguntas para evaluar tu nivel técnico.</p>
      <p className="text-indigo-500 dark:text-indigo-400 text-xs font-semibold mb-8">{respondidas} / {total} respondidas</p>

      <div className="flex flex-col gap-6">
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl">
            <p className="font-bold mb-4 text-sm">
              {index + 1}. {pregunta.enunciado}
            </p>

            <div className="flex flex-col gap-2">
              {pregunta.opciones.map((opcion, opcionIndex) => (
                <label
                  key={opcionIndex}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    respuestasUsuario[pregunta.id] === opcionIndex
                      ? "bg-indigo-50 dark:bg-indigo-600/20 border-indigo-300 dark:border-indigo-500/50 text-slate-900 dark:text-white"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name={`pregunta_${pregunta.id}`}
                    value={opcionIndex}
                    checked={respuestasUsuario[pregunta.id] === opcionIndex}
                    onChange={() => manejarCambioRespuesta(pregunta.id, opcionIndex)}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm">{opcion}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 mb-8">
        <button
          onClick={finalizarDiagnostico}
          disabled={cargandoEnvio}
          className={`inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all text-sm ${
            cargandoEnvio
              ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer"
          }`}
        >
          {cargandoEnvio ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando Evaluación...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Finalizar y Ver Recursos Personalizados
            </>
          )}
        </button>
      </div>
    </div>
  );
}
