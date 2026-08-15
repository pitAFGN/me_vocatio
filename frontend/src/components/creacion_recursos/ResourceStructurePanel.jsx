export default function ResourceStructurePanel({ isPremium }) {
  return (
    <section
      className={`rounded-3xl border p-5 transition-all ${
        isPremium
          ? "border-violet-500/30 bg-slate-900/80"
          : "border-slate-800 bg-slate-900/50 opacity-60"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Flujo del curso
          </p>
          <h2 className="mt-2 text-xl font-black text-white">Estructura de recursos</h2>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-black text-violet-200">
                  0{item}
                </div>
                <div>
                  <p className="font-bold text-white">Lección {item}</p>
                  <p className="text-xs text-slate-400">Video + guía práctica</p>
                </div>
              </div>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                Activo
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
