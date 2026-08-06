import { defineCollection } from 'astro:content';
import { z } from "astro/zod"

import { glob } from 'astro/loaders';

const education = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/education' }),
  schema: z.object({
    level: z.string(),
    institution: z.string(),
    url: z.string().optional(),
    degree: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    description: z.string(),
    grade: z.number().optional(),
    isPublished: z.boolean().default(false),
  }),
});

const career = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/career' }),
  schema: z.object({
    company: z.string(),
    url: z.string(),
    location: z.string(),
    jobs: z.array(
      z.object({
        title: z.string(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        description: z.string(),
        technologies: z.array(z.string()).optional(),
      }),
    ),
    isPublished: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      repositoryURL: z.string().url(),
      deployedURL: z.string().url().optional(),
      state: z.enum(['Planned', 'WIP', 'Done', 'Maintenance']),
      order: z.number().min(0).max(100).default(50),
      image: image().optional(),
      isPublished: z.boolean().default(false),
    }),
});

const skills = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/skills' }),
  schema: z.object({
    category: z.string(),
    skills: z.array(
      z.object({
        name: z.string(),
        image: z.string().optional(),
        isPublished: z.boolean().default(true),
      }),
    ),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		publishedAt: z.coerce.date().optional(),
		isPublished: z.boolean().default(false),
		noIndex: z.boolean().default(false),
  }),
});

export const collections = { education, career, projects, skills, pages };
