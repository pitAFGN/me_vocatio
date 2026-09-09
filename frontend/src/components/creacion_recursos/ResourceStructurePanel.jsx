import { ExternalLink, Trash2, HelpCircle } from "lucide-react";

export default function ResourceStructurePanel({
  isPremium,
  resources,
  freeResourceLimit,
  onCreateResource,
  onRemoveResource,
  onUpgrade,
}) {
  const visibleResources = isPremium ? resources : resources.slice(0, freeResourceLimit);

  return (
    <section
      className={`rounded-3xl border p-5 transition-all ${
        isPremium
          ? "border-violet-500/30 bg-slate-900/80"
          : "border-slate-800 bg-slate-900/50 opacity-90"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/80">
            Flujo del curso
          </p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-xl font-black text-white">Estructura de recursos</h2>
            
            {/* Tooltip Icon */}
            <div className="relative group cursor-help">
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 hover:text-violet-300 hover:border-violet-500 hover:bg-violet-500/20 transition-colors">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
              
              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">¿Qué es esto?</strong>
                  Imagina que es como una lista de reproducción estructurada. Aquí defines el orden exacto (videos, guías, tareas) y los enlaces que tu estudiante seguirá paso a paso al tomar el curso.
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>
          
          <p className="mt-1 text-xs text-slate-400">
            {isPremium
              ? `${resources.length} recursos creados · sin límite`
              : `${visibleResources.length} de ${freeResourceLimit} recursos gratuitos visibles`}
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateResource}
          className={`shrink-0 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition-all cursor-pointer ${
            isPremium
              ? "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20"
              : "border border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
          }`}
        >
          {isPremium ? "+ Crear recurso" : "🔒 Crear recurso"}
        </button>
      </div>

      <div className="space-y-3">
        {visibleResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
            <p className="text-sm font-semibold text-slate-300">Aún no has agregado recursos a este curso</p>
            <p className="mt-1 text-xs text-slate-500">
              Haz clic en "+ Crear recurso" para añadir tu primera lección, video o enlace.
            </p>
            <button
              type="button"
              onClick={onCreateResource}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600/20 border border-violet-500/30 px-3.5 py-2 text-xs font-bold text-violet-200 hover:bg-violet-600/30 transition-colors cursor-pointer"
            >
              + Agregar primer recurso
            </button>
          </div>
        ) : (
          visibleResources.map((resource, index) => (
            <div 
              key={resource.id} 
              className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-violet-500/30 hover:bg-slate-900/80"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-black text-violet-200 border border-violet-500/20">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{resource.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 font-medium">{resource.type}</span>
                      {resource.url && (
                        <a
                          href={resource.url.startsWith("http") ? resource.url : `https://${resource.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300 hover:bg-violet-500/20 transition-colors"
                          title={resource.url}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="max-w-[140px] truncate">{resource.url}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    Activo
                  </span>
                  {onRemoveResource && (
                    <button
                      type="button"
                      onClick={() => onRemoveResource(resource.id)}
                      className="rounded-xl p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Eliminar recurso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {!isPremium && resources.length > freeResourceLimit && (
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full rounded-2xl border border-dashed border-violet-500/40 bg-violet-500/5 p-4 text-sm font-bold text-violet-200 transition-colors hover:bg-violet-500/10 cursor-pointer"
          >
            Actualiza a Premium para ver el resto de tus recursos ({resources.length - freeResourceLimit} más)
          </button>
        )}
      </div>
    </section>
  );
}
