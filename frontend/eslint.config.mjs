import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    // Desactivamos `react-hooks/set-state-in-effect` porque esta regla del React Compiler
    // no es disableable por comentario y marca como error un patrón que usamos a propósito:
    // sincronizar estado al montar en el cliente (leer localStorage / marcar "mounted" para
    // evitar flash de hidratación y detectar sesión). Estos usos son intencionales, no bugs.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
