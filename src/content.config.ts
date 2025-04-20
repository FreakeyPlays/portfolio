import { defineCollection, z } from 'astro:content';

import { file } from 'astro/loaders';

const education = defineCollection({
  loader: file('src/data/education.json'),
  schema: z.object({
    level: z.string(),
    institution: z.string(),
    degree: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    location: z.string(),
    description: z.string(),
    grade: z.string().optional(),
    ongoing: z.boolean().optional(),
  }),
});

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