"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProfessionById } from '@/app/data/professions';
import { API_URL } from '@/lib/constants';

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

  // --- 1. EFECTO AL CARGAR: Generar el test con Groq ---
  useEffect(() => {
    const generarTest = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/generar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            profesion_title: profession?.title,
            profesion_area: profession?.area
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
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

  // --- 2. MANEJADOR DE RESPUESTAS ---
  const manejarCambioRespuesta = (preguntaId, opcionIndex) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [preguntaId]: opcionIndex
    }));
  };

  // --- 3. FINALIZAR Y GUARDAR ---
  const finalizarDiagnostico = async () => {
    if (Object.keys(respuestasUsuario).length < preguntas.length) {
      if (!confirm("Aún no has respondido todas las preguntas. ¿Deseas finalizar de todas formas?")) {
        return;
      }
    }

    // Obtenemos el token JWT guardado en el navegador al iniciar sesión
    const token = localStorage.getItem('token');

    if (!token) {
      alert("No se encontró una sesión activa. Por favor, inicia sesión de nuevo.");
      router.push('/login');
      return;
    }

    if (!testId) {
      alert("No se encontró un test válido. Recarga la página e inténtalo de nuevo.");
      return;
    }

    setCargandoEnvio(true);
    try {
      // Enviamos la petición con el token en los headers de autorización (Bearer Token)
      const response = await fetch(`${API_URL}/api/evaluar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
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

  // --- RENDERIZADO ---
  if (!profession) {
    return <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>Vocación no encontrada.</div>;
  }

  if (cargandoTest) {
    return <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>Cargando preguntas del test...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: '#ff6b6b', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '2rem', color: '#fff', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Cuestionario de Diagnóstico: {profession.title}</h1>
      <p style={{ marginBottom: '2rem' }}>Responde las siguientes preguntas para evaluar tu nivel técnico.</p>

      {/* LISTADO DE PREGUNTAS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
              {index + 1}. {pregunta.enunciado}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pregunta.opciones.map((opcion, opcionIndex) => (
                <label key={opcionIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`pregunta_${pregunta.id}`}
                    value={opcionIndex}
                    checked={respuestasUsuario[pregunta.id] === opcionIndex}
                    onChange={() => manejarCambioRespuesta(pregunta.id, opcionIndex)}
                    style={{ accentColor: '#38bdf8' }}
                  />
                  {opcion}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BOTÓN FINALIZAR */}
      <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
        <button 
          onClick={finalizarDiagnostico}
          disabled={cargandoEnvio}
          style={{
            background: '#38bdf8', 
            color: '#0f172a', 
            border: 'none', 
            padding: '1rem 2rem', 
            fontWeight: 'bold', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '1.1rem',
            opacity: cargandoEnvio ? 0.7 : 1
          }}
        >
          {cargandoEnvio ? 'Guardando Evaluación...' : 'Finalizar y Ver Recursos Personalizados'}
        </button>
      </div>
    </div>
  );
}