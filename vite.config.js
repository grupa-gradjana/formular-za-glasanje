import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "./",
    // Bind 0.0.0.0 so the dev server is reachable from a phone on the same
    // Wi-Fi — the camera and touch paths (cropper, signature) can only really
    // be checked on a real device. Set here rather than in the npm script so
    // `npx vite` and IDE-launched dev servers behave the same.
    server: {
        host: true,
    },
    // Same for the production preview — that is what a phone should be pointed
    // at when checking the real bundle (scripts/e2e.sh keeps using localhost).
    preview: {
        host: true,
    },
    css: {
        postcss: "./postcss.config.js",
    },
});
