import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schema } from "./src/sanity/schemaTypes";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || "ezatuf8z";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  projectId,
  dataset,
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: import.meta.env.PUBLIC_URL || "http://localhost:4321",
    }),
  ],
  schema,
});