"use client";

import dynamic from "next/dynamic";

const DiamanteCanvas = dynamic(
  () => import("@/components/ThreeScene").then((m) => m.DiamanteCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/15 animate-ping" />
      </div>
    ),
  }
);

export default function LandingDiamante() {
  return (
    <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] flex items-center justify-center pointer-events-none -mt-2 -mb-2 sm:-mt-4 sm:-mb-6 md:-mt-6 md:-mb-8 animate-[float_6s_ease-in-out_infinite]">
      <div className="absolute w-[70%] h-[70%] bg-purple-400/10 dark:bg-gradient-to-tr dark:from-purple-600/20 dark:via-indigo-500/15 dark:to-blue-500/10 rounded-full blur-[50px] dark:blur-[90px] -z-10 animate-pulse" />
      <DiamanteCanvas />
    </div>
  );
}