import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "ezatuf8z",
    dataset: "production",
  },
  typegen: {
    generates: "./src/sanity/sanity.types.ts",
  },
});
