// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  integrations: [sanity({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET,
    useCdn: true,
  }), react()]
});