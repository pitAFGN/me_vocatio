import {
  Palette,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  Server,
  Code2
} from "lucide-react";

export const TEMAS_AREAS = [
  {
    keys: ["diseno", "ux"],
    clase: "from-pink-500/70 via-rose-600/40 to-[#1e1b4b]",
    icono: Palette,
    colorTexto: "text-pink-300"
  },
  {
    keys: ["dato", "analis", "ciencia"],
    clase: "from-emerald-500/70 via-teal-600/40 to-[#042f2e]",
    icono: BarChart3,
    colorTexto: "text-emerald-300"
  },
  {
    keys: ["seguridad"],
    clase: "from-red-500/70 via-rose-600/40 to-[#450a0a]",
    icono: ShieldCheck,
    colorTexto: "text-red-300"
  },
  {
    keys: ["ia", "inteligencia"],
    clase: "from-violet-500/70 via-purple-600/40 to-[#2e1065]",
    icono: BrainCircuit,
    colorTexto: "text-violet-300"
  },
  {
    keys: ["infraestructura", "sistema", "cloud", "devops"],
    clase: "from-cyan-500/70 via-sky-600/40 to-[#0c4a6e]",
    icono: Server,
    colorTexto: "text-cyan-300"
  }
];

export const TEMA_DEFAULT = {
  clase: "from-indigo-500/70 via-blue-600/40 to-[#1e1b4b]",
  icono: Code2,
  colorTexto: "text-indigo-300"
};

export const obtenerTema = (area = "") => {
  const a = area.toLowerCase();
  const tema = TEMAS_AREAS.find((t) => t.keys.some((k) => a.includes(k)));
  return tema || TEMA_DEFAULT;
};

export const obtenerChipDemanda = (demanda = "") => {
  const d = demanda.toLowerCase();
  if (d.includes("alta") && d.includes("media")) {
    return {
      texto: demanda,
      clase: "bg-amber-100 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300"
    };
  }
  if (d.includes("alta")) {
    return {
      texto: demanda,
      clase: "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
    };
  }
  return {
    texto: demanda || "Media",
    clase: "bg-sky-100 dark:bg-sky-500/15 border-sky-300 dark:border-sky-500/40 text-sky-700 dark:text-sky-300"
  };
};

export const obtenerChipNivel = (nivel = "") => {
  const n = nivel.toLowerCase();
  if (n.includes("principiant")) {
    return {
      texto: nivel,
      clase: "bg-sky-100 dark:bg-sky-500/15 border-sky-300 dark:border-sky-500/40 text-sky-700 dark:text-sky-300"
    };
  }
  if (n.includes("intermedio")) {
    return {
      texto: nivel,
      clase: "bg-violet-100 dark:bg-violet-500/15 border-violet-300 dark:border-violet-500/40 text-violet-700 dark:text-violet-300"
    };
  }
  return {
    texto: nivel || "Avanzado",
    clase: "bg-rose-100 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300"
  };
};