import { defineCollection, z } from 'astro:content';

import { file } from 'astro/loaders';

const career = defineCollection({
  loader: file('src/data/career.json'),
  schema: z.object({
    company: z.string(),
    url: z.string(),
    location: z.string(),
    jobs: z.array(z.object({
      title: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
      ongoing: z.boolean().optional(),
      technologies: z.array(z.string()).optional(),
    })),
  }),
});

export const collections = { education, career };