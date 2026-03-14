import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#e5e7eb] font-sans">

        {/* Navbar con degradado - SIN BORDES, SIN SOMBRAS, SIN LINEAS */}
        <nav className="fixed top-0 w-full z-50 px-10 py-3 flex justify-between items-center 
          bg-[linear-gradient(135deg,_#94a3b8_0%,_#334155_45%,_#1e293b_100%)]">

          {/* Lado Izquierdo: El Diamante */}
          <Link href="/" className="flex items-center justify-center group">
            <div className="w-12 h-12 flex items-center justify-center 
              bg-[#e5e7eb] rounded-xl relative overflow-hidden
              transition-all hover:scale-110 active:scale-95">

              <Image
                src="/layout3.png"
                alt="Me Vocatio Diamond"
                width={100}
                height={100}
                priority
                className="object-contain scale-[3.3] mix-blend-multiply -ml-0.5 translate-y-[2px]"
              />
            </div>
          </Link>

          {/* Lado Derecho: Botones */}
          <div className="flex gap-4 items-center">
            <Link href="/register" className="bg-white text-[#1e293b] px-7 py-2.5 rounded-full text-[11px] font-black transition-all hover:scale-105 active:scale-95">
              REGISTRO
            </Link>
            <Link href="/login" className="bg-white text-[#1e293b] px-7 py-2.5 rounded-full text-[11px] font-black transition-all hover:scale-105 active:scale-95">
              INICIAR SESIÓN
            </Link>
          </div>
        </nav>

        {/* El Main - Ajustamos el padding para que no haya espacio de 1px */}
        <main className="mt-[64px] bg-[#e5e7eb] min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}