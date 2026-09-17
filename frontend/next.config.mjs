/** @type {import('next').NextConfig} */

const apiOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const supabaseOrigin = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' en script/style: Next.js inyecta scripts y estilos inline
  // (RSC payload, dev overlay). El markdown de la IA se escapa por defecto
  // (react-markdown sin rehypeRaw), así que no hay vector de XSS conocido.
  "script-src 'self' 'unsafe-inline' https://checkout.wompi.co https://www.google.com https://www.gstatic.com",
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

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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