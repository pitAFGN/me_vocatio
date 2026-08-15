"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import { PROFESSIONS } from "@/app/data/professions";
import {
  LayoutDashboard,
  Sparkles,
  Search,
  BookmarkCheck,
  LineChart,
  Settings,
  LogOut,
  Bell,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Menu,
  X,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Code2
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

export default function ExecutiveDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { loading } = useProtectedRoute();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b14] text-white italic font-black uppercase tracking-widest">
        Verificando acceso...
      </div>
    );
  }

  const filteredProfessions = PROFESSIONS.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProfessions = filteredProfessions.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <div className="text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-indigo-600 selection:text-white font-sans bg-[#0a0b14]">

      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0a0b14]"></div>
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#3131c0]/10 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-[#8a5bf5]/10 blur-[150px]"></div>
      </div>

      {/* Side Navigation Shell (Desktop) */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-[#010f1f]/40 backdrop-blur-3xl border-r border-white/10 shadow-2xl flex flex-col pt-8 pb-8 z-40 hidden md:flex transition-all duration-200 ease-in-out">
        <div className="px-6 mb-10 flex items-center gap-3">
          <span className="text-indigo-400 text-2xl font-bold flex items-center"><Code2 className="w-7 h-7" /></span>
          <div>
            <h2 className="text-xl font-bold text-white leading-none">MeVocatio</h2>
            <p className="text-xs text-indigo-300/70 mt-1">Elite Tier</p>
          </div>
        </div>

        {/* Menú Principal */}
        <div className="flex flex-col gap-1.5 flex-grow px-4">
          <a className="flex items-center gap-3 text-indigo-300 bg-indigo-950/40 border-r-4 border-indigo-500 px-4 py-3 text-sm font-medium rounded-l-lg transition-all" href="#">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5 transition-all" href="#explorar">
            <Sparkles className="w-5 h-5" /> Vocaciones
          </a>
          <a className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5 transition-all" href="#">
            <BookmarkCheck className="w-5 h-5" /> Guardados
          </a>
          <a className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5 transition-all" href="#">
            <LineChart className="w-5 h-5" /> Mi Progreso
          </a>
          <a className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5 transition-all" href="#">
            <Settings className="w-5 h-5" /> Ajustes
          </a>
        </div>

        {/* Sección inferior: Logout */}
        <div className="flex flex-col gap-2 px-4 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 text-slate-400 hover:text-red-300 px-4 py-3 text-sm font-medium rounded-lg hover:bg-red-950/30 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Top Mobile Nav */}
      <nav className="md:hidden fixed top-0 w-full bg-[#010f1f]/80 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-5 h-16 z-50">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold"><Code2 className="w-6 h-6" /></span>
          <span className="text-lg font-bold">MeVocatio</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 cursor-pointer">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-[#010f1f]/95 backdrop-blur-2xl border-b border-white/10 p-6 z-40 md:hidden flex flex-col gap-3 shadow-2xl">
          <a className="flex items-center gap-3 text-white py-2 font-medium" href="#">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" /> Dashboard
          </a>
          <a className="flex items-center gap-3 text-slate-300 py-2 font-medium" href="#explorar">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Vocaciones
          </a>
          <a className="flex items-center gap-3 text-slate-300 py-2 font-medium" href="#">
            <BookmarkCheck className="w-5 h-5 text-indigo-400" /> Guardados
          </a>
          <a className="flex items-center gap-3 text-slate-300 py-2 font-medium" href="#">
            <LineChart className="w-5 h-5 text-indigo-400" /> Mi Progreso
          </a>
          <button onClick={logout} className="flex items-center gap-3 text-red-400 font-semibold py-3 mt-2 border-t border-white/10 cursor-pointer">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 md:pt-12 md:pl-64 min-h-screen px-5 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                Welcome back, <br />
                <span className="bg-gradient-to-r from-indigo-200 to-purple-400 bg-clip-text text-transparent">
                  Samuel Moreno
                </span>
              </h1>
              <p className="text-base text-slate-400">Tu panel central de desarrollo profesional y rutas vocacionales.</p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 transition-all text-white cursor-pointer">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-200">
                SM
              </div>
            </div>
          </header>

          {/* Top Grid: Status Card & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

            {/* Status Card con puntitos de checkpoints estáticos */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 lg:col-span-2 flex flex-col justify-between relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-950/80 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">ADSO Apprentice / Developer Tier</h3>
                    <p className="text-xs text-slate-400">Vocational Track Status</p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-xs text-slate-400 tracking-wider font-semibold uppercase">Roadmap Progress</span>
                    <span className="text-lg text-indigo-400 font-bold">85%</span>
                  </div>

                  {/* Barra con puntos/checkpoints estáticos */}
                  <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-visible mb-6">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full w-[85%] shadow-lg"></div>

                    {/* Puntos estáticos distribuidos en la barra */}
                    <div className="absolute inset-0 flex justify-between items-center px-1">
                      <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                      <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                      <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                      <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-600 border-2 border-[#0a0b14] z-10 shadow-md"></div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">15% remaining to complete current milestones. Full-stack deployment ready.</p>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-purple-950/40 flex items-center justify-center mb-6 border border-purple-500/30 text-purple-400">
                <Briefcase className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Profile Analytics</h4>
              <p className="text-sm text-slate-400 mb-6">Tu workspace cuenta con acceso ilimitado a las rutas de desarrollo.</p>
              <button
                onClick={() => router.push("/vocacion/analisis-y-desarrollo-de-software")}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 font-semibold text-xs text-white uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                Ver Carrera Principal
              </button>
            </div>

          </div>

          {/* Search & Exploration Section */}
          <section id="explorar" className="mb-10 scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Explorar Vocaciones</h2>
              </div>

              {/* Paginación rápida */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className={`p-2.5 rounded-xl border transition-all ${page === 0
                      ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 cursor-pointer"
                    }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1 || filteredProfessions.length <= ITEMS_PER_PAGE}
                  className={`p-2.5 rounded-xl border transition-all ${page === 1 || filteredProfessions.length <= ITEMS_PER_PAGE
                      ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 cursor-pointer"
                    }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative flex items-center mb-6">
              <Search className="absolute left-4 text-indigo-300/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar profesiones o áreas de interés (ej. Desarrollo, Datos, Ciberseguridad)..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl text-sm placeholder-slate-400 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />
            </div>

            {/* Grilla de Carreras */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProfessions.map((job, idx) => (
                <div
                  key={job.id}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 group hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-[11px] font-semibold text-indigo-300 uppercase tracking-wide">
                        {job.area}
                      </span>
                      <div className="flex items-center gap-1 text-indigo-400 font-bold text-sm">
                        {95 - (idx * 2)}% Afinidad <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{job.title}</h3>
                    <p className="text-xs text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                      {job.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/vocacion/${job.slug}`)}
                    className="w-full py-2.5 px-4 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-semibold hover:bg-indigo-600/20 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    Ver Módulo / Ruta <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}