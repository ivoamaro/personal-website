import { defineType, defineField } from "sanity";

/**
 * Reusable SEO object. Reference it in any document with:
 *   { name: 'seo', title: 'SEO', type: 'seo' }
 */
export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Overrides the page title in the browser tab and search results.",
      validation: (rule) => rule.max(60).warning("Keep under 60 characters for best results."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Shown below the title in search engine results.",
      validation: (rule) => rule.max(160).warning("Keep under 160 characters for best results."),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Image shown when sharing on social media (1200×630 recommended).",
      options: { hotspot: true },
    }),
  ],
});
