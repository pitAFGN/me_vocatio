"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAdminRoute } from "@/hooks/useRouteGuard";
import { useAuth } from "@/hooks/useAuth";
import SidebarNav from "@/components/SidebarNav";
import LoadingScreen from "@/components/LoadingScreen";
import Toast from "@/components/Toast";
import { API_URL } from "@/lib/constants";
import { LayoutDashboard, Users, BookOpen, CreditCard, Search, Plus, Edit, Trash2, ArrowUpRight, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

const MetricsDashboard = dynamic(
  () => import("@/components/admin/MetricsDashboard"),
  { ssr: false, loading: () => (
    <div className="space-y-6">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Estadísticas y Crecimiento</h3>
      </div>
      <div className="p-16 text-center text-slate-500">Cargando métricas...</div>
    </div>
  ) }
);

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { loading, user } = useAdminRoute();
  
  const [activeTab, setActiveTab] = useState("recursos");
  const [stats, setStats] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [recursosLoading, setRecursosLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  
  // States for Recursos
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // States for Usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // States for Metrics Dashboard
  const [metricsData, setMetricsData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // States for Pagos
  const [pagos, setPagos] = useState([]);
  const [pagosLoading, setPagosLoading] = useState(true);

  // Search States
  const [searchRecurso, setSearchRecurso] = useState("");
  const [searchUsuario, setSearchUsuario] = useState("");

  // Pagination States
  const [pageRecursos, setPageRecursos] = useState(1);
  const [pageUsuarios, setPageUsuarios] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setPageRecursos(1);
  }, [searchRecurso]);

  useEffect(() => {
    setPageUsuarios(1);
  }, [searchUsuario]);

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchStats();
      if (activeTab === 'recursos') fetchResources();
      if (activeTab === 'usuarios') fetchUsers();
      if (activeTab === 'metricas') fetchMetricsDashboard();
      if (activeTab === 'pagos') fetchPayments();
    }
  }, [loading, user, activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error stats:", err);
    }
  };

  const fetchMetricsDashboard = async () => {
    try {
      setMetricsLoading(true);
      const res = await fetch(`${API_URL}/api/admin/metrics-dashboard`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setMetricsData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setPagosLoading(true);
      const res = await fetch(`${API_URL}/api/admin/payments`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setPagos(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPagosLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      setRecursosLoading(true);
      const res = await fetch(`${API_URL}/api/admin/resources`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setRecursos(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRecursosLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsuariosLoading(true);
      const res = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include",
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsuariosLoading(false);
    }
  };

  const handleUserUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          plan: editingUser.plan,
          role: editingUser.role,
          level: parseInt(editingUser.level, 10) || 1
        })
      });
      if (res.ok) {
        fetchUsers();
        setIsUserModalOpen(false);
        setEditingUser(null);
        setToast({ message: "Usuario actualizado correctamente.", type: "success" });
      } else {
        setToast({ message: "Error al actualizar el usuario.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error de conexión al servidor.", type: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!deletingCourse) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/resources/${deletingCourse.id}`, {
        method: 'DELETE',
        credentials: "include"
      });
      if (res.ok) {
        setRecursos(recursos.filter(r => r.id !== deletingCourse.id));
        setIsDeleteModalOpen(false);
        setDeletingCourse(null);
        setToast({ message: "Curso eliminado correctamente.", type: "success" });
      } else {
        setToast({ message: "Error al eliminar el curso. Verifica que el servidor esté actualizado.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error de conexión al eliminar.", type: "error" });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/resources/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          title: editingCourse.titulo,
          category: editingCourse.vocacion,
          status: editingCourse.estado === 'Activo' ? 'published' : 'borrador' // o los valores que manejes
        })
      });
      if (res.ok) {
        fetchResources(); // recargar
        setIsEditModalOpen(false);
        setEditingCourse(null);
        setToast({ message: "Cambios guardados correctamente.", type: "success" });
      } else {
        setToast({ message: "La ruta no fue encontrada (Error 404). ¿Reiniciaste el backend?", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error de conexión al servidor.", type: "error" });
    }
  };

  const filteredRecursos = recursos.filter(r => 
    r.titulo?.toLowerCase().includes(searchRecurso.toLowerCase()) || 
    r.instructor_name?.toLowerCase().includes(searchRecurso.toLowerCase())
  );
  const totalPagesRecursos = Math.ceil(filteredRecursos.length / ITEMS_PER_PAGE);
  const paginatedRecursos = filteredRecursos.slice((pageRecursos - 1) * ITEMS_PER_PAGE, pageRecursos * ITEMS_PER_PAGE);

  const filteredUsuarios = usuarios.filter(u => 
    u.name?.toLowerCase().includes(searchUsuario.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchUsuario.toLowerCase())
  );
  const totalPagesUsuarios = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);
  const paginatedUsuarios = filteredUsuarios.slice((pageUsuarios - 1) * ITEMS_PER_PAGE, pageUsuarios * ITEMS_PER_PAGE);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <SidebarNav logout={logout} />
      <main className="md:pl-64 pt-6 sm:pt-8 px-4 sm:px-6 md:px-10 pb-16 relative z-10 min-h-screen bg-slate-50 dark:bg-[#0c1222]">
        
        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />

        <div className="max-w-7xl mx-auto">
          
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-indigo-500" />
                Panel de Administración
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Bienvenido, {user?.name}. Tienes control total sobre la plataforma.
              </p>
            </div>
            {activeTab === "recursos" && (
              <button 
                onClick={() => router.push('/creacion_recursos')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuevo Recurso
              </button>
            )}
          </header>

          {/* KPI Cards (Resumen rápido arriba) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Usuarios Totales</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats !== null ? stats.totalUsers : <span className="animate-pulse bg-slate-200 dark:bg-slate-800 text-transparent rounded">0000</span>}
              </p>
              <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                Registrados en base de datos
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Peticiones IA Hoy</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats !== null ? stats.aiRequestsToday : <span className="animate-pulse bg-slate-200 dark:bg-slate-800 text-transparent rounded">00</span>}
              </p>
              <p className="text-xs text-amber-500 mt-2 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Consumo real de Groq API hoy
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Usuarios Premium</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats !== null ? stats.premiumUsers : <span className="animate-pulse bg-slate-200 dark:bg-slate-800 text-transparent rounded">000</span>}
              </p>
              <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Subscripciones pagas activas
              </p>
            </div>
          </div>

          {/* Menú de Navegación Interno (Tabs) */}
          <div className="flex overflow-x-auto gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-px scrollbar-hide">
            {[
              { id: "recursos", label: "Gestión de Recursos", icon: BookOpen },
              { id: "usuarios", label: "Usuarios & Planes", icon: Users },
              { id: "metricas", label: "Dashboard Métricas", icon: LayoutDashboard },
              { id: "pagos", label: "Pagos (Wompi)", icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido de la Tab Activa */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            
            {activeTab === "recursos" && (
              <>
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Cursos de la Comunidad</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchRecurso}
                      onChange={(e) => setSearchRecurso(e.target.value)}
                      placeholder="Buscar curso..." 
                      className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full sm:w-64 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 text-xs uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30">
                        <th className="px-6 py-4 font-semibold">Curso / Título</th>
                        <th className="px-6 py-4 font-semibold">Categoría / Vocación</th>
                        <th className="px-6 py-4 font-semibold">Estado</th>
                        <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-white/5">
                      {recursosLoading ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                            Cargando cursos...
                          </td>
                        </tr>
                      ) : paginatedRecursos.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                            {searchRecurso ? "No se encontraron cursos con esa búsqueda." : "No hay cursos creados por la comunidad aún."}
                          </td>
                        </tr>
                      ) : (
                        paginatedRecursos.map((recurso) => (
                          <tr key={recurso.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900 dark:text-white">{recurso.titulo}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Autor: {recurso.instructor_name} • ID: {recurso.id}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                              {recurso.vocacion}
                            </td>
                            <td className="px-6 py-4">
                              {recurso.estado === "Activo" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Borrador
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  setEditingCourse({...recurso});
                                  setIsEditModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setDeletingCourse(recurso);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-1"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Mostrando {paginatedRecursos.length} de {filteredRecursos.length} resultados</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPageRecursos(p => Math.max(1, p - 1))}
                      disabled={pageRecursos === 1}
                      className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 font-medium cursor-pointer shadow-sm disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button 
                      onClick={() => setPageRecursos(p => Math.min(totalPagesRecursos, p + 1))}
                      disabled={pageRecursos >= totalPagesRecursos || totalPagesRecursos === 0}
                      className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 font-medium cursor-pointer shadow-sm disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "usuarios" && (
              <>
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Usuarios y Planes</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchUsuario}
                      onChange={(e) => setSearchUsuario(e.target.value)}
                      placeholder="Buscar usuario..." 
                      className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full sm:w-64 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 text-xs uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30">
                        <th className="px-6 py-4 font-semibold">Usuario</th>
                        <th className="px-6 py-4 font-semibold">Plan</th>
                        <th className="px-6 py-4 font-semibold">Rol</th>
                        <th className="px-6 py-4 font-semibold">Nivel / XP</th>
                        <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-white/5">
                      {usuariosLoading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                            Cargando usuarios...
                          </td>
                        </tr>
                        ) : paginatedUsuarios.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                            {searchUsuario ? "No se encontraron usuarios con esa búsqueda." : "No hay usuarios registrados."}
                          </td>
                        </tr>
                      ) : (
                        paginatedUsuarios.map((usr) => (
                          <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900 dark:text-white">{usr.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{usr.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${usr.plan === 'premium' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'}`}>
                                {usr.plan === 'premium' ? 'Premium' : 'Free'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${usr.role === 'admin' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
                                {usr.role === 'admin' ? 'Admin' : 'Usuario'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                              Lvl {usr.level} <span className="text-slate-400 text-xs">({usr.xp} XP)</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  setEditingUser({...usr});
                                  setIsUserModalOpen(true);
                                }}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mx-2 p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors" 
                                title="Editar Plan/Rol"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Mostrando {paginatedUsuarios.length} de {filteredUsuarios.length} resultados</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPageUsuarios(p => Math.max(1, p - 1))}
                      disabled={pageUsuarios === 1}
                      className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 font-medium cursor-pointer shadow-sm disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button 
                      onClick={() => setPageUsuarios(p => Math.min(totalPagesUsuarios, p + 1))}
                      disabled={pageUsuarios >= totalPagesUsuarios || totalPagesUsuarios === 0}
                      className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 font-medium cursor-pointer shadow-sm disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "metricas" && (
              <MetricsDashboard metricsData={metricsData} metricsLoading={metricsLoading} />
            )}

            {activeTab === "pagos" && (
              <div className="space-y-6">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Transacciones y Pagos</h3>
                </div>

                {pagosLoading ? (
                  <div className="p-16 text-center text-slate-500">Cargando pagos...</div>
                ) : pagos.length === 0 ? (
                  <div className="p-16 text-center text-slate-500">No hay pagos registrados.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                          <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/10">Fecha</th>
                          <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/10">Usuario</th>
                          <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/10">Concepto</th>
                          <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/10">Monto</th>
                          <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/10">Estado</th>
                          <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/10">Referencia (ID)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                        {pagos.map((pago) => (
                          <tr key={pago.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {new Date(pago.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold text-slate-900 dark:text-white">{pago.name}</div>
                              <div className="text-xs text-slate-500">{pago.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                pago.concept === 'premium' 
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' 
                                  : 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                              }`}>
                                {pago.concept}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: pago.currency || 'COP' }).format(pago.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                pago.status === 'APPROVED' || pago.status === 'pagado'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                  : pago.status === 'DECLINED' || pago.status === 'fallido'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
                              }`}>
                                {pago.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                              {pago.reference.substring(0, 15)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Modal de Edición */}
        {isEditModalOpen && editingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Editar Curso</h3>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título del Curso</label>
                  <input 
                    type="text" 
                    value={editingCourse.titulo} 
                    onChange={(e) => setEditingCourse({...editingCourse, titulo: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                  <input 
                    type="text" 
                    value={editingCourse.vocacion} 
                    onChange={(e) => setEditingCourse({...editingCourse, vocacion: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                  <select 
                    value={editingCourse.estado} 
                    onChange={(e) => setEditingCourse({...editingCourse, estado: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                  >
                    <option value="Activo">Activo / Publicado</option>
                    <option value="Borrador">Borrador / Pendiente</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        {isDeleteModalOpen && deletingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Eliminar Curso</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                ¿Estás seguro de que deseas eliminar permanentemente el curso <span className="font-bold text-slate-900 dark:text-white">"{deletingCourse.titulo}"</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow-sm transition-colors"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición de Usuario */}
        {isUserModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Editar Usuario</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{editingUser.name}</p>
              <form onSubmit={handleUserUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plan</label>
                  <select 
                    value={editingUser.plan} 
                    onChange={(e) => setEditingUser({...editingUser, plan: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                  <select 
                    value={editingUser.role || 'user'} 
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nivel del Usuario</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={editingUser.level || 1} 
                    onChange={(e) => setEditingUser({...editingUser, level: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
