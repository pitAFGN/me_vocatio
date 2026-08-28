"use client";

export default function LoadingScreen({
  mensaje = "Verificando acceso...",
  claseFondo = "bg-slate-50 dark:bg-[#0a0b14]",
  claseTexto = "text-indigo-500 dark:text-indigo-400",
  spinner = false,
}) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${claseFondo} font-bold uppercase tracking-widest text-sm transition-colors duration-300`}
    >
      <div className="text-center">
        {spinner && (
          <div className="w-8 h-8 mx-auto mb-4 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        )}
        <span className={claseTexto}>{mensaje}</span>
      </div>
    </div>
  );
}