import "./globals.css";
import Navbar from "../components/Navbar";
import ThemeProvider from "../components/ThemeProvider";

export const metadata = {
  title: {
    default: "MeVocatio - Desarrollo Profesional Elite",
    template: "%s | MeVocatio",
  },
  description:
    "Plataforma de desarrollo profesional con análisis vocacional, diagnóstico psicotécnico y rutas de aprendizaje personalizadas.",
  keywords: [
    "vocación",
    "desarrollo profesional",
    "carrera",
    "diagnóstico vocacional",
    "aprendizaje",
  ],
  openGraph: {
    title: "MeVocatio",
    description: "Transformando el potencial en legado",
    type: "website",
    locale: "es_CO",
    siteName: "MeVocatio",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <ThemeProvider>
        <Navbar />
        <main className="mt-[88px] min-h-[calc(100vh-88px)]">
          {children}
        </main>
      </ThemeProvider>
    </html>
  );
}
