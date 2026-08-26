"use client";

const plans = [
  {
    id: "free",
    name: "Plan Gratuito",
    description: "Explora una vocación con hasta 3 recursos.",
    features: ["Hasta 3 recursos por vocación", "Datos básicos del curso"],
  },
  {
    id: "premium",
    name: "Plan Premium",
    description: "Crea y consulta todos tus recursos sin límites.",
    features: ["Recursos ilimitados", "Personalización y analíticas"],
  },
];

export default function PlanSelectionModal({ onSelect }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-selection-title"
        className="relative w-full max-w-2xl rounded-3xl border border-violet-400/30 bg-slate-900 p-6 shadow-2xl sm:p-8"
      >
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-300">
            Tu experiencia en MeVocatio
          </p>
          <h2 id="plan-selection-title" className="mt-3 text-2xl font-black text-white sm:text-3xl">
            Elige tu plan
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Puedes cambiar de plan más adelante.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan.id)}
              className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 ${
                plan.id === "premium"
                  ? "border-violet-400/60 bg-violet-500/10 hover:bg-violet-500/20"
                  : "border-slate-700 bg-slate-950/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-black text-white">{plan.name}</h3>
                {plan.id === "premium" && (
                  <span className="rounded-full bg-violet-500/20 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-violet-200">
                    Recomendado
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
              <span className="mt-5 block text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">
                {plan.id === "premium" ? "Elegir Premium" : "Continuar gratis"}
              </span>
            </button>
          ))}
        </div>

      </section>
    </div>
  );
}
