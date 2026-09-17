import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Las rutas que queremos proteger (que requieren iniciar sesión)
const protectedRoutes = [
  "/dashboard",
  "/creacion_recursos",
  "/diagnostico",
  "/recomendacion",
  "/insignias",
  "/mis-rutas",
  "/favoritos",
  "/configuracion",
  "/admin",
  "/pago-resultado",
];

const secretKey = () => new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || "");

// Verifica que el token haya sido firmado realmente por el backend (HS256),
// rechazando cookies inventadas o firmadas con otra clave.
// Si el token es auténtico pero ya expiró, se deja pasar: el guard del cliente
// renueva la sesión con el refresh token y, si no puede, redirige a /login.
async function esFirmaAutentica(token) {
  if (!token || !process.env.JWT_ACCESS_SECRET) return false;
  try {
    await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return true;
  } catch (error) {
    if (error?.code === "ERR_JWT_EXPIRED" || error?.name === "JWTExpired") return true;
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const autentico = await esFirmaAutentica(token);

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !autentico) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si el usuario ya está logueado (token válido y vigente) y va a login,
  // se redirige al dashboard.
  if (pathname === "/login" && token && autentico) {
    try {
      const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
      if (payload?.exp && Date.now() < payload.exp * 1000) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // token auténtico pero expirado: se permite entrar al login
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