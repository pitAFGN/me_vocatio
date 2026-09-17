"use client";
import { useState, useEffect } from "react";
import { X, Video, FileText, FileBadge, Link as LinkIcon, Globe } from "lucide-react";

const resourceTypes = [
  { id: "Video", icon: Video, label: "Video", desc: "Clase grabada / YouTube" },
  { id: "Guía práctica", icon: FileText, label: "Guía práctica", desc: "Documento o PDF" },
  { id: "Proyecto", icon: FileBadge, label: "Proyecto", desc: "Reto o tarea" },
  { id: "Enlace", icon: LinkIcon, label: "Enlace", desc: "Recurso externo" },
];

export default function ResourceModal({ isOpen, onClose, onAdd, onEdit, lessonNumber, editingResource }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [selectedType, setSelectedType] = useState("Video");
  const [urlError, setUrlError] = useState("");

  // Al abrir el modal, pre-cargar los datos si estamos editando
  useEffect(() => {
    if (isOpen) {
      setUrlError("");
      if (editingResource) {
        setTitle(editingResource.title || "");
        setUrl(editingResource.url || "");
        setSelectedType(editingResource.type || "Video");
      } else {
        setTitle("");
        setUrl("");
        setSelectedType("Video");
      }
    }
  }, [isOpen, editingResource]);

  if (!isOpen) return null;

  const handleAction = () => {
    if (!title.trim()) return;
    
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setUrlError("La URL del recurso es obligatoria.");
      return;
    }

    try {
      new URL(trimmedUrl);
      setUrlError("");
    } catch (e) {
      setUrlError("Por favor ingresa una URL válida que incluya https://");
      return;
    }

    if (editingResource && onEdit) {
      onEdit(editingResource.id, title.trim(), selectedType, trimmedUrl);
    } else {
      onAdd(title.trim(), selectedType, trimmedUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50 dark:bg-[#02040a]/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-violet-500/30 bg-white dark:bg-[#0a0b14] p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Nuevo Recurso</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Lección #{lessonNumber}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
              Título del recurso *
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && title.trim() && handleAction()}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900"
              placeholder="Ej: Introducción a los componentes"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
              URL o Enlace del Recurso *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError("");
                }}
                onKeyDown={(e) => e.key === 'Enter' && title.trim() && handleAction()}
                className={`w-full rounded-xl border ${urlError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:bg-white dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900`}
                placeholder="https://youtube.com/watch?v=... o enlace de material"
              />
            </div>
            {urlError ? (
              <p className="mt-1.5 text-[10px] text-red-500 dark:text-red-400">
                {urlError}
              </p>
            ) : (
              <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                Pega aquí el enlace de YouTube, Drive, GitHub o documentación de esta lección.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
              Tipo de contenido
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {resourceTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-500/10 shadow-sm' 
                        : 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-violet-400' : 'text-slate-500'}`} />
                    <span className={`text-xs font-bold ${isSelected ? 'text-violet-700 dark:text-violet-200' : 'text-slate-700 dark:text-slate-300'}`}>{type.label}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{type.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent py-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleAction}
            disabled={!title.trim()}
            className="flex-1 rounded-xl bg-violet-600 py-3 text-xs font-bold text-white transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20 cursor-pointer"
          >
            {editingResource ? "Guardar Cambios" : "Agregar Recurso"}
          </button>
        </div>
      </div>
    </div>
  );
}
