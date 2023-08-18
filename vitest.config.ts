/// <reference types="vitest" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    includeSource: ["**/*.ts"],
    coverage: {
      provider: "v8",
      all: true,
      include: ["gateway"],
      exclude: ["**/*.test.ts"],
      reporter: ["html", "json-summary", "json"],
      lines: 65,
      branches: 80,
      functions: 65,
      statements: 65,
    },
  },
})
