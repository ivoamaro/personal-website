import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";

import { z } from "astro/zod";

const homepage = defineCollection({
  loader: glob({ base: "./content/homepage", pattern: "**/*.{md,mdx}" }),
  //   schema: z.object({
  //     title: z.string(),

  //     work: z.object({
  //       title: z.string(),
  //       items: z.array(
  //         z.object({
  //           title: z.string(),
  //           category: z.array(z.string()),
  //         }),
  //       ),
  //     }),

  //     skills: z.object({
  //       title: z.string(),
  //       items: z.array(
  //         z.object({
  //           title: z.string(),
  //           skills: z.array(
  //             z.object({
  //               title: z.string(),
  //             }),
  //           ),
  //         }),
  //       ),
  //     }),

  //     education: z.object({
  //       title: z.string(),
  //       items: z.array(
  //         z.object({
  //           degree: z.string(),
  //           year: z.string(),
  //         }),
  //       ),
  //     }),

  //     experience: z.object({
  //       title: z.string(),
  //       items: z.array(
  //         z.object({
  //           title: z.string(),
  //           year: z.string(),
  //         }),
  //       ),
  //     }),

  //     about: z.object({
  //       p1: z.string(),
  //       p2: z.string(),
  //     }),
  //   }),
});

export const collections = { homepage };
