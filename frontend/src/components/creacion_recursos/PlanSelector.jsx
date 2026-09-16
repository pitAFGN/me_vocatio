export default function PlanSelector({ isPremium, onUpgrade }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-colors duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
            Tu Plan Actual
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/70 p-1 gap-2 items-center">
          <div
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              !isPremium
                ? "bg-slate-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Plan Gratuito
          </div>
          <div
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              isPremium
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Plan Premium
          </div>
          {!isPremium && (
            <button
              onClick={onUpgrade}
              className="ml-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
            >
              Mejorar
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
