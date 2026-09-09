"use client";
import { useState } from "react";
import { X, Video, FileText, FileBadge, Link as LinkIcon } from "lucide-react";

const resourceTypes = [
  { id: "Video", icon: Video, label: "Video", desc: "Clase grabada" },
  { id: "Guía práctica", icon: FileText, label: "Guía práctica", desc: "Documento o PDF" },
  { id: "Proyecto", icon: FileBadge, label: "Proyecto", desc: "Reto o tarea" },
  { id: "Enlace", icon: LinkIcon, label: "Enlace", desc: "Recurso externo" },
];

export default function ResourceModal({ isOpen, onClose, onAdd, lessonNumber }) {
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState("Video");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title, selectedType);
    setTitle("");
    setSelectedType("Video");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-violet-500/30 bg-[#0a0b14] p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] animate-in zoom-in-95 fade-in duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-white">Nuevo Recurso</h3>
            <p className="text-xs text-slate-400 mt-1">Lección #{lessonNumber}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Título del recurso
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && title.trim() && handleAdd()}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:bg-slate-900"
              placeholder="Ej: Introducción a los componentes"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Tipo de contenido
            </label>
            <div className="grid grid-cols-2 gap-3">
              {resourceTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-500/10' 
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-violet-400' : 'text-slate-500'}`} />
                    <span className={`text-xs font-bold ${isSelected ? 'text-violet-200' : 'text-slate-300'}`}>{type.label}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{type.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-700 bg-transparent py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
            Cancelar
          </button>
          <button 
            onClick={handleAdd}
            disabled={!title.trim()}
            className="flex-1 rounded-xl bg-violet-600 py-3 text-xs font-bold text-white transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar Recurso
          </button>
        </div>
      </div>
    </div>
  );
}

