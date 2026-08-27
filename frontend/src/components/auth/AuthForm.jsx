"use client";

import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/hooks/useAuth";
import { RECAPTCHA_SITE_KEY } from "@/lib/constants";
import { supabase, isGoogleLoginEnabled } from "@/lib/supabase";
import { validarCamposLogin, validarCamposRegistro } from "@/lib/validations/auth";
import ModalOlvidePassword from "@/components/ModalOlvidePassword";
import PlanSelectionModal from "@/components/PlanSelectionModal";

function CampoError({ mensaje }) {
  if (!mensaje) return null;
  return (
    <p className="text-red-400 text-[10px] font-black uppercase tracking-wide mt-1 ml-1 flex items-center gap-1">
      <span>⚠</span> {mensaje}
    </p>
  );
}

function IconoGoogle() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.75s.43 3.62 1.19 5.15l4.08-2.66z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

export default function AuthForm({ esRegistro, setEsRegistro }) {
  const { login, register, googleLogin } = useAuth();

  const [mostrarOlvido, setMostrarOlvido] = useState(false);
  const [mostrarPlan, setMostrarPlan] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [googleEnviando, setGoogleEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const [captchaToken, setCaptchaToken] = useState("");
  const recaptchaRef = useRef(null);

  const googleHandlerRef = useRef(null);
  const procesandoOAuth = useRef(false);

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: "" }));
  };

  const limpiarFormulario = () => {
    setFormData({ nombre: "", email: "", password: "" });
    setMostrarPassword(false);
    setErrores({});
    setErrorGeneral("");
    setCaptchaToken("");
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const resetearCaptcha = () => {
    setCaptchaToken("");
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const cambiarModo = (modoRegistro) => {
    limpiarFormulario();
    setEsRegistro(modoRegistro);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral("");

    const validacion = esRegistro
      ? validarCamposRegistro(formData)
      : validarCamposLogin(formData);

    if (Object.keys(validacion).length > 0) {
      setErrores(validacion);
      return;
    }

    if (esRegistro && !captchaToken) {
      setErrorGeneral("Por favor, completa la verificación de reCAPTCHA.");
      return;
    }

    setEnviando(true);

    try {
      if (esRegistro) {
        await register(formData.nombre, formData.email, formData.password, captchaToken);
        limpiarFormulario();
        setEsRegistro(false);
        setMostrarPlan(true);
      } else {
        await login(formData.email, formData.password);

        // Redirección directa al dashboard forzando la actualización de cookies
        window.location.href = "/dashboard";
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("Credenciales")) setErrorGeneral("Email o contraseña incorrectos.");
      else if (msg.includes("registrado")) setErrorGeneral("Este email ya tiene una cuenta. Inicia sesión.");
      else if (msg.includes("verificar tu correo")) setErrorGeneral("Debes verificar tu correo electrónico antes de iniciar sesión.");
      else if (msg.includes("correo")) setErrorGeneral("No encontramos una cuenta con ese email.");
      else if (msg.includes("reCAPTCHA")) setErrorGeneral("Validación de reCAPTCHA inválida o expirada. Inténtalo de nuevo.");
      else setErrorGeneral(msg || "Ocurrió un error, intenta de nuevo.");

      if (esRegistro) resetearCaptcha();
    } finally {
      setEnviando(false);
    }
  };

  const handleGoogleSession = async (session) => {
    if (!session?.user || procesandoOAuth.current || enviando) return;
    procesandoOAuth.current = true;
    setGoogleEnviando(true);

    try {
      const user = session.user;
      const nombreGoogle =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Usuario";

      await googleLogin(user.email, nombreGoogle, session.access_token);
      procesandoOAuth.current = false;
      setGoogleEnviando(false);

      // Redirección directa al dashboard tras login con Google
      window.location.href = "/dashboard";
    } catch (err) {
      setErrorGeneral(err.message || "No se pudo completar el inicio de sesión con Google.");
      procesandoOAuth.current = false;
      setGoogleEnviando(false);
    }
  };

  useEffect(() => {
    googleHandlerRef.current = handleGoogleSession;
  });

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const esRetornoOAuth =
      window.location.search.includes("code=") ||
      window.location.hash.includes("access_token=");

    if (!esRetornoOAuth) return;

    const procesarSesion = async () => {
      const { data } = await supabase.auth.getSession();
      if (active && data.session && !procesandoOAuth.current) {
        googleHandlerRef.current(data.session);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && event === "SIGNED_IN" && session) {
        googleHandlerRef.current(session);
      }
    });

    procesarSesion();
    const intervalo = setInterval(procesarSesion, 300);
    setTimeout(() => clearInterval(intervalo), 6000);

    return () => {
      active = false;
      subscription.unsubscribe();
      clearInterval(intervalo);
    };
  }, []);

  const handleGoogleLogin = async () => {
    if (!supabase || googleEnviando) return;
    setErrorGeneral("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;
    } catch {
      setErrorGeneral("No se pudo iniciar sesión con Google.");
    }
  };

  const inputClass = (campo) =>
    `w-full px-5 py-3.5 bg-[#0f172a] border rounded-xl outline-none transition-all font-bold text-slate-100 text-sm shadow-inner placeholder:text-slate-500 ${errores[campo]
      ? "border-red-500 focus:border-red-400 bg-red-950/20"
      : "border-slate-700 focus:border-purple-500 hover:border-slate-600"
    }`;

  const botonDeshabilitado = enviando || googleEnviando;

  const seleccionarPlan = (plan) => {
    localStorage.setItem("mevocatio_plan", plan);
    setMostrarPlan(false);
    setErrores({ exito: "¡Cuenta creada! Ahora inicia sesión." });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center lg:text-left">
        <h3 className="text-4xl font-black text-white mb-1 tracking-tighter uppercase">
          {esRegistro ? "Regístrate" : "Inicia Sesión"}
        </h3>
        <p className="text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em]">
          Accede a MeVocatio
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/80 mb-8">
        <button
          type="button"
          onClick={() => cambiarModo(false)}
          className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${!esRegistro
            ? "border-purple-500 text-purple-300"
            : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
        >
          INICIAR SESIÓN
        </button>
        <button
          type="button"
          onClick={() => cambiarModo(true)}
          className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${esRegistro
            ? "border-purple-500 text-purple-300"
            : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
        >
          REGÍSTRATE
        </button>
      </div>

      {/* Botón de Google */}
      {isGoogleLoginEnabled && (
        <>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={botonDeshabilitado}
            className="w-full py-3.5 px-4 border border-slate-700 rounded-xl shadow-sm bg-[#0f172a] hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-3 text-slate-200 font-bold text-xs uppercase tracking-wider mb-6 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <IconoGoogle />
            {googleEnviando ? "Conectando con Google..." : "Continuar con Google"}
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[9px] font-black uppercase tracking-widest">
              o con email
            </span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {esRegistro && (
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Nombre Completo
            </label>
            <input
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value.slice(0, 60))}
              className={inputClass("nombre")}
              placeholder="JESUS TORRES"
              type="text"
              autoComplete="name"
            />
            <CampoError mensaje={errores.nombre} />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Email
          </label>
          <input
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={inputClass("email")}
            placeholder="NAME@COMPANY.COM"
            type="email"
            autoComplete="email"
          />
          <CampoError mensaje={errores.email} />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Contraseña {esRegistro && "(8+ caracteres, mayúscula, minúscula, número y símbolo)"}
          </label>
          <div className="relative">
            <input
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value.slice(0, 64))}
              className={`${inputClass("password")} pr-12`}
              placeholder="••••••••"
              type={mostrarPassword ? "text" : "password"}
              autoComplete={esRegistro ? "new-password" : "current-password"}
            />
            <button
              type="button"
              onClick={() => setMostrarPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {mostrarPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
          <CampoError mensaje={errores.password} />
        </div>

        {/* reCAPTCHA limpio y centrado */}
        {esRegistro && RECAPTCHA_SITE_KEY && (
          <div className="flex justify-center my-4 overflow-x-auto">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token || "")}
              onExpired={() => setCaptchaToken("")}
              onErrored={() => setCaptchaToken("")}
              theme="dark"
            />
          </div>
        )}

        {errores.exito && (
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
            <span>✓</span> {errores.exito}
          </p>
        )}

        {errorGeneral && (
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-[11px] font-black uppercase tracking-wide flex items-center gap-2">
              <span>⚠</span> {errorGeneral}
            </p>
          </div>
        )}

        {!esRegistro && (
          <div className="flex justify-end pr-1">
            <button
              type="button"
              onClick={() => setMostrarOlvido(true)}
              className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={botonDeshabilitado}
          className={`w-full py-4 font-black rounded-xl shadow-xl transition-all transform mt-4 uppercase text-[11px] tracking-[0.3em] cursor-pointer ${botonDeshabilitado
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-[0.97] border border-purple-400/30"
            }`}
        >
          {enviando ? "Procesando..." : esRegistro ? "Crear Cuenta" : "Entrar al Portal"}
        </button>
      </form>

      {mostrarOlvido && <ModalOlvidePassword onClose={() => setMostrarOlvido(false)} />}
      {mostrarPlan && <PlanSelectionModal onSelect={seleccionarPlan} />}
    </div>
  );
}