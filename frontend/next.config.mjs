/** @type {import('next').NextConfig} */

const apiOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const supabaseOrigin = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' en script/style: Next.js inyecta scripts y estilos inline
  // (RSC payload, dev overlay). El markdown de la IA se escapa por defecto
  // (react-markdown sin rehypeRaw), así que no hay vector de XSS conocido.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://checkout.wompi.co https://www.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://checkout.wompi.co",
  `img-src 'self' data: blob: ${apiOrigin} https:`,
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin}${supabaseOrigin ? ` ${supabaseOrigin}` : ""} https://checkout.wompi.co https://www.google.com https://www.gstatic.com ws: wss:`,
  "frame-src 'self' https://checkout.wompi.co https://www.google.com https://recaptcha.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig = {
  reactCompiler: true,
  output: "standalone",

  // Los paquetes de three.js/drei son ESM y algunos (p. ej. three-stdlib)
  // pueden fallar durante el build en Vercel con "Unexpected token 'export'".
  // Transpilarlos con el bundler evita esos errores sin afectar el rendimiento.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "three-stdlib"],

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Rewrite de /api/* al backend externo. Así la app habla same-origin
  // (funciona también sin dominio propio) y el Set-Cookie del login aterriza
  // en el origen del frontend, de modo que proxy.js ve el access_token.
  // API_UPSTREAM_URL (p. ej. https://app.up.railway.app) se define en el
  // deploy; en desarrollo el frontend llama directo a localhost:3001.
  async rewrites() {
    const upstream = process.env.API_UPSTREAM_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${upstream}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(woff|woff2|eot|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(glb|gltf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), display-capture=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;