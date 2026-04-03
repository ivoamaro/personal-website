// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { projectType } from "./project";
import { blockContentType } from "./blocks/blockContent";
import { seoType } from "./blocks/seo";
import { siteSettingsType } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, seoType, projectType,siteSettingsType],
};