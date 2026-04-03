// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  integrations: [sanity({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    studioBasePath: "/admin",
    apiVersion: "2026-04-02",
    token: env.SANITY_API_READ_TOKEN,  // enables draft content
    stega: {
      studioUrl: "/admin",      // where clicks navigate to
    },
  }), react()]
});