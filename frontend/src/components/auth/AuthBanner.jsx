import Image from "next/image";

export default function AuthBanner({ esRegistro }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-[#1e293b] justify-center border-r border-white/10 pt-20">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-[50rem] h-[50rem] border-[60px] border-white rotate-45 -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center px-12">
        <div className="mb-6 italic font-black text-white">
          <Image
            src="/mevocatio.png"
            alt="Logo MeVocatio"
            width={650}
            height={250}
            priority
            className="brightness-0 invert object-contain h-48 w-auto transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-black leading-[1.1] mb-4 tracking-tighter uppercase italic text-white max-w-md">
            {esRegistro ? "El diamante eres tú, lúcelo" : "Sigue puliendo tu profesión"}
          </h2>
          <p className="text-base text-slate-400 font-light max-w-sm leading-snug">
            {esRegistro
              ? "Crea tu perfil ahora y accede a la red de talentos más exclusiva."
              : "Bienvenido de nuevo al portal donde tu carrera toma un brillo superior."}
          </p>
        </div>
      </div>
    </div>
  );
}