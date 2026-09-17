"use client";

import { LayoutDashboard } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function MetricsDashboard({ metricsData, metricsLoading }) {
  if (metricsLoading || !metricsData) {
    return (
      <div className="space-y-6">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Estadísticas y Crecimiento</h3>
        </div>
        <div className="p-16 text-center text-slate-500">Cargando métricas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Estadísticas y Crecimiento</h3>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Usuarios Registrados (7 días)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData.usersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" name="Nuevos Usuarios" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Cursos por Categoría</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData.coursesByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="value" name="Cursos" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm lg:col-span-2">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Distribución de Planes (Free vs Premium)</h4>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metricsData.plansDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metricsData.plansDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'premium' ? '#f59e0b' : '#64748b'} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}