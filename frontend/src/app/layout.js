import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#e5e7eb] font-sans">

        {/* Navbar con degradado metálico oscuro */}
        <nav className="fixed top-0 w-full z-50 px-10 py-3.5 flex justify-between items-center bg-[linear-gradient(180deg,_#334155_0%,_#1e293b_100%)] shadow-2xl border-b border-white/5">

          {/* Lado Izquierdo: El Diamante - AJUSTE FINAL DE POSICIÓN */}
          <Link href="/" className="flex items-center justify-center group">
            <div className="w-12 h-12 flex items-center justify-center 
    bg-[#e5e7eb] rounded-xl shadow-inner relative overflow-hidden
    filter drop-shadow-[0_0_12px_rgba(125,211,252,0.6)] transition-all hover:scale-110 active:scale-95">

              <Image
                src="/layout3.png"
                alt="Me Vocatio Diamond"
                width={100}
                height={100}
                priority
                // scale-[3.3] lo mantiene grande
                // -ml-0.5: lo mueve un pelín a la derecha comparado con el anterior
                // translate-y-[2px]: lo baja un poco para que no se vea tan pegado al techo
                className="object-contain scale-[3.3] mix-blend-multiply -ml-0.5 translate-y-[2px]"
              />
            </div>
          </Link>

          {/* Lado Derecho: Botones con el brillo azul */}
          <div className="flex gap-4 items-center">
            <Link href="/register" className="bg-white text-slate-900 px-7 py-2 rounded-full text-[11px] font-black shadow-[0_0_15px_rgba(125,211,252,1)] border-2 border-slate-900 transition-all hover:scale-105 active:scale-95">
              REGISTRO
            </Link>
            <Link href="/login" className="bg-white text-slate-900 px-7 py-2 rounded-full text-[11px] font-black shadow-[0_0_15px_rgba(125,211,252,1)] border-2 border-slate-900 transition-all hover:scale-105 active:scale-95">
              INICIAR SESIÓN
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}