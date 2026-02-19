// @ts-check
import { defineConfig } from "astro/config";
import lenis from "astro-lenis";

// https://astro.build/config
export default defineConfig({
  integrations: [lenis()],
});
