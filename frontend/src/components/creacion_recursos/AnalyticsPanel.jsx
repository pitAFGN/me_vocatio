export default function AnalyticsPanel({ isPremium, metricCards, funnelData, recentStudents }) {
  if (!isPremium) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="rounded-2xl border border-dashed border-violet-500/30 bg-violet-500/5 p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Premium requerido
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">Métricas ocultas</h2>
          <p className="mt-2 text-sm text-slate-300">
            Actualiza a Premium para ver las estadísticas de tus alumnos.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_18px_rgba(168,85,247,0.35)]"
          >
            Mejorar plan
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-violet-500/30 bg-slate-900/80 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Analíticas
          </p>
          <h2 className="mt-2 text-xl font-black text-white">Rendimiento del curso</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {metricCards.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
              {metric.label}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-2xl font-black text-white">{metric.value}</span>
              <span className="text-xs font-bold text-emerald-300">{metric.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
            Embudo de abandono
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
            Drop-off
          </span>
        </div>

        <div className="space-y-3">
          {funnelData.map((item) => (
            <div key={item.step}>
              <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                <span>{item.step}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
            Estudiantes recientes
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
            Live
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-900/80 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">Alumno</th>
                <th className="px-3 py-3 font-semibold">Curso</th>
                <th className="px-3 py-3 font-semibold">Avance</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr key={student.name} className="border-t border-slate-800 bg-slate-950/40">
                  <td className="px-3 py-3">
                    <div className="font-medium text-white">{student.name}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{student.course}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">{student.progress}</span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                        {student.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
