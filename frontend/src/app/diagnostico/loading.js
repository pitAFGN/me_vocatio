export default function DiagnosticoLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1329] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
          Cargando diagnóstico...
        </span>
      </div>
    </div>
  );
}
