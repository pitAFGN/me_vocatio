"use client";

import React, { useState } from 'react';
import './RecomendacionPage.css';

const RecomendacionPage = () => {
  const [vocacion, setVocacion] = useState('');
  const [nivel, setNivel] = useState('Principiante');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const obtenerImagenFondo = (url, titulo) => {
    const palabraClave = encodeURIComponent(titulo.split(' ')[0] || 'study');
    return `https://loremflickr.com/600/400/${palabraClave}`;
  };

  const manejarBusqueda = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch('http://localhost:3001/api/v1/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocacion, nivel, evitarUrls: [] })
      });

      if (!response.ok) {
        const textoError = await response.text();
        console.error("Error crudo del backend:", textoError);
        throw new Error(`Error en el servidor (${response.status}). Revisa la consola.`);
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="rec-page-container">
      {/* El fondo animado ahora se maneja directamente en el contenedor principal vía CSS */}
      <div className="rec-content-wrapper">
        
        {/* Cabecera Principal */}
        <header className="rec-header">
          <span className="brand-logo">💎</span>
          <h1>RUTAS DE APRENDIZAJE</h1>
          <p>Descubre los mejores recursos académicos adaptados a tu próximo paso profesional.</p>
        </header>

        {/* Formulario Minimalista */}
        <div className="rec-form-card">
          <form onSubmit={manejarBusqueda} className="rec-minimal-form">
            <div className="form-row">
              <div className="input-group">
                <label>¿QUÉ VOCACIÓN DESEAS EXPLORAR?</label>
                <input 
                  type="text" 
                  value={vocacion}
                  onChange={(e) => setVocacion(e.target.value)}
                  placeholder="Ej. Astronomía, Programación, Cocina..." 
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

          {/* Aviso sutil de UX */}
          <div className="ux-notice-box">
            <p>
              <strong>Nota sobre los recursos:</strong> Las sugerencias son estructuradas de forma automatizada por Inteligencia Artificial. Aunque priorizamos plataformas estables y de libre acceso, de forma muy ocasional algunos enlaces externos podrían cambiar de ruta o no estar disponibles (Error 404).
            </p>
          </div>
        </div>

        {/* Zona de Errores e Indicadores */}
        {error && <div className="error-message-box">⚠️ {error}</div>}

        {/* Zona de Resultados */}
        {resultado && (
          <div className="results-section">
            <div className="results-focus-card">
              <h3>Enfoque sugerido para tu nivel:</h3>
              <p>{resultado.resumen_enfoque}</p>
            </div>

            <div className="cards-grid">
              {resultado.materiales.map((material, index) => (
                <div key={index} className="resource-card">
                  
                  <div 
                    className="card-banner" 
                    style={{ backgroundImage: `url(${obtenerImagenFondo(material.url, material.titulo)})` }}
                  >
                    <span className={`badge type-${material.tipo.toLowerCase()}`}>{material.tipo}</span>
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
};

export default RecomendacionPage;