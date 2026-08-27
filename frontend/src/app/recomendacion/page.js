"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '@/lib/constants';
import './RecomendacionPage.css';
import AchievementToast from '@/components/AchievementToast';

function RecomendacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const peticionInicialRealizada = useRef(false);

  // 1. Capturar parámetros de la URL incluyendo el evaluation_id de Neon
  const profesionURL = searchParams.get('profesion') || searchParams.get('vocacion') || 'Desarrollo de Software';
  const nivelURL = searchParams.get('nivel') || 'Principiante';
  const evaluationIdURL = searchParams.get('evaluation_id') || null;

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);

  const [paginasRecursos, setPaginasRecursos] = useState([]);
  const [urlsVistas, setUrlsVistas] = useState([]);
  const [paginaActualIndex, setPaginaActualIndex] = useState(0);

  useEffect(() => {
    const savedAchievements = localStorage.getItem("mevocatio_new_achievements");
    if (!savedAchievements) return;

    try {
      setNewAchievements(JSON.parse(savedAchievements));
    } catch {
      localStorage.removeItem("mevocatio_new_achievements");
    }
  }, []);

  const obtenerImagenFondo = (url, titulo) => {
    const palabraClave = encodeURIComponent(titulo.split(' ')[0] || 'study');
    return `https://loremflickr.com/600/400/${palabraClave}`;
  };

  // 2. Función para consultar el endpoint enviando el evaluation_id
  const ejecutarPeticion = useCallback(async (vocacionQuery, nivelQuery, urlsActuales = []) => {
    if (!vocacionQuery) return;

    setCargando(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/recomendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          evaluation_id: evaluationIdURL, // Clave para guardar en resource_blocks
          vocation: vocacionQuery,
          nivel: nivelQuery,
          evitarUrls: urlsActuales
        })
      });

      if (!response.ok) {
        const textoError = await response.text();
        console.error("Error crudo del backend:", textoError);
        throw new Error(`Error en el servidor (${response.status}).`);
      }

      const data = await response.json();

      if (data.materiales && Array.isArray(data.materiales)) {
        const nuevasUrls = data.materiales.map(m => m.url);

        setUrlsVistas(prev => [...prev, ...nuevasUrls]);

        setPaginasRecursos(prev => {
          const nuevoHistorial = [...prev, data];
          setPaginaActualIndex(nuevoHistorial.length - 1);
          return nuevoHistorial;
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [evaluationIdURL]);

  useEffect(() => {
    if (profesionURL && !peticionInicialRealizada.current) {
      peticionInicialRealizada.current = true; // Marcamos que ya se hizo
      ejecutarPeticion(profesionURL, nivelURL, []);
    }
  }, [profesionURL, nivelURL, ejecutarPeticion]);

  const manejarCargarMas = () => {
    ejecutarPeticion(profesionURL, nivelURL, urlsVistas);
  };

  return (
    <div className="rec-page-container">
      <AchievementToast
        achievementCodes={newAchievements}
        onClose={() => setNewAchievements([])}
      />
      <div className="rec-content-wrapper">

        {/* Botón de retorno al Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <header className="rec-header">
          <span className="brand-logo">💎</span>
          <h1>RUTAS DE APRENDIZAJE</h1>
          <p>
            Resultados para <strong style={{ color: '#38bdf8' }}>{profesionURL}</strong> en nivel <strong style={{ color: '#38bdf8' }}>{nivelURL}</strong>.
          </p>
        </header>

        {error && <div className="error-message-box">⚠️ {error}</div>}

        {paginasRecursos.length > 0 && (
          <div className="pagination-bar" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {paginasRecursos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPaginaActualIndex(idx)}
                style={{
                  background: paginaActualIndex === idx ? '#38bdf8' : 'rgba(30, 41, 59, 0.8)',
                  color: paginaActualIndex === idx ? '#0f172a' : '#94a3b8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Página {idx + 1}
              </button>
            ))}
          </div>
        )}

        {paginasRecursos.length > 0 && (
          <div className="results-section">
            <div className="results-focus-card">
              <h3>Enfoque sugerido (Bloque {paginaActualIndex + 1}):</h3>
              <p>{paginasRecursos[paginaActualIndex].resumen_enfoque}</p>
            </div>

            <div className="cards-grid">
              {paginasRecursos[paginaActualIndex].materiales?.map((material, index) => (
                <div key={index} className="resource-card">

                  <div
                    className="card-banner"
                    style={{ backgroundImage: `url(${obtenerImagenFondo(material.url, material.titulo)})` }}
                  >
                    <span className={`badge type-${(material.tipo || 'recurso').toLowerCase()}`}>
                      {material.tipo || 'RECURSO'}
                    </span>
                  </div>

                  <div className="card-body">
                    <h4>{material.titulo}</h4>
                    <p>{material.descripcion}</p>
                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="card-link-btn">
                      Ir al recurso externo
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {cargando && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#38bdf8' }}>
            <p>🔄 Buscando y estructurando nuevos recursos con IA...</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
          <button
            onClick={manejarCargarMas}
            className="rec-submit-btn"
            disabled={cargando}
            style={{ maxWidth: '320px', margin: '0 auto' }}
          >
            {cargando ? 'GENERANDO...' : '➕ CARGAR MÁS RECURSOS (NUEVA PÁGINA)'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function RecomendacionPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', padding: '2rem' }}>Cargando página...</div>}>
      <RecomendacionContent />
    </Suspense>
  );
}