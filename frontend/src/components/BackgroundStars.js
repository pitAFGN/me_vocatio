"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useTheme } from "./ThemeProvider";

export default function BackgroundStars({ fondo = "auto" }) {
  const { isDarkMode } = useTheme();
  const esOscuro = fondo === "dark" || isDarkMode;

  const colores = esOscuro
    ? { capa1: "#ffffff", capa2: "#c084fc", capa3: "#38bdf8" }
    : { capa1: "#475569", capa2: "#7c3aed", capa3: "#0891b2" };

  const opacidad = esOscuro ? [0.9, 0.8, 0.7] : [0.7, 0.7, 0.6];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      >
        {/* Capa 1: Estrellitas blancas ultra visibles */}
        <Sparkles
          count={100}
          scale={[20, 20, 10]}
          size={3.5}
          speed={0.4}
          opacity={opacidad[0]}
          color={colores.capa1}
        />

        {/* Capa 2: Destellos violetas/morados de la marca */}
        <Sparkles
          count={60}
          scale={[18, 18, 8]}
          size={5.0}
          speed={0.5}
          opacity={opacidad[1]}
          color={colores.capa2}
        />

        {/* Capa 3: Destellos cian sutiles */}
        <Sparkles
          count={40}
          scale={[15, 15, 6]}
          size={4.0}
          speed={0.3}
          opacity={opacidad[2]}
          color={colores.capa3}
        />
      </Canvas>
    </div>
  );
}