"use client";

import { useState } from "react";
import { X } from "lucide-react";
import usePayment from "@/hooks/usePayment";

const plans = [
  {
    id: "free",
    name: "Plan Gratuito",
    price: "Gratis",
    description: "Explora una vocación con hasta 3 recursos.",
    features: ["Hasta 3 recursos por vocación", "Datos básicos del curso"],
  },
  {
    id: "premium",
    name: "Plan Premium",
    price: "$49.000 COP",
    description: "Crea y consulta todos tus recursos sin límites.",
    features: ["Recursos ilimitados", "Personalización y analíticas"],
  },
];

export default function PlanSelectionModal({ onSelect }) {
  const { pagarCurso, cargando } = usePayment();
  const [selected, setSelected] = useState(null);

  const mostrarAlerta = async (titulo, texto, icono) => {
    const { default: Swal } = await import("sweetalert2");
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonColor: "#8b5cf6",
    });
  };

  const handlePagarPremium = () => {
    pagarCurso(
      { nombre: "Plan Premium MeVocatio", price: 49000 },
      {
        onExito: () => {
          mostrarAlerta("¡Pago exitoso!", "Has adquirido el Plan Premium.", "success");
          onSelect("premium");
        },
        onError: (err) => {
          mostrarAlerta("Error", err, "error");
        },
      }
    );
  };

  const handleCerrar = () => {
    onSelect("free");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-sm" />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-selection-title"
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-violet-400/30 bg-white dark:bg-slate-900 p-6 shadow-2xl sm:p-8"
      >
        {/* Botón de Cerrar (X) */}
        <button
          type="button"
          onClick={handleCerrar}
          className="absolute top-4 right-4 p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-600 dark:text-violet-300">
            Tu experiencia en MeVocatio
          </p>
          <h2 id="plan-selection-title" className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Elige tu plan
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Puedes cambiar de plan más adelante.
          </p>
        </div>

        {/* Tarjetas de Plan */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`rounded-2xl border p-5 text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
                selected === plan.id
                  ? plan.id === "premium"
                    ? "border-violet-500 dark:border-violet-400 bg-violet-50 dark:bg-violet-500/20 ring-2 ring-violet-500/50"
                    : "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/50"
                  : plan.id === "premium"
                    ? "border-violet-300 dark:border-violet-400/60 bg-violet-50/50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-500"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-black text-slate-900 dark:text-white">{plan.name}</h3>
                {plan.id === "premium" && (
                  <span className="rounded-full bg-violet-500/20 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-violet-700 dark:text-violet-200">
                    Recomendado
                  </span>
                )}
              </div>
              <p className="mt-2 text-lg font-black text-violet-600 dark:text-violet-300">{plan.price}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Botones de Acción */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {/* Botón Continuar Gratis / Cerrar */}
          <button
            type="button"
            onClick={handleCerrar}
            className="flex-1 py-3 px-6 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          >
            Continuar Gratis
          </button>

          {/* Botón Pagar Premium */}
          <button
            type="button"
            disabled={cargando}
            onClick={handlePagarPremium}
            className={`flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-violet-500/25 transition-all cursor-pointer ${
              cargando ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {cargando ? "Abriendo Wompi..." : "Pagar Plan Premium"}
          </button>
        </div>
      </section>
    </div>
  );
}
