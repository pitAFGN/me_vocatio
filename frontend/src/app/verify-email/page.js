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
    <main className="min-h-screen w-full flex items-center justify-center bg-[#1e293b] relative overflow-hidden p-6">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
        <div className="w-[50rem] h-[50rem] border-[70px] border-white rotate-45 shadow-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white p-10 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-50 duration-500 mx-4 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-14 h-14 text-slate-900 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-tight">
              Verificando tu correo...
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">
              Esto solo toma un segundo
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-tight">
              ¡Correo verificado!
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-3">{message}</p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-4 bg-[#1e293b] text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all uppercase text-[11px] tracking-[0.3em] active:scale-95 mt-8 border border-slate-700"
            >
              Ir a Iniciar Sesión
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-tight">
              No se pudo verificar
            </h2>
            <p className="text-red-500 font-bold text-[11px] tracking-wide mt-3">{message}</p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-4 bg-[#1e293b] text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all uppercase text-[11px] tracking-[0.3em] active:scale-95 mt-8 border border-slate-700"
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
        <div className="min-h-screen bg-[#1e293b] flex items-center justify-center text-white font-black italic uppercase tracking-widest text-xs">
          Cargando Portal...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}