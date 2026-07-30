'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const PROFESSIONS = [
  { id: 1, title: "Ingeniería de Software", area: "Tecnología & Desarrollo" },
  { id: 2, title: "Diseño de Producto", area: "Diseño & UX" },
  { id: 3, title: "Ciencia de Datos", area: "Análisis de Datos" },
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

export default function DiagnosticoPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Estados
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testData, setTestData] = useState(null);
  const [respuestas, setRespuestas] = useState({}); // { pregunta_id: opcion_idx }
  const [error, setError] = useState(null);

  // 1. Cargar las preguntas dinámicas al montar la página
  useEffect(() => {
    async function cargarTest() {
      try {
        setLoading(true);
        setError(null);

        // Convertir ID a número y buscar la profesión
        const profesionIdNum = Number(id);
        const profesionEncontrada = PROFESSIONS.find(p => p.id === profesionIdNum);

        // Si no existe la profesión en el array local, usamos un fallback preventivo
        const profesionTitle = profesionEncontrada?.title || "Desarrollo de Software";
        const profesionArea = profesionEncontrada?.area || "Tecnología";

        const res = await fetch('http://localhost:3001/api/test/generar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profesion_id: profesionIdNum,
            profesion_title: profesionTitle,
            profesion_area: profesionArea
          })
        });

        if (!res.ok) {
          const errorApi = await res.json().catch(() => ({}));
          throw new Error(errorApi.error || 'Error al generar el examen.');
        }

        const data = await res.json();
        setTestData(data.data);
      } catch (err) {
        setError(err.message || 'Ocurrió un error inesperado al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    }

    if (id) cargarTest();
  }, [id]);

  // Selección de opciones
  const handleSelectOption = (preguntaId, opcionIdx) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: opcionIdx
    }));
  };

  // 2. Enviar el test para evaluación y guardado
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Obtener el título de la profesión de forma segura
      const profesionEncontrada = PROFESSIONS.find(p => p.id === Number(id));
      const nombreProfesion = testData?.profesion || profesionEncontrada?.title || "Ingeniería de Software";

      const payload = {
        usuario_id: 1, // ID temporal de sesión
        profesion_id: Number(id),
        profesion_title: nombreProfesion,
        respuestas: Object.entries(respuestas).map(([pregunta_id, opcion_idx]) => ({
          pregunta_id: Number(pregunta_id),
          opcion_idx
        }))
      };

      // Apuntamos al backend de Express en el puerto 3001
      const res = await fetch('http://localhost:3001/api/test/evaluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al procesar la evaluación.');

      const data = await res.json();
      
      // Obtener nivel y nombre devueltos por el servidor de forma segura
      const nivelCalculado = data.resultado?.nivel || data.nivel || "Principiante";
      const vocacionFinal = data.resultado?.vocacion || nombreProfesion;

      // Redirección hacia la página de recomendaciones con variables definidas
      router.push(`/recomendacion?profesion=${encodeURIComponent(vocacionFinal)}&nivel=${encodeURIComponent(nivelCalculado)}`);
    } catch (err) {
      alert('Error enviando el test: ' + err.message);
      setSubmitting(false);
    }
  };

  // --- Renderizado de Estados ---

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <div className="text-center">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2 justify-center">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Generando evaluación...
          </h3>
          <p className="text-sm text-gray-500">
            Estructurando preguntas específicas según la profesión seleccionada.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-red-800">No se pudo cargar el examen</h3>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const preguntas = testData?.preguntas || [];
  const totalPreguntas = preguntas.length;
  const respondidas = Object.keys(respuestas).length;
  const esCompleto = respondidas === totalPreguntas && totalPreguntas > 0;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" /> Test Diagnóstico
        </span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Evaluación de Nivel: {testData?.profesion}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Responde las preguntas para determinar tu nivel y filtrar los recursos.
        </p>

        {/* Barra de Progreso */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progreso</span>
            <span>{respondidas} de {totalPreguntas} respondidas</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: totalPreguntas > 0 ? `${(respondidas / totalPreguntas) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Preguntas */}
      <div className="space-y-6">
        {preguntas.map((p, index) => (
          <div
            key={p.id || index}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm"
          >
            {/* Enunciado */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold text-sm pt-0.5">
                  {index + 1}.
                </span>
                <h3 className="font-medium text-gray-900 dark:text-white text-base">
                  {p.enunciado}
                </h3>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                p.dificultad === 'Principiante' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                p.dificultad === 'Intermedio' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
              }`}>
                {p.dificultad}
              </span>
            </div>

            {/* Opciones */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              {p.opciones.map((opcion, idx) => {
                const isSelected = respuestas[p.id || index] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(p.id || index, idx)}
                    className={`p-3.5 rounded-lg border text-left text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-medium'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{opcion}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón de Envío */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!esCompleto || submitting}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 shadow-md"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluando nivel...</span>
            </>
          ) : (
            <>
              <span>Finalizar y Ver Recursos</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}