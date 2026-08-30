import { defineCollection, reference } from 'astro:content';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const singleton =
  (id: string) =>
  (text: string): Record<string, Record<string, unknown>> => ({
    [id]: JSON.parse(text),
  });

const markdown = () =>
  z
    .string()
    .transform(async (value) =>
      (await createSatteriMarkdownProcessor()).render(value).then((r) => r.code),
    );

const publicationMetadata = {
  isPublished: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date().optional(),
};

const pages = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/pages',
    generateId: (options) => options.data.id as string,
  }),
  schema: z.object({
    id: z.uuid(),
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    ...publicationMetadata,
    noIndex: z.boolean(),
  }),
});

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/posts',
    generateId: (options) => options.data.id as string,
  }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      id: z.uuid(),
      title: z.string(),
      image: image(),
      slug: z.string(),
      description: markdown(),
      relatedPosts: z.array(reference('posts')).optional(),
      tags: z.array(reference('tags')),
      category: reference('categories'),
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: markdown(),
          }),
        )
        .optional(),
      ...publicationMetadata,
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/projects' }),
  schema: ({ image }) =>
    z.object({
      id: z.uuid(),
      order: z.number(),
      title: z.string(),
      description: markdown(),
      repositoryURL: z.url().optional(),
      deployedURL: z.url().optional(),
      relatedBlogPost: reference('posts').optional(),
      state: z.enum(['Planned', 'WIP', 'Done', 'Maintenance']),
      image: image().optional(),
      hidden: z.boolean(),
    }),
});

const career = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/career' }),
  schema: z.object({
    id: z.uuid(),
    order: z.number(),
    company: z.string(),
    url: z.url(),
    location: z.string(),
    jobs: z.array(
      z.object({
        title: z.string(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        description: markdown(),
        technologies: z.array(z.string()).optional(),
      }),
    ),
    hidden: z.boolean(),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/skills' }),
  schema: z.object({
    id: z.uuid(),
    order: z.number(),
    category: z.string(),
    hidden: z.boolean(),
    skills: z.array(
      z.object({
        name: z.string(),
        icon: z.string().optional(),
        hidden: z.boolean(),
      }),
    ),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/education' }),
  schema: z.object({
    id: z.uuid(),
    order: z.number(),
    level: z.string(),
    institution: z.string(),
    url: z.url(),
    degree: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    grade: z.number().min(1).max(6).optional(),
    hidden: z.boolean(),
    description: markdown(),
  }),
});

const tags = defineCollection({
  loader: file('src/data/meta/tags.json'),
  schema: z.object({
    id: z.uuid(),
    label: z.string(),
    slug: z.string(),
  }),
});

const categories = defineCollection({
  loader: file('src/data/meta/categories.json'),
  schema: z.object({
    id: z.uuid(),
    label: z.string(),
    slug: z.string(),
  }),
});

const personal = defineCollection({
  loader: file('src/data/personal.json', { parser: singleton('personal') }),
  schema: ({ image }) =>
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      alternateName: z.string().optional(),
      jobTitle: z.string(),
      tagline: z.string(),
      bio: z.object({
        long: z.string(),
        short: z.string().optional(),
      }),
      email: z.email(),
      orcid: z.url().optional(),
      image: image().optional(),
      location: z.object({
        locality: z.string(),
        region: z.string().optional(),
        country: z.string(),
      }),
      workLocation: z.array(z.string()),
      languages: z.array(
        z.object({
          name: z.string(),
          code: z.string(),
        }),
      ),
    }),
});

const site = defineCollection({
  loader: file('src/data/site.json', { parser: singleton('site') }),
  schema: ({ image }) =>
    z.object({
      launchedAt: z.coerce.date(),
      description: z.string(),
      socialPreview: z.object({
        image: z.object({
          src: image(),
          alt: z.string(),
        }),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    }),
});

const socials = defineCollection({
  loader: file('src/data/socials.json', { parser: singleton('socials') }),
  schema: z.array(
    z.object({
      label: z.string(),
      text: z.string(),
      href: z.url(),
      icon: z.string(),
    }),
  ),
});

export const collections = {
  pages,
  posts,
  projects,
  career,
  skills,
  education,
  tags,
  categories,
  personal,
  site,
  socials,
};
