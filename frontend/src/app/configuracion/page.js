"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, User, Mail, Lock, Bell, LogOut, Save, ShieldCheck, ArrowLeft
} from "lucide-react";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import { useAuth } from "@/hooks/useAuth";

export default function Configuracion() {
  const router = useRouter();
  const { logout } = useAuth();
  const { loading } = useProtectedRoute();

  const [nombre, setNombre] = useState("Samuel Moreno");
  const [email, setEmail] = useState("samuel.moreno@mevocatio.com");
  const [notificaciones, setNotificaciones] = useState(true);
  const [guardado, setGuardado] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0b14] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm transition-colors duration-300">
        Verificando acceso...
      </div>
    );
  }

  const handleGuardar = (e) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14] text-slate-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300">
      <main className="max-w-3xl mx-auto w-full pt-12">

        {/* Botón de retorno al Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </button>

        <header className="mb-10 border-b border-slate-200 dark:border-white/10 pb-6">
          <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-1">
            Mi Cuenta
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Settings className="w-7 h-7 text-indigo-500 dark:text-indigo-400" /> Configuración
          </h1>
        </header>

        {/* Tarjeta de perfil */}
        <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shadow-inner shrink-0">
            <User className="w-8 h-8 opacity-90" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{nombre}</h3>
            <p className="text-indigo-500 dark:text-indigo-400 font-extrabold uppercase text-[10px] tracking-wider">Estudiante ADSO</p>
          </div>
        </section>

        {/* Formulario de datos */}
        <form onSubmit={handleGuardar} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl mb-6 space-y-5">
          <h3 className="text-xs font-bold uppercase text-indigo-500 dark:text-indigo-400 tracking-wider mb-2">Datos Personales</h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1.5">
              <User className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Nombre Completo
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-5 py-3.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl outline-none transition-all font-semibold text-slate-900 dark:text-slate-100 text-sm shadow-inner focus:border-indigo-500/50"
              type="text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl outline-none transition-all font-semibold text-slate-900 dark:text-slate-100 text-sm shadow-inner focus:border-indigo-500/50"
              type="email"
            />
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Notificaciones de progreso</span>
            </div>
            <button
              type="button"
              onClick={() => setNotificaciones(!notificaciones)}
              className={`w-11 h-6 rounded-full transition-all relative ${notificaciones ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notificaciones ? "left-5" : "left-0.5"}`}></span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 font-bold rounded-xl shadow-lg transition-all transform uppercase text-xs tracking-wider bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" /> {guardado ? "¡Guardado!" : "Guardar Cambios"}
          </button>
        </form>

        {/* Seguridad */}
        <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl mb-6">
          <h3 className="text-xs font-bold uppercase text-indigo-500 dark:text-indigo-400 tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Seguridad
          </h3>
          <button
            onClick={() => router.push("/reset-password")}
            className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Lock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Cambiar Contraseña
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Actualizar</span>
          </button>
        </section>

        {/* Zona de salida */}
        <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-500/30 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </section>

      </main>
    </div>
  );
}
