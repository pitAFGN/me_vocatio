"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { validarPassword } from "@/lib/validarPassword";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  if (!token) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!validarPassword(password)) {
      setError("La contraseña debe tener mínimo 7 caracteres y al menos 2 números.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      alert("¡Contraseña actualizada con éxito!");
    } catch (err) {
      setError(err.message || "El enlace expiró o es inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#1e293b] relative overflow-hidden p-6">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
        <div className="w-[50rem] h-[50rem] border-[70px] border-white rotate-45 shadow-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white p-10 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-50 duration-500 mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-tight">
            Nueva Contraseña
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">
            Accede a tu cuenta para seguir puliendo tu profesión
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Contraseña
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Confirmar contraseña
            </label>
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-slate-800 text-sm shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-[11px] font-bold tracking-wide">{error}</p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-[#1e293b] text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all uppercase text-[11px] tracking-[0.3em] active:scale-95 disabled:opacity-50 mt-4 border border-slate-700"
          >
            {loading ? "Actualizando..." : "Guardar Cambios"}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            Cancelar y Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1e293b] flex items-center justify-center text-white font-black italic uppercase tracking-widest text-xs">
          Cargando Portal...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
