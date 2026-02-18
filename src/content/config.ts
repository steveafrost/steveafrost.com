import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  articles,
};