import { defineType, defineField } from "sanity";

export const projectType = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      defineField({ name: 'title', type: 'string' }),
      defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
      defineField({ name: 'description', type: 'text' }),
      defineField({ name: 'image', type: 'image' }),
    ],
  });