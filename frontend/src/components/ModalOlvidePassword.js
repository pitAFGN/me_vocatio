"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";

export default function ModalOlvidePassword({ onClose }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      await Swal.fire({
        icon: "success",
        title: "¡Correo enviado!",
        text: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
      });
      onClose();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo enviar el correo",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-slate-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 text-slate-400 hover:text-slate-900 font-black text-lg transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
            ¿Olvidaste tu contraseña?
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
            Te enviaremos un enlace de recuperación
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="TU-EMAIL@EJEMPLO.COM"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1e293b] text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all uppercase text-[11px] tracking-[0.3em] active:scale-95 disabled:opacity-50 border border-slate-700"
          >
            {loading ? "Enviando..." : "Enviar Enlace"}
          </button>
        </form>
      </div>
    </div>
  );
}
