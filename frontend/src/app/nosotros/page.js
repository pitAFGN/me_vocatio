import OpinionesCarrusel from '../components/OpinionesCarrusel';

export default function NosotrosPage() {
    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#b4b8c0_0%,_#e5e7eb_100%)] flex flex-col items-center py-20 px-6">

            {/* CUADRO DE CRISTAL PRINCIPAL */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl max-w-6xl w-full p-8 md:p-12 mt-10">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* LADO IZQUIERDO: BENEFICIOS */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-slate-900 text-2xl font-black uppercase tracking-widest border-b-4 border-cyan-500 w-fit pb-2">
                            Beneficios
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">01.</span>
                                <p className="text-slate-800 font-medium italic">Identidad Digital: Crea una presencia profesional moderna que destaque tu verdadero talento.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">02.</span>
                                <p className="text-slate-800 font-medium italic">Estructura de Perfil: Organiza tu trayectoria bajo un diseño minimalista de alto impacto visual.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">03.</span>
                                <p className="text-slate-800 font-medium italic">Claridad de Objetivos: Centraliza tus logros y metas en un solo lugar para proyectar seguridad.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-600 font-bold">04.</span>
                                <p className="text-slate-800 font-medium italic">Enfoque Vocacional: Herramientas diseñadas para profesionales que buscan dar el siguiente paso con orden.</p>
                            </li>
                        </ul>
                    </div> 

                    {/* LADO DERECHO: FUNCIONAMIENTO */}
                    <div className="flex flex-col gap-6 bg-slate-800/10 rounded-3xl p-6 border border-white/20">
                        <h2 className="text-slate-900 text-2xl font-black uppercase tracking-widest border-b-4 border-slate-800 w-fit pb-2">
                            Funcionamiento
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <span className="font-bold text-slate-900">Regístrate:</span> Crea tu perfil y cuéntanos sobre tus pasiones y experiencia.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <span className="font-bold text-slate-900">Diagnóstico:</span> Realiza nuestras pruebas psicotécnicas de última generación.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">3</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <span className="font-bold text-slate-900">Mejora:</span> Recibe recomendaciones exactas para pulir tu potencial.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* TÍTULO PARA LAS OPINIONES */}
            <div className="mt-20 w-full max-w-5xl">
                <OpinionesCarrusel />
            </div>

            {/* ESPACIADOR FINAL PARA QUE EL CARRUSEL NO QUEDE PEGADO AL BORDE */}
            <div className="h-20"></div>

        </main>
    );
}