"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ModalOlvidePassword from "@/components/ModalOlvidePassword";
import { createClient } from "@supabase/supabase-js";

// Inicializar cliente de Supabase para el login con Google
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ─────────────────────────────────────────
   VALIDACIONES
───────────────────────────────────────── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚÑáéíóúñÜü\s]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;

const validarCamposLogin = ({ email, password }) => {
  const errores = {};
  if (!email.trim())                  errores.email    = "El email es obligatorio.";
  else if (!EMAIL_REGEX.test(email))   errores.email    = "Ingresa un email válido.";
  if (!password)                      errores.password = "La contraseña es obligatoria.";
  return errores;
};

const validarCamposRegistro = ({ nombre, email, password }) => {
  const errores = {};
  if (!nombre.trim())                         errores.nombre   = "El nombre es obligatorio.";
  else if (nombre.trim().length < 3)          errores.nombre   = "El nombre debe tener al menos 3 caracteres.";
  else if (!NOMBRE_REGEX.test(nombre.trim()))  errores.nombre   = "El nombre solo puede contener letras y espacios.";
  if (!email.trim())                          errores.email    = "El email es obligatorio.";
  else if (!EMAIL_REGEX.test(email))          errores.email    = "Ingresa un email válido.";
  if (!password)                              errores.password = "La contraseña es obligatoria.";
  else if (!PASSWORD_REGEX.test(password))    errores.password = "Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.";
  return errores;
};

function CampoError({ mensaje }) {
  if (!mensaje) return null;
  return (
    <p className="text-red-500 text-[10px] font-black uppercase tracking-wide mt-1 ml-1 flex items-center gap-1">
      <span>⚠</span> {mensaje}
    </p>
  );
}

function useAntiInspeccion() {
  useEffect(() => {
    const bloquearContextMenu = (e) => e.preventDefault();
    const bloquearTeclado = (e) => {
      const esForbidden =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "U"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U");
      if (esForbidden) e.preventDefault();
    };

    const detectarDevTools = setInterval(() => {
      const umbral = 160;
      const abierto =
        window.outerWidth - window.innerWidth > umbral ||
        window.outerHeight - window.innerHeight > umbral;
      if (abierto) {
        document.body.innerHTML = "";
        window.location.replace("/");
      }
    }, 1000);

    document.addEventListener("contextmenu", bloquearContextMenu);
    document.addEventListener("keydown", bloquearTeclado);

    return () => {
      document.removeEventListener("contextmenu", bloquearContextMenu);
      document.removeEventListener("keydown", bloquearTeclado);
      clearInterval(detectarDevTools);
    };
  }, []);
}

function AuthContent() {
  const { login, register } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useAntiInspeccion();

  const [esRegistro, setEsRegistro]       = useState(false);
  const [mostrarOlvido, setMostrarOlvido] = useState(false);
  const [enviando, setEnviando]           = useState(false);
  const [nombre, setNombre]               = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores]             = useState({});
  const [errorGeneral, setErrorGeneral]   = useState("");

  useEffect(() => {
    setEsRegistro(searchParams.get("mode") === "signup");
  }, [searchParams]);

  // ── DETECTOR DE RETORNO DE GOOGLE Y LLAMADA AL BACKEND ──
// ── DETECTOR REACTIVO DE SESIÓN DE GOOGLE ──
  useEffect(() => {
    // Escucha cuando Supabase detecta y establece la sesión desde la URL automáticamente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !enviando) {
        setEnviando(true);
        try {
          const user = session.user;
          
          const response = await fetch('http://localhost:3001/api/auth/google-sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0]
            })
          });

const data = await response.json();

          if (response.ok && data.token) {
            localStorage.setItem("token", data.token);
            window.location.replace('/dashboard');
          } else {
            // AQUÍ: Mostramos el error exacto que viene del backend o de la respuesta
            console.error("Detalle del error del backend:", data);
            setErrorGeneral(data.message || `Error del servidor: ${response.status}`);
            setEnviando(false);
          }
        } catch (err) {
          // AQUÍ: Si el backend está apagado o hay un bloqueo de red/CORS
          console.error("Error de red/conexión:", err);
          setErrorGeneral(`Fallo de conexión con el backend: ${err.message}`);
          setEnviando(false);
        }
      }
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => {
      subscription.unsubscribe();
    };
  }, [enviando]);

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setMostrarPassword(false);
    setErrores({});
    setErrorGeneral("");
  };

  const cambiarModo = (modoRegistro) => {
    limpiarFormulario();
    setEsRegistro(modoRegistro);
  };

  // Botón para iniciar el flujo de Google
  const handleGoogleLogin = async () => {
    try {
      setErrorGeneral("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorGeneral("No se pudo iniciar sesión con Google.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral("");

    const erroresNuevos = esRegistro
      ? validarCamposRegistro({ nombre, email, password })
      : validarCamposLogin({ email, password });

    if (Object.keys(erroresNuevos).length > 0) {
      setErrores(erroresNuevos);
      return;
    }

    setErrores({});
    setEnviando(true);

    try {
      if (esRegistro) {
        await register(nombre, email, password);
        limpiarFormulario();
        setEsRegistro(false);
        setErrorGeneral("");
        setErrores({ exito: "¡Cuenta creada! Ahora inicia sesión." });
      } else {
        await login(email, password);
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("Credenciales"))       setErrorGeneral("Email o contraseña incorrectos.");
      else if (msg.includes("registrado"))    setErrorGeneral("Este email ya tiene una cuenta. Inicia sesión.");
      else if (msg.includes("correo"))        setErrorGeneral("No encontramos una cuenta con ese email.");
      else                                    setErrorGeneral(msg || "Ocurrió un error, intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const inputClass = (campo) =>
    `w-full px-5 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all font-bold text-slate-800 text-sm shadow-sm ${
      errores[campo]
        ? "border-red-400 focus:border-red-500 bg-red-50"
        : "border-slate-200 focus:border-slate-900"
    }`;

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">

      {enviando && window.location.hash.includes("access_token") && (
        <div className="absolute inset-0 bg-[#1e293b]/90 z-50 flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black uppercase tracking-widest text-xs">Validando credenciales con el servidor...</p>
        </div>
      )}

      {/* ── LADO IZQUIERDO ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1e293b] justify-center border-r border-white/10 pt-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-[50rem] h-[50rem] border-[60px] border-white rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center px-12">
          <div className="mb-6 italic font-black text-white">
            <Image
              src="/mevocatio.png"
              alt="Logo MeVocatio"
              width={650}
              height={250}
              priority
              className="brightness-0 invert object-contain h-48 w-auto transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-black leading-[1.1] mb-4 tracking-tighter uppercase italic text-white max-w-md">
              {esRegistro ? "El diamante eres tú, lúcelo" : "Sigue puliendo tu profesión"}
            </h2>
            <p className="text-base text-slate-400 font-light max-w-sm leading-snug">
              {esRegistro
                ? "Crea tu perfil ahora y accede a la red de talentos más exclusiva."
                : "Bienvenido de nuevo al portal donde tu carrera toma un brillo superior."}
            </p>
          </div>
        </div>
      </div>

      {/* ── FORMULARIO ── */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 lg:pt-24 p-8 sm:p-12 bg-white relative overflow-y-auto">
        <Link
          href="/"
          className="fixed top-24 right-10 text-[#1e293b] hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] z-[40] bg-white/90 backdrop-blur-md shadow-2xl px-6 py-2.5 rounded-full border border-slate-200 hover:bg-[#1e293b] active:scale-95"
        >
          Cerrar ✕
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter uppercase">
              {esRegistro ? "Regístrate" : "Inicia Sesión"}
            </h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              Accede a MeVocatio
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 mb-8">
            <button
              type="button"
              onClick={() => cambiarModo(false)}
              className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${
                !esRegistro ? "border-slate-900 text-slate-900" : "border-transparent text-slate-300"
              }`}
            >
              INICIAR SESIÓN
            </button>
            <button
              type="button"
              onClick={() => cambiarModo(true)}
              className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${
                esRegistro ? "border-slate-900 text-slate-900" : "border-transparent text-slate-300"
              }`}
            >
              REGISTRATE
            </button>
          </div>

          {/* Botón de Google (Inicio de sesión alternativo) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-slate-700 font-bold text-xs uppercase tracking-wider mb-6 active:scale-[0.97]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.75s.43 3.62 1.19 5.15l4.08-2.66z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[9px] font-black uppercase tracking-widest">o con email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {esRegistro && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nombre Completo
                </label>
                <input
                  value={nombre}
                  onChange={(e) => {
                    const valor = e.target.value.slice(0, 60);
                    setNombre(valor);
                    setErrores((p) => ({ ...p, nombre: "" }));
                  }}
                  className={inputClass("nombre")}
                  placeholder="JESUS TORRES"
                  type="text"
                  autoComplete="name"
                  minLength={3}
                  maxLength={60}
                  required
                />
                <CampoError mensaje={errores.nombre} />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrores((p) => ({ ...p, email: "" })); }}
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
                  value={password}
                  onChange={(e) => {
                    const valor = e.target.value.slice(0, 64);
                    setPassword(valor);
                    setErrores((p) => ({ ...p, password: "" }));
                  }}
                  className={`${inputClass("password")} pr-12`}
                  placeholder="••••••••"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete={esRegistro ? "new-password" : "current-password"}
                  minLength={esRegistro ? 8 : undefined}
                  maxLength={64}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {mostrarPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <CampoError mensaje={errores.password} />
            </div>

            {errores.exito && (
              <p className="text-green-600 text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                <span>✓</span> {errores.exito}
              </p>
            )}

            {errorGeneral && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-[11px] font-black uppercase tracking-wide flex items-center gap-2">
                  <span>⚠</span> {errorGeneral}
                </p>
              </div>
            )}

            {!esRegistro && (
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() => setMostrarOlvido(true)}
                  className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e293b] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              onClick={(e) => {
                if (enviando) e.preventDefault();
              }}
              className={`w-full py-4 font-black rounded-xl shadow-xl transition-all transform mt-4 uppercase text-[11px] tracking-[0.3em] ${
                enviando
                  ? "bg-slate-400 text-slate-200 cursor-not-allowed"
                  : "bg-[#1e293b] hover:bg-slate-800 text-white active:scale-[0.97]"
              }`}
            >
              {enviando
                ? "Procesando..."
                : esRegistro
                ? "Crear Cuenta"
                : "Entrar al Portal"}
            </button>
          </form>
        </div>
      </div>

      {mostrarOlvido && <ModalOlvidePassword onClose={() => setMostrarOlvido(false)} />}
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-widest">
          MeVocatio...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}