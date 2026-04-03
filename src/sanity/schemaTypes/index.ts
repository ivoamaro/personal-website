// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { projectType } from "./project";
import { blockContentType } from "./blockContent";
import { seoType } from "./seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, seoType, projectType],
};