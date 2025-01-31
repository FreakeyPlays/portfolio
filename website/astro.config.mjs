// @ts-check
import node from "@astrojs/node";
import { defineConfig } from "astro/config";
import { loadEnv } from "payload/node";

loadEnv();

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
