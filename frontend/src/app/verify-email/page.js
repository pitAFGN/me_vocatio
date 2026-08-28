"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const token = searchParams.get("token");

  // "loading" | "success" | "error"
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Falta el token de verificación en el enlace.");
      return;
    }

    const verificar = async () => {
      try {
        const data = await verifyEmail(token);
        setStatus("success");
        setMessage(data.message || "Correo verificado exitosamente.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "El enlace es inválido o ya expiró.");
      }
    };

    verificar();
    // Solo debe ejecutarse una vez, al montar el componente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#0f172a] relative overflow-hidden p-6 transition-colors duration-300">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
        <div className="w-[50rem] h-[50rem] border-[70px] border-slate-300 dark:border-slate-500 rotate-45 shadow-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1e293b] p-10 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-50 duration-500 mx-4 text-center transition-colors duration-300">
        {status === "loading" && (
          <>
            <Loader2 className="w-14 h-14 text-slate-900 dark:text-white mx-auto mb-6 animate-spin" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">
              Verificando...
            </h2>
            <p className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">
              Esto solo toma un segundo
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">
              ¡Correo verificado!
            </h2>
            <p className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">{message}</p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-4 font-black rounded-xl shadow-xl transition-all transform mt-8 uppercase text-[11px] tracking-[0.3em] cursor-pointer bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-[0.97] border border-purple-400/30"
            >
              Ir a Iniciar Sesión
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">
              Error
            </h2>
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3 mt-4 inline-block">
              <p className="text-red-600 dark:text-red-400 font-bold text-[11px] tracking-wide uppercase">{message}</p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-4 font-black rounded-xl shadow-xl transition-all transform mt-8 uppercase text-[11px] tracking-[0.3em] cursor-pointer bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-[0.97] border border-purple-400/30"
            >
              Volver al Inicio de Sesión
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-slate-900 dark:text-white font-black italic uppercase tracking-widest text-xs transition-colors duration-300">
          Cargando Portal...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
