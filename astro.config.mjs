import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  image: {
    endpoint: {
      route: "/_image",
      entrypoint: "@astrojs/cloudflare/image-endpoint"
    }
  },
  adapter: cloudflare(),
});
