"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, User, Lock, LogOut, Save, ShieldCheck, ArrowLeft, ChevronRight, Crown, Sparkles, CalendarDays, CheckCircle2
} from "lucide-react";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import dynamic from "next/dynamic";

const PlanSelectionModal = dynamic(
  () => import("@/components/PlanSelectionModal"),
  { ssr: false }
);

export default function Configuracion() {
  const router = useRouter();
  const { logout, forgotPassword } = useAuth();
  const { loading } = useProtectedRoute();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [userPlan, setUserPlan] = useState("free");
  const [createdAt, setCreatedAt] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [guardandoNombre, setGuardandoNombre] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [enviandoReset, setEnviandoReset] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.me();
        if (res?.user) {
          setNombre(res.user.name || "");
          setEmail(res.user.email || "");
          setUserPlan(res.user.plan || "free");
          setCreatedAt(res.user.created_at || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setUserLoaded(true);
      }
    };
    if (!loading) {
      fetchUser();
    }
  }, [loading]);

  if (loading || !userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1329] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm transition-colors duration-300">
        Cargando perfil...
      </div>
    );
  }

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || guardandoNombre) return;

    setGuardandoNombre(true);
    try {
      const response = await authService.updateName(nombre);
      setNombre(response.user.name);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch (error) {
      const { default: Swal } = await import("sweetalert2");
      await Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: error.message || "Intenta de nuevo más tarde.",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setGuardandoNombre(false);
    }
  };

  const isPremium = userPlan === "premium";

  const cardBase =
    "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-xl";

  const handleCambiarContrasena = async () => {
    if (!email || enviandoReset) return;
    setEnviandoReset(true);
    try {
      await forgotPassword(email);
      const { default: Swal } = await import("sweetalert2");
      await Swal.fire({
        icon: "success",
        title: "¡Correo enviado!",
        text: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (error) {
      console.error("Error enviando correo de recuperación:", error);
      const { default: Swal } = await import("sweetalert2");
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo enviar el correo",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setEnviandoReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-300">
      {/* Ambient Glows a juego con Rutas de Aprendizaje */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none bg-indigo-500/10 blur-[100px]" />
      <div className="absolute top-1/3 right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none bg-purple-500/10 blur-[100px]" />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Header compacto */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">
              Mi Cuenta
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Settings className="w-6 h-6 text-indigo-500 dark:text-indigo-400" /> Configuración
            </h1>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/20 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </header>

        {/* Grid de 2 columnas: todo visible, sin scroll en escritorio */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] items-start">

          {/* ===== COLUMNA IZQUIERDA: PERFIL ===== */}
          <section className={`${cardBase} p-7 sm:p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shadow-inner shrink-0">
                <User className="w-8 h-8 opacity-90" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{nombre}</h3>
                <p className="text-indigo-500 dark:text-indigo-400 font-extrabold uppercase text-[10px] tracking-wider">Estudiante ADSO</p>
              </div>
            </div>

            <form onSubmit={handleGuardar} className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-indigo-500 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
                <User className="w-3 h-3" /> Datos Personales
              </h3>

              <div className="space-y-1">
                <label htmlFor="nombre-completo" className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Nombre Completo
                </label>
                <input
                  id="nombre-completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl outline-none transition-all font-semibold text-slate-900 dark:text-slate-100 text-sm shadow-inner focus:border-indigo-500/50"
                  type="text"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 font-bold rounded-xl shadow-lg transition-all transform uppercase text-xs tracking-wider bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer shadow-indigo-600/30"
              >
                <Save className="w-4 h-4" /> {guardandoNombre ? "Guardando..." : guardado ? "¡Guardado!" : "Guardar Cambios"}
              </button>
            </form>
          </section>

          {/* ===== COLUMNA DERECHA: NOTIFICACIONES / SEGURIDAD / SESIÓN ===== */}
          <div className="space-y-6">

            {/* Suscripción */}
            <section
              className={`${isPremium ? "bg-white dark:bg-white/5 border border-amber-400/40 dark:border-amber-500/30" : cardBase} backdrop-blur-xl rounded-2xl shadow-xl`}
              style={isPremium ? { boxShadow: "0 0 25px rgba(245, 158, 11, 0.15), 0 0 60px rgba(245, 158, 11, 0.06)" } : {}}
            >
              <div className="p-5 sm:p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
                  <Crown className={`w-4 h-4 ${isPremium ? "text-amber-500" : ""}`} /> Suscripción
                </h2>

                <div className="flex items-center justify-between bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isPremium ? "bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/30" : "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"}`}>
                      <Crown className={`w-4 h-4 ${isPremium ? "text-amber-500" : "text-slate-500 dark:text-slate-400"}`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Plan actual</p>
                      <p className={`text-sm font-bold ${isPremium ? "text-amber-600 dark:text-amber-300" : "text-slate-700 dark:text-slate-200"}`}>
                        {isPremium ? "Plan Premium" : "Plan Gratuito"}
                      </p>
                    </div>
                  </div>

                  {isPremium ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                      FREE
                    </span>
                  )}
                </div>

                {isPremium && createdAt ? (
                  <div className="flex items-center gap-2 mt-3 px-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Miembro desde {new Date(createdAt).toLocaleDateString("es-CO", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                ) : !isPremium ? (
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(true)}
                    className="w-full mt-3 py-3 font-bold rounded-xl shadow-lg transition-all transform uppercase text-xs tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer shadow-indigo-600/30"
                  >
                    <Sparkles className="w-4 h-4" /> Explorar Plan Premium
                  </button>
                ) : null}
              </div>
            </section>

            {/* Seguridad */}
            <section className={cardBase}>
              <div className="p-5 sm:p-6">
                <h2 className="text-xs font-bold uppercase text-indigo-500 dark:text-indigo-400 tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Seguridad
                </h2>
                <button
                  type="button"
                  onClick={handleCambiarContrasena}
                  disabled={enviandoReset || !email}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Lock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Cambiar Contraseña
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                    {enviandoReset ? "Enviando..." : "Actualizar"} <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </div>
            </section>

            {/* Sesión */}
            <section className={`${cardBase} p-5 sm:p-6`}>
              <h2 className="text-xs font-bold uppercase text-red-500 dark:text-red-400 tracking-wider mb-3 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sesión
              </h2>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-500/30 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </section>

          </div>
        </div>
      </main>

      {/* MODAL DE PLANES (WOMPI) */}
      {showPlanModal && (
        <PlanSelectionModal onSelect={() => setShowPlanModal(false)} />
      )}
    </div>
  );
}