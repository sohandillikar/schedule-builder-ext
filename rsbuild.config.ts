import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginWebExtension } from "rsbuild-plugin-web-extension";
import manifest from "./manifest.ts";
import path from "path";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginWebExtension({
      manifest,
    }),
  ],

  // Add path aliases configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@public": path.resolve(__dirname, "./public")
    },
  },

  // Tailwind CSS and PostCSS configuration
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          require("tailwindcss"),
          require("autoprefixer"),
        ],
      },
    },
  },
});
