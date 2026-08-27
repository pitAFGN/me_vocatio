export default function PlanSelector({ plan, setPlan }) {
  const planOptions = [
    { id: "free", label: "Plan Gratuito" },
    { id: "premium", label: "Plan Premium" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-colors duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
            Seleccionar plan
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/70 p-1">
          {planOptions.map((option) => {
            const active = plan === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPlan(option.id)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                    : "text-slate-600 dark:text-slate-300 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
