'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[linear-gradient(180deg,_#b4b8c0_0%,_#e5e7eb_100%)] relative overflow-hidden">

      {/* CAPA DE FONDO: Los Rombos Estáticos y Perfectos */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none z-0">
        <div className="relative flex items-center justify-center w-full h-full -translate-y-10">
          <div className="absolute w-[30rem] h-[30rem] border-[40px] border-slate-400 rotate-45 -translate-x-44 shadow-2xl"></div>
          <div className="absolute w-[30rem] h-[30rem] border-[40px] border-slate-400 rotate-45 translate-x-44 shadow-2xl"></div>
        </div>
      </div>

      {/* CAPA DE CONTENIDO CENTRAL */}
      <div className="z-10 flex flex-col items-center justify-center text-center mt-40 relative">

        {/* EL LOGO COMPLETO */}
        <div className="flex items-center justify-center mb-0 transition-transform duration-700 hover:scale-105 group">
          <Image
            src="/mevocatio.png"
            alt="Logo MeVocatio"
            width={600}
            height={200}
            priority
            className="w-auto h-44 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)] transition-all group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          />
        </div>

        {/* Textos Secundarios: Ajuste de margen negativo para subir el bloque */}
        <div className="flex flex-col gap-1 -mt-8">
          <p className="text-[#1e293b] text-xl md:text-2xl font-black tracking-tight italic">
            Pulimos tu potencial profesional
          </p>
        </div>

        {/* Botón Único: Reducido de mt-12 a mt-8 para mayor cercanía */}
        <div className="mt-8">
          <Link href="/login">
            <button className="bg-[#1e293b] text-white px-16 py-4 rounded-md font-black shadow-[0_15px_30px_rgba(30,41,59,0.3)] hover:bg-slate-800 transition-all text-[12px] uppercase tracking-[0.3em] active:scale-95 border border-slate-700">
              Empieza a pulir tu futuro
            </button>
          </Link>
        </div>
      </div>

      {/* Frase inferior fija al fondo */}
      <div className="absolute bottom-10 w-full text-center">
        <p className="text-slate-500 uppercase tracking-[0.8em] text-[10px] font-black opacity-40">
          Empieza hoy a pulir tu perfil profesional
        </p>
      </div>

    </main>
  );
}