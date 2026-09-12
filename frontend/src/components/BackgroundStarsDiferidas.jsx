"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BackgroundStars = dynamic(
  () => import("@/components/ThreeScene").then((m) => m.BackgroundStars),
  { ssr: false }
);

export default function BackgroundStarsDiferidas() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    import("@/components/ThreeScene").catch(() => {});
    const timer = setTimeout(() => setMostrar(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return mostrar ? <BackgroundStars /> : null;
}