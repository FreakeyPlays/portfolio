// @ts-check

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { getContentModifiedDate } from '@lib/contentDate.ts';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://chrismerck.dev',

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: ['400 800'],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    processor: satteri(),
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: getContentModifiedDate().toISOString() }),
    }),
  ],
});
