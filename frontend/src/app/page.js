import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,_#b4b8c0_0%,_#e5e7eb_100%)] relative overflow-hidden">

      {/* CAPA DE FONDO: Los Rombos */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute w-[32rem] h-[32rem] border-[45px] border-slate-400 rotate-45 -translate-x-32 shadow-inner"></div>
          <div className="absolute w-[32rem] h-[32rem] border-[45px] border-slate-400 rotate-45 translate-x-32 shadow-inner"></div>
        </div>
      </div>

      {/* CAPA DE CONTENIDO: Subido con -mt-28 para que quede perfecto */}
      <div className="z-10 flex flex-col items-center justify-center text-center -mt-28">

        {/* EL LOGO COMPLETO */}
        <div className="flex items-center justify-center mb-0">
          <Image
            src="/mevocatio.png"
            alt="Logo MeVocatio"
            width={600}
            height={200}
            priority
            className="w-auto h-48 object-contain"
          />
        </div>

        {/* Textos Secundarios: Bien pegaditos */}
        <div className="flex flex-col gap-0.5 -mt-6">
          <p className="text-slate-700 text-lg font-bold tracking-tight">
            Pulimos tu potencial profesional
          </p>
          <p className="text-slate-900 text-sm font-black uppercase tracking-[0.2em]">
            Comienza ya!!
          </p>
        </div>

        {/* Botones Centrales */}
        <div className="flex gap-6 mt-8">
          <button className="bg-[#cbd5e1] text-slate-800 px-12 py-3 rounded-md font-bold border border-slate-400 shadow-md hover:bg-slate-300 transition-all text-xs uppercase tracking-wider active:scale-95">
            Registro
          </button>
          <button className="bg-[#cbd5e1] text-slate-800 px-12 py-3 rounded-md font-bold border border-slate-400 shadow-md hover:bg-slate-300 transition-all text-xs uppercase tracking-wider active:scale-95">
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Frase inferior */}
      <div className="absolute bottom-10 w-full text-center">
        <p className="text-slate-500 uppercase tracking-[0.8em] text-[10px] font-black opacity-40">
          Elevate Your Professional Path
        </p>
      </div>
    </main>
  );
}