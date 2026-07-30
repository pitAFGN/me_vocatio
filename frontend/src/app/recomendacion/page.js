"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './RecomendacionPage.css';

function RecomendacionContent() {
  const searchParams = useSearchParams();

  // 1. Capturar parámetros de la URL enviados desde el test
  const profesionURL = searchParams.get('profesion') || searchParams.get('vocacion') || '';
  const nivelURL = searchParams.get('nivel') || 'Principiante';

  const [vocacion, setVocacion] = useState(profesionURL);
  const [nivel, setNivel] = useState(nivelURL);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const obtenerImagenFondo = (url, titulo) => {
    const palabraClave = encodeURIComponent(titulo.split(' ')[0] || 'study');
    return `https://loremflickr.com/600/400/${palabraClave}`;
  };

  // 2. Función para consultar el endpoint /api/recomendar
  const ejecutarPeticion = useCallback(async (vocacionQuery, nivelQuery) => {
    if (!vocacionQuery) return;

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch('http://localhost:3001/api/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vocacion: vocacionQuery, 
          nivel: nivelQuery, 
          evitarUrls: [] 
        })
      });

      if (!response.ok) {
        const textoError = await response.text();
        console.error("Error crudo del backend:", textoError);
        throw new Error(`Error en el servidor (${response.status}).`);
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  // 3. Petición automática si el usuario viene del test
  useEffect(() => {
    if (profesionURL) {
      setVocacion(profesionURL);
      setNivel(nivelURL);
      ejecutarPeticion(profesionURL, nivelURL);
    }
  }, [profesionURL, nivelURL, ejecutarPeticion]);

  const manejarBusqueda = (e) => {
    e.preventDefault();
    ejecutarPeticion(vocacion, nivel);
  };

  return (
    <div className="rec-page-container">
      <div className="rec-content-wrapper">
        
        {/* Cabecera */}
        <header className="rec-header">
          <span className="brand-logo">💎</span>
          <h1>RUTAS DE APRENDIZAJE</h1>
          <p>Descubre los mejores recursos académicos adaptados a tu próximo paso profesional.</p>
        </header>

        {/* Formulario */}
        <div className="rec-form-card">
          <form onSubmit={manejarBusqueda} className="rec-minimal-form">
            <div className="form-row">
              <div className="input-group">
                <label>¿QUÉ VOCACIÓN DESEAS EXPLORAR?</label>
                <input 
                  type="text" 
                  value={vocacion}
                  onChange={(e) => setVocacion(e.target.value)}
                  placeholder="Ej. Ingeniería de Software, Gastronomía..." 
                  required 
                />
              </div>

              <div className="input-group select-group">
                <label>NIVEL ACTUAL</label>
                <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <button type="submit" className="rec-submit-btn" disabled={cargando}>
              {cargando ? 'PULIENDO TU RUTA...' : 'OBTENER RECURSOS'}
            </button>
          </form>

          <div className="ux-notice-box">
            <p>
              <strong>Nota sobre los recursos:</strong> Las sugerencias son estructuradas de forma automatizada por Inteligencia Artificial. Aunque priorizamos plataformas estables y de libre acceso, de forma muy ocasional algunos enlaces externos podrían cambiar de ruta o no estar disponibles.
            </p>
          </div>
        </div>

        {/* Estado Carga y Error */}
        {cargando && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#38bdf8' }}>
            <p>🔄 Generando recomendaciones personalizadas con IA...</p>
          </div>
        )}

        {error && <div className="error-message-box">⚠️ {error}</div>}

        {/* Resultados */}
        {!cargando && resultado && (
          <div className="results-section">
            <div className="results-focus-card">
              <h3>Enfoque sugerido para tu nivel ({nivel}):</h3>
              <p>{resultado.resumen_enfoque}</p>
            </div>

            <div className="cards-grid">
              {resultado.materiales && resultado.materiales.map((material, index) => (
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