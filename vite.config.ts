import { defineConfig } from "vite";
import { octane } from "@octanejs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// Octane SPA (client-only). All sources live under ./octane/*.tsrx
// (+ octane-client.tsx) and are entered via pinku-octane.html.
export default defineConfig({
  plugins: [
    octane(),
    tailwindcss(),
  ],
  build: {
    outDir: "dist-octane",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html",
    },
  },
});
