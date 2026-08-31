"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Clock,
  Briefcase,
  Send,
  ExternalLink,
  Code2,
  Check,
  Copy,
  Bot,
  User,
  Zap,
  BookOpen
} from "lucide-react";
import { API_URL } from "@/lib/constants";

export default function ResourceAiModal({
  isOpen,
  onClose,
  resource,
  vocation,
  nivel,
  isPremium,
  onUpgrade
}) {
  const [loading, setLoading] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && resource) {
      setCustomQuestion("");
      setChatMessages([]);
      setError(null);
      setInitialAnalysis(null);

      if (!isPremium) {
        return;
      }

      const fetchAnalysis = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/analizar`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              titulo: resource.titulo,
              tipo: resource.tipo,
              plataforma: resource.plataforma,
              url: resource.url,
              descripcion: resource.descripcion,
              vocation: vocation,
              nivel: nivel,
            }),
          });

          if (!response.ok) {
            throw new Error(`Error en el servidor (${response.status})`);
          }

          const resJson = await response.json();
          if (resJson.exito && resJson.data) {
            setInitialAnalysis(resJson.data);
            // El primer mensaje del chat es el resumen completo generado por Gemini
            setChatMessages([
              {
                id: "initial-summary",
                sender: "bot",
                tipo: "summary",
                data: resJson.data,
              },
            ]);
          } else {
            throw new Error("No se pudo obtener el análisis");
          }
        } catch (err) {
          console.error("Error al obtener análisis de IA:", err);
          setError("No se pudo cargar el análisis con IA. Por favor, intenta de nuevo.");
        } finally {
          setLoading(false);
        }
      };

      fetchAnalysis();
    }
  }, [isOpen, resource, isPremium, vocation, nivel]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading]);

  const handleSendQuestion = async (preguntaTexto) => {
    const texto = (preguntaTexto || customQuestion).trim();
    if (!texto || chatLoading || !resource) return;

    const userMsg = { id: Date.now().toString(), sender: "user", text: texto };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!preguntaTexto) setCustomQuestion("");
    setChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/analizar`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: resource.titulo,
          tipo: resource.tipo,
          plataforma: resource.plataforma,
          url: resource.url,
          descripcion: resource.descripcion,
          vocation: vocation,
          nivel: nivel,
          pregunta_usuario: texto,
        }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del chat");

      const resJson = await response.json();
      const botReply =
        resJson.data?.respuesta_chat ||
        resJson.data?.impacto_vocacional ||
        "He analizado el recurso para tu perfil. ¡Está listo para potenciar tus habilidades!";

      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: botReply },
      ]);
    } catch (err) {
      console.error("Error en chat de recurso:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Lo siento, tuve un problema al procesar tu pregunta. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!initialAnalysis) return;
    const textToCopy = `📌 Resumen de ${resource.titulo}:\n\n${initialAnalysis.resumen_completo}\n\n🎯 Impacto en ${vocation}: ${initialAnalysis.impacto_vocacional}\n⏱️ Tiempo sugerido: ${initialAnalysis.analisis_tiempo}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[780px] rounded-3xl border border-violet-500/30 bg-[#0c1222]/95 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl z-10 overflow-hidden flex flex-col">
        
        {/* Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
                  Gemini Copilot
                </span>
                <span className="px-2 py-0.2 rounded-full bg-violet-500/20 border border-violet-500/40 text-[9px] font-bold text-violet-200">
                  PREMIUM
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {resource.titulo}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-sky-300 transition-colors"
            >
              <span>Abrir recurso</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Si el usuario es FREE (No Premium) */}
        {!isPremium && (
          <div className="relative z-10 m-auto text-center py-10 px-6 max-w-md">
            <div className="w-14 h-14 mx-auto rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300 mb-4 shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">
              Desbloquea el Asistente y Resumen IA con Gemini
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              Obtén un resumen completo en texto de videos extensos o páginas web, su impacto directo en tu profesión ({vocation}) y un chat interactivo con el Plan Premium.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onUpgrade();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Ver Plan Premium
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tal vez después
              </button>
            </div>
          </div>
        )}

        {/* Si el usuario es PREMIUM -> Área de Chat */}
        {isPremium && (
          <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            {/* Historial de Mensajes / Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {loading && (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs sm:text-sm font-medium text-violet-300">
                    Gemini está leyendo y sintetizando el contenido del recurso...
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs sm:text-sm text-center">
                  {error}
                </div>
              )}

              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-violet-500/20 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  {/* Mensaje de Resumen Inicial de Gemini */}
                  {msg.tipo === "summary" ? (
                    <div className="w-full max-w-[92%] rounded-2xl border border-violet-500/20 bg-slate-900/80 p-4 sm:p-5 text-slate-200 text-xs sm:text-sm space-y-4 shadow-lg">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="font-bold text-violet-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <BookOpen className="w-4 h-4 text-violet-400" />
                          Resumen en Profundidad del Recurso
                        </span>
                        <button
                          onClick={handleCopySummary}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copiar
                            </>
                          )}
                        </button>
                      </div>

                      {/* Texto del Resumen Completo */}
                      <div className="text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                        {msg.data.resumen_completo}
                      </div>

                      {/* Bloques de Impacto Vocacional y Tiempo */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                          <div className="flex items-center gap-1.5 text-violet-300 font-bold text-xs">
                            <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                            <span>Impacto en tu carrera ({vocation})</span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-300 leading-normal">
                            {msg.data.impacto_vocacional}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                          <div className="flex items-center gap-1.5 text-sky-300 font-bold text-xs">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            <span>Tiempo & Estudio</span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-300 leading-normal">
                            {msg.data.analisis_tiempo}
                          </p>
                        </div>
                      </div>

                      {/* Prerrequisitos si existen */}
                      {msg.data.prerrequisitos && msg.data.prerrequisitos.length > 0 && (
                        <div className="p-3 rounded-xl border border-white/5 bg-slate-950/40">
                          <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs mb-1">
                            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Prerrequisitos sugeridos:</span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400">
                            {msg.data.prerrequisitos.join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mensaje de Chat Regular */
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                        msg.sender === "user"
                          ? "bg-violet-600 text-white rounded-tr-none shadow-md shadow-violet-600/20"
                          : "bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none shadow-md"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  )}

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-violet-300 text-xs flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini está escribiendo una respuesta...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Footer con Preguntas Rápidas e Input */}
            <div className="p-4 border-t border-white/10 bg-slate-900/90 space-y-3 shrink-0">
              {/* Pills de Preguntas Rápidas */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Preguntar:</span>
                <button
                  onClick={() =>
                    handleSendQuestion("¿En qué orden debería estudiar los temas de este recurso?")
                  }
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-violet-600/20 hover:border-violet-500/40 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                >
                  ⏱️ ¿Cómo organizar mi horario?
                </button>
                <button
                  onClick={() =>
                    handleSendQuestion("¿Qué conceptos son los más difíciles de este recurso y cómo dominarlos?")
                  }
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-violet-600/20 hover:border-violet-500/40 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                >
                  💡 Conceptos clave más difíciles
                </button>
                <button
                  onClick={() =>
                    handleSendQuestion("¿Cómo demuestro lo aprendido en este recurso en mi portafolio o CV?")
                  }
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-violet-600/20 hover:border-violet-500/40 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                >
                  💼 ¿Cómo incluirlo en mi portafolio?
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Pregúntale a Gemini lo que quieras sobre este recurso..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!customQuestion.trim() || chatLoading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-violet-500/20 shrink-0"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
