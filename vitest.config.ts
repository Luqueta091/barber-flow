import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    environmentMatchGlobs: [
      ["integration_tests/**", "node"],
      ["src/**/cache/**/*.test.ts", "node"],
    ],
    include: [
      "src/**/*.{test,spec}.ts",
      "src/**/*.{test,spec}.tsx",
      "integration_tests/**/*.{test,spec}.ts",
    ],
  },
});
