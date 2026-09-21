"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { validarPassword } from "@/lib/validarPassword";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
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
      setError("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      const Swal = (await import("sweetalert2")).default;
      await Swal.fire({
        title: "¡Contraseña Actualizada!",
        text: "Tu nueva contraseña se guardó con éxito. Ya puedes iniciar sesión.",
        icon: "success",
        confirmButtonColor: "#8b5cf6"
      });
      router.push("/login");
    } catch (err) {
      setError(err.message || "El enlace expiró o es inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#0f172a] relative overflow-hidden p-6 transition-colors duration-300">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
        <div className="w-[50rem] h-[50rem] border-[70px] border-slate-300 dark:border-slate-500 rotate-45 shadow-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1e293b] p-10 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 mx-4 transition-colors duration-300">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter uppercase">
            Nueva Contraseña
          </h2>
          <p className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Sigue puliendo tu profesión
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                required
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 pr-12 py-3.5 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 focus:border-purple-500 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl outline-none transition-all font-bold text-slate-900 dark:text-slate-100 text-sm shadow-sm dark:shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword((visible) => !visible)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 transition-colors cursor-pointer"
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 ml-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                required
                type={mostrarConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 pr-12 py-3.5 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 focus:border-purple-500 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl outline-none transition-all font-bold text-slate-900 dark:text-slate-100 text-sm shadow-sm dark:shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmPassword((visible) => !visible)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 transition-colors cursor-pointer"
                aria-label={mostrarConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
              >
                {mostrarConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3 mt-2">
              <p className="text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-wide flex items-center gap-2">
                <span>⚠</span> {error}
              </p>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 font-black rounded-xl shadow-xl transition-all transform mt-6 uppercase text-[11px] tracking-[0.3em] cursor-pointer bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-[0.97] border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando..." : "Guardar Cambios"}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
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
        <div className="min-h-screen bg-slate-100 dark:bg-[#0f172a] flex items-center justify-center text-slate-900 dark:text-white font-black italic uppercase tracking-widest text-xs transition-colors duration-300">
          Cargando Portal...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
