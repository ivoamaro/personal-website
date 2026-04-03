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
    defineField({
      name: "ogType",
      title: "Open Graph Type",
      type: "string",
      description: "The type of content (e.g. website, article, product).",
      initialValue: "website",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Article", value: "article" },
          { title: "Product", value: "product" },
          { title: "Profile", value: "profile" },
        ],
      },
    }),
    defineField({
      name: "twitterCard",
      title: "Twitter Card Type",
      type: "string",
      description: "Layout used when the link is shared on X / Twitter.",
      initialValue: "summary_large_image",
      options: {
        list: [
          { title: "Summary Large Image", value: "summary_large_image" },
          { title: "Summary", value: "summary" },
        ],
      },
    }),
    defineField({
      name: "structuredData",
      title: "Structured Data (JSON-LD)",
      type: "text",
      rows: 10,
      description:
        "Paste valid JSON-LD markup for rich results in search engines (schema.org). Leave empty to omit.",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          try {
            JSON.parse(value);
            return true;
          } catch {
            return "Must be valid JSON.";
          }
        }),
    }),
  ],
});
