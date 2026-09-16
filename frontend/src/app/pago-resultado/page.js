"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { paymentService } from "@/services/payment.service";

const TEXTOS_ESTADO = {
  pagado: {
    titulo: "¡Pago aprobado! 🎉",
    detalle: "Tu curso ya quedó activo.",
    color: "text-emerald-400",
  },
  pendiente: {
    titulo: "Tu pago está pendiente",
    detalle: "Puede tardar unos minutos. Vuelve a revisar más tarde.",
    color: "text-amber-400",
  },
  fallido: {
    titulo: "El pago no se pudo completar",
    detalle: "Intenta de nuevo o usa otro medio de pago.",
    color: "text-red-400",
  },
  cancelado: {
    titulo: "El pago fue cancelado",
    detalle: "No se realizó ningún cobro.",
    color: "text-slate-400",
  },
};

const TEXTOS_ESTADO_PREMIUM = {
  pagado: {
    titulo: "¡Pago aprobado! 🎉",
    detalle: "Tu Plan Premium ya está activo. ¡Disfruta de todos los beneficios sin límites!",
    color: "text-emerald-400",
  },
  pendiente: {
    titulo: "Tu pago está pendiente",
    detalle: "En cuanto se confirme, tu Plan Premium quedará activo.",
    color: "text-amber-400",
  },
  fallido: {
    titulo: "El pago no se pudo completar",
    detalle: "Intenta de nuevo o usa otro medio de pago para activar tu Plan Premium.",
    color: "text-red-400",
  },
  cancelado: {
    titulo: "El pago fue cancelado",
    detalle: "No se realizó ningún cobro.",
    color: "text-slate-400",
  },
};

function PagoResultadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("course_id");
  const concept = searchParams.get("concept");
  const reference = searchParams.get("reference");
  const esPremium = concept === "premium";

  const [estado, setEstado] = useState("cargando");
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const revisar = async () => {
      try {
        const pagos = await paymentService.misPagos();

        let pago;
        if (esPremium) {
          pago = pagos.find((p) => String(p.reference) === String(reference));
        } else {
          pago = pagos.find((p) => String(p.course_id) === String(courseId));
        }

        if (!pago) {
          setEstado("no-encontrado");
          return;
        }

        const pagoActualizado = await paymentService.reconsultarEstado(pago.id);
        if (esPremium && pagoActualizado.status === "pagado") {
          // El backend ya activó el plan; sincronizamos la interfaz.
          if (typeof window !== "undefined") {
            window.localStorage.setItem("mevocatio_plan", "premium");
          }
        }

        setEstado(pagoActualizado.status || "pendiente");
      } catch (err) {
        setErrorMsg(err.message || "No se pudo consultar el pago");
        setEstado("error");
      }
    };

    if (esPremium ? reference : courseId) revisar();
    else setEstado("no-encontrado");
  }, [courseId, concept, reference, esPremium]);

  const info = esPremium ? TEXTOS_ESTADO_PREMIUM[estado] : TEXTOS_ESTADO[estado];

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070b17] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center">
        {estado === "cargando" && (
          <p className="text-slate-300">Consultando el estado de tu pago...</p>
        )}

        {estado === "no-encontrado" && (
          <p className="text-slate-300">No encontramos información de este pago.</p>
        )}

        {estado === "error" && (
          <p className="text-red-400">{errorMsg}</p>
        )}

        {info && (
          <>
            <h1 className={`text-2xl font-black ${info.color}`}>{info.titulo}</h1>
            <p className="mt-3 text-sm text-slate-400">{info.detalle}</p>
          </>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => router.push(esPremium ? "/dashboard" : "/creacion_recursos")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800"
          >
            Volver
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-bold text-white"
          >
            Ir al panel
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PagoResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b17] flex items-center justify-center text-white font-black italic uppercase tracking-widest text-xs">
          Cargando...
        </div>
      }
    >
      <PagoResultadoContent />
    </Suspense>
  );
}