export default function ResourceStructurePanel({
  isPremium,
  resources,
  freeResourceLimit,
  onCreateResource,
  onUpgrade,
}) {
  const visibleResources = isPremium ? resources : resources.slice(0, freeResourceLimit);

  return (
    <section
      className={`rounded-3xl border p-5 transition-all ${
        isPremium
          ? "border-violet-500/30 bg-slate-900/80"
          : "border-slate-800 bg-slate-900/50 opacity-60"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Flujo del curso
          </p>
          <h2 className="mt-2 text-xl font-black text-white">Estructura de recursos</h2>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-xl font-black text-white">Estructura de recursos</h2>
            
            {/* Tooltip Icon */}
            <div className="relative group cursor-help">
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 hover:text-violet-300 hover:border-violet-500 hover:bg-violet-500/20 transition-colors">
                <span className="text-xs font-bold">?</span>
              </div>
              
              {/* Tooltip Content (hidden by default, visible on hover) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">¿Qué es esto?</strong>
                  Imagina que es como crear una lista de reproducción. Aquí defines el orden exacto (videos, guías, etc.) que tu estudiante seguirá paso a paso al tomar el curso.
                </p>
                {/* Flechita del tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>
          
          <p className="mt-2 text-xs text-slate-400">
            {isPremium
              ? `${resources.length} recursos visibles · sin límite`
              : `${visibleResources.length} de ${freeResourceLimit} recursos gratuitos visibles`}
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateResource}
          className={`shrink-0 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition-all ${
            isPremium
              ? "bg-violet-600 text-white hover:bg-violet-500"
              : "border border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
          }`}
        >
          {isPremium ? "+ Crear recurso" : "🔒 Crear recurso"}
        </button>
      </div>

      <div className="space-y-4">
        {visibleResources.map((resource, index) => (
          <div key={resource.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-black text-violet-200">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-bold text-white">{resource.title}</p>
                  <p className="text-xs text-slate-400">{resource.type}</p>
                </div>
              </div>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                Activo
              </span>
            </div>
          </div>
        ))}

        {!isPremium && resources.length > freeResourceLimit && (
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full rounded-2xl border border-dashed border-violet-500/40 bg-violet-500/5 p-4 text-sm font-bold text-violet-200 transition-colors hover:bg-violet-500/10"
          >
            Actualiza a Premium para ver el resto de tus recursos
          </button>
        )}
      </div>
    </section>
  );
}
