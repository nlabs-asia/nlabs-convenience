import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Konfigurasi Vite — Family Mart Indonesia landing page.
// Catatan SEO (docs/technical-decisions.md §1): struktur harus tetap
// kompatibel dengan prerender/SSG saat Milestone 10.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
