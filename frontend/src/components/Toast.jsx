"use client";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
        type === 'success' 
          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
          : 'bg-red-950/80 border-red-500/40 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
      }`}>
        {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
        <p className="text-sm font-semibold">{message}</p>
        <button onClick={onClose} className="ml-4 text-white/50 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

