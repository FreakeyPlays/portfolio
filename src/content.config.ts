import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const order = z.number().optional();
const cmsDate = z.coerce.date();
const singleton = (name: string) => (text: string) => ({ [name]: JSON.parse(text) });

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    isPublished: z.boolean().default(false),
    noIndex: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    publishedAt: z.coerce.date().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().optional(),
      image: image(),
      title: z.string(),
      slug: z.string(),
      intro: z.string(),
      faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
      tags: z.array(z.string()).default([]),
      category: z.string(),
      customSlug: z.string().optional(),
      isPublished: z.boolean().default(false),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      publishedAt: z.coerce.date().optional(),
    }),
});

const education = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/data/education' }),
  schema: z.object({
    order,
    level: z.string(),
    institution: z.string(),
    url: z.url(),
    degree: z.string(),
    startDate: cmsDate,
    endDate: cmsDate.optional(),
    location: z.string(),
    grade: z.number().min(1).max(6).optional(),
    isPublished: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/projects' }),
  schema: ({ image }) =>
    z.object({
      order,
      title: z.string(),
      description: z.string(),
      repositoryURL: z.url().optional(),
      deployedURL: z.url().optional(),
      state: z.enum(['Planned', 'WIP', 'Done', 'Maintenance']),
      image: image().optional(),
      isPublished: z.boolean().default(false),
    }),
});

const career = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/career' }),
  schema: z.object({
    order,
    company: z.string(),
    url: z.url(),
    location: z.string(),
    jobs: z.array(
      z.object({
        title: z.string(),
        startDate: cmsDate,
        endDate: cmsDate.optional(),
        description: z.string(),
        technologies: z.array(z.string()).optional(),
      }),
    ),
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

const person = defineCollection({
  loader: file('src/data/person.json', { parser: singleton('person') }),
  schema: z.object({
    name: z.object({
      first: z.string(),
      last: z.string(),
    }),
    alternateName: z.string().optional(),
    jobTitle: z.string(),
    tagline: z.string(),
    bio: z.object({
      long: z.string(),
      short: z.string().optional(),
    }),
    email: z.email(),
    orcid: z.url().optional(),
    image: z.string().optional(),
    location: z.object({
      locality: z.string(),
      region: z.string().optional(),
      country: z.string(),
    }),
    workLocation: z.array(z.string()).default([]),
    languages: z
      .array(
        z.object({
          name: z.string(),
          code: z.string(),
        }),
      )
      .default([]),
  }),
});

const site = defineCollection({
  loader: file('src/data/site.json', { parser: singleton('site') }),
  schema: z.object({
    launchedAt: cmsDate,
    description: z.string(),
    socialPreview: z.object({
      image: z.object({
        src: z.string(),
        alt: z.string(),
      }),
      title: z.string().optional(),
      description: z.string().optional(),
      card: z.enum(['none', 'summary_large_image', 'summary']).default('none'),
      twitterHandle: z.string().optional(),
    }),
  }),
});

const socials = defineCollection({
  loader: file('src/data/socials.json', {
    parser: (text) =>
      Object.fromEntries(
        (JSON.parse(text) as { label: string }[]).map((social, index) => [
          social.label,
          { ...social, order: index },
        ]),
      ),
  }),
  schema: z.object({
    order: z.number(),
    label: z.string(),
    text: z.string(),
    href: z.url(),
    icon: z.string(),
    footerOnly: z.boolean().default(false),
  }),
});

export const collections = {
  pages,
  posts,
  education,
  projects,
  career,
  skills,
  person,
  site,
  socials,
};
