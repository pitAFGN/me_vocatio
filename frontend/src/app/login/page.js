"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePublicRoute } from "@/hooks/useRouteGuard";
import AuthBanner from "@/components/auth/AuthBanner";
import AuthForm from "@/components/auth/AuthForm";

function AuthContent() {
  const { loading } = usePublicRoute();
  const searchParams = useSearchParams();
  const [esRegistro, setEsRegistro] = useState(false);

  useEffect(() => {
    setEsRegistro(searchParams.get("mode") === "signup");
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1329] text-white italic font-black uppercase tracking-[0.3em]">
        Verificando...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-[#0f172a] text-slate-100 overflow-hidden">
      {/* Banner con estrellas a la izquierda */}
      <AuthBanner esRegistro={esRegistro} />

      {/* Lado derecho con el formulario en tono índigo/slate sobrio */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 lg:pt-24 p-8 sm:p-12 bg-[#1e293b] relative overflow-y-auto">
        <Link
          href="/"
          className="fixed top-24 right-10 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] z-[40] bg-slate-900/90 backdrop-blur-md shadow-2xl px-6 py-2.5 rounded-full border border-slate-700 hover:bg-slate-800 active:scale-95"
        >
          Cerrar ✕
        </Link>

        <AuthForm esRegistro={esRegistro} setEsRegistro={setEsRegistro} />
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b1329] text-white italic font-black uppercase tracking-widest">
          MeVocatio...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}