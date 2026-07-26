"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LayoutDashboard, Compass, Award, Settings,
  User, Mail, Lock, Bell, LogOut, Save, ShieldCheck
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
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b] text-white italic font-black uppercase tracking-widest">
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
    <div className="min-h-screen bg-[#e5e7eb] text-slate-800 font-sans flex">

      <main className="max-w-3xl mx-auto w-full p-6 md:p-10 pt-32">

        <header className="mb-8 border-b border-slate-300 pb-6">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
            Mi Cuenta
          </span>
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight flex items-center gap-3">
            <Settings className="w-7 h-7" /> Configuración
          </h1>
        </header>

        {/* Tarjeta de perfil */}
        <section className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center text-white shadow-inner shrink-0">
            <User className="w-8 h-8 opacity-90" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{nombre}</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Estudiante ADSO</p>
          </div>
        </section>

        {/* Formulario de datos */}
        <form onSubmit={handleGuardar} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mb-6 space-y-5">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Datos Personales</h3>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
              <User className="w-3 h-3" /> Nombre Completo
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all font-bold text-slate-800 text-sm shadow-sm focus:border-slate-900"
              type="text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all font-bold text-slate-800 text-sm shadow-sm focus:border-slate-900"
              type="email"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Notificaciones de progreso</span>
            </div>
            <button
              type="button"
              onClick={() => setNotificaciones(!notificaciones)}
              className={`w-11 h-6 rounded-full transition-all relative ${notificaciones ? "bg-[#1e293b]" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notificaciones ? "left-5" : "left-0.5"}`}></span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 font-black rounded-xl shadow-xl transition-all transform uppercase text-[11px] tracking-[0.3em] bg-[#1e293b] hover:bg-slate-800 text-white active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {guardado ? "¡Guardado!" : "Guardar Cambios"}
          </button>
        </form>

        {/* Seguridad */}
        <section className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mb-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Seguridad
          </h3>
          <button
            onClick={() => router.push("/reset-password")}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all"
          >
            <span className="flex items-center gap-3 text-xs font-bold text-slate-700">
              <Lock className="w-4 h-4 text-slate-500" /> Cambiar Contraseña
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actualizar</span>
          </button>
        </section>

        {/* Zona de salida */}
        <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </section>

      </main>
    </div>
  );
}
