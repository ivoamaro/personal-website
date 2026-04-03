import { defineType, defineField, defineArrayMember } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  preview: {
    prepare() {
      return {
        title: 'Site Settings'
      }
    }
  },
  fields: [
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "href", type: "string", title: "URL" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "href", type: "string", title: "URL" }),
          ],
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
});