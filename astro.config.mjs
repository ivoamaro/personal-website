// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_URL,
  integrations: [sanity({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: "2026-04-02",
    token: env.SANITY_API_READ_TOKEN,  // enables draft content
    studioBasePath: "/admin",
    stega: {
      studioUrl: "/admin",      // where clicks navigate to
    },
  }), react(), sitemap(), robotsTxt()], 
  vite: {
    optimizeDeps: {
      include: [
        "react/compiler-runtime",
        "lodash/isObject.js",
        "lodash/groupBy.js",
        "lodash/keyBy.js",
        "lodash/partition.js",
        "lodash/sortedIndex.js",
      ],
    },
  },
});