import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/language",
      "@codemirror/autocomplete",
      "@lezer/common",
      "@lezer/highlight",
    ],
  },
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
  },
});
