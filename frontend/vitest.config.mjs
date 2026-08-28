import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Configuración de vitest para el frontend.
// - Alias "@" -> ./src (está definido igual en jsconfig.json)
// - Plugin de React para compilar JSX en los tests
// - Ambiente jsdom (viene de la dependencia "jsdom")
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.js"],
  },
});
