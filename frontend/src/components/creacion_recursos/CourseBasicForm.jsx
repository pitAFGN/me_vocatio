export default function CourseBasicForm({ curso, setCurso, isPremium, onUpgrade }) {
  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-[#0f172a] px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-violet-500";

  return (
    <section
      className={`rounded-3xl border p-5 transition-all ${
        isPremium
          ? "border-violet-500/30 bg-slate-900/80"
          : "border-slate-800 bg-slate-900/50 opacity-70"
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Curso
          </p>
          <h2 className="mt-2 text-xl font-black text-white">Datos básicos</h2>
        </div>

        {!isPremium && (
          <div className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            🔒 Premium
          </div>
        )}
      </div>

      {!isPremium && (
        <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-medium text-amber-100">
            🔒 La creación de cursos es exclusiva del Plan Premium. Actualiza tu plan para crear y publicar cursos.
        </div>
      )}

      {!isPremium && (
        <button
          type="button"
          onClick={onUpgrade}
          className="mb-5 w-full rounded-xl bg-violet-600 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-violet-500"
        >
          Actualizar a Premium
        </button>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Nombre del curso
          </label>
          <input
            value={curso.nombre}
            disabled={!isPremium}
            onChange={(e) => setCurso({ ...curso, nombre: e.target.value })}
            className={inputClass}
            placeholder="Ej: Curso de Diseño UX"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            URL del curso
          </label>
          <input
            value={curso.url}
            disabled={!isPremium}
            onChange={(e) => setCurso({ ...curso, url: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Descripción breve
          </label>
          <textarea
            value={curso.descripcion}
            disabled={!isPremium}
            onChange={(e) => setCurso({ ...curso, descripcion: e.target.value })}
            rows={4}
            className={inputClass}
            placeholder="Describe el curso de manera clara y atractiva..."
          />
        </div>
      </div>
    </section>
  );
}
