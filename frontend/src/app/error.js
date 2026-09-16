"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

/**
 * ErrorBoundary global de Next.js.
 * Se muestra cuando un componente del árbol de rutas lanza un error en runtime,
 * en lugar de dejar una pantalla en blanco. El botón vuelve a renderizar la
 * página (reset) para intentar recuperarse sin recargar la aplicación entera.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Registrar el error para diagnóstico (evita lanzar ruido en consola del test).
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#080d1a] text-center px-6 transition-colors duration-300">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
        <RefreshCw className="w-10 h-10" />
      </div>

      <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
        Algo salió mal
      </h1>
      <p className="text-slate-300 font-light max-w-sm mb-10 leading-snug">
        Ocurrió un error inesperado. Recargá la pantalla para volver a intentar.
      </p>

      <button
        type="button"
        onClick={reset}
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-3.5 rounded-xl font-black shadow-lg border border-purple-400/40 transition-all text-[11px] uppercase tracking-[0.3em] active:scale-95 cursor-pointer"
      >
        Recargar
      </button>
    </main>
  );
}
