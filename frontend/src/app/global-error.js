"use client";

import { RefreshCw } from "lucide-react";

/**
 * ErrorBoundary a nivel del root layout.
 * Se usa cuando el fallo ocurre dentro del árbol del layout raíz (por eso debe
 * incluir <html> y <body>, ya que esas etiquetas pudieron no haberse renderizado).
 * Es la última red de seguridad; ante un error global muestra un mensaje amigable
 * con opción de recargar la aplicación.
 */
export default function GlobalError({ reset }) {
  return (
    <html lang="es">
      <body className="bg-[#0b1329]">
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#080d1a] text-center px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <RefreshCw className="w-10 h-10" />
          </div>

          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Error crítico
          </h1>
          <p className="text-slate-300 font-light max-w-sm mb-10 leading-snug">
            La aplicación no pudo cargarse. Recargá para reintentar.
          </p>

          <button
            type="button"
            onClick={reset}
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-3.5 rounded-xl font-black shadow-lg border border-purple-400/40 transition-all text-[11px] uppercase tracking-[0.3em] active:scale-95 cursor-pointer"
          >
            Recargar
          </button>
        </main>
      </body>
    </html>
  );
}
