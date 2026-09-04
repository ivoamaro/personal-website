import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";



export default defineConfig({
  site: 'https://ivoamaro.com',
  image: {
    endpoint: {
      route: "/_image",
      entrypoint: "@astrojs/cloudflare/image-endpoint"
    }
  },

  adapter: cloudflare(),
  integrations: [robotsTxt(), sitemap()],
});