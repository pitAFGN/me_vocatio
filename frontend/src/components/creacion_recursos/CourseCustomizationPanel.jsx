export default function CourseCustomizationPanel({
  isPremium,
  backgroundOptions,
  badgeOptions,
  selectedBackground,
  selectedBadges,
  setSelectedBackground,
  toggleBadge,
  curso,
}) {
  return (
    <section
      className={`rounded-3xl border p-5 transition-all ${
        isPremium
          ? "border-violet-500/30 bg-slate-900/80"
          : "border-slate-800 bg-slate-900/50 opacity-70"
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Personalización
          </p>
          <h2 className="mt-2 text-xl font-black text-white">Carta del curso</h2>
        </div>

        {!isPremium && (
          <div className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            🔒 Premium
          </div>
        )}
      </div>

      {!isPremium && (
        <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-medium text-amber-100">
          🔒 Función exclusiva del Plan Premium.
        </div>
      )}

      <div className={`space-y-5 ${!isPremium ? "pointer-events-none select-none" : ""}`}>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Fondo de la carta
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {backgroundOptions.map((background) => (
              <button
                key={background.name}
                type="button"
                disabled={!isPremium}
                onClick={() => setSelectedBackground(background.className)}
                className={`h-20 rounded-2xl border transition-all ${
                  selectedBackground === background.className
                    ? "border-violet-400 ring-2 ring-violet-500/30"
                    : "border-slate-700 hover:border-slate-500"
                } ${background.className}`}
              >
                <span className="flex h-full items-end justify-start p-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-100/90">
                  {background.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Insignias / logros
          </label>
          <div className="flex flex-wrap gap-2">
            {badgeOptions.map((badge) => {
              const active = selectedBadges.includes(badge);
              return (
                <button
                  key={badge}
                  type="button"
                  disabled={!isPremium}
                  onClick={() => toggleBadge(badge)}
                  className={`rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all ${
                    active
                      ? "border-violet-400 bg-violet-500/15 text-violet-100"
                      : "border-slate-700 bg-slate-950/70 text-slate-400"
                  }`}
                >
                  {badge}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className={`rounded-2xl border border-slate-700 p-4 ${selectedBackground}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-200/80">
                  Curso destacado
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">{curso.nombre || "Mi curso"}</h3>
              </div>
              <div className="rounded-full border border-violet-300/30 bg-violet-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-100">
                Actualizado
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-200/90">{curso.descripcion}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-violet-100"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
