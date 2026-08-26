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
