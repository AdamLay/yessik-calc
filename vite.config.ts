import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
//import { nitro } from "nitro/vite";
import netlify from '@netlify/vite-plugin-tanstack-start';
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    port: 3000,
  },
  plugins: [
    devtools(),
    // nitro({
    //   output: {
    //     dir: "dist",
    //   },
    //   rollupConfig: { external: [/^@sentry\//] }
    // }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    netlify()
  ],
});

export default config;
