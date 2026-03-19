'use client';

import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Detecta si la ruta actual es el acceso (login/registro)
  const isAccessActive = pathname.startsWith('/login');

  // Estilo dinámico para los botones de la Navbar
  const getButtonStyle = (path) => {
    const isActive = path === '/login' ? isAccessActive : pathname === path;

    return isActive
      ? "bg-[#1e293b] text-white border border-slate-600 shadow-lg scale-105"
      : "bg-white text-[#1e293b] shadow-[0_4px_12px_rgba(125,211,252,0.3)] hover:scale-105";
  };

  return (
    <html lang="es">
      <body className="antialiased bg-[#e5e7eb] font-sans" suppressHydrationWarning>

        {/* Navbar Premium Unificada */}
        <nav className="fixed top-0 w-full z-50 px-10 py-3 flex justify-between items-center bg-[linear-gradient(135deg,_#94a3b8_0%,_#334155_45%,_#1e293b_100%)] shadow-xl">

          {/* Lado Izquierdo: El Diamante */}
          <Link href="/" className="flex items-center justify-center group">
            <div className="w-14 h-14 flex items-center justify-center bg-[#e5e7eb] rounded-xl relative overflow-hidden transition-all hover:scale-110 active:scale-95">
              <Image
                src="/layout3.png"
                alt="Me Vocatio Diamond"
                width={120}
                height={120}
                priority
                className="object-contain scale-[3.8] mix-blend-multiply -ml-0.5 translate-y-[2px]"
              />
            </div>
          </Link>

          {/* Lado Derecho: Dos opciones claras */}
          <div className="flex gap-4 items-center">

            <Link href="/nosotros"
              className={`${getButtonStyle('/nosotros')} px-7 py-2.5 rounded-full text-[11px] font-black transition-all active:scale-95 uppercase tracking-widest`}>
              NOSOTROS
            </Link>

            <Link href="/login"
              className={`${getButtonStyle('/login')} px-7 py-2.5 rounded-full text-[11px] font-black transition-all active:scale-95 uppercase tracking-widest`}>
              ACCESO
            </Link>

          </div>
        </nav>

        {/* Contenido Principal */}
        <main className="mt-[72px] bg-[#e5e7eb] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}