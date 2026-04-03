import { defineCliConfig } from "sanity/cli";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || "ezatuf8z";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: dataset,
  },
  typegen: {
    generates: "./src/sanity/sanity.types.ts",
  },
});
