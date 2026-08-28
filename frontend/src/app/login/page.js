"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePublicRoute } from "@/hooks/useRouteGuard";
import AuthBanner from "@/components/auth/AuthBanner";
import AuthForm from "@/components/auth/AuthForm";

function AuthContent() {
  // La ruta pública ya no bloquea el render: muestra el formulario de inmediato
  // y solo redirige al dashboard si ya hay una sesión válida.
  usePublicRoute();
  const searchParams = useSearchParams();
  const [esRegistro, setEsRegistro] = useState(false);

  useEffect(() => {
    setEsRegistro(searchParams.get("mode") === "signup");
  }, [searchParams]);

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-100 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      <AuthBanner esRegistro={esRegistro} />

      <div className="flex-1 flex flex-col items-center justify-start pt-16 lg:pt-24 p-8 sm:p-12 bg-white dark:bg-[#1e293b] relative overflow-y-auto transition-colors duration-300">
        <Link
          href="/"
          className="fixed top-24 right-10 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] z-[40] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
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
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0b1329] text-slate-900 dark:text-white italic font-black uppercase tracking-widest transition-colors duration-300">
          MeVocatio...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
