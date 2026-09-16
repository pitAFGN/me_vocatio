export default function RecomendacionLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
          Cargando recomendación...
        </span>
      </div>
    </div>
  );
}
