import {
  Code2,
  BrainCircuit,
  Server,
  ShieldCheck,
  Rocket
} from "lucide-react";
import { PROFESSIONS } from "@/app/data/professions";

export const VOCATION_GROUPS = [
  {
    id: "desarrollo",
    label: "Desarrollo",
    subtitle: "Programación, aplicaciones y videojuegos",
    icon: Code2,
    gradient: "from-indigo-500/70 via-blue-600/40 to-[#1e1b4b]",
    colorTexto: "text-indigo-300",
    vocationIds: ["1", "7", "8", "9", "19"]
  },
  {
    id: "data-ai",
    label: "Data & AI",
    subtitle: "Datos, inteligencia artificial y analytics",
    icon: BrainCircuit,
    gradient: "from-violet-500/70 via-purple-600/40 to-[#2e1065]",
    colorTexto: "text-violet-300",
    vocationIds: ["3", "6", "14", "15", "20"]
  },
  {
    id: "infraestructura",
    label: "Infraestructura & Cloud",
    subtitle: "Cloud, redes y operaciones a escala",
    icon: Server,
    gradient: "from-cyan-500/70 via-sky-600/40 to-[#0c4a6e]",
    colorTexto: "text-cyan-300",
    vocationIds: ["4", "10", "11", "12", "21"]
  },
  {
    id: "seguridad",
    label: "Seguridad & QA",
    subtitle: "Protección digital y calidad de software",
    icon: ShieldCheck,
    gradient: "from-red-500/70 via-rose-600/40 to-[#450a0a]",
    colorTexto: "text-red-300",
    vocationIds: ["5", "13", "22"]
  },
  {
    id: "diseno-emerging",
    label: "Diseño & Emerging Tech",
    subtitle: "Producto, diseño, blockchain y arquitectura",
    icon: Rocket,
    gradient: "from-pink-500/70 via-rose-600/40 to-[#1e1b4b]",
    colorTexto: "text-pink-300",
    vocationIds: ["2", "16", "17", "18"]
  }
];

const byId = new Map(PROFESSIONS.map((p) => [p.id, p]));

export const getVocationsForGroup = (groupId) => {
  const group = VOCATION_GROUPS.find((g) => g.id === groupId);
  if (!group) return [];
  return group.vocationIds
    .map((id) => byId.get(id))
    .filter(Boolean);
};