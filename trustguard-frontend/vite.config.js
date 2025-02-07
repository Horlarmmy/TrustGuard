import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["5173-gitpoddemos-votingapp-nqc5j80vipp.ws-eu117.gitpod.io"],
  },
});
