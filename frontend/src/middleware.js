import { NextResponse } from 'next/server';

export function middleware(request) {
  // Las rutas que queremos proteger (que requieren iniciar sesión)
  const protectedRoutes = ['/dashboard', '/creacion_recursos', '/diagnostico', '/recomendacion', '/insignias'];
  
  const { pathname } = request.nextUrl;
  
  // Verificamos si la ruta actual es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Buscar la cookie de sesión o el token (dependiendo de cómo se haya implementado)
    const token = request.cookies.get('access_token')?.value || request.cookies.get('session_id')?.value;
    
    if (!token) {
      // Si no hay token, redirigir al login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Si el usuario ya está logueado y va a login, redirigir a dashboard
  if (pathname === '/login' || pathname === '/register') {
    const token = request.cookies.get('access_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

