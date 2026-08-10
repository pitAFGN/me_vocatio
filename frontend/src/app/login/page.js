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
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-[0.3em]">
        Verificando...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      <AuthBanner esRegistro={esRegistro} />

      <div className="flex-1 flex flex-col items-center justify-start pt-16 lg:pt-24 p-8 sm:p-12 bg-white relative overflow-y-auto">
        <Link
          href="/"
          className="fixed top-24 right-10 text-[#1e293b] hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] z-[40] bg-white/90 backdrop-blur-md shadow-2xl px-6 py-2.5 rounded-full border border-slate-200 hover:bg-[#1e293b] active:scale-95"
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
        <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-widest">
          MeVocatio...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}